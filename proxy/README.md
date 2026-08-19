# BitForge Terminal — Proxy IA (Cloudflare Worker)

Este Worker conecta la Terminal de la web con OpenRouter (IA real) y lee
las noticias de `noticias.html` para que la IA pueda buscar en ellas.

## Lo que necesitas (tus cuentas)
1. **OpenRouter** (gratis): crea una clave en https://openrouter.ai/keys
2. **Cloudflare** (gratis): cuenta en https://workers.cloudflare.com

## Pasos de despliegue
```bash
# 1) instalar wrangler (Node necesario)
npm i -g wrangler

# 2) login en Cloudflare
wrangler login

# 3) meter tu clave de OpenRouter como secreto (te pedirá pegarla)
wrangler secret put OPENROUTER_API_KEY

# (opcional) cambiar de modelo:
wrangler secret put OPENROUTER_MODEL
#   valor sugerido: meta-llama/llama-3.1-8b-instruct  (gratis)

# 4) desplegar
wrangler deploy
```

Te dará una URL tipo:
`https://bitforge-terminal.<tu-subdomain>.workers.dev`

## Conectar la web
Copia esa URL y ponla en `script.js`, en la constante `TERMINAL_PROXY_URL`
(línea cerca del bloque de la Terminal). Queda así:

```js
const TERMINAL_PROXY_URL = "https://bitforge-terminal.TU-SUBDOMINIO.workers.dev";
```

Luego sube la web (git add + commit + push) y la Terminal ya responderá con IA real.

## Qué pasa si el proxy no está configurado
La Terminal sigue funcionando en **modo demo** (respuestas de muestra) hasta
que configures el proxy. No se rompe nada.
