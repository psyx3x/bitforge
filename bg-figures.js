1|/* ===== BitForge — fondo de partículas formando figuras (dragón/pingüino/delfín/IA) ===== */
2|(function () {
3|  "use strict";
4|
5|  const canvas = document.getElementById("bg");
6|  const ctx = canvas.getContext("2d");
7|  let W = 0, H = 0, dpr = 1;
8|
9|  /* ---- Figuras en coordenadas 0..100 (se escalan al canvas) ----
10|     Cada figura es una lista de puntos {x,y} dibujados a mano (estilo low-poly/constelación).
11|     La "malla" (líneas) se traza uniendo puntos cercanos entre sí.                  */
12|  const FIGURES = {
13|    dragon: [
      {x:4.0,y:6.3},
      {x:5.2,y:6.9},
      {x:8.5,y:7.3},
      {x:11.9,y:8.0},
      {x:15.0,y:8.7},
      {x:18.3,y:9.4},
      {x:21.4,y:9.7},
      {x:23.7,y:9.9},
      {x:19.5,y:10.3},
      {x:21.9,y:10.7},
      {x:25.0,y:11.2},
      {x:28.3,y:12.0},
      {x:29.9,y:13.5},
      {x:31.5,y:12.5},
      {x:32.0,y:13.8},
      {x:34.6,y:13.0},
      {x:35.2,y:14.3},
      {x:38.5,y:15.1},
      {x:41.5,y:15.7},
      {x:41.9,y:17.8},
      {x:44.8,y:16.2},
      {x:45.2,y:17.9},
      {x:47.4,y:16.7},
      {x:2.2,y:20.4},
      {x:5.0,y:19.8},
      {x:5.0,y:20.2},
      {x:8.4,y:19.6},
      {x:8.4,y:20.2},
      {x:11.8,y:20.2},
      {x:11.9,y:19.5},
      {x:14.9,y:19.4},
      {x:14.9,y:20.2},
      {x:18.3,y:19.4},
      {x:18.6,y:20.3},
      {x:21.7,y:19.4},
      {x:21.7,y:20.4},
      {x:24.9,y:19.4},
      {x:25.1,y:20.6},
      {x:28.3,y:19.4},
      {x:28.4,y:20.7},
      {x:31.5,y:19.5},
      {x:31.8,y:20.9},
      {x:35.1,y:19.6},
      {x:35.1,y:21.2},
      {x:38.4,y:19.8},
      {x:38.5,y:21.4},
      {x:41.6,y:21.6},
      {x:45.0,y:21.8},
      {x:48.4,y:18.5},
      {x:48.5,y:21.9},
      {x:51.4,y:18.9},
      {x:51.6,y:21.6},
      {x:54.4,y:19.5},
      {x:54.8,y:21.6},
      {x:41.7,y:26.0},
      {x:45.1,y:25.2},
      {x:48.4,y:25.0},
      {x:51.6,y:25.0},
      {x:54.9,y:25.1},
      {x:19.7,y:29.8},
      {x:22.0,y:29.4},
      {x:25.0,y:29.1},
      {x:28.3,y:28.4},
      {x:31.6,y:28.0},
      {x:32.7,y:26.6},
      {x:35.1,y:27.8},
      {x:35.3,y:26.4},
      {x:38.4,y:27.8},
      {x:38.6,y:26.2},
      {x:41.6,y:27.8},
      {x:45.0,y:27.8},
      {x:48.4,y:28.0},
      {x:51.6,y:28.3},
      {x:55.0,y:28.4},
      {x:57.0,y:26.6},
      {x:57.4,y:28.8},
      {x:10.6,y:33.7},
      {x:12.0,y:32.9},
      {x:15.0,y:31.8},
      {x:18.3,y:30.8},
      {x:21.5,y:30.3},
      {x:23.7,y:30.2},
      {x:55.9,y:31.3},
      {x:58.3,y:31.9},
      {x:60.7,y:33.0},
      {x:72.4,y:32.3},
      {x:74.4,y:33.1},
      {x:9.6,y:34.1},
      {x:53.0,y:36.5},
      {x:55.4,y:35.6},
      {x:58.3,y:37.8},
      {x:58.4,y:35.1},
      {x:61.5,y:35.2},
      {x:61.6,y:37.6},
      {x:64.6,y:35.9},
      {x:65.0,y:37.8},
      {x:67.4,y:36.4},
      {x:75.9,y:34.1},
      {x:78.2,y:35.6},
      {x:78.9,y:37.7},
      {x:80.1,y:36.5},
      {x:49.0,y:42.0},
      {x:49.8,y:39.5},
      {x:51.6,y:41.6},
      {x:51.9,y:38.6},
      {x:54.1,y:40.8},
      {x:55.0,y:38.3},
      {x:68.4,y:38.2},
      {x:69.7,y:40.1},
      {x:71.5,y:38.9},
      {x:72.1,y:40.5},
      {x:75.0,y:39.4},
      {x:75.3,y:41.3},
      {x:78.2,y:41.8},
      {x:81.6,y:38.4},
      {x:83.7,y:39.7},
      {x:84.7,y:42.0},
      {x:48.5,y:45.1},
      {x:51.1,y:44.9},
      {x:78.8,y:44.3},
      {x:81.6,y:42.2},
      {x:81.7,y:45.0},
      {x:85.1,y:45.1},
      {x:87.3,y:45.5},
      {x:46.6,y:48.0},
      {x:48.4,y:48.4},
      {x:50.9,y:48.5},
      {x:82.5,y:48.0},
      {x:85.1,y:48.4},
      {x:88.0,y:48.6},
      {x:48.6,y:51.7},
      {x:51.4,y:51.9},
      {x:53.4,y:53.2},
      {x:83.2,y:50.7},
      {x:85.3,y:51.5},
      {x:88.2,y:51.8},
      {x:90.6,y:52.3},
      {x:49.3,y:54.5},
      {x:51.6,y:55.0},
      {x:52.0,y:57.6},
      {x:54.4,y:55.4},
      {x:88.7,y:54.1},
      {x:90.8,y:57.1},
      {x:91.4,y:55.0},
      {x:93.8,y:55.4},
      {x:55.0,y:58.3},
      {x:55.9,y:60.7},
      {x:58.1,y:58.8},
      {x:58.5,y:61.3},
      {x:60.8,y:59.6},
      {x:61.6,y:61.7},
      {x:62.2,y:63.6},
      {x:64.8,y:62.1},
      {x:65.2,y:64.2},
      {x:68.0,y:62.7},
      {x:68.4,y:64.8},
      {x:70.3,y:63.1},
      {x:71.6,y:65.2},
      {x:74.9,y:65.8},
      {x:72.3,y:67.4},
      {x:75.3,y:68.2},
      {x:77.9,y:66.4},
      {x:78.3,y:68.5},
      {x:81.5,y:68.7},
      {x:84.3,y:69.5},
      {x:76.5,y:70.2},
      {x:78.8,y:71.2},
      {x:81.1,y:71.8},
      {x:85.3,y:70.9},
      {x:87.9,y:72.2},
      {x:89.1,y:73.8},
      {x:90.0,y:73.0},
      {x:82.2,y:74.7},
      {x:83.2,y:77.3},
      {x:84.0,y:75.8},
      {x:91.4,y:75.1},
      {x:92.9,y:77.4},
      {x:84.7,y:78.4},
      {x:85.8,y:81.5},
      {x:94.1,y:78.7},
      {x:95.3,y:81.6},
      {x:86.4,y:84.5},
      {x:87.0,y:82.5},
      {x:87.3,y:85.3},
      {x:96.1,y:85.1},
      {x:87.7,y:88.2},
      {x:96.2,y:87.3},
      {x:88.1,y:91.5},
      {x:88.2,y:94.6},
    ],
28|    penguin: [
29|      // cabeza
30|      {x:50,y:10},{x:44,y:16},{x:42,y:24},{x:46,y:30},{x:54,y:30},{x:58,y:24},{x:56,y:16},
31|      // cuerpo
32|      {x:40,y:34},{x:36,y:46},{x:38,y:62},{x:46,y:72},{x:54,y:72},{x:62,y:62},{x:64,y:46},{x:60,y:34},
33|      // ojos
34|      {x:46,y:20},{x:54,y:20},
35|      // pico
36|      {x:50,y:24},{x:50,y:28},
37|      // aletas
38|      {x:36,y:42},{x:30,y:50},{x:64,y:42},{x:70,y:50},
39|      // pies
40|      {x:44,y:74},{x:40,y:80},{x:56,y:74},{x:60,y:80},
41|    ],
42|    dolphin: [
43|      // hocico / cabeza
44|      {x:14,y:50},{x:22,y:44},{x:30,y:42},{x:40,y:44},{x:50,y:48},
45|      // lomo
46|      {x:58,y:42},{x:66,y:36},{x:74,y:34},{x:82,y:38},
47|      // cola
48|      {x:86,y:34},{x:92,y:26},{x:94,y:34},{x:90,y:42},{x:86,y:44},
49|      // barriga / vientre
50|      {x:50,y:54},{x:42,y:58},{x:34,y:60},{x:26,y:60},{x:20,y:56},
51|      // aleta pectoral
52|      {x:44,y:58},{x:40,y:68},{x:48,y:64},
53|      // ojo
54|      {x:28,y:48},
55|    ],
56|    ai: [
57|      // nodo central
58|      {x:50,y:50},
59|      // anillo interior
60|      {x:50,y:34},{x:66,y:42},{x:66,y:58},{x:50,y:66},{x:34,y:58},{x:34,y:42},
61|      // nodos exteriores
62|      {x:50,y:18},{x:82,y:34},{x:82,y:66},{x:50,y:82},{x:18,y:66},{x:18,y:34},
63|      // conexiones radiales (se unen al centro por cercanía)
64|      {x:50,y:26},{x:74,y:42},{x:74,y:58},{x:50,y:74},{x:26,y:58},{x:26,y:42},
65|    ],
66|    parrot: [
67|      // cabeza / cogote
68|      {x:34,y:20},{x:41,y:16},{x:47,y:19},{x:48,y:26},{x:43,y:31},{x:37,y:31},{x:31,y:27},
69|      // pico curvo (hacia la izquierda)
70|      {x:27,y:25},{x:20,y:27},{x:18,y:31},{x:24,y:32},{x:29,y:30},
71|      // ojo
72|      {x:38,y:23},
73|      // cuerpo
74|      {x:45,y:33},{x:53,y:35},{x:57,y:44},{x:55,y:54},{x:47,y:58},{x:41,y:53},{x:41,y:43},
75|      // ala
76|      {x:51,y:37},{x:60,y:42},{x:58,y:53},{x:49,y:51},
77|      // cola larga (hacia abajo-derecha)
78|      {x:54,y:57},{x:63,y:66},{x:68,y:78},{x:61,y:73},{x:55,y:64},
79|      // patas
80|      {x:45,y:60},{x:45,y:67},{x:51,y:60},{x:51,y:67},
81|      // perchita
82|      {x:30,y:69},{x:72,y:69},
83|    ],
84|  };
85|
86|  // orden aleatorio en cada recarga (F5): se baraja la lista de figuras
87|  const ORDER_BASE = ["dragon", "penguin", "dolphin", "ai", "parrot"];
88|  let ORDER = ORDER_BASE.slice();
89|  (function shuffle(a) {
90|    for (let i = a.length - 1; i > 0; i--) {
91|      const j = Math.floor(Math.random() * (i + 1));
92|      [a[i], a[j]] = [a[j], a[i]];
93|    }
94|  })(ORDER);
95|  const LABELS = { dragon: "Kali Linux", penguin: "Linux", dolphin: "Flipper Zero", ai: "Inteligencia Artificial", parrot: "Parrot Security" };
96|
97|  let particles = [];
98|  let figIndex = Math.floor(Math.random() * ORDER.length); // arranca en una figura al azar
99|  let figTimer = 0;
100|  const FIG_DURATION = 700; // frames que dura cada figura (~12s a 60fps)
101|
102|  let mouse = { x: -9999, y: -9999, active: false };
103|  const PARALLAX = 26; // desplazamiento suave de la figura según el ratón
104|
105|  function resize() {
106|    dpr = Math.min(window.devicePixelRatio || 1, 2);
107|    W = canvas.width = Math.floor(innerWidth * dpr);
108|    H = canvas.height = Math.floor(innerHeight * dpr);
109|    canvas.style.width = innerWidth + "px";
110|    canvas.style.height = innerHeight + "px";
111|  }
112|
113|  function targetFor(figName) {
114|    const fig = FIGURES[figName];
115|    const base = Math.min(W, H) * 0.62;       // tamaño de la figura
116|    const cx = W / 2, cy = H / 2;
117|    return fig.map((p) => ({
118|      x: cx + (p.x - 50) / 100 * base,
119|      y: cy + (p.y - 50) / 100 * base,
120|    }));
121|  }
122|
123|  function assignTargets() {
124|    const targets = targetFor(ORDER[figIndex]);
125|    // si hay más partículas que puntos, repite puntos para rellenar
126|    particles.forEach((p, i) => {
127|      const t = targets[i % targets.length];
128|      p.tx = t.x; p.ty = t.y;
129|    });
130|  }
131|
132|  function init() {
133|    // nº de partículas = puntos de la figura más grande, con un mínimo decorativo
134|    const maxPts = Math.max(...ORDER.map((f) => FIGURES[f].length));
135|    const count = maxPts + 14; // extras para "polvo" flotante
136|    particles = [];
137|    for (let i = 0; i < count; i++) {
138|      particles.push({
139|        x: Math.random() * W,
140|        y: Math.random() * H,
141|        vx: 0, vy: 0,
142|        r: (Math.random() * 1.6 + 1.1) * dpr,
143|        tx: W / 2, ty: H / 2,
144|        isDust: i >= maxPts, // las últimas son polvo, no forman figura
145|      });
146|    }
147|    assignTargets();
148|    const lbl = document.getElementById("figLabel");
149|    if (lbl) lbl.textContent = LABELS[ORDER[figIndex]];
150|  }
151|
152|  function draw() {
153|    ctx.clearRect(0, 0, W, H);
154|
155|    // parallax suave de la figura hacia el ratón
156|    const px = mouse.active ? (mouse.x / dpr - W / dpr / 2) / (W / dpr / 2) : 0;
157|    const py = mouse.active ? (mouse.y / dpr - H / dpr / 2) / (H / dpr / 2) : 0;
158|
159|    const solid = particles.filter((p) => !p.isDust);
160|    const dust = particles.filter((p) => p.isDust);
161|
162|    // mover partículas sólidas hacia su punto objetivo
163|    solid.forEach((p) => {
164|      const tox = p.tx + px * PARALLAX * dpr;
165|      const toy = p.ty + py * PARALLAX * dpr;
166|      p.vx += (tox - p.x) * 0.012;
167|      p.vy += (toy - p.y) * 0.012;
168|      p.vx *= 0.86; p.vy *= 0.86;
169|      p.x += p.vx; p.y += p.vy;
170|    });
171|    // polvo flotante lento
172|    dust.forEach((p) => {
173|      p.x += p.vx; p.y += p.vy;
174|      p.vx *= 0.99; p.vy *= 0.99;
175|      if (Math.abs(p.vx) < 0.05 * dpr) p.vx += (Math.random() - 0.5) * 0.04 * dpr;
176|      if (Math.abs(p.vy) < 0.05 * dpr) p.vy += (Math.random() - 0.5) * 0.04 * dpr;
177|      if (p.x < 0 || p.x > W) p.vx *= -1;
178|      if (p.y < 0 || p.y > H) p.vy *= -1;
179|    });
180|
181|    // ---- MALLA: líneas entre partículas sólidas cercanas (efecto constelación) ----
182|    const max = 70 * dpr;
183|    for (let i = 0; i < solid.length; i++) {
184|      const a = solid[i];
185|      for (let j = i + 1; j < solid.length; j++) {
186|        const b = solid[j];
187|        const dx = a.x - b.x, dy = a.y - b.y;
188|        const d = Math.hypot(dx, dy);
189|        if (d < max) {
190|          const alpha = 0.22 * (1 - d / max);
191|          ctx.strokeStyle = "rgba(120,170,255," + alpha + ")";
192|          ctx.lineWidth = dpr * 0.7;
193|          ctx.beginPath();
194|          ctx.moveTo(a.x, a.y);
195|          ctx.lineTo(b.x, b.y);
196|          ctx.stroke();
197|        }
198|      }
199|    }
200|
201|    // ---- PUNTOS ----
202|    for (const p of particles) {
203|      ctx.beginPath();
204|      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
205|      ctx.fillStyle = p.isDust ? "rgba(150,185,255,0.35)" : "rgba(170,200,255,0.95)";
206|      ctx.fill();
207|    }
208|
209|    // rotación de figura
210|    figTimer++;
211|    if (figTimer >= FIG_DURATION) {
212|      figTimer = 0;
213|      figIndex = (figIndex + 1) % ORDER.length;
214|      assignTargets();
215|      const lbl = document.getElementById("figLabel");
216|      if (lbl) lbl.textContent = LABELS[ORDER[figIndex]];
217|    }
218|
219|    requestAnimationFrame(draw);
220|  }
221|
222|  // eventos
223|  window.addEventListener("mousemove", (e) => {
224|    mouse.x = e.clientX * dpr;
225|    mouse.y = e.clientY * dpr;
226|    mouse.active = true;
227|  });
228|  window.addEventListener("mouseleave", () => { mouse.active = false; });
229|
230|  resize();
231|  init();
232|  draw();
233|  window.addEventListener("resize", () => { resize(); init(); });
234|
235|  // pausar animación cuando la pestaña no es visible (ahorra batería/CPU)
236|  document.addEventListener("visibilitychange", () => {
237|    if (!document.hidden) { init(); }
238|  });
239|})();
240|