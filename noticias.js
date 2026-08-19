/* ===== Filtro de noticias por tag (estilo WordPress) ===== */
(function () {
  "use strict";
  const filterBar = document.getElementById("tagFilter");
  const posts = Array.from(document.querySelectorAll(".post"));
  if (!filterBar || posts.length === 0) return;

  function applyFilter(tag) {
    posts.forEach((p) => {
      const tags = (p.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean);
      const show = tag === "all" || tags.indexOf(tag) !== -1;
      p.classList.toggle("hidden", !show);
    });
    filterBar.querySelectorAll(".tag-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-filter") === tag);
    });
  }

  // clicks en la barra de filtros
  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".tag-btn");
    if (btn) applyFilter(btn.getAttribute("data-filter"));
  });

  // si la URL trae ?tag=xxx, filtra al cargar
  const params = new URLSearchParams(window.location.search);
  const initial = params.get("tag");
  if (initial) applyFilter(initial);
})();
