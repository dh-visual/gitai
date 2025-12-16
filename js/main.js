// year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------------------------
   Language switch (robust)
   - Works for domain root: /it/...
   - Works for GitHub Pages: /<repo>/it/...
---------------------------- */

const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");
const langLabel = document.getElementById("langLabel");

const RESERVED_ROOT_FOLDERS = new Set(["it", "projects", "css", "js", "assets"]);

function getSegments() {
  return window.location.pathname.split("/").filter(Boolean);
}

function getBaseSegments(segments) {
  const first = segments[0];
  if (!first) return [];

  // ✅ 关键：如果是 Windows 盘符（E: / C:），不要当成 repo base
  if (/^[A-Za-z]:$/.test(first)) return [];

  if (first.includes(".")) return []; // e.g. index.html
  if (RESERVED_ROOT_FOLDERS.has(first)) return [];
  return [first]; // e.g. repo name
}

function parsePath() {
  const segments = getSegments();
  const base = getBaseSegments(segments);
  const rest = segments.slice(base.length);

  const isIt = rest[0] === "it";
  const restNoLang = isIt ? rest.slice(1) : rest;

  return { base, isIt, restNoLang };
}

function buildPath(base, targetIsIt, restNoLang) {
  const segs = base.concat(targetIsIt ? ["it", ...restNoLang] : restNoLang);
  return "/" + segs.join("/");
}

function syncLangUI() {
  const { isIt } = parsePath();
  document.documentElement.setAttribute("lang", isIt ? "it" : "en");
  if (langLabel) langLabel.textContent = isIt ? "IT" : "EN";
}

function toggleLangMenu(force) {
  if (!langMenu) return;
  const isOpen = langMenu.style.display === "block";
  const next = typeof force === "boolean" ? force : !isOpen;
  langMenu.style.display = next ? "block" : "none";
  langBtn?.setAttribute("aria-expanded", String(next));
}

// init lang UI
syncLangUI();

// dropdown events
langBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleLangMenu();
});

document.addEventListener("click", () => toggleLangMenu(false));
langMenu?.addEventListener("click", (e) => e.stopPropagation());

langMenu?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-lang]");
  if (!btn) return;

  const lang = btn.dataset.lang; // "en" | "it"
  const { base, restNoLang } = parsePath();

  const targetIsIt = (lang === "it");
  const targetPath = buildPath(base, targetIsIt, restNoLang);

  window.location.pathname = targetPath;
});

/* ---------------------------
   Hero slideshow
---------------------------- */
(function heroSlideshow(){
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  if (slides.length <= 1) return;

  let index = slides.findIndex(s => s.classList.contains("is-active"));
  if (index < 0) index = 0;

  const SHOW_MS = 4000;
  let timer = null;

  function setActive(next){
    slides.forEach((s, i) => {
      s.classList.toggle("is-active", i === next);
    });
    index = next;
  }

  function tick(){
    const next = (index + 1) % slides.length;
    setActive(next);
  }

  setActive(index);
  timer = setInterval(tick, SHOW_MS);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(timer);
      timer = null;
    } else if (!timer) {
      timer = setInterval(tick, SHOW_MS);
    }
  });
})();