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

  /* ---- Fondo animado: LO CONTROLA bg-figures.js (puntitos libres + dragón Kali centro) ---- */

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
  wireDropdown("navHacking", "navHackingTrigger");
  wireDropdown("navTrading", "navTradingTrigger");

  /* ---- Terminal (apariencia chat tipo GPT/Gemini) ---- */
  const termOpen = document.getElementById("terminalOpen");
  const termClose = document.getElementById("terminalClose");
  const termOverlay = document.getElementById("terminalOverlay");
  const termChat = document.getElementById("terminalChat");
  const termText = document.getElementById("terminalText");
  const termSend = document.getElementById("terminalSend");
  const attachImg = document.getElementById("attachImg");
  const attachFile = document.getElementById("attachFile");
  const attachMore = document.getElementById("attachMore");
  const fileImg = document.getElementById("fileImg");
  const fileAny = document.getElementById("fileAny");
  const attachName = document.getElementById("attachName");

  function openTerminal() {
    termOverlay.classList.add("open");
    termOverlay.setAttribute("aria-hidden", "false");
    setTimeout(() => termText.focus(), 50);
  }
  function closeTerminal() {
    termOverlay.classList.remove("open");
    termOverlay.setAttribute("aria-hidden", "true");
  }
  termOpen.addEventListener("click", (e) => { e.preventDefault(); openTerminal(); });
  termClose.addEventListener("click", closeTerminal);
  termOverlay.addEventListener("click", (e) => { if (e.target === termOverlay) closeTerminal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && termOverlay.classList.contains("open")) closeTerminal(); });

  let pendingAttachment = null; // {type:'image'|'file', name, dataUrl?}

  // URL del proxy Cloudflare Worker (IA real vía OpenRouter).
  const TERMINAL_PROXY_URL = "https://bitforge-terminal.n4rvik.workers.dev";
  const chatHistory = []; // contexto para la IA real

  function addMessage(role, html) {
    const wrap = document.createElement("div");
    wrap.className = "msg " + role;
    const avatar = role === "user" ? "TÚ" : "BF";
    wrap.innerHTML = '<div class="avatar">' + avatar + '</div><div class="bubble">' + html + "</div>";
    termChat.appendChild(wrap);
    termChat.scrollTop = termChat.scrollHeight;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function sendMessage() {
    const text = termText.value.trim();
    if (!text && !pendingAttachment) return;
    let body = "";
    if (pendingAttachment) {
      if (pendingAttachment.type === "image") {
        body += '<img src="' + pendingAttachment.dataUrl + '" alt="adjunto"/>';
      } else {
        body += '<div class="fname">📎 ' + escapeHtml(pendingAttachment.name) + "</div>";
      }
    }
    if (text) body += (body ? "<br>" : "") + escapeHtml(text);
    addMessage("user", body);
    chatHistory.push({ role: "user", content: text || "(adjunto)" });

    termText.value = "";
    pendingAttachment = null;
    attachName.textContent = "";
    autoGrow();

    // Si hay proxy configurado -> IA real; si no -> modo demo
    if (TERMINAL_PROXY_URL) {
      const typing = document.createElement("div");
      typing.className = "msg bot";
      typing.innerHTML = '<div class="avatar">BF</div><div class="bubble">…</div>';
      termChat.appendChild(typing);
      termChat.scrollTop = termChat.scrollHeight;

      fetch(TERMINAL_PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: chatHistory }),
      })
        .then((r) => r.json())
        .then((data) => {
          const reply = data.reply || "(sin respuesta de la IA)";
          typing.querySelector(".bubble").innerHTML = escapeHtml(reply);
          chatHistory.push({ role: "assistant", content: reply });
        })
        .catch(() => {
          typing.querySelector(".bubble").textContent = "No se pudo conectar con la IA. Revisa el proxy.";
        });
    } else {
      setTimeout(() => {
        const samples = [
          "Recibido. Esta es una demo visual: aún no hay un modelo de IA conectado, pero la interfaz ya funciona igual que un chat real.",
          "Buena pregunta sobre tecnología. Cuando conectemos la IA (vía API + proxy), responderé de verdad aquí mismo.",
          "Entendido. Puedes adjuntar imágenes o archivos con los botones de abajo, como en GPT o Gemini.",
        ];
        const reply = samples[Math.floor(Math.random() * samples.length)];
        addMessage("bot", reply);
        chatHistory.push({ role: "assistant", content: reply });
      }, 500);
    }
  }

  termSend.addEventListener("click", sendMessage);
  termText.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  function autoGrow() {
    termText.style.height = "auto";
    termText.style.height = Math.min(termText.scrollHeight, 140) + "px";
  }
  termText.addEventListener("input", autoGrow);

  attachImg.addEventListener("click", () => fileImg.click());
  attachFile.addEventListener("click", () => fileAny.click());
  attachMore.addEventListener("click", () => fileAny.click());

  fileImg.addEventListener("change", () => {
    const f = fileImg.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      pendingAttachment = { type: "image", name: f.name, dataUrl: reader.result };
      attachName.textContent = "🖼️ " + f.name;
    };
    reader.readAsDataURL(f);
    fileImg.value = "";
  });
  fileAny.addEventListener("change", () => {
    const f = fileAny.files[0];
    if (!f) return;
    pendingAttachment = { type: "file", name: f.name };
    attachName.textContent = "📎 " + f.name;
    fileAny.value = "";
  });

  /* ---- Buscador de la portada -> redirige a noticias filtradas ---- */
  const heroSearch = document.getElementById("heroSearch");
  if (heroSearch) {
    heroSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = heroSearch.value.trim();
        window.location.href = "noticias.html" + (q ? "?q=" + encodeURIComponent(q) : "");
      }
    });
  }
})();
