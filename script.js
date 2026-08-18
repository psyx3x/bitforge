/* ===== BitForge — interacciones ===== */
(function () {
  "use strict";

  /* ---- Cursor glow que sigue el ratón ---- */
  const glow = document.getElementById("cursorGlow");
  let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
  let tx = gx, ty = gy;
  window.addEventListener("mousemove", (e) => {
    tx = e.clientX; ty = e.clientY;
  });
  function glowLoop() {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.left = gx + "px";
    glow.style.top = gy + "px";
    requestAnimationFrame(glowLoop);
  }
  glowLoop();

  /* ---- Nav: sombra al hacer scroll + menú móvil ---- */
  const nav = document.getElementById("nav");
  const navLinks = document.getElementById("navLinks");
  const navToggle = document.getElementById("navToggle");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  });
  navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );

  /* ---- Tilt 3D en tarjetas/paneles ---- */
  const tiltEls = document.querySelectorAll("[data-tilt]");
  tiltEls.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * 8;
      const ry = (px - 0.5) * 8;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      if (el.classList.contains("card")) {
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
      }
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });

  /* ---- Reveal al entrar en viewport ---- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

  /* ---- Fondo animado: partículas conectadas (original, siguen el ratón) ---- */
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");
  let w, h, dpr, particles;
  const mouse = { x: -999, y: -999, active: false, glow: 0 };
  const COUNT = 110;
  const ATTRACT_RADIUS = 520 * 1;
  const ATTRACT_FORCE = 0.03;
  const AFTERGLOW = 90;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  }
  function init() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22 * dpr,
        vy: (Math.random() - 0.5) * 0.22 * dpr,
        r: (Math.random() * 1.8 + 0.9) * dpr,
      });
    }
  }
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX * dpr;
    mouse.y = e.clientY * dpr;
    mouse.active = true;
    mouse.glow = AFTERGLOW;
  });
  window.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (mouse.active || mouse.glow > 0) {
        const txp = mouse.active ? mouse.x : (mouse._lx ?? mouse.x);
        const typ = mouse.active ? mouse.y : (mouse._ly ?? mouse.y);
        const dxm = txp - p.x, dym = typ - p.y;
        const dm = Math.hypot(dxm, dym) || 1;
        const radius = ATTRACT_RADIUS * dpr;
        if (dm < radius) {
          const falloff = mouse.active ? 1 : (mouse.glow / AFTERGLOW);
          const pull = (1 - dm / radius) * ATTRACT_FORCE * falloff;
          p.vx += (dxm / dm) * pull * dpr;
          p.vy += (dym / dm) * pull * dpr;
        }
        if (mouse.active) { mouse._lx = mouse.x; mouse._ly = mouse.y; }
      }
      if (!mouse.active && mouse.glow > 0) mouse.glow--;
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.985; p.vy *= 0.985;
      if (Math.abs(p.vx) < 0.05 * dpr) p.vx += (Math.random() - 0.5) * 0.02 * dpr;
      if (Math.abs(p.vy) < 0.05 * dpr) p.vy += (Math.random() - 0.5) * 0.02 * dpr;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(150,185,255,0.95)";
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.hypot(dx, dy);
        const max = 150 * dpr;
        if (d < max) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = "rgba(140,175,255," + (0.32 * (1 - d / max)) + ")";
          ctx.lineWidth = dpr * 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  resize();
  init();
  draw();
  window.addEventListener("resize", () => { resize(); init(); });

  /* ---- Menús desplegables del nav (IA, Linux, etc.) ---- */

  // ===== Efecto HUMO al sacar el ratón del menú =====
  const smokeCanvas = document.getElementById("iaSmoke");
  const sctx = smokeCanvas.getContext("2d");
  let smokeParticles = [];
  let smokeRAF = null;
  function resizeSmoke(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    smokeCanvas.width = innerWidth * dpr;
    smokeCanvas.height = innerHeight * dpr;
    smokeCanvas.style.width = innerWidth + "px";
    smokeCanvas.style.height = innerHeight + "px";
  }
  resizeSmoke();
  window.addEventListener("resize", resizeSmoke);
  const SMOKE_COLORS = ["rgba(120,200,255,", "rgba(160,140,255,", "rgba(120,255,230,", "rgba(205,222,255,"];
  function spawnSmoke(rect){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const n = 85;
    for (let i = 0; i < n; i++){
      smokeParticles.push({
        x: (rect.left + Math.random() * rect.width) * dpr,
        y: (rect.top + Math.random() * rect.height) * dpr,
        vx: (Math.random() - 0.5) * 0.7 * dpr,
        vy: -(0.3 + Math.random() * 1.3) * dpr,
        r: (5 + Math.random() * 20) * dpr,
        grow: (0.12 + Math.random() * 0.28) * dpr,
        life: 1,
        decay: 0.007 + Math.random() * 0.012,
        col: SMOKE_COLORS[(Math.random() * SMOKE_COLORS.length) | 0]
      });
    }
    if (!smokeRAF) smokeRAF = requestAnimationFrame(smokeLoop);
  }
  function smokeLoop(){
    sctx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
    for (let i = smokeParticles.length - 1; i >= 0; i--){
      const p = smokeParticles[i];
      p.x += p.vx; p.y += p.vy; p.r += p.grow; p.life -= p.decay;
      if (p.life <= 0){ smokeParticles.splice(i, 1); continue; }
      const a = Math.max(0, p.life) * 0.45;
      const g = sctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, p.col + a + ")");
      g.addColorStop(1, p.col + "0)");
      sctx.fillStyle = g;
      sctx.beginPath();
      sctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      sctx.fill();
    }
    if (smokeParticles.length > 0) smokeRAF = requestAnimationFrame(smokeLoop);
    else { smokeRAF = null; sctx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height); }
  }

  function wireDropdown(wrapId, triggerId) {
    const wrap = document.getElementById(wrapId);
    const trigger = document.getElementById(triggerId);
    if (!wrap || !trigger) return;
    const dd = wrap.querySelector(".ia-dropdown");
    trigger.addEventListener("click", (e) => {
      if (window.innerWidth > 820) {
        e.preventDefault();
        e.stopPropagation();
        const willOpen = !wrap.classList.contains("open");
        wrap.classList.toggle("open");
        if (willOpen) burstSparks(trigger);
      }
    });
    document.addEventListener("click", (e) => {
      if (wrap.classList.contains("open") && !wrap.contains(e.target)) {
        wrap.classList.remove("open");
      }
    });
    wrap.querySelectorAll(".ia-item").forEach((it) =>
      it.addEventListener("click", () => wrap.classList.remove("open"))
    );
    // al volver a entrar, cancelamos la evaporación pendiente
    wrap.addEventListener("mouseenter", () => dd.classList.remove("evaporating"));
    // al sacar el ratón => se evapora como humo
    wrap.addEventListener("mouseleave", () => {
      if (window.innerWidth <= 820) return;
      const r = dd.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      spawnSmoke(r);
      dd.classList.add("evaporating");
      wrap.classList.remove("open");
      setTimeout(() => dd.classList.remove("evaporating"), 650);
    });
  }
  wireDropdown("navIa", "navIaTrigger");
  wireDropdown("navLinux", "navLinuxTrigger");
  wireDropdown("navFlipper", "navFlipperTrigger");
})();
