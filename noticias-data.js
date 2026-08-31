/* ===== BitForge: fuente de noticias (window.NOTICIAS) =====
   Las noticias se añaden AQUÍ (no a mano en noticias.html).
   noticias.js inyecta este array en el feed como .post generados desde datos.
   Campos por entrada: id, fecha, tags[], title, excerpt, body (HTML <p>),
   thumb (opcional), fuenteText, fuenteLink (FUENTE REAL verificada).
   Orden del array = orden en pantalla (el más reciente primero). */
window.NOTICIAS = [
  {
    id: "post-20260831-tencent-hy4",
    fecha: "31 AGO 2026",
    tags: ["ia"],
    title: "Tencent lanza y libera como open-source Hunyuan Hy4 preview: 770B parámetros y más de 1M de contexto",
    excerpt: "Tencent ha publicado y abierto el código de Hunyuan Hy4 preview, un LLM de próxima generación con 770B parámetros totales, 49B activos y ventana de contexto superior a 1M tokens, accesible vía WorkBuddy, CodeBuddy y OpenRouter.",
    body:
      "<p>Tencent anunció el 28 de agosto de 2026 el lanzamiento y la apertura del código de <strong>Hunyuan Hy4 preview</strong>, un modelo de lenguaje de próxima generación con 770B parámetros totales y 49B activos (arquitectura Mixture-of-Experts) y una ventana de contexto que supera el millón de tokens.</p>" +
      "<p>El modelo está disponible como open-source y se puede usar globalmente a través de WorkBuddy y CodeBuddy, así como de los productos Yuanbao e ima de Tencent. También es accesible por API vía Tencent Cloud TokenHub y OpenRouter. Al lanzamiento, Hy4 preview es gratis en WorkBuddy y CodeBuddy durante dos semanas.</p>" +
      "<p>En una evaluación interna a ciegas de Tencent con 163 expertos y 203 tareas de ingeniería, Hy4 preview obtuvo una media de 2,99 sobre 4,00, por delante de GLM-5.3 (2,92) y Kimi K3 (2,94). Está optimizado para tareas de productividad reales: ingeniería de software, ofimática e investigación científica.</p>",
    thumb: "https://commons.wikimedia.org/wiki/Special:FilePath/Tencent_Logo.svg",
    fuenteText: "Tencent Newsroom",
    fuenteLink: "https://www.tencent.com/tencent-releases-and-open-sources-tencent-hy4-preview/"
  },
  {
    id: "post-20260831-nvidia-groq-lpx",
    fecha: "31 AGO 2026",
    tags: ["ia", "hardware"],
    title: "NVIDIA Groq 3 LPX entra en producción: hasta 3.400 tokens/s para IA agentica",
    excerpt: "En Hot Chips, NVIDIA anunció que Groq 3 LPX, el acelerador de inferencia interactivo de la plataforma Vera Rubin, ya está en producción plena, con 3.400 tokens por segundo en Gemma 4 31B según Artificial Analysis.",
    body:
      "<p>NVIDIA anunció el 24 de agosto de 2026 (en Hot Chips) que <strong>Groq 3 LPX</strong>, su acelerador de inferencia interactivo, ya está en producción plena. Es una extensión de la plataforma Vera Rubin y está pensado para generar tokens a velocidad ultraalta en sistemas agenticos que razonan y actúan en tiempo real.</p>" +
      "<p>Según el benchmarking de Artificial Analysis, Groq 3 LPX alcanzó un récord de 3.400 tokens de salida por segundo ejecutando Gemma 4 31B (un modelo agentico open-source) con un contexto de 100.000 tokens, la cifra más rápida registrada para ese modelo. NVIDIA afirma hasta 4x más capacidad de respuesta que la alternativa más cercana para cargas sensibles a la latencia.</p>" +
      "<p>Nebius será la primera nube de IA en adoptarlo en producción a través de su plataforma Token Factory. El chip acelera la fase de generación de tokens de los bucles agenticos, lo que reduce tareas de codificación de horas a minutos.</p>",
    thumb: "https://commons.wikimedia.org/wiki/Special:FilePath/Nvidia_logo.svg",
    fuenteText: "NVIDIA Investor Relations",
    fuenteLink: "https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Groq-3-LPX-Now-in-Full-Production-With-World-Class-Speed-for-Agentic-AI/default.aspx"
  },
  {
    id: "post-20260831-flipper-unleashed",
    fecha: "31 AGO 2026",
    tags: ["ciberseguridad", "hardware"],
    title: "Flipper Zero: Unleashed lanza unlshd-092, el firmware comunitario que desbloquea Sub-GHz",
    excerpt: "El proyecto DarkFlippers publicó unlshd-092, la última versión estable de Unleashed, el firmware comunitario basado en el oficial del Flipper Zero que desbloquea bandas Sub-GHz y soporta módulos externos CC1101/nRF24.",
    body:
      "<p>DarkFlippers publicó <strong>unlshd-092</strong>, la última versión estable de Unleashed, el firmware comunitario para Flipper Zero construido sobre el código oficial. Es el fork personalizable más popular por su equilibrio entre características desbloqueadas y estabilidad.</p>" +
      "<p>Unleashed mantiene el núcleo cercano al upstream y añade lo que la comunidad pide: rango de frecuencias Sub-GHz ampliado, protocolos extra, herramientas NFC/RFID y un instalador web. Soporta módulos externos CC1101 (Sub-GHz) y nRF24 (2.4 GHz); el firmware por sí solo no añade hardware nuevo, ya que el Flipper no incluye radio de 2.4 GHz.</p>" +
      "<p>El desbloqueo de frecuencias Sub-GHz por región es un ajuste de firmware; el usuario sigue responsable de transmitir solo en bandas, potencias y ciclos de trabajo legales en su zona. Las releases se mantienen en GitHub con firma GPG verificada del mantenedor xMasterX.</p>",
    thumb: "https://commons.wikimedia.org/wiki/Special:FilePath/Flipper_Zero.jpg",
    fuenteText: "DarkFlippers (GitHub Releases)",
    fuenteLink: "https://github.com/DarkFlippers/unleashed-firmware/releases/tag/unlshd-092"
  },
  {
    id: "post-20260831-linux73-amd",
    fecha: "31 AGO 2026",
    tags: ["linux", "kernel"],
    title: "Linux 7.3 añade un nuevo tipo de núcleo 'low power' de AMD y unifica el manejo de cores Intel/AMD",
    excerpt: "En la ventana de merge de Linux 7.3 se integró el reconocimiento del nuevo tipo de núcleo de bajo consumo de AMD (AMD_CPU_TYPE_LOW_POWER, previsto para Zen 6) y se unificó el manejo de tipos de core entre Intel y AMD.",
    body:
      "<p>El 19 de agosto de 2026 Phoronix confirmó que, durante la ventana de merge de Linux 7.3, se integró el <em>pull request</em> x86/cpu que añade el tipo de núcleo <strong>AMD_CPU_TYPE_LOW_POWER</strong>, para identificar correctamente los próximos núcleos de bajo consumo de AMD en lugar de marcarlos como 'unknown'. Se presume que aparecerán en algunas plataformas cliente Zen 6.</p>" +
      "<p>Además, Linux 7.3 unifica el manejo de los tipos de núcleo de CPU mapeando los tipos específicos de cada fabricante a tipos genéricos, de modo que el sistema trata de forma coherente los cores de Intel y de AMD. También se incorporaron limpiezas en x86/core (optimización para sistemas Athlon XP con SSE pero sin SSE2) y la migración de las interfaces MSR de 32 a 64 bits.</p>" +
      "<p>El trabajo forma parte de la serie de cambios de la ventana de merge de Linux 7.3 y llega junto a otras mejoras de gestión de energía y drivers gráficos para la próxima versión del kernel.</p>",
    thumb: "https://commons.wikimedia.org/wiki/Special:FilePath/Tux.svg",
    fuenteText: "Phoronix",
    fuenteLink: "https://www.phoronix.com/news/x86-Core-Types-Linux-7.3"
  }
];
