/* ===== BitForge — fondo de partículas formando figuras ===== */
(function () {
  "use strict";

  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, dpr = 1;

  /* ---- Figuras en coordenadas 0..100 (se escalan al canvas) ----
     dragon = escaneado del logo real de Kali; el resto dibujadas a mano. */
  const FIGURES = {
    dragon: [
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
    penguin: [
      {x:50,y:10},{x:44,y:16},{x:42,y:24},{x:46,y:30},{x:54,y:30},{x:58,y:24},{x:56,y:16},
      {x:40,y:34},{x:36,y:46},{x:38,y:62},{x:46,y:72},{x:54,y:72},{x:62,y:62},{x:64,y:46},{x:60,y:34},
      {x:46,y:20},{x:54,y:20},
      {x:50,y:24},{x:50,y:28},
      {x:36,y:42},{x:30,y:50},{x:64,y:42},{x:70,y:50},
      {x:44,y:74},{x:40,y:80},{x:56,y:74},{x:60,y:80},
    ],
    dolphin: [
      {x:14,y:50},{x:22,y:44},{x:30,y:42},{x:40,y:44},{x:50,y:48},
      {x:58,y:42},{x:66,y:36},{x:74,y:34},{x:82,y:38},
      {x:86,y:34},{x:92,y:26},{x:94,y:34},{x:90,y:42},{x:86,y:44},
      {x:50,y:54},{x:42,y:58},{x:34,y:60},{x:26,y:60},{x:20,y:56},
      {x:44,y:58},{x:40,y:68},{x:48,y:64},
      {x:28,y:48},
    ],
    ai: [
      {x:50,y:50},
      {x:50,y:34},{x:66,y:42},{x:66,y:58},{x:50,y:66},{x:34,y:58},{x:34,y:42},
      {x:50,y:18},{x:82,y:34},{x:82,y:66},{x:50,y:82},{x:18,y:66},{x:18,y:34},
      {x:50,y:26},{x:74,y:42},{x:74,y:58},{x:50,y:74},{x:26,y:58},{x:26,y:42},
    ],
    parrot: [
      {x:34,y:20},{x:41,y:16},{x:47,y:19},{x:48,y:26},{x:43,y:31},{x:37,y:31},{x:31,y:27},
      {x:27,y:25},{x:20,y:27},{x:18,y:31},{x:24,y:32},{x:29,y:30},
      {x:38,y:23},
      {x:45,y:33},{x:53,y:35},{x:57,y:44},{x:55,y:54},{x:47,y:58},{x:41,y:53},{x:41,y:43},
      {x:51,y:37},{x:60,y:42},{x:58,y:53},{x:49,y:51},
      {x:54,y:57},{x:63,y:66},{x:68,y:78},{x:61,y:73},{x:55,y:64},
      {x:45,y:60},{x:45,y:67},{x:51,y:60},{x:51,y:67},
      {x:30,y:69},{x:72,y:69},
    ],
  };

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
  let figIndex = Math.floor(Math.random() * ORDER.length);
  let figTimer = 0;
  const FIG_DURATION = 700;

  let mouse = { x: -9999, y: -9999, active: false };
  const PARALLAX = 26;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = Math.floor(innerWidth * dpr);
    H = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  }

  function targetFor(figName) {
    const fig = FIGURES[figName];
    const base = Math.min(W, H) * 0.62;
    const cx = W / 2, cy = H / 2;
    return fig.map((p) => ({
      x: cx + (p.x - 50) / 100 * base,
      y: cy + (p.y - 50) / 100 * base,
    }));
  }

  function assignTargets() {
    const targets = targetFor(ORDER[figIndex]);
    particles.forEach((p, i) => {
      const t = targets[i % targets.length];
      p.tx = t.x; p.ty = t.y;
    });
  }

  function init() {
    const maxPts = Math.max(...ORDER.map((f) => FIGURES[f].length));
    const count = maxPts + 14;
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0, vy: 0,
        r: (Math.random() * 1.6 + 1.1) * dpr,
        tx: W / 2, ty: H / 2,
        isDust: i >= maxPts,
      });
    }
    assignTargets();
    const lbl = document.getElementById("figLabel");
    if (lbl) lbl.textContent = LABELS[ORDER[figIndex]];
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const px = mouse.active ? (mouse.x / dpr - W / dpr / 2) / (W / dpr / 2) : 0;
    const py = mouse.active ? (mouse.y / dpr - H / dpr / 2) / (H / dpr / 2) : 0;

    const solid = particles.filter((p) => !p.isDust);
    const dust = particles.filter((p) => p.isDust);

    solid.forEach((p) => {
      const tox = p.tx + px * PARALLAX * dpr;
      const toy = p.ty + py * PARALLAX * dpr;
      p.vx += (tox - p.x) * 0.012;
      p.vy += (toy - p.y) * 0.012;
      p.vx *= 0.86; p.vy *= 0.86;
      p.x += p.vx; p.y += p.vy;
    });
    dust.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.99; p.vy *= 0.99;
      if (Math.abs(p.vx) < 0.05 * dpr) p.vx += (Math.random() - 0.5) * 0.04 * dpr;
      if (Math.abs(p.vy) < 0.05 * dpr) p.vy += (Math.random() - 0.5) * 0.04 * dpr;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

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

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.isDust ? "rgba(150,185,255,0.35)" : "rgba(170,200,255,0.95)";
      ctx.fill();
    }

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
  document.addEventListener("visibilitychange", () => { if (!document.hidden) init(); });
})();
