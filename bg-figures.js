/* ===== BitForge — fondo de partículas formando figuras (dragón/pingüino/delfín/IA) ===== */
(function () {
  "use strict";

  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, dpr = 1;

  /* ---- Figuras en coordenadas 0..100 (se escalan al canvas) ----
     Cada figura es una lista de puntos {x,y} dibujados a mano (estilo low-poly/constelación).
     La "malla" (líneas) se traza uniendo puntos cercanos entre sí.                  */
  const FIGURES = {
    dragon: [
      // cabeza
      {x:18,y:30},{x:24,y:24},{x:30,y:22},{x:35,y:26},{x:33,y:32},{x:27,y:33},{x:21,y:34},
      // cuernos
      {x:28,y:18},{x:31,y:14},{x:35,y:16},{x:38,y:20},
      // cuello / lomo serpenteado
      {x:40,y:30},{x:46,y:38},{x:52,y:34},{x:58,y:42},{x:64,y:38},{x:70,y:46},{x:76,y:42},{x:82,y:50},
      // ala superior
      {x:50,y:20},{x:58,y:14},{x:66,y:18},{x:60,y:28},{x:54,y:30},
      // cola en espiral
      {x:84,y:56},{x:80,y:64},{x:74,y:62},{x:78,y:70},{x:84,y:66},{x:86,y:74},
      // patas
      {x:46,y:48},{x:48,y:58},{x:44,y:60},
      {x:62,y:54},{x:64,y:64},{x:60,y:66},
    ],
    penguin: [
      // cabeza
      {x:50,y:10},{x:44,y:16},{x:42,y:24},{x:46,y:30},{x:54,y:30},{x:58,y:24},{x:56,y:16},
      // cuerpo
      {x:40,y:34},{x:36,y:46},{x:38,y:62},{x:46,y:72},{x:54,y:72},{x:62,y:62},{x:64,y:46},{x:60,y:34},
      // ojos
      {x:46,y:20},{x:54,y:20},
      // pico
      {x:50,y:24},{x:50,y:28},
      // aletas
      {x:36,y:42},{x:30,y:50},{x:64,y:42},{x:70,y:50},
      // pies
      {x:44,y:74},{x:40,y:80},{x:56,y:74},{x:60,y:80},
    ],
    dolphin: [
      // hocico / cabeza
      {x:14,y:50},{x:22,y:44},{x:30,y:42},{x:40,y:44},{x:50,y:48},
      // lomo
      {x:58,y:42},{x:66,y:36},{x:74,y:34},{x:82,y:38},
      // cola
      {x:86,y:34},{x:92,y:26},{x:94,y:34},{x:90,y:42},{x:86,y:44},
      // barriga / vientre
      {x:50,y:54},{x:42,y:58},{x:34,y:60},{x:26,y:60},{x:20,y:56},
      // aleta pectoral
      {x:44,y:58},{x:40,y:68},{x:48,y:64},
      // ojo
      {x:28,y:48},
    ],
    ai: [
      // nodo central
      {x:50,y:50},
      // anillo interior
      {x:50,y:34},{x:66,y:42},{x:66,y:58},{x:50,y:66},{x:34,y:58},{x:34,y:42},
      // nodos exteriores
      {x:50,y:18},{x:82,y:34},{x:82,y:66},{x:50,y:82},{x:18,y:66},{x:18,y:34},
      // conexiones radiales (se unen al centro por cercanía)
      {x:50,y:26},{x:74,y:42},{x:74,y:58},{x:50,y:74},{x:26,y:58},{x:26,y:42},
    ],
    parrot: [
      // cabeza / cogote
      {x:34,y:20},{x:41,y:16},{x:47,y:19},{x:48,y:26},{x:43,y:31},{x:37,y:31},{x:31,y:27},
      // pico curvo (hacia la izquierda)
      {x:27,y:25},{x:20,y:27},{x:18,y:31},{x:24,y:32},{x:29,y:30},
      // ojo
      {x:38,y:23},
      // cuerpo
      {x:45,y:33},{x:53,y:35},{x:57,y:44},{x:55,y:54},{x:47,y:58},{x:41,y:53},{x:41,y:43},
      // ala
      {x:51,y:37},{x:60,y:42},{x:58,y:53},{x:49,y:51},
      // cola larga (hacia abajo-derecha)
      {x:54,y:57},{x:63,y:66},{x:68,y:78},{x:61,y:73},{x:55,y:64},
      // patas
      {x:45,y:60},{x:45,y:67},{x:51,y:60},{x:51,y:67},
      // perchita
      {x:30,y:69},{x:72,y:69},
    ],
  };

  // orden aleatorio en cada recarga (F5): se baraja la lista de figuras
  const ORDER_BASE = ["dragon", "penguin", "dolphin", "ai", "parrot"];
  let ORDER = ORDER_BASE.slice();
  (function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  })(ORDER);
  const LABELS = { dragon: "Kali Linux", penguin: "Linux", dolphin: "Flipper Zero", ai: "Inteligencia Artificial", parrot: "Parrot Security" };

  let particles = [];
  let figIndex = Math.floor(Math.random() * ORDER.length); // arranca en una figura al azar
  let figTimer = 0;
  const FIG_DURATION = 700; // frames que dura cada figura (~12s a 60fps)

  let mouse = { x: -9999, y: -9999, active: false };
  const PARALLAX = 26; // desplazamiento suave de la figura según el ratón

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = Math.floor(innerWidth * dpr);
    H = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  }

  function targetFor(figName) {
    const fig = FIGURES[figName];
    const base = Math.min(W, H) * 0.62;       // tamaño de la figura
    const cx = W / 2, cy = H / 2;
    return fig.map((p) => ({
      x: cx + (p.x - 50) / 100 * base,
      y: cy + (p.y - 50) / 100 * base,
    }));
  }

  function assignTargets() {
    const targets = targetFor(ORDER[figIndex]);
    // si hay más partículas que puntos, repite puntos para rellenar
    particles.forEach((p, i) => {
      const t = targets[i % targets.length];
      p.tx = t.x; p.ty = t.y;
    });
  }

  function init() {
    // nº de partículas = puntos de la figura más grande, con un mínimo decorativo
    const maxPts = Math.max(...ORDER.map((f) => FIGURES[f].length));
    const count = maxPts + 14; // extras para "polvo" flotante
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0, vy: 0,
        r: (Math.random() * 1.6 + 1.1) * dpr,
        tx: W / 2, ty: H / 2,
        isDust: i >= maxPts, // las últimas son polvo, no forman figura
      });
    }
    assignTargets();
    const lbl = document.getElementById("figLabel");
    if (lbl) lbl.textContent = LABELS[ORDER[figIndex]];
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // parallax suave de la figura hacia el ratón
    const px = mouse.active ? (mouse.x / dpr - W / dpr / 2) / (W / dpr / 2) : 0;
    const py = mouse.active ? (mouse.y / dpr - H / dpr / 2) / (H / dpr / 2) : 0;

    const solid = particles.filter((p) => !p.isDust);
    const dust = particles.filter((p) => p.isDust);

    // mover partículas sólidas hacia su punto objetivo
    solid.forEach((p) => {
      const tox = p.tx + px * PARALLAX * dpr;
      const toy = p.ty + py * PARALLAX * dpr;
      p.vx += (tox - p.x) * 0.012;
      p.vy += (toy - p.y) * 0.012;
      p.vx *= 0.86; p.vy *= 0.86;
      p.x += p.vx; p.y += p.vy;
    });
    // polvo flotante lento
    dust.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.99; p.vy *= 0.99;
      if (Math.abs(p.vx) < 0.05 * dpr) p.vx += (Math.random() - 0.5) * 0.04 * dpr;
      if (Math.abs(p.vy) < 0.05 * dpr) p.vy += (Math.random() - 0.5) * 0.04 * dpr;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    // ---- MALLA: líneas entre partículas sólidas cercanas (efecto constelación) ----
    const max = 70 * dpr;
    for (let i = 0; i < solid.length; i++) {
      const a = solid[i];
      for (let j = i + 1; j < solid.length; j++) {
        const b = solid[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < max) {
          const alpha = 0.22 * (1 - d / max);
          ctx.strokeStyle = "rgba(120,170,255," + alpha + ")";
          ctx.lineWidth = dpr * 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // ---- PUNTOS ----
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.isDust ? "rgba(150,185,255,0.35)" : "rgba(170,200,255,0.95)";
      ctx.fill();
    }

    // rotación de figura
    figTimer++;
    if (figTimer >= FIG_DURATION) {
      figTimer = 0;
      figIndex = (figIndex + 1) % ORDER.length;
      assignTargets();
      const lbl = document.getElementById("figLabel");
      if (lbl) lbl.textContent = LABELS[ORDER[figIndex]];
    }

    requestAnimationFrame(draw);
  }

  // eventos
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX * dpr;
    mouse.y = e.clientY * dpr;
    mouse.active = true;
  });
  window.addEventListener("mouseleave", () => { mouse.active = false; });

  resize();
  init();
  draw();
  window.addEventListener("resize", () => { resize(); init(); });

  // pausar animación cuando la pestaña no es visible (ahorra batería/CPU)
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) { init(); }
  });
})();
