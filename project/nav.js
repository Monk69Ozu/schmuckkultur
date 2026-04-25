// Shared navigation + mega menu component for all pages
// Usage: <script src="nav.js"></script><site-nav active="home"></site-nav>

class SiteNav extends HTMLElement {
  connectedCallback() {
    if (this._init) return;
    this._init = true;

    const active = this.getAttribute('active') || '';
    const base = window._KAT ? '../' : '';
    const links = [
      { href: base + 'index.html',    label: 'Home' },
      { href: base + 'ueber-uns.html',label: 'Über uns' },
      { href: base + 'designer.html', label: 'Designer' },
      { href: base + 'shop.html',     label: 'Shop' },
      { href: base + 'kontakt.html',  label: 'Kontakt' },
    ];

    const navItems = links.map(l => {
      const bare = l.href.replace('../','').replace('.html','');
      const isActive = bare === active || (active === 'home' && l.href.endsWith('index.html'));
      const extra = l.mega ? ' data-mega="true"' : '';
      const label = l.mega ? l.label + ' &#9662;' : l.label;
      return '<li><a href="' + l.href + '"' + (isActive ? ' class="active"' : '') + extra + '>' + label + '</a></li>';
    }).join('');

    this.innerHTML =
      '<div class="topbar">Ihr Juweliergeschäft in Mödling &nbsp;·&nbsp; Hauptstraße 71, 2340 Mödling &nbsp;·&nbsp; +43 (2236) 2 27 90</div>' +
      '<header>' +
        '<a href="index.html" class="site-title">Schmuckkultur Gabriele Golzar</a>' +
        '<span class="site-sub">Designschmuck · Perlen · Uhren · Juwelier</span>' +
        '<nav>' + navItems + '</nav>' +
      '</header>';

    // ── SHARED STYLES ──
    if (!document.getElementById('site-nav-styles')) {
      const style = document.createElement('style');
      style.id = 'site-nav-styles';
      style.textContent = [
        '.topbar{background:var(--clr-text,#2a2420);color:rgba(255,255,255,0.7);text-align:center;font-size:11px;letter-spacing:0.14em;padding:8px 20px;text-transform:uppercase;font-family:var(--font-sans,"Raleway",sans-serif);}',
        'header{text-align:center;padding:32px 24px 0;border-bottom:1px solid var(--clr-border,#ddd6ce);background:var(--clr-bg,#f8f5f1);}',
        '.site-title{font-family:var(--font-serif,"Playfair Display",Georgia,serif);font-size:clamp(22px,3vw,36px);font-weight:400;letter-spacing:0.04em;color:var(--clr-text,#2a2420);text-decoration:none;display:block;line-height:1.2;margin-bottom:4px;}',
        '.site-title:hover{color:var(--clr-accent,#8c7355);}',
        '.site-sub{font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:var(--clr-accent,#8c7355);font-weight:400;margin-bottom:24px;display:block;font-family:var(--font-sans,"Raleway",sans-serif);}',
        'header nav{display:flex;justify-content:center;list-style:none;flex-wrap:wrap;padding:0;margin:0;}',
        'header nav li{list-style:none;}',
        'header nav li a{display:block;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--clr-muted,#7a706a);text-decoration:none;padding:12px 20px;font-weight:400;font-family:var(--font-sans,"Raleway",sans-serif);transition:color 0.2s;position:relative;cursor:pointer;}',
        'header nav li a::after{content:"";position:absolute;bottom:0;left:50%;right:50%;height:2px;background:var(--clr-accent,#8c7355);transition:left 0.25s,right 0.25s;}',
        'header nav li a:hover,header nav li a.active{color:var(--clr-text,#2a2420);}',
        'header nav li a.active::after{left:20px;right:20px;}',
        'header nav li a:hover::after{left:12px;right:12px;}',
        '@media(max-width:680px){header nav li a{padding:10px 12px;font-size:10px;}}',
        // Mega menu
        '.mega-overlay{display:none;position:fixed;inset:0;z-index:999;background:rgba(30,24,18,0.45);backdrop-filter:blur(2px);}',
        '.mega-overlay.open{display:block;}',
        '.mega-panel{position:absolute;top:0;left:0;right:0;background:var(--clr-bg,#f8f5f1);padding:56px 64px 64px;box-shadow:0 8px 40px rgba(0,0,0,0.12);transform:translateY(-100%);transition:transform 0.35s cubic-bezier(0.4,0,0.2,1);}',
        '.mega-overlay.open .mega-panel{transform:translateY(0);}',
        '.mega-close{position:absolute;top:20px;right:28px;font-size:24px;cursor:pointer;color:var(--clr-muted,#7a706a);background:none;border:none;line-height:1;transition:color 0.2s;}',
        '.mega-close:hover{color:var(--clr-text,#2a2420);}',
        '.mega-title{font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:var(--clr-accent,#8c7355);margin-bottom:40px;font-family:var(--font-sans,"Raleway",sans-serif);}',
        '.mega-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:32px 24px;}',
        '.mega-item{display:flex;flex-direction:column;align-items:center;gap:14px;text-decoration:none;cursor:pointer;}',
        '.mega-item-img{width:100%;aspect-ratio:1;overflow:hidden;background:#e8e3dd;}',
        '.mega-item-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.4s;filter:grayscale(15%);}',
        '.mega-item:hover .mega-item-img img{transform:scale(1.05);filter:grayscale(0%);}',
        '.mega-item-label{font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--clr-muted,#7a706a);font-family:var(--font-sans,"Raleway",sans-serif);font-weight:400;transition:color 0.2s;}',
        '.mega-item:hover .mega-item-label{color:var(--clr-accent,#8c7355);}',
        '@media(max-width:700px){.mega-grid{grid-template-columns:repeat(2,1fr);}.mega-panel{padding:40px 20px;}}'
      ].join('');
      document.head.appendChild(style);
    }

    // ── MEGA MENU INJECTION (deferred) ──
    const injectMega = () => {
      if (document.getElementById('mega-overlay')) return;

      // Detect subfolder: window._KAT is only set on shop/ category pages
      const inShop = !!window._KAT;
      const shopBase = inShop ? './' : 'shop/';
      const imgBase  = 'images/kategorien/';

      const KATEGORIEN = [
        { slug: 'ringe',           img: 'ringe',        ext: 'jpg', label: 'Ringe' },
        { slug: 'trauringe',       img: 'trauringe',    ext: 'jpg', label: 'Trauringe' },
        { slug: 'verlobungsringe', img: 'verlobung',    ext: 'jpg', label: 'Verlobungsringe' },
        { slug: 'halsschmuck',     img: 'halsschmuck',  ext: 'jpg', label: 'Halsschmuck' },
        { slug: 'ohrschmuck',      img: 'ohrschmuck',   ext: 'jpg', label: 'Ohrschmuck' },
        { slug: 'perlen',          img: 'perlen',       ext: 'jpg', label: 'Perlen' },
        { slug: 'uhren',           img: 'uhren',        ext: 'jpg', label: 'Uhren' },
        { slug: 'armschmuck',      img: 'armschmuck',   ext: 'png', label: 'Armschmuck' },
        { slug: 'maennersache',    img: 'maennersache', ext: 'png', label: 'Männersache' },
        { slug: 'atelierschmuck',  img: 'atelier',      ext: 'jpg', label: 'Atelierschmuck' },
      ];

      const el = document.createElement('div');
      el.id = 'mega-overlay';
      el.className = 'mega-overlay';
      el.innerHTML =
        '<div class="mega-panel">' +
          '<button class="mega-close" id="mega-close-btn">&times;</button>' +
          '<p class="mega-title">Kategorien</p>' +
          '<div class="mega-grid">' +
            KATEGORIEN.map(k =>
              '<a class="mega-item" href="' + shopBase + k.slug + '.html">' +
                '<div class="mega-item-img"><img src="' + imgBase + k.img + '.' + k.ext + '" alt="' + k.label + '" onerror="this.parentElement.style.background=\'#e8e3dd\'"></div>' +
                '<span class="mega-item-label">' + k.label + '</span>' +
              '</a>'
            ).join('') +
          '</div>' +
        '</div>';
      document.body.appendChild(el);

      el.addEventListener('click', e => { if (e.target === el) el.classList.remove('open'); });
      document.getElementById('mega-close-btn').addEventListener('click', () => el.classList.remove('open'));
      document.addEventListener('keydown', e => { if (e.key === 'Escape') el.classList.remove('open'); });
    };

    // Run after current render cycle
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectMega);
    } else {
      setTimeout(injectMega, 0);
    }

    // ── EVENT DELEGATION for Kategorien click ──
    document.addEventListener('click', function(e) {
      const a = e.target.closest('a[data-mega]');
      if (a) {
        e.preventDefault();
        const overlay = document.getElementById('mega-overlay');
        if (overlay) overlay.classList.toggle('open');
      }
    }, true);
  }
}

customElements.define('site-nav', SiteNav);
