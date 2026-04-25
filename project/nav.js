// Shared navigation component for all pages
// Usage: <script src="nav.js"></script><site-nav active="home"></site-nav>

class SiteNav extends HTMLElement {
  connectedCallback() {
    if (this._init) return;
    this._init = true;

    const active = this.getAttribute('active') || '';
    const base = window._KAT ? '../' : '';
    const links = [
      { href: base + 'index.html',     label: 'Home' },
      { href: base + 'ueber-uns.html', label: 'Über uns' },
      { href: base + 'designer.html',  label: 'Designer' },
      { href: base + 'shop.html',      label: 'Shop' },
      { href: base + 'kontakt.html',   label: 'Kontakt' },
    ];

    const navItems = links.map(l => {
      const bare = l.href.replace('../', '').replace('.html', '');
      const isActive = bare === active || (active === 'home' && l.href.endsWith('index.html'));
      return '<li><a href="' + l.href + '"' + (isActive ? ' class="active"' : '') + '>' + l.label + '</a></li>';
    }).join('');

    this.innerHTML =
      '<div class="topbar">Ihr Juweliergeschäft in Mödling &nbsp;·&nbsp; Hauptstraße 71, 2340 Mödling &nbsp;·&nbsp; +43 (2236) 2 27 90</div>' +
      '<header>' +
        '<a href="' + base + 'index.html" class="site-title">Schmuckkultur Gabriele Golzar</a>' +
        '<span class="site-sub">Designschmuck · Perlen · Uhren · Juwelier</span>' +
        '<nav>' + navItems + '</nav>' +
      '</header>';

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
      ].join('');
      document.head.appendChild(style);
    }
  }
}

customElements.define('site-nav', SiteNav);
