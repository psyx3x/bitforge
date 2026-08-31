/* ===== Noticias estilo WordPress (tags, buscador, paginación, sidebar, comentarios) ===== */
(function () {
  "use strict";

  const PER_PAGE = 5;
  const feed = document.getElementById("newsFeed");

  // --- inyecta noticias desde window.NOTICIAS (noticias-data.js) ---
  // Genera .post a partir de datos; no toca el HTML de noticias a mano.
  function injectNoticias() {
    if (!feed || !Array.isArray(window.NOTICIAS)) return;
    // reverse(): el primer elemento del array queda arriba del todo
    window.NOTICIAS.slice().reverse().forEach(function (n) {
      var art = document.createElement("article");
      art.className = "post";
      art.id = n.id;
      art.setAttribute("data-tags", (n.tags || []).join(" "));
      var html = "";
      if (n.thumb) {
        html += '<img class="post-thumb" src="' + n.thumb + '" alt="" loading="lazy" />';
      }
      html += '<div class="post-meta"><span class="post-date">' + n.fecha + "</span>";
      (n.tags || []).forEach(function (t) {
        html += '<a class="tag" href="noticias.html?tag=' + t + '">' + t.toUpperCase() + "</a>";
      });
      html += "</div>";
      html += '<a class="post-link" href="#' + n.id + '"><h3 class="post-title">' + n.title + "</h3></a>";
      html += '<p class="post-excerpt">' + n.excerpt + "</p>";
      html += '<div class="post-body">' + (n.body || "") + "</div>";
      html += '<a class="post-link read-more" href="#' + n.id + '">Leer más →</a>';
      html += '<span class="dim">Fuente: <a href="' + n.fuenteLink + '" target="_blank" rel="noopener noreferrer">' + n.fuenteText + "</a></span>";
      art.innerHTML = html;
      feed.insertBefore(art, feed.firstChild);
    });
  }
  injectNoticias();

  const posts = feed ? Array.from(feed.querySelectorAll(".post")) : [];
  const filterBar = document.getElementById("tagFilter");
  const searchInput = document.getElementById("newsSearch");
  const pager = document.getElementById("pager");
  const tagCloud = document.getElementById("tagCloud");
  const recentList = document.getElementById("recentList");

  let activeTag = "all";
  let searchTerm = "";
  let currentPage = 1;

  // --- extrae texto plano de un post (para buscar) ---
  function postText(p) {
    return (p.textContent || "").toLowerCase();
  }
  function postTags(p) {
    return (p.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean);
  }

  // --- filtra según tag + búsqueda ---
  function visiblePosts() {
    return posts.filter((p) => {
      const tags = postTags(p);
      const okTag = activeTag === "all" || tags.indexOf(activeTag) !== -1;
      const okSearch = !searchTerm || postText(p).indexOf(searchTerm) !== -1;
      return okTag && okSearch;
    });
  }

  // --- render principal ---
  function render() {
    const list = visiblePosts();
    const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PER_PAGE;
    const pageItems = list.slice(start, start + PER_PAGE);

    posts.forEach((p) => p.classList.add("hidden"));
    pageItems.forEach((p) => p.classList.remove("hidden"));

    // pager
    if (pager) {
      pager.innerHTML = "";
      if (totalPages > 1) {
        const prev = document.createElement("button");
        prev.className = "pager-btn";
        prev.textContent = "← Anterior";
        prev.disabled = currentPage === 1;
        prev.addEventListener("click", () => { currentPage--; render(); });
        pager.appendChild(prev);

        const label = document.createElement("span");
        label.className = "pager-label";
        label.textContent = "Página " + currentPage + " de " + totalPages;
        pager.appendChild(label);

        const next = document.createElement("button");
        next.className = "pager-btn";
        next.textContent = "Siguiente →";
        next.disabled = currentPage === totalPages;
        next.addEventListener("click", () => { currentPage++; render(); });
        pager.appendChild(next);
      }
    }
  }

  // --- barra de filtros ---
  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".tag-btn");
      if (!btn) return;
      activeTag = btn.getAttribute("data-filter");
      currentPage = 1;
      filterBar.querySelectorAll(".tag-btn").forEach((b) =>
        b.classList.toggle("active", b === btn)
      );
      render();
    });
  }

  // --- buscador ---
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchTerm = searchInput.value.trim().toLowerCase();
      currentPage = 1;
      render();
    });
  }

  // --- nube de tags (sidebar) ---
  function buildTagCloud() {
    if (!tagCloud) return;
    const counts = {};
    posts.forEach((p) => postTags(p).forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    const order = { ia: "IA", web: "Web", internet: "Internet", cloudflare: "Cloudflare", ejemplo: "Ejemplo", linux: "Linux", kernel: "Kernel", hardware: "Hardware", framework: "Framework", trading: "Trading", cripto: "Cripto", fibonacci: "Fibonacci", smc: "SMC", ciberseguridad: "Ciberseguridad", movil: "Móvil", privacidad: "Privacidad" };
    Object.keys(counts).forEach((t) => {
      const a = document.createElement("a");
      a.className = "cloud-tag";
      a.href = "noticias.html?tag=" + t;
      a.textContent = (order[t] || t) + " (" + counts[t] + ")";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        activeTag = t;
        currentPage = 1;
        if (filterBar) filterBar.querySelectorAll(".tag-btn").forEach((b) =>
          b.classList.toggle("active", b.getAttribute("data-filter") === t));
        // si el tag no está en la barra, igual filtramos
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      tagCloud.appendChild(a);
    });
  }

  // --- últimas noticias (sidebar) ---
  function buildRecent() {
    if (!recentList) return;
    posts.slice(0, 5).forEach((p) => {
      const title = p.querySelector(".post-title");
      const date = p.querySelector(".post-date");
      const a = document.createElement("a");
      a.className = "recent-item";
      a.href = "#";
      a.innerHTML =
        '<span class="recent-date">' + (date ? date.textContent : "") + "</span>" +
        '<span class="recent-title">' + (title ? title.textContent : "") + "</span>";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        p.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      recentList.appendChild(a);
    });
  }

  // --- URL con ?tag= o ?q= al cargar ---
  const params = new URLSearchParams(window.location.search);
  const initial = params.get("tag");
  if (initial) {
    activeTag = initial;
    if (filterBar) filterBar.querySelectorAll(".tag-btn").forEach((b) =>
      b.classList.toggle("active", b.getAttribute("data-filter") === initial));
  }
  const qParam = params.get("q");
  if (qParam && searchInput) {
    searchTerm = qParam.toLowerCase();
    searchInput.value = qParam;
  }

  buildTagCloud();
  buildRecent();
  render();

  /* ---- Comentarios con Giscus ----
     Requiere que CREES el repo de comentarios en giscus.app y pegues tu
     repo de GitHub abajo. Mientras tanto, muestra un aviso.
     Web: https://giscus.app */
  const GISCUS_REPO = "psyx3x/bitforge";
  const GISCUS_REPO_ID = "R_kgDOT7w2Qg";
  const GISCUS_CATEGORY_ID = "DIC_kwDOT7w2Qs4DD0vV"; // General
  const container = document.getElementById("giscus-container");
  if (container && GISCUS_REPO_ID && GISCUS_CATEGORY_ID) {
    const s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    s.setAttribute("data-repo", GISCUS_REPO);
    s.setAttribute("data-repo-id", GISCUS_REPO_ID);
    s.setAttribute("data-category", "Comentarios");
    s.setAttribute("data-category-id", GISCUS_CATEGORY_ID);
    s.setAttribute("data-mapping", "pathname");
    s.setAttribute("data-reactions-enabled", "1");
    s.setAttribute("data-emit-metadata", "0");
    s.setAttribute("data-theme", "dark");
    s.setAttribute("data-lang", "es");
    s.crossOrigin = "anonymous";
    s.async = true;
    container.appendChild(s);
  } else if (container) {
    container.innerHTML =
      '<p class="dim">Los comentarios se activarán al conectar Giscus (gratis). ' +
      'Pídele a Hermes que lo configure o ve a giscus.app.</p>';
  }

  /* ---- Modal single-post: título clicable abre la noticia sola ---- */
  const postModal = document.getElementById("postModal");
  const postModalBody = document.getElementById("postModalBody");
  const postModalClose = document.getElementById("postModalClose");

  function slugify(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "") // quita acentos
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  function openPost(article) {
    if (!postModal || !postModalBody || !article) return;
    // cambiamos la URL de la barra a un slug legible de la noticia (estilo WordPress)
    const titleEl = article.querySelector(".post-title");
    const slug = slugify(titleEl ? titleEl.textContent : "") || article.id || "";
    if (slug && history && history.pushState) {
      history.pushState({ post: slug }, "", "#" + slug);
    }
    // clonamos el contenido del post (meta + título + cuerpo + vídeo)
    const clone = article.cloneNode(true);
    clone.classList.remove("hidden");
    clone.querySelectorAll(".post-link").forEach((l) => {
      l.removeAttribute("href");
      l.classList.remove("post-link");
    });
    postModalBody.innerHTML = "";
    postModalBody.appendChild(clone);
    postModal.classList.add("open");
    postModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closePost() {
    if (!postModal) return;
    postModal.classList.remove("open");
    postModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // volvemos la URL a la lista de noticias (sin recargar)
    if (history && history.pushState) {
      history.pushState({}, "", location.pathname + location.search);
    }
  }

  document.querySelectorAll(".post-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const article = link.closest(".post");
      openPost(article);
    });
  });
  if (postModalClose) postModalClose.addEventListener("click", closePost);
  if (postModal) {
    postModal.addEventListener("click", (e) => { if (e.target === postModal) closePost(); });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && postModal && postModal.classList.contains("open")) closePost();
  });
})();
