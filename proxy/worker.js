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
