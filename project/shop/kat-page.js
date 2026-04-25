/**
 * kat-page.js — Shared category page renderer
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
      --clr-bg: #f8f5f1; --clr-text: #2a2420; --clr-muted: #7a706a;
      --clr-light: #e0d9d2; --clr-border: #ddd6ce; --clr-accent: #8c7355;
      --font-serif: 'Playfair Display', Georgia, serif;
      --font-sans: 'Raleway', Helvetica, sans-serif;
    }
    html { scroll-behavior: smooth; }
    body { background: var(--clr-bg); color: var(--clr-text); font-family: var(--font-sans); font-weight: 300; }

    /* BREADCRUMB */
    .kat-breadcrumb {
      padding: 18px 64px 0;
      font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
      color: var(--clr-muted);
    }
    .kat-breadcrumb a { color: var(--clr-accent); text-decoration: none; }
    .kat-breadcrumb a:hover { text-decoration: underline; }
    .kat-breadcrumb span { margin: 0 8px; }

    /* PAGE HEADER */
    .kat-header {
      padding: 32px 64px 36px;
      border-bottom: 1px solid var(--clr-border);
      display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap;
    }
    .kat-header-label {
      font-size: 9px; letter-spacing: 0.32em; text-transform: uppercase;
      color: var(--clr-accent); margin-bottom: 10px; font-weight: 400;
    }
    .kat-header h1 {
      font-family: var(--font-serif); font-size: clamp(28px, 4vw, 52px);
      font-weight: 400; line-height: 1.1;
    }
    .kat-header-desc {
      font-size: 13px; color: var(--clr-muted); max-width: 340px;
      line-height: 1.7; text-align: right;
    }
    .kat-count {
      font-size: 11px; color: var(--clr-muted); letter-spacing: 0.12em;
      display: block; margin-top: 6px;
    }

    /* PRODUCT GRID */
    .kat-grid-wrap { padding: 32px 48px 24px; max-width: 1400px; margin: 0 auto; }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    /* PAGINATION */
    .kat-pagination {
      display: flex; align-items: center; justify-content: center;
      gap: 8px; padding: 32px 48px 56px;
    }
    .kat-page-btn {
      font-family: var(--font-sans); font-size: 11px; letter-spacing: 0.14em;
      text-transform: uppercase; padding: 8px 16px;
      border: 1px solid var(--clr-border); background: transparent;
      color: var(--clr-muted); cursor: pointer; transition: all 0.2s;
    }
    .kat-page-btn:hover { border-color: var(--clr-accent); color: var(--clr-accent); }
    .kat-page-btn.active { border-color: var(--clr-accent); color: var(--clr-accent); background: rgba(140,115,85,0.08); }
    .kat-page-btn:disabled { opacity: 0.3; cursor: default; }
    .kat-page-btn:disabled:hover { border-color: var(--clr-border); color: var(--clr-muted); }
    .product-card {
      background: #fff;
      cursor: pointer;
      transition: box-shadow 0.25s, transform 0.25s;
      display: flex; flex-direction: column;
      border: 1px solid var(--clr-border);
    }
    .product-card:hover {
      box-shadow: 0 6px 24px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }
    .product-img {
      aspect-ratio: 4/3;
      overflow: hidden;
      background: #f0ede9;
      position: relative;
    }
    .product-img img {
      width: 100%; height: 100%; object-fit: contain;
      transition: transform 0.4s ease;
      padding: 8px;
    }
    .product-card:hover .product-img img { transform: scale(1.05); }
    .product-img-ph {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #ede8e3 0%, #e0dad3 100%);
      color: rgba(0,0,0,0.2); font-size: 11px; font-family: monospace; text-align: center; padding: 12px;
    }
    .product-badge {
      position: absolute; top: 12px; left: 12px;
      background: var(--clr-accent); color: #fff;
      font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase;
      padding: 4px 10px; font-family: var(--font-sans);
    }
    .product-info { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 4px; }
    .product-designer { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--clr-accent); }
    .product-name { font-family: var(--font-serif); font-size: 14px; font-weight: 400; line-height: 1.25; color: var(--clr-text); margin-bottom: 8px; }
    .product-price { display: none !important; }
    .lightbox-price { display: none !important; }
    .product-anfrage {
      display: inline-block; font-family: var(--font-sans); font-size: 8px;
      letter-spacing: 0.18em; text-transform: uppercase; padding: 7px 16px;
      border: 1px solid var(--clr-border); color: var(--clr-muted);
      background: transparent; cursor: pointer; transition: border-color 0.2s, color 0.2s;
      font-weight: 400; text-decoration: none; align-self: flex-start; margin-top: 4px;
    }
    .product-anfrage:hover { border-color: var(--clr-accent); color: var(--clr-accent); }

    .empty-state { padding: 120px 64px; text-align: center; color: var(--clr-muted); }
    .empty-state h2 { font-family: var(--font-serif); font-size: 32px; font-weight: 400; margin-bottom: 16px; }
    .empty-state p { font-size: 14px; line-height: 1.8; }

    /* LIGHTBOX */
    .lightbox {
      display: none; position: fixed; inset: 0; z-index: 500;
      background: rgba(20,16,12,0.7); backdrop-filter: blur(4px);
      align-items: center; justify-content: center; padding: 40px;
    }
    .lightbox.open { display: flex; }
    .lightbox-inner {
      background: var(--clr-bg); max-width: 800px; width: 100%;
      display: grid; grid-template-columns: 1fr 1fr;
      max-height: 90vh; overflow: auto; position: relative;
    }
    .lightbox-img { aspect-ratio: 1; overflow: hidden; background: var(--clr-light); }
    .lightbox-img img { width: 100%; height: 100%; object-fit: cover; }
    .lightbox-content { padding: 48px 40px; display: flex; flex-direction: column; gap: 16px; }
    .lightbox-designer { font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--clr-accent); }
    .lightbox-name { font-family: var(--font-serif); font-size: 28px; font-weight: 400; line-height: 1.15; }
    .lightbox-price { font-size: 15px; color: var(--clr-muted); }
    .lightbox-desc { font-size: 13px; line-height: 1.85; color: var(--clr-muted); flex: 1; }
    .lightbox-close {
      position: absolute; top: 16px; right: 20px;
      font-size: 22px; background: none; border: none;
      cursor: pointer; color: var(--clr-muted); line-height: 1;
    }
    .lightbox-close:hover { color: var(--clr-text); }

    /* ALL CATEGORIES STRIP */
    .kat-strip {
      padding: 40px 64px;
      border-top: 1px solid var(--clr-border);
      border-bottom: 1px solid var(--clr-border);
      background: #fff;
    }
    .kat-strip-title {
      font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
      color: var(--clr-muted); margin-bottom: 20px; font-weight: 400;
    }
    .kat-strip-links {
      display: flex; flex-wrap: wrap; gap: 8px;
    }
    .kat-strip-link {
      font-family: var(--font-sans); font-size: 10px; letter-spacing: 0.14em;
      text-transform: uppercase; padding: 7px 16px;
      border: 1px solid var(--clr-border); color: var(--clr-muted);
      text-decoration: none; transition: all 0.2s; font-weight: 400;
    }
    .kat-strip-link:hover { border-color: var(--clr-accent); color: var(--clr-accent); background: rgba(140,115,85,0.05); }
    .kat-strip-link.current { border-color: var(--clr-accent); color: var(--clr-accent); background: rgba(140,115,85,0.08); }

    /* FOOTER */
    footer { background: #1e1b18; color: rgba(255,255,255,0.55); padding: 56px 64px 36px; }
    .footer-inner { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
    .footer-logo { font-family: var(--font-serif); font-size: 18px; color: rgba(255,255,255,0.85); font-weight: 400; margin-bottom: 16px; }
    .footer-col h4 { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 16px; font-weight: 400; }
    .footer-col ul { list-style: none; }
    .footer-col li { margin-bottom: 8px; }
    .footer-col a { font-size: 12px; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; }
    .footer-col a:hover { color: rgba(255,255,255,0.9); }
    .footer-col p { font-size: 12px; line-height: 2.2; }
    .footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.25); flex-wrap: wrap; gap: 8px; }
    .footer-bottom a { color: rgba(255,255,255,0.3); text-decoration: none; }
    .footer-bottom a:hover { color: rgba(255,255,255,0.6); }

    @media (max-width: 1200px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 900px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 800px) {
      .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .kat-grid-wrap { padding: 24px 20px 16px; }
      .kat-pagination { padding: 16px 20px 40px; }
      .kat-header, .kat-breadcrumb, .kat-strip { padding-left: 20px; padding-right: 20px; }
      .kat-header-desc { text-align: left; }
      .lightbox-inner { grid-template-columns: 1fr; }
      .footer-inner { grid-template-columns: 1fr 1fr; }
      footer { padding: 40px 20px 24px; }
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

  const PER_PAGE = 16;
  let __katCurrentPage = 0;
  let __katFiltered = [];
  let __katAllProducts = [];

  function renderPage(page) {
    __katCurrentPage = page;
    const start = page * PER_PAGE;
    const pageItems = __katFiltered.slice(start, start + PER_PAGE);
    const totalPages = Math.ceil(__katFiltered.length / PER_PAGE);

    // Render cards
    const grid = document.getElementById('kat-grid');
    grid.innerHTML = pageItems.map(p => {
      const idx = __katAllProducts.indexOf(p);
      return '<div class="product-card" onclick="__katOpenLightbox(' + idx + ')">' +
        '<div class="product-img">' +
          (p.foto
            ? '<img src="' + p.foto + '" alt="' + p.name + '" onerror="this.parentElement.innerHTML=\'<div class=\\"product-img-ph\\">' + p.name + '</div>\'">'
            : '<div class="product-img-ph">' + p.name + '</div>') +
          (p.neu ? '<span class="product-badge">Neu</span>' : '') +
        '</div>' +
        '<div class="product-info">' +
          '<p class="product-designer">' + (p.designer || '') + '</p>' +
          '<p class="product-name">' + p.name + '</p>' +
          '<button class="product-anfrage" onclick="event.stopPropagation();window.location=\'../kontakt.html\'">Anfrage</button>' +
        '</div>' +
      '</div>';
    }).join('');

    // Render pagination
    const pag = document.getElementById('kat-pagination');
    if (totalPages <= 1) { pag.style.display = 'none'; return; }
    pag.style.display = 'flex';
    let html = '<button class="kat-page-btn" onclick="__katGoPage(' + (page-1) + ')" ' + (page === 0 ? 'disabled' : '') + '>&#8592;</button>';
    for (let i = 0; i < totalPages; i++) {
      html += '<button class="kat-page-btn' + (i === page ? ' active' : '') + '" onclick="__katGoPage(' + i + ')">' + (i+1) + '</button>';
    }
    html += '<button class="kat-page-btn" onclick="__katGoPage(' + (page+1) + ')" ' + (page === totalPages-1 ? 'disabled' : '') + '>&#8594;</button>';
    pag.innerHTML = html;
  }

  window.__katGoPage = function(page) {
    renderPage(page);
    const wrap = document.querySelector('.kat-grid-wrap');
    if (wrap) wrap.scrollTop = 0;
    window.scrollTo({ top: wrap ? wrap.offsetTop - 80 : 0, behavior: 'smooth' });
  };

  /* ── BUILD HTML ────────────────────────────────────────────────────── */
  function build() {
    const products = getProducts();
    const filtered = products.filter(p => p.kategorie === KAT.filter);
    __katFiltered = filtered;
    __katAllProducts = products;

    const katStripLinks = ALLE_KAT.map(k =>
      '<a class="kat-strip-link' + (k.filter === KAT.filter ? ' current' : '') + '" href="' + k.slug + '.html">' + k.label + '</a>'
    ).join('');

    const emptyDisplay = filtered.length === 0 ? 'block' : 'none';
    const gridDisplay  = filtered.length > 0  ? 'grid' : 'none';

    const wrap = document.createElement('div');
    wrap.innerHTML =
      '<nav class="kat-breadcrumb">' +
        '<a href="../shop.html">Shop</a>' +
        '<span>›</span>' +
        KAT.label +
      '</nav>' +

      '<div class="kat-header">' +
        '<div>' +
          '<p class="kat-header-label">Unsere Kollektion</p>' +
          '<h1>' + KAT.label + '</h1>' +
          '<span class="kat-count" id="kat-count">' + filtered.length + ' Produkt' + (filtered.length !== 1 ? 'e' : '') + '</span>' +
        '</div>' +
        (KAT.desc ? '<p class="kat-header-desc">' + KAT.desc + '</p>' : '') +
      '</div>' +

      '<div class="kat-grid-wrap"><div class="product-grid" id="kat-grid" style="display:' + gridDisplay + '"></div></div>' +
      '<div class="kat-pagination" id="kat-pagination"></div>' +

      '<div class="empty-state" id="kat-empty" style="display:' + emptyDisplay + '">' +
        '<h2>Noch keine Produkte in dieser Kategorie</h2>' +
        '<p>Produkte können im <a href="../crm.html" style="color:var(--clr-accent)">Admin-Bereich</a> hinzugefügt werden.<br>' +
        'Wähle beim Produkt die Kategorie <strong>' + KAT.label + '</strong> — es erscheint dann automatisch hier.</p>' +
      '</div>' +

      '<div class="kat-strip">' +
        '<p class="kat-strip-title">Weitere Kategorien</p>' +
        '<div class="kat-strip-links">' + katStripLinks + '</div>' +
      '</div>' +

      '<div class="lightbox" id="kat-lightbox" onclick="__katCloseLightbox(event)">' +
        '<div class="lightbox-inner" id="kat-lb-inner">' +
          '<button class="lightbox-close" onclick="__katCloseLightbox()">×</button>' +
          '<div class="lightbox-img"><img id="kat-lb-img" src="" alt=""></div>' +
          '<div class="lightbox-content">' +
            '<p class="lightbox-designer" id="kat-lb-designer"></p>' +
            '<h2 class="lightbox-name" id="kat-lb-name"></h2>' +
            '<p class="lightbox-price" id="kat-lb-price" style="display:none"></p>' +
            '<p class="lightbox-desc" id="kat-lb-desc"></p>' +
            '<p style="font-size:12px;line-height:1.8;color:var(--clr-accent);border-top:1px solid var(--clr-border);padding-top:16px;margin-top:4px;">' +
              'Besuchen Sie uns in Mödling — wir zeigen Ihnen das Stück persönlich, beraten Sie ausführlich und besprechen gemeinsam den Preis.' +
            '</p>' +
            '<a id="kat-lb-anfrage" href="../kontakt.html" class="product-anfrage">Anfrage stellen</a>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<site-footer></site-footer>';

    document.body.appendChild(wrap);
    if (filtered.length > 0) renderPage(0);
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
    document.getElementById('kat-lb-name').textContent = p.name;
    document.getElementById('kat-lb-price').textContent = p.preis ? p.preis + '\u202f€' : 'Preis auf Anfrage';
    document.getElementById('kat-lb-desc').textContent = p.beschreibung || '';
    document.getElementById('kat-lb-anfrage').href = '../kontakt.html?produkt=' + encodeURIComponent(p.name);
    document.getElementById('kat-lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.__katCloseLightbox = function(e) {
    const lb = document.getElementById('kat-lightbox');
    if (e && e.target !== lb) return;
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
