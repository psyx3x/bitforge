/* ===== BitForge — fondo: muchos puntitos libres + dragón de Kali en el centro ===== */
(function () {
  "use strict";

  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, dpr = 1;

  // Puntos del dragón de Kali (escaneado del logo real), en coordenadas 0..100
  const DRAGON = [
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
  ];

  let particles = [];   // todos: libres + los que forman el dragón
  let mouse = { x: -999, y: -999, active: false, glow: 0 };
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

  function dragonTargets() {
    const base = Math.min(W, H) * 0.6;
    const cx = W / 2, cy = H / 2;
    return DRAGON.map(p => ({
      x: cx + (p.x - 50) / 100 * base,
      y: cy + (p.y - 50) / 100 * base,
    }));
  }

  function init() {
    particles = [];
    // 1) puntitos LIBRES por toda la pantalla (los de antes, pero muchos más)
    const FREE = 420;
    for (let i = 0; i < FREE; i++) {
      particles.push({
        x: Math.random()*W, y: Math.random()*H,
        vx:(Math.random()-0.5)*0.22*dpr, vy:(Math.random()-0.5)*0.22*dpr,
        r:(Math.random()*1.7+0.8)*dpr,
        isDragon:false, tx:0, ty:0
      });
    }
    // 2) puntitos que FORMAN el dragón en el centro
    const t = dragonTargets();
    for (const p of t) {
      particles.push({
        x: Math.random()*W, y: Math.random()*H,
        vx:0, vy:0, r:(Math.random()*1.2+1.4)*dpr,
        isDragon:true, tx:p.x, ty:p.y
      });
    }
  }

  function draw() {
    ctx.clearRect(0,0,W,H);

    for (const p of particles) {
      if (p.isDragon) {
        // se quedan formando el dragón en el centro, pero también siguen al ratón
        p.vx += (p.tx - p.x) * 0.02;
        p.vy += (p.ty - p.y) * 0.02;
      }
      // atracción al ratón (mismo efecto de antes) para TODOS
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
      p.x += p.vx; p.y += p.vy;
    }

    // malla: líneas entre todos los puntitos cercanos (efecto de antes)
    const max = 150 * dpr;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i+1; j < particles.length; j++) {
        const b = particles[j];
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if (d < max) {
          const alpha = 0.22 * (1 - d/max);
          ctx.strokeStyle = "rgba(140,175,255," + alpha + ")";
          ctx.lineWidth = dpr*0.8;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.isDragon ? "rgba(180,210,255,0.98)" : "rgba(150,185,255,0.85)";
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
