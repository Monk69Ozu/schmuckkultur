// Shared footer component for all pages
// Usage: <script src="footer.js"></script><site-footer></site-footer>

class SiteFooter extends HTMLElement {
  connectedCallback() {
    if (this._init) return;
    this._init = true;

    // Detect subfolder (shop/ category pages set window._KAT)
    const inShop = !!window._KAT;
    const base   = inShop ? '../' : '';
    const shopBase = inShop ? './' : 'shop/';

    const KATEGORIEN = [
      { slug: 'ringe',           label: 'Ringe' },
      { slug: 'trauringe',       label: 'Trauringe' },
      { slug: 'verlobungsringe', label: 'Verlobungsringe' },
      { slug: 'halsschmuck',     label: 'Halsschmuck' },
      { slug: 'ohrschmuck',      label: 'Ohrschmuck' },
      { slug: 'perlen',          label: 'Perlen' },
      { slug: 'uhren',           label: 'Uhren' },
      { slug: 'armschmuck',      label: 'Armschmuck' },
      { slug: 'maennersache',    label: 'Männersache' },
      { slug: 'atelierschmuck',  label: 'Atelierschmuck' },
    ];

    const katLinks = KATEGORIEN.map(k =>
      '<li><a href="' + shopBase + k.slug + '.html">' + k.label + '</a></li>'
    ).join('');

    this.outerHTML =
      '<footer>' +
        '<div class="sf-inner">' +
          '<div class="sf-brand">' +
            '<div class="sf-logo">Schmuckkultur Gabriele Golzar</div>' +
            '<p><a href="https://maps.google.com/?q=Hauptstra%C3%9Fe+71+M%C3%B6dling" target="_blank">Hauptstraße 71, 2340 Mödling</a></p>' +
            '<p><a href="tel:+43223622790">+43 (2236) 2 27 90</a></p>' +
            '<p>Fax: +43 (2236) 2 99 50</p>' +
            '<p><a href="mailto:info@schmuckkultur.at">info@schmuckkultur.at</a></p>' +
            '<p class="sf-hours-title">Öffnungszeiten</p>' +
            '<p>Di – Fr: 9:30 – 12:30 &amp; 15:00 – 18:00</p>' +
            '<p>Sa: 9:30 – 12:30 Uhr</p>' +
          '</div>' +
          '<div class="sf-col">' +
            '<h4>Kategorien</h4>' +
            '<ul>' + katLinks + '</ul>' +
          '</div>' +
          '<div class="sf-col">' +
            '<h4>Navigation</h4>' +
            '<ul>' +
              '<li><a href="' + base + 'index.html">Home</a></li>' +
              '<li><a href="' + base + 'ueber-uns.html">Über uns</a></li>' +
              '<li><a href="' + base + 'shop.html">Shop</a></li>' +
              '<li><a href="' + base + 'designer.html">Designer</a></li>' +
              '<li><a href="' + base + 'kontakt.html">Kontakt</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="sf-col">' +
            '<h4>Folgen Sie uns</h4>' +
            '<ul>' +
              '<li><a href="https://www.facebook.com/schmuckkulturweiss" target="_blank">Facebook</a></li>' +
              '<li><a href="https://www.instagram.com/schmuckkultur.weiss/" target="_blank">Instagram</a></li>' +
            '</ul>' +
            '<h4 style="margin-top:20px">Rechtliches</h4>' +
            '<ul>' +
              '<li><a href="#">Impressum</a></li>' +
              '<li><a href="#">Datenschutz</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="sf-bottom">' +
          '<span>Copyright &copy; Gabriele Golzar Designschmuck und Perlen 2025</span>' +
          '<a href="https://www.webars.at/" target="_blank" style="color:inherit;display:inline-flex;align-items:center;gap:7px;text-decoration:none">' +
            '<img src="' + base + 'images/webars-logo-white.png" alt="WebArs" style="height:18px;width:auto;opacity:0.7;vertical-align:middle"> Made By WebArs' +
          '</a>' +
        '</div>' +
      '</footer>';

    // Inject styles once
    if (!document.getElementById('site-footer-styles')) {
      const style = document.createElement('style');
      style.id = 'site-footer-styles';
      style.textContent = `
        footer {
          background: #1e1b18;
          color: rgba(255,255,255,0.55);
          font-family: var(--font-sans,'Raleway',Helvetica,sans-serif);
          font-weight: 300;
        }
        .sf-inner {
          display: grid;
          grid-template-columns: 2fr 2fr 1fr 1fr;
          gap: 40px;
          padding: 56px 64px 48px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .sf-logo {
          font-family: var(--font-serif,'Playfair Display',Georgia,serif);
          font-size: 18px;
          color: rgba(255,255,255,0.85);
          font-weight: 400;
          margin-bottom: 16px;
        }
        .sf-brand p {
          font-size: 12px;
          line-height: 2;
          color: rgba(255,255,255,0.5);
        }
        .sf-brand a {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.2s;
        }
        .sf-brand a:hover { color: rgba(255,255,255,0.9); }
        .sf-hours-title {
          margin-top: 16px !important;
          color: rgba(255,255,255,0.3) !important;
          font-size: 9px !important;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .sf-col h4 {
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 16px;
          font-weight: 400;
        }
        .sf-col ul { list-style: none; }
        .sf-col li { margin-bottom: 8px; }
        .sf-col a {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.2s;
        }
        .sf-col a:hover { color: rgba(255,255,255,0.9); }
        .sf-bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 20px 64px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          flex-wrap: wrap;
          gap: 8px;
          max-width: 1400px;
          margin: 0 auto;
        }
        @media (max-width: 1000px) {
          .sf-inner { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .sf-inner { grid-template-columns: 1fr; padding: 40px 20px 32px; }
          .sf-bottom { padding: 16px 20px; }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

customElements.define('site-footer', SiteFooter);
