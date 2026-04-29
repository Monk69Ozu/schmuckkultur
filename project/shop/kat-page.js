/**
 * kat-page.js — Premium category page renderer
 * Each category HTML sets window._KAT = { filter, label, desc } before loading this script.
 * Products are read from localStorage key 'schmuck_products' (same as CRM/shop).
 */
(function () {
  const KAT = window._KAT || { filter: 'Ringe', label: 'Ringe', desc: '' };
  const PRODUCTS_KEY = 'schmuck_products';

  /* ── INJECT STYLES ─────────────────────────────────────────────────── */
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --clr-bg: #faf8f5; --clr-text: #1f1a16; --clr-muted: #8a8074;
      --clr-light: #f0ebe4; --clr-border: #e8e2da; --clr-accent: #9b7d52;
      --clr-accent-dark: #7d6440;
      --font-serif: 'Playfair Display', Georgia, serif;
      --font-sans: 'Raleway', Helvetica, sans-serif;
    }
    html { scroll-behavior: smooth; }
    body { background: var(--clr-bg); color: var(--clr-text); font-family: var(--font-sans); font-weight: 300; -webkit-font-smoothing: antialiased; }

    /* BREADCRUMB */
    .kat-breadcrumb {
      max-width: 1320px; margin: 0 auto;
      padding: 28px 56px 0;
      font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--clr-muted); font-weight: 400;
    }
    .kat-breadcrumb a { color: var(--clr-muted); text-decoration: none; transition: color 0.2s; }
    .kat-breadcrumb a:hover { color: var(--clr-accent); }
    .kat-breadcrumb span.sep { margin: 0 10px; opacity: 0.5; }

    /* PAGE HEADER */
    .kat-header {
      max-width: 1320px; margin: 0 auto;
      padding: 48px 56px 56px; text-align: center;
    }
    .kat-header-label {
      font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase;
      color: var(--clr-accent); margin-bottom: 18px; font-weight: 500;
    }
    .kat-header h1 {
      font-family: var(--font-serif); font-size: clamp(36px, 5vw, 64px);
      font-weight: 400; line-height: 1.05; letter-spacing: -0.01em;
      margin-bottom: 20px;
    }
    .kat-header-desc {
      font-size: 14px; color: var(--clr-muted); max-width: 540px; margin: 0 auto;
      line-height: 1.8; font-weight: 300;
    }
    .kat-count {
      font-size: 10px; color: var(--clr-muted); letter-spacing: 0.22em;
      text-transform: uppercase; display: block; margin-top: 28px;
    }

    /* DESIGNER FILTER */
    .kat-filter-wrap {
      max-width: 1320px; margin: 0 auto;
      padding: 0 56px 8px; text-align: center;
    }
    .kat-filter-bar {
      display: inline-flex; flex-wrap: wrap; justify-content: center;
      gap: 0; padding: 14px 8px; border-top: 1px solid var(--clr-border);
      border-bottom: 1px solid var(--clr-border); width: 100%;
      align-items: center;
    }
    .kat-filter-label {
      font-size: 9px; letter-spacing: 0.32em; text-transform: uppercase;
      color: var(--clr-muted); font-weight: 500; margin-right: 18px;
      padding: 6px 0;
    }
    .kat-filter-btn {
      font-family: var(--font-sans); font-size: 11px; letter-spacing: 0.18em;
      text-transform: uppercase; padding: 8px 14px;
      background: transparent; border: none;
      color: var(--clr-muted); cursor: pointer; transition: color 0.2s;
      font-weight: 400; position: relative;
    }
    .kat-filter-btn:hover { color: var(--clr-accent); }
    .kat-filter-btn.active { color: var(--clr-text); font-weight: 500; }
    .kat-filter-btn.active::after {
      content: ''; position: absolute; bottom: 2px; left: 14px; right: 14px;
      height: 1px; background: var(--clr-accent);
    }

    /* PRODUCT GRID */
    .kat-grid-wrap {
      max-width: 1320px; margin: 0 auto;
      padding: 24px 56px 32px;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 56px 40px;
    }

    /* PRODUCT CARD */
    .product-card {
      background: transparent;
      cursor: pointer;
      display: flex; flex-direction: column;
      transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .product-card:hover { transform: translateY(-4px); }
    .product-img {
      aspect-ratio: 4/5;
      overflow: hidden;
      background: var(--clr-light);
      position: relative;
      margin-bottom: 18px;
    }
    .product-img img {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
      display: block;
    }
    .product-card:hover .product-img img { transform: scale(1.04); }
    .product-img-ph {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #efe9e1 0%, #e1d8ce 100%);
      color: rgba(0,0,0,0.18); font-size: 11px; letter-spacing: 0.18em;
      text-transform: uppercase; text-align: center; padding: 16px;
      font-family: var(--font-sans); font-weight: 400;
    }
    .product-badge {
      position: absolute; top: 14px; left: 14px;
      background: rgba(255,255,255,0.95); color: var(--clr-accent);
      font-size: 8px; letter-spacing: 0.24em; text-transform: uppercase;
      padding: 5px 11px; font-family: var(--font-sans); font-weight: 500;
    }
    .product-info {
      display: flex; flex-direction: column; align-items: center;
      text-align: center; gap: 8px; padding: 0 8px;
    }
    .product-designer {
      font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
      color: var(--clr-accent); font-weight: 500;
    }
    .product-name {
      font-family: var(--font-serif); font-size: 17px; font-weight: 400;
      line-height: 1.3; color: var(--clr-text); letter-spacing: 0.01em;
    }
    .product-cta {
      margin-top: 6px;
      font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase;
      color: var(--clr-muted); font-weight: 400;
      padding-bottom: 2px; border-bottom: 1px solid transparent;
      transition: color 0.2s, border-color 0.2s;
    }
    .product-card:hover .product-cta {
      color: var(--clr-accent); border-color: var(--clr-accent);
    }
    .product-price, .lightbox-price { display: none !important; }

    /* PAGINATION */
    .kat-pagination {
      display: flex; align-items: center; justify-content: center;
      gap: 4px; padding: 56px 56px 80px;
    }
    .kat-page-btn {
      font-family: var(--font-sans); font-size: 11px; letter-spacing: 0.16em;
      text-transform: uppercase; padding: 12px 18px; min-width: 42px;
      border: none; background: transparent;
      color: var(--clr-muted); cursor: pointer; transition: color 0.2s;
      font-weight: 400;
    }
    .kat-page-btn:hover { color: var(--clr-accent); }
    .kat-page-btn.active { color: var(--clr-text); font-weight: 500; }
    .kat-page-btn.active::after {
      content: ''; display: block; width: 16px; height: 1px;
      background: var(--clr-accent); margin: 6px auto 0;
    }
    .kat-page-btn:disabled { opacity: 0.25; cursor: default; }
    .kat-page-btn:disabled:hover { color: var(--clr-muted); }

    /* EMPTY STATE */
    .empty-state {
      max-width: 560px; margin: 0 auto;
      padding: 80px 56px 120px; text-align: center;
    }
    .empty-state-icon {
      width: 72px; height: 72px; margin: 0 auto 32px;
      border: 1px solid var(--clr-border); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: var(--clr-accent); font-size: 28px;
    }
    .empty-state h2 {
      font-family: var(--font-serif); font-size: 28px; font-weight: 400;
      margin-bottom: 18px; line-height: 1.2;
    }
    .empty-state p {
      font-size: 14px; line-height: 1.85; color: var(--clr-muted);
    }
    .empty-state a { color: var(--clr-accent); text-decoration: none; border-bottom: 1px solid var(--clr-accent); padding-bottom: 1px; }
    .empty-state a:hover { color: var(--clr-accent-dark); }

    /* LIGHTBOX */
    .lightbox {
      display: none; position: fixed; inset: 0; z-index: 500;
      background: rgba(20,16,12,0.78); backdrop-filter: blur(8px);
      align-items: center; justify-content: center; padding: 32px;
      animation: lbFade 0.3s ease;
    }
    @keyframes lbFade { from { opacity: 0; } to { opacity: 1; } }
    .lightbox.open { display: flex; }
    .lightbox-inner {
      background: var(--clr-bg); max-width: 960px; width: 100%;
      display: grid; grid-template-columns: 1.1fr 1fr;
      max-height: 88vh; position: relative;
      box-shadow: 0 30px 80px rgba(0,0,0,0.4);
    }
    .lightbox-img { aspect-ratio: 4/5; overflow: hidden; background: var(--clr-light); }
    .lightbox-img img { width: 100%; height: 100%; object-fit: cover; }
    .lightbox-content {
      padding: 56px 48px; display: flex; flex-direction: column; gap: 18px;
      overflow-y: auto;
    }
    .lightbox-designer {
      font-size: 10px; letter-spacing: 0.32em; text-transform: uppercase;
      color: var(--clr-accent); font-weight: 500;
    }
    .lightbox-name {
      font-family: var(--font-serif); font-size: 32px; font-weight: 400;
      line-height: 1.15; letter-spacing: -0.005em;
    }
    .lightbox-divider {
      width: 32px; height: 1px; background: var(--clr-accent); margin: 4px 0;
    }
    .lightbox-desc {
      font-size: 14px; line-height: 1.85; color: #5a5048; flex: 1;
      font-weight: 300;
    }
    .lightbox-info-box {
      background: var(--clr-light); padding: 20px 22px; margin-top: 8px;
      border-left: 2px solid var(--clr-accent);
    }
    .lightbox-info-box p {
      font-size: 12px; line-height: 1.75; color: #5a5048;
      font-style: italic;
    }
    .lightbox-anfrage {
      display: inline-block; margin-top: 12px; align-self: flex-start;
      font-family: var(--font-sans); font-size: 10px; letter-spacing: 0.28em;
      text-transform: uppercase; padding: 14px 32px;
      background: var(--clr-text); color: #fff;
      text-decoration: none; transition: background 0.25s;
      font-weight: 500;
    }
    .lightbox-anfrage:hover { background: var(--clr-accent); }
    .lightbox-close {
      position: absolute; top: 14px; right: 18px; z-index: 2;
      width: 36px; height: 36px;
      background: none; border: none;
      cursor: pointer; color: var(--clr-muted); line-height: 1;
      font-size: 24px; transition: color 0.2s;
    }
    .lightbox-close:hover { color: var(--clr-text); }

    /* ALL CATEGORIES STRIP */
    .kat-strip {
      max-width: 1320px; margin: 0 auto;
      padding: 56px 56px 64px;
      border-top: 1px solid var(--clr-border);
      text-align: center;
    }
    .kat-strip-title {
      font-size: 9px; letter-spacing: 0.32em; text-transform: uppercase;
      color: var(--clr-muted); margin-bottom: 28px; font-weight: 500;
    }
    .kat-strip-links {
      display: flex; flex-wrap: wrap; gap: 0; justify-content: center;
    }
    .kat-strip-link {
      font-family: var(--font-sans); font-size: 11px; letter-spacing: 0.18em;
      text-transform: uppercase; padding: 10px 22px;
      color: var(--clr-muted); text-decoration: none;
      transition: color 0.2s; font-weight: 400;
      position: relative;
    }
    .kat-strip-link:not(:last-child)::after {
      content: ''; position: absolute; right: 0; top: 50%;
      transform: translateY(-50%); width: 1px; height: 12px;
      background: var(--clr-border);
    }
    .kat-strip-link:hover { color: var(--clr-accent); }
    .kat-strip-link.current { color: var(--clr-text); font-weight: 500; }

    /* RESPONSIVE */
    @media (max-width: 1100px) {
      .product-grid { grid-template-columns: repeat(3, 1fr); gap: 40px 28px; }
      .kat-grid-wrap, .kat-header, .kat-breadcrumb, .kat-strip { padding-left: 32px; padding-right: 32px; }
    }
    @media (max-width: 800px) {
      .product-grid { grid-template-columns: repeat(2, 1fr); gap: 32px 20px; }
      .kat-grid-wrap { padding: 16px 20px 24px; }
      .kat-header { padding: 32px 20px 40px; }
      .kat-filter-wrap { padding: 0 20px 8px; }
      .kat-filter-bar { padding: 10px 4px; }
      .kat-filter-label { width: 100%; margin: 0 0 4px; text-align: center; }
      .kat-breadcrumb { padding: 20px 20px 0; }
      .kat-strip { padding: 40px 20px 48px; }
      .kat-pagination { padding: 32px 20px 56px; }
      .product-name { font-size: 15px; }
      .lightbox { padding: 16px; }
      .lightbox-inner { grid-template-columns: 1fr; max-height: 92vh; overflow: auto; }
      .lightbox-content { padding: 32px 24px; }
      .lightbox-name { font-size: 26px; }
    }
    @media (max-width: 480px) {
      .product-grid { gap: 28px 16px; }
    }
  `;
  document.head.appendChild(styleEl);

  /* ── ALL CATEGORIES (same as CRM) ──────────────────────────────────── */
  const ALLE_KAT = [
    { filter: 'Ringe',          label: 'Ringe',          slug: 'ringe' },
    { filter: 'Trauringe',      label: 'Trauringe',      slug: 'trauringe' },
    { filter: 'Verlobungsringe',label: 'Verlobungsringe',slug: 'verlobungsringe' },
    { filter: 'Halsschmuck',    label: 'Halsschmuck',    slug: 'halsschmuck' },
    { filter: 'Ohrschmuck',     label: 'Ohrschmuck',     slug: 'ohrschmuck' },
    { filter: 'Perlen',         label: 'Perlen',         slug: 'perlen' },
    { filter: 'Uhren',          label: 'Uhren',          slug: 'uhren' },
    { filter: 'Armschmuck',     label: 'Armschmuck',     slug: 'armschmuck' },
    { filter: 'Männersache',    label: 'Männersache',    slug: 'maennersache' },
    { filter: 'Atelierschmuck', label: 'Atelierschmuck', slug: 'atelierschmuck' },
  ];

  /* ── LOAD PRODUCTS ─────────────────────────────────────────────────── */
  function getProducts() {
    try { return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]'); } catch(e) { return []; }
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  const PER_PAGE = 12;
  let __katCurrentPage = 0;
  let __katFiltered = [];
  let __katAllProducts = [];
  let __katCategoryProducts = [];
  let __katActiveDesigner = 'Alle';

  function applyDesignerFilter() {
    __katFiltered = __katActiveDesigner === 'Alle'
      ? __katCategoryProducts.slice()
      : __katCategoryProducts.filter(p => (p.designer || '').trim() === __katActiveDesigner);
    const countEl = document.getElementById('kat-count');
    if (countEl) {
      countEl.textContent = __katFiltered.length + ' ' + (__katFiltered.length === 1 ? 'Stück' : 'Stücke');
    }
    renderPage(0);
  }

  window.__katSetDesigner = function(name) {
    __katActiveDesigner = name;
    document.querySelectorAll('.kat-filter-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.designer === name);
    });
    applyDesignerFilter();
  };

  function renderPage(page) {
    __katCurrentPage = page;
    const start = page * PER_PAGE;
    const pageItems = __katFiltered.slice(start, start + PER_PAGE);
    const totalPages = Math.ceil(__katFiltered.length / PER_PAGE);

    const grid = document.getElementById('kat-grid');
    grid.innerHTML = pageItems.map(p => {
      const idx = __katAllProducts.indexOf(p);
      const name = escapeHtml(p.name);
      const designer = escapeHtml(p.designer || '');
      const foto = escapeHtml(p.foto || '');
      return '<div class="product-card" onclick="__katOpenLightbox(' + idx + ')">' +
        '<div class="product-img">' +
          (foto
            ? '<img src="' + foto + '" alt="' + name + '" onerror="this.parentElement.innerHTML=\'<div class=&quot;product-img-ph&quot;>' + name.replace(/'/g, '\\\'') + '</div>\'">'
            : '<div class="product-img-ph">' + name + '</div>') +
          (p.neu ? '<span class="product-badge">Neu</span>' : '') +
        '</div>' +
        '<div class="product-info">' +
          (designer ? '<p class="product-designer">' + designer + '</p>' : '') +
          '<p class="product-name">' + name + '</p>' +
          '<span class="product-cta">Anfrage stellen</span>' +
        '</div>' +
      '</div>';
    }).join('');

    const pag = document.getElementById('kat-pagination');
    if (totalPages <= 1) { pag.style.display = 'none'; return; }
    pag.style.display = 'flex';
    let html = '<button class="kat-page-btn" onclick="__katGoPage(' + (page-1) + ')" ' + (page === 0 ? 'disabled' : '') + '>← Zurück</button>';
    for (let i = 0; i < totalPages; i++) {
      html += '<button class="kat-page-btn' + (i === page ? ' active' : '') + '" onclick="__katGoPage(' + i + ')">' + (i+1) + '</button>';
    }
    html += '<button class="kat-page-btn" onclick="__katGoPage(' + (page+1) + ')" ' + (page === totalPages-1 ? 'disabled' : '') + '>Weiter →</button>';
    pag.innerHTML = html;
  }

  window.__katGoPage = function(page) {
    renderPage(page);
    const wrap = document.querySelector('.kat-grid-wrap');
    window.scrollTo({ top: wrap ? wrap.offsetTop - 80 : 0, behavior: 'smooth' });
  };

  /* ── BUILD HTML ────────────────────────────────────────────────────── */
  function build() {
    const products = getProducts();
    const filtered = products.filter(p => p.kategorie === KAT.filter);
    __katFiltered = filtered;
    __katCategoryProducts = filtered;
    __katAllProducts = products;

    // Build unique designer list (sorted)
    const designerSet = new Set();
    filtered.forEach(p => { if (p.designer && p.designer.trim()) designerSet.add(p.designer.trim()); });
    const designers = Array.from(designerSet).sort((a, b) => a.localeCompare(b, 'de'));
    const filterHtml = (designers.length > 0 && filtered.length > 1)
      ? '<div class="kat-filter-wrap"><div class="kat-filter-bar">' +
          '<span class="kat-filter-label">Designer</span>' +
          '<button class="kat-filter-btn active" data-designer="Alle" onclick="__katSetDesigner(\'Alle\')">Alle</button>' +
          designers.map(d =>
            '<button class="kat-filter-btn" data-designer="' + escapeHtml(d) + '" onclick="__katSetDesigner(' + JSON.stringify(d).replace(/"/g, '&quot;') + ')">' + escapeHtml(d) + '</button>'
          ).join('') +
        '</div></div>'
      : '';

    const katStripLinks = ALLE_KAT.map(k =>
      '<a class="kat-strip-link' + (k.filter === KAT.filter ? ' current' : '') + '" href="' + k.slug + '.html">' + k.label + '</a>'
    ).join('');

    const wrap = document.createElement('div');

    if (filtered.length === 0) {
      wrap.innerHTML =
        '<nav class="kat-breadcrumb">' +
          '<a href="../shop.html">Shop</a><span class="sep">›</span>' + KAT.label +
        '</nav>' +
        '<div class="kat-header">' +
          '<p class="kat-header-label">Unsere Kollektion</p>' +
          '<h1>' + KAT.label + '</h1>' +
          (KAT.desc ? '<p class="kat-header-desc">' + KAT.desc + '</p>' : '') +
        '</div>' +
        '<div class="empty-state">' +
          '<div class="empty-state-icon">◇</div>' +
          '<h2>Diese Kollektion wird gerade kuratiert</h2>' +
          '<p>Aktuell sind in dieser Kategorie noch keine Stücke online verfügbar. Besuchen Sie uns gerne in unserem Geschäft in Mödling – oder kontaktieren Sie uns über das ' +
          '<a href="../kontakt.html">Kontaktformular</a> für individuelle Anfragen.</p>' +
        '</div>' +
        '<div class="kat-strip">' +
          '<p class="kat-strip-title">Weitere Kategorien</p>' +
          '<div class="kat-strip-links">' + katStripLinks + '</div>' +
        '</div>' +
        '<site-footer></site-footer>';
      document.body.appendChild(wrap);
      return;
    }

    wrap.innerHTML =
      '<nav class="kat-breadcrumb">' +
        '<a href="../shop.html">Shop</a><span class="sep">›</span>' + KAT.label +
      '</nav>' +

      '<div class="kat-header">' +
        '<p class="kat-header-label">Unsere Kollektion</p>' +
        '<h1>' + KAT.label + '</h1>' +
        (KAT.desc ? '<p class="kat-header-desc">' + KAT.desc + '</p>' : '') +
        '<span class="kat-count" id="kat-count">' + filtered.length + ' ' + (filtered.length === 1 ? 'Stück' : 'Stücke') + '</span>' +
      '</div>' +

      filterHtml +

      '<div class="kat-grid-wrap"><div class="product-grid" id="kat-grid"></div></div>' +
      '<div class="kat-pagination" id="kat-pagination"></div>' +

      '<div class="kat-strip">' +
        '<p class="kat-strip-title">Weitere Kategorien entdecken</p>' +
        '<div class="kat-strip-links">' + katStripLinks + '</div>' +
      '</div>' +

      '<div class="lightbox" id="kat-lightbox" onclick="__katCloseLightbox(event)">' +
        '<div class="lightbox-inner" id="kat-lb-inner">' +
          '<button class="lightbox-close" onclick="__katCloseLightbox()" aria-label="Schließen">×</button>' +
          '<div class="lightbox-img"><img id="kat-lb-img" src="" alt=""></div>' +
          '<div class="lightbox-content">' +
            '<p class="lightbox-designer" id="kat-lb-designer"></p>' +
            '<h2 class="lightbox-name" id="kat-lb-name"></h2>' +
            '<div class="lightbox-divider"></div>' +
            '<p class="lightbox-desc" id="kat-lb-desc"></p>' +
            '<div class="lightbox-info-box">' +
              '<p>Besuchen Sie uns in Mödling – wir zeigen Ihnen das Stück persönlich, beraten Sie ausführlich und besprechen gemeinsam alle Details.</p>' +
            '</div>' +
            '<a id="kat-lb-anfrage" href="../kontakt.html" class="lightbox-anfrage">Anfrage stellen</a>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<site-footer></site-footer>';

    document.body.appendChild(wrap);
    renderPage(0);
  }

  /* ── LIGHTBOX ──────────────────────────────────────────────────────── */
  window.__katOpenLightbox = function(idx) {
    const products = getProducts();
    const p = products[idx];
    if (!p) return;
    const img = document.getElementById('kat-lb-img');
    img.src = p.foto || '';
    img.style.display = p.foto ? '' : 'none';
    document.getElementById('kat-lb-designer').textContent = p.designer || '';
    document.getElementById('kat-lb-name').textContent = p.name || '';
    document.getElementById('kat-lb-desc').textContent = p.beschreibung || '';
    document.getElementById('kat-lb-anfrage').href = '../kontakt.html?produkt=' + encodeURIComponent(p.name || '');
    document.getElementById('kat-lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.__katCloseLightbox = function(e) {
    const lb = document.getElementById('kat-lightbox');
    if (e && e.target !== lb && e.target.tagName !== 'BUTTON') return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const lb = document.getElementById('kat-lightbox');
      if (lb) { lb.classList.remove('open'); document.body.style.overflow = ''; }
    }
  });

  /* ── INIT ──────────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
