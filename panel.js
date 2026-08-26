/* Mi Panel — BitForge. Guarda en localStorage del navegador.
   No depende de nada externo. */
(function () {
  "use strict";

  // ---- YouTube: extrae el ID y carga el embed ----
  var ytInput = document.getElementById("ytInput");
  var ytLoad = document.getElementById("ytLoad");
  var ytWrap = document.getElementById("ytFrameWrap");
  var ytFrame = document.getElementById("ytFrame");

  function ytId(url) {
    if (!url) return null;
    var m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    return m ? m[1] : null;
  }
  if (ytLoad && ytInput && ytFrame && ytWrap) {
    ytLoad.addEventListener("click", function () {
      var id = ytId(ytInput.value.trim());
      if (!id) {
        ytWrap.hidden = false;
        ytFrame.src = "";
        ytFrame.replaceWith(ytFrame); // limpia
        alert("Pega un enlace válido de YouTube.");
        return;
      }
      ytFrame.src = "https://www.youtube.com/embed/" + id;
      ytWrap.hidden = false;
    });
  }

  // ---- Enlaces guardados ----
  var nameEl = document.getElementById("linkName");
  var urlEl = document.getElementById("linkUrl");
  var addBtn = document.getElementById("linkAdd");
  var listEl = document.getElementById("savedLinks");
  var emptyEl = document.getElementById("linksEmpty");
  var KEY = "bitforge_panel_links";

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function save(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }
  function render() {
    var arr = load();
    listEl.innerHTML = "";
    if (!arr.length) {
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    arr.forEach(function (item, i) {
      var a = document.createElement("a");
      a.className = "panel-link-item";
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = item.name || item.url;
      var del = document.createElement("button");
      del.className = "panel-link-del";
      del.textContent = "✕";
      del.setAttribute("aria-label", "Eliminar");
      del.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var cur = load();
        cur.splice(i, 1);
        save(cur);
        render();
      });
      a.appendChild(del);
      listEl.appendChild(a);
    });
  }
  if (addBtn && nameEl && urlEl) {
    addBtn.addEventListener("click", function () {
      var url = urlEl.value.trim();
      var name = nameEl.value.trim();
      if (!url) { alert("Pon un enlace en 'https://...'"); return; }
      if (!/^https?:\/\//i.test(url)) url = "https://" + url;
      var arr = load();
      arr.push({ name: name, url: url });
      save(arr);
      nameEl.value = "";
      urlEl.value = "";
      render();
    });
    render();
  }
})();
