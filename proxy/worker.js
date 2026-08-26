/**
 * BitForge Terminal — Cloudflare Worker (proxy hacia OpenRouter)
 *
 * Guarda tu clave de OpenRouter en una variable de entorno del Worker
 * (Settings > Variables > Secret):  OPENROUTER_API_KEY
 *
 * Despliegue:
 *   1. Crea la cuenta gratis en https://workers.cloudflare.com
 *   2. Instala Wrangler:  npm i -g wrangler
 *   3. wrangler login
 *   4. wrangler deploy
 *   5. Apunta TERMINAL_PROXY_URL (en script.js) a la URL que te dé, p.ej.
 *      https://bitforge-terminal.<tu-subdomain>.workers.dev
 *
 * El Worker:
 *   - Recibe POST { message, history } desde la web
 *   - Mete en el system prompt las NOTICIAS leídas de noticias.html (GitHub Pages)
 *   - Llama a OpenRouter y devuelve la respuesta de la IA
 */
export default {
  async fetch(request, env) {
    // CORS: permitir que la web de GitHub Pages llame a este Worker
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (request.method !== "POST") {
      return new Response("Método no permitido", { status: 405, headers: corsHeaders });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("JSON inválido", { status: 400, headers: corsHeaders });
    }

    const userMsg = (body.message || "").toString().slice(0, 4000);
    const history = Array.isArray(body.history) ? body.history.slice(-20) : [];
    if (!userMsg && history.length === 0) {
      return new Response("Sin mensaje", { status: 400, headers: corsHeaders });
    }

    // Leer las noticias publicadas en la web (para que la IA busque en ellas)
    let newsText = "";
    try {
      const newsRes = await fetch("https://psyx3x.github.io/bitforge/noticias.html", {
        headers: { "User-Agent": "BitForge-Worker/1.0" },
      });
      if (newsRes.ok) {
        const html = await newsRes.text();
        // extrae el contenido de cada <article class="post">
        const posts = html.match(/<article class="post">[\s\S]*?<\/article>/g) || [];
        newsText = posts
          .map((p) => p.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
          .join("\n\n---\n\n")
          .slice(0, 6000);
      }
    } catch (e) {
      newsText = "(no se pudieron cargar las noticias)";
    }

    const systemPrompt =
      "Eres el asistente de BitForge, un sitio de informática, Linux, IA y Flipper Zero. " +
      "Responde en español, de forma clara y cercana. " +
      "Si el usuario pregunta por noticias o novedades, busca en la sección de NOTICIAS que aparece abajo " +
      "y cita la información encontrada. Si no aparece en las noticias, díselo con honestidad.\n\n" +
      "REGLAS ESTRICTAS DE ENLACES:\n" +
      "- Usa EXCLUSIVAMENTE los enlaces del MAPA DE LA WEB que aparece abajo. NUNCA inventes rutas ni archivos.\n" +
      "- Linux, IA, Trading, Tutoriales, Temas, Novedades, Flipper son SECCIONES DENTRO de index.html (usa https://psyx3x.github.io/bitforge/index.html#linux y similares). NO existen páginas separadas como /linux.\n" +
      "- Solo hay estas páginas: index.html, noticias.html, trading.html, hacking.html.\n\n" +
      "=== MAPA COMPLETO DE LA WEB BITFORGE (enlaces reales, NO inventes) ===\n" +
      "Páginas del sitio:\n" +
      "  - Principal: https://psyx3x.github.io/bitforge/index.html\n" +
      "  - Noticias (blog diario): https://psyx3x.github.io/bitforge/noticias.html\n" +
      "  - Trading: https://psyx3x.github.io/bitforge/trading.html\n" +
      "  - Hacking: https://psyx3x.github.io/bitforge/hacking.html\n" +
      "Secciones dentro de index.html (anclas):\n" +
      "  - Inicio: https://psyx3x.github.io/bitforge/index.html#hero\n" +
      "  - Temas: https://psyx3x.github.io/bitforge/index.html#temas\n" +
      "  - Linux: https://psyx3x.github.io/bitforge/index.html#linux\n" +
      "  - IA: https://psyx3x.github.io/bitforge/index.html#ia\n" +
      "  - Trading: https://psyx3x.github.io/bitforge/index.html#trading\n" +
      "  - Tutoriales: https://psyx3x.github.io/bitforge/index.html#tutoriales\n" +
      "  - Novedades: https://psyx3x.github.io/bitforge/index.html#novedades\n" +
      "  - Flipper Zero: https://psyx3x.github.io/bitforge/index.html#flipper\n" +
      "  - Arduino: https://psyx3x.github.io/bitforge/index.html#arduino | ESP32: https://psyx3x.github.io/bitforge/index.html#esp32 | Controladoras: https://psyx3x.github.io/bitforge/index.html#controladoras | Gadgets: https://psyx3x.github.io/bitforge/index.html#gadgets\n" +
      "Submenú HACKING (desde https://psyx3x.github.io/bitforge/hacking.html o el menú):\n" +
      "  - Linux y distros: Kali https://www.kali.org/ , Parrot https://www.parrotsec.org/ , Ubuntu https://ubuntu.com/ , Debian https://www.debian.org/ , Mint https://linuxmint.com/ , Fedora https://fedoraproject.org/ , Arch https://archlinux.org/\n" +
      "  - Arduino: https://psyx3x.github.io/bitforge/index.html#arduino | ESP32: https://psyx3x.github.io/bitforge/index.html#esp32 | Controladoras: https://psyx3x.github.io/bitforge/index.html#controladoras | Gadgets: https://psyx3x.github.io/bitforge/index.html#gadgets\n" +
      "  - Flipper Zero y firmwares: Flipper https://flipperzero.one/ , Oficial https://github.com/flipperdevices/flipperzero-firmware , Unleashed https://github.com/DarkFlippers/unleashed-firmware , RogueMaster https://github.com/RogueMaster/flipperzero-firmware-wPlugins , Xtreme https://github.com/Flipper-XFW/Xtreme-Firmware , Momentum https://github.com/next-flip/momentum-firmware , Bruce https://bruce.computer/ , Evil Portal https://github.com/bigbrodude6119/flipper-zero-evil-portal , WiFi Marauder https://github.com/justcallmekoko/ESP32Marauder\n" +
      "  - ESP32 ESP-IDF: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/\n" +
      "Submenú IA:\n" +
      "  - Ollama y modelos: https://ollama.com/ (glm-5.2, deepseek-v4-flash, kimi-k3, qwen3.8, llama3.1, mistral, deepseek-coder, codellama, gemma2 en https://ollama.com/library/<modelo>)\n" +
      "  - Hugging Face: https://huggingface.co/ | Buscador de IA: https://unvelai.com/ia/\n" +
      "Submenú TRADING (https://psyx3x.github.io/bitforge/trading.html):\n" +
      "  - Estrategias: https://psyx3x.github.io/bitforge/trading.html#estrategias | Cripto: https://psyx3x.github.io/bitforge/trading.html#cripto | Mercado tradicional: https://psyx3x.github.io/bitforge/trading.html#tradicional | Fundamental: https://psyx3x.github.io/bitforge/trading.html#fundamental\n" +
      "Menú social (abajo a la derecha): WhatsApp Web https://web.whatsapp.com/ , Telegram https://web.telegram.org/ , YouTube https://www.youtube.com/ , Instagram https://www.instagram.com/ , TikTok https://www.tiktok.com/ , X https://x.com/\n" +
      "Blog externo referenciado: https://tecnologia4youu.blogspot.com/\n" +
      "REGLAS: usa SOLO estos enlaces. Linux/IA/Trading/Tutoriales son secciones de index.html (anclas #), NO páginas aparte. Solo existen index.html, noticias.html, trading.html, hacking.html.\n" +
      "=== FIN MAPA ===\n\n" +
      "=== NOTICIAS PUBLICADAS EN BITFORGE ===\n" +
      (newsText || "(aún no hay noticias publicadas)") +
      "\n=== FIN NOTICIAS ===";

    // Construir mensajes para OpenRouter (formato OpenAI)
    const messages = [{ role: "system", content: systemPrompt }];
    for (const h of history) {
      if (h.role === "user" || h.role === "assistant") {
        messages.push({ role: h.role, content: h.content.slice(0, 4000) });
      }
    }
    if (userMsg) messages.push({ role: "user", content: userMsg });

    const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.OPENROUTER_API_KEY,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://psyx3x.github.io",
        "X-Title": "BitForge Terminal",
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct",
        messages,
        max_tokens: 700,
        temperature: 0.7,
      }),
    });

    if (!orRes.ok) {
      const errText = await orRes.text();
      return new Response("Error de OpenRouter: " + orRes.status + " " + errText, {
        status: 502,
        headers: corsHeaders,
      });
    }

    const data = await orRes.json();
    const reply = data?.choices?.[0]?.message?.content || "(sin respuesta)";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
};
