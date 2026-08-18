/* ===== BitForge — fondo: partículas libres + figuras que aparecen de repente ===== */
(function () {
  "use strict";

  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, dpr = 1;

  /* ---- Figuras en coordenadas 0..100 ----
     dragon = escaneado del logo real de Kali; el resto dibujadas a mano. */
  const FIGURES = {
    dragon: [
      {x:25.8,y:16.7},{x:30.0,y:12.2},{x:38.5,y:10.5},{x:45.6,y:12.2},{x:49.2,y:16.7},{x:46.5,y:22.0},{x:38.6,y:23.7},{x:30.5,y:23.4},{x:25.0,y:20.2},
      {x:33.3,y:9.3},{x:37.7,y:6.0},{x:42.1,y:7.0},{x:45.6,y:10.5},
      {x:50.8,y:14.0},{x:57.6,y:20.5},{x:62.9,y:17.3},{x:68.2,y:25.0},{x:73.5,y:21.7},{x:78.8,y:29.5},{x:84.1,y:25.8},{x:89.4,y:33.5},
      {x:61.4,y:9.3},{x:69.7,y:4.5},{x:78.0,y:8.2},{x:72.7,y:18.0},{x:65.2,y:20.3},
      {x:91.2,y:38.5},{x:86.4,y:47.0},{x:79.5,y:44.8},{x:84.1,y:54.0},{x:91.2,y:49.5},{x:93.6,y:58.5},
      {x:57.6,y:33.0},{x:60.0,y:44.0},{x:55.3,y:46.3},
      {x:73.5,y:39.8},{x:76.0,y:51.0},{x:71.2,y:53.3},
      {x:30.5,y:28.2},{x:33.0,y:34.0},{x:28.3,y:36.3},
      {x:44.7,y:30.5},{x:46.5,y:38.7},{x:41.8,y:40.5},
      {x:55.3,y:23.7},{x:58.8,y:28.2},{x:53.6,y:30.0},
      {x:62.9,y:17.3},{x:66.4,y:22.0},{x:61.4,y:23.7},
      {x:84.1,y:25.8},{x:87.6,y:30.5},{x:82.3,y:32.2},
      {x:48.4,y:38.7},{x:50.8,y:44.0},{x:46.5,y:45.7},
      {x:71.2,y:56.3},{x:73.5,y:64.5},{x:68.8,y:66.3},
      {x:38.6,y:49.5},{x:41.0,y:58.5},{x:36.2,y:60.3},
      {x:33.3,y:40.8},{x:35.7,y:47.0},{x:30.5,y:48.7}
    ],
    parrot: [
      {x:34,y:20},{x:41,y:16},{x:47,y:19},{x:48,y:26},{x:43,y:31},{x:37,y:31},{x:31,y:27},
      {x:27,y:25},{x:20,y:27},{x:18,y:31},{x:24,y:32},{x:29,y:30},
      {x:38,y:23},
      {x:45,y:33},{x:53,y:35},{x:57,y:44},{x:55,y:54},{x:47,y:58},{x:41,y:53},{x:41,y:43},
      {x:51,y:37},{x:60,y:42},{x:58,y:53},{x:49,y:51},
      {x:54,y:57},{x:63,y:66},{x:68,y:78},{x:61,y:73},{x:55,y:64},
      {x:45,y:60},{x:45,y:67},{x:51,y:60},{x:51,y:67},
      {x:30,y:69},{x:72,y:69}
    ],
    penguin: [
      {x:50,y:10},{x:44,y:16},{x:42,y:24},{x:46,y:30},{x:54,y:30},{x:58,y:24},{x:56,y:16},
      {x:40,y:34},{x:36,y:46},{x:38,y:62},{x:46,y:72},{x:54,y:72},{x:62,y:62},{x:64,y:46},{x:60,y:34},
      {x:46,y:20},{x:54,y:20},{x:50,y:24},{x:50,y:28},
      {x:36,y:42},{x:30,y:50},{x:64,y:42},{x:70,y:50},
      {x:44,y:74},{x:40,y:80},{x:56,y:74},{x:60,y:80}
    ],
    dolphin: [
      {x:14,y:50},{x:22,y:44},{x:30,y:42},{x:40,y:44},{x:50,y:48},
      {x:58,y:42},{x:66,y:36},{x:74,y:34},{x:82,y:38},
      {x:86,y:34},{x:92,y:26},{x:94,y:34},{x:90,y:42},{x:86,y:44},
      {x:50,y:54},{x:42,y:58},{x:34,y:60},{x:26,y:60},{x:20,y:56},
      {x:44,y:58},{x:40,y:68},{x:48,y:64},{x:28,y:48}
    ],
    ai: [
      {x:50,y:50},{x:50,y:34},{x:66,y:42},{x:66,y:58},{x:50,y:66},{x:34,y:58},{x:34,y:42},
      {x:50,y:18},{x:82,y:34},{x:82,y:66},{x:50,y:82},{x:18,y:66},{x:18,y:34},
      {x:50,y:26},{x:74,y:42},{x:74,y:58},{x:50,y:74},{x:26,y:58},{x:26,y:42}
    ]
  };

  // orden aleatorio en cada recarga (F5)
  const ORDER_BASE = ["dragon", "parrot", "penguin", "dolphin", "ai"];
  let ORDER = ORDER_BASE.slice();
  (function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}})(ORDER);
  const LABELS = { dragon:"Kali Linux", parrot:"Parrot Security", penguin:"Linux", dolphin:"Flipper Zero", ai:"Inteligencia Artificial" };

  let particles = [];
  let figIndex = 0;
  let mode = "free";          // 'free' = como antes | 'figure' = formando figura
  let modeTimer = 0;
  const FREE_TIME = 360;      // frames sueltas (~6s)
  const FIG_TIME = 300;       // frames formando (~5s)

  let mouse = { x:-9999, y:-9999, active:false, glow:0 };
  const ATTRACT_RADIUS = 520;
  const ATTRACT_FORCE = 0.03;
  const AFTERGLOW = 90;

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
    const cx = W/2, cy = H/2;
    return fig.map(p => ({ x: cx + (p.x-50)/100*base, y: cy + (p.y-50)/100*base }));
  }

  function init() {
    const maxPts = Math.max(...ORDER.map(f => FIGURES[f].length));
    const count = maxPts + 20; // extras que siempre quedan sueltas
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random()*W, y: Math.random()*H,
        vx:(Math.random()-0.5)*0.22*dpr, vy:(Math.random()-0.5)*0.22*dpr,
        r:(Math.random()*1.8+0.9)*dpr,
        tx:0, ty:0
      });
    }
  }

  function startFigure() {
    const targets = targetFor(ORDER[figIndex]);
    particles.forEach((p, i) => {
      if (i < targets.length) { p.tx = targets[i].x; p.ty = targets[i].y; p.isFig = true; }
      else p.isFig = false;
    });
    const lbl = document.getElementById("figLabel");
    if (lbl) lbl.textContent = LABELS[ORDER[figIndex]];
  }

  function draw() {
    ctx.clearRect(0,0,W,H);

    // ---- ciclo de modos ----
    modeTimer++;
    if (mode === "free" && modeTimer >= FREE_TIME) {
      mode = "figure"; modeTimer = 0; startFigure();
    } else if (mode === "figure" && modeTimer >= FIG_TIME) {
      mode = "free"; modeTimer = 0;
      particles.forEach(p => p.isFig = false);
      const lbl = document.getElementById("figLabel");
      if (lbl) lbl.textContent = "";
      figIndex = (figIndex + 1) % ORDER.length;
    }

    // ---- física ----
    for (const p of particles) {
      if (p.isFig) {
        // vuela al punto de la figura y se queda
        p.vx += (p.tx - p.x) * 0.02;
        p.vy += (p.ty - p.y) * 0.02;
        p.vx *= 0.85; p.vy *= 0.85;
      } else {
        // comportamiento libre ORIGINAL: atracción al ratón + deriva
        if (mouse.active || mouse.glow > 0) {
          const txp = mouse.active ? mouse.x : (mouse._lx ?? mouse.x);
          const typ = mouse.active ? mouse.y : (mouse._ly ?? mouse.y);
          const dxm = txp - p.x, dym = typ - p.y;
          const dm = Math.hypot(dxm, dym) || 1;
          const radius = ATTRACT_RADIUS * dpr;
          if (dm < radius) {
            const falloff = mouse.active ? 1 : (mouse.glow/AFTERGLOW);
            const pull = (1 - dm/radius) * ATTRACT_FORCE * falloff;
            p.vx += (dxm/dm)*pull*dpr; p.vy += (dym/dm)*pull*dpr;
          }
          if (mouse.active) { mouse._lx = mouse.x; mouse._ly = mouse.y; }
        }
        if (!mouse.active && mouse.glow > 0) mouse.glow--;
        p.vx *= 0.985; p.vy *= 0.985;
        if (Math.abs(p.vx) < 0.05*dpr) p.vx += (Math.random()-0.5)*0.02*dpr;
        if (Math.abs(p.vy) < 0.05*dpr) p.vy += (Math.random()-0.5)*0.02*dpr;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      p.x += p.vx; p.y += p.vy;
    }

    // ---- líneas (malla) ----
    const max = (mode === "figure" ? 90 : 150) * dpr;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i+1; j < particles.length; j++) {
        const b = particles[j];
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if (d < max) {
          const alpha = (mode === "figure" ? 0.30 : 0.22) * (1 - d/max);
          ctx.strokeStyle = "rgba(140,175,255," + alpha + ")";
          ctx.lineWidth = dpr*0.8;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }

    // ---- puntos ----
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.isFig ? "rgba(180,210,255,0.98)" : "rgba(150,185,255,0.85)";
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX*dpr; mouse.y = e.clientY*dpr; mouse.active = true; mouse.glow = AFTERGLOW;
  });
  window.addEventListener("mouseleave", () => { mouse.active = false; });

  resize(); init(); draw();
  window.addEventListener("resize", () => { resize(); init(); });
})();
