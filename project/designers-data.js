/**
 * designers-data.js — Loads designers-data.json (canonical, in repo) and
 * exposes window.DESIGNERS + window.findDesigner.
 *
 * Single source of truth: project/designers-data.json (managed via CRM).
 * To update: edit through the CRM Designer page → Sync to GitHub.
 */
(function () {
  const STORAGE_KEY = 'schmuck_designers';

  // Fallback list — only used if both fetch and localStorage fail.
  const FALLBACK = [
    { name: 'Niessing', logo: 'images/designer-logos/niessing.png', url: 'https://niessing.com/de-AT/SCHMUCK/' },
  ];

  function setActive(list) {
    list.sort((a, b) => a.name.localeCompare(b.name, 'de'));
    window.DESIGNERS = list;
  }

  // Initial: read localStorage as warm cache so layout doesn't flash empty
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) setActive(parsed);
    }
  } catch (e) {}

  if (!window.DESIGNERS) setActive(FALLBACK);

  window.findDesigner = function (raw) {
    if (!raw) return null;
    const norm = String(raw).trim().toLowerCase();
    return (window.DESIGNERS || []).find(d => d.name.toLowerCase() === norm) || null;
  };

  // Async: fetch canonical JSON; if newer/different, replace localStorage + active list
  // Path resolution: pages in /shop/ load us via "../designers-data.js", so JSON is at "../designers-data.json"
  // Pages at root (crm.html, designer.html) use "designers-data.js" → JSON at "designers-data.json"
  const here = (document.currentScript && document.currentScript.src) || '';
  const jsonUrl = here.replace(/designers-data\.js.*$/, 'designers-data.json');

  fetch(jsonUrl + '?ts=' + Date.now(), { cache: 'no-store' })
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setActive(data);
        // Notify any UI to re-render
        window.dispatchEvent(new CustomEvent('designers:loaded', { detail: data }));
      }
    })
    .catch(() => { /* offline → keep cache/fallback */ });
})();
