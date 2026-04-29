/**
 * designers-data.js — Single source of truth for all designers.
 * Used by CRM (dropdown) and shop category pages (filter + links).
 * To add a new designer: append to this list. Used everywhere automatically.
 */
(function () {
  const DESIGNERS = [
    { name: 'Gabriele Golzar',     logo: 'images/logo.jpg',                                url: '#' },
    { name: 'Andrea Frahm',        logo: 'images/designer-logos/andrea-frahm.webp',        url: 'https://www.andreafrahm.de/' },
    { name: 'Angela Hübel',        logo: 'images/designer-logos/angela-huebel.png',        url: 'https://www.angelahuebel.de/' },
    { name: 'Barbara Jewellery',   logo: 'images/designer-logos/barbara-jewellery.png',    url: 'https://www.barbara-jewellery.com/portfolio/sternenstaub/' },
    { name: 'Carl Dau',            logo: '',                                               url: 'https://dau-berlin.com/' },
    { name: 'Claudia Hoppe',       logo: 'images/designer-logos/claudia-hoppe.svg',        url: 'http://www.claudia-hoppe.de/' },
    { name: 'Dorothea Brill',      logo: 'images/designer-logos/dorothea-brill.png',       url: 'http://www.dorothea-brill.de/' },
    { name: 'Eva Strepp',          logo: 'images/designer-logos/eva-strepp.png',           url: 'https://evastrepp.de/de/armschmuck/' },
    { name: 'Franziska Rappold',   logo: 'images/designer-logos/franziska-rappold.png',    url: 'https://www.franziska-rappold.de/' },
    { name: 'Gellner',             logo: 'images/designer-logos/gellner.png',              url: 'https://www.gellner.com/' },
    { name: 'Güzin',               logo: 'images/designer-logos/guzin.png',                url: 'https://www.un-wearable-design.com/necklaces' },
    { name: 'Henrich & Denzel',    logo: 'images/designer-logos/henrich-denzel.svg',       url: 'https://www.henrich-denzel.com/' },
    { name: 'Ilka Bruse',          logo: 'images/designer-logos/ilka-bruse.png',           url: 'https://www.ilkabruse.de/' },
    { name: 'Jiro Kamata',         logo: 'images/designer-logos/jiro-kamata.jpg',          url: 'https://jirokamata.com/' },
    { name: 'Joko Takirai',        logo: 'images/designer-logos/joko-takirai.jpg',         url: 'https://www.yokotakirai.com/en/jewellery-next-level-isabella-hund-gallery-in-munich/' },
    { name: 'Jörg Heinz',          logo: 'images/designer-logos/joerg-heinz.png',          url: 'https://joergheinz.de/' },
    { name: 'Kazuko Nishibayashi', logo: 'images/designer-logos/kazuko.png',               url: 'https://kaz-ni.de/' },
    { name: 'Maier & Beck',        logo: 'images/designer-logos/maier-beck.jpg',           url: 'https://www.maierundbeck.de/' },
    { name: 'MANU',                logo: 'images/designer-logos/manu.png',                 url: 'https://www.manuschmuck.de/' },
    { name: 'Monika Seitter',      logo: 'images/designer-logos/monika-seitter.svg',       url: 'https://www.monika-seitter.de/' },
    { name: 'Niessing',            logo: 'images/designer-logos/niessing.png',             url: 'https://niessing.com/de-AT/SCHMUCK/' },
    { name: 'Oliver Schmidt',      logo: 'images/designer-logos/oliver-schmidt.svg',       url: 'https://ol-schmidt.de/' },
    { name: 'Patrick Malotky',     logo: 'images/designer-logos/patrick-malotky.png',      url: 'https://patrickmalotki.de/' },
    { name: 'Qlocktwo',            logo: 'images/designer-logos/qlocktwo.jpg',             url: 'https://www.qlocktwo.com/' },
    { name: 'Quinn',               logo: 'images/designer-logos/quinn.png',                url: 'https://www.quinn.de/' },
    { name: 'Takto',               logo: 'images/designer-logos/takto.png',                url: 'http://www.takto.es/' },
    { name: 'Tanja Zessel',        logo: 'images/designer-logos/tanja-zessel.png',         url: 'https://tanjazessel.de/' },
    { name: 'TEZER',               logo: 'images/designer-logos/tezer.png',                url: 'https://www.tezer-design.de/' },
    { name: 'Ute Dippl',           logo: 'images/designer-logos/ute-dippl.png',            url: 'https://utedippel.de/' },
    { name: 'Violetta Seliger',    logo: 'images/designer-logos/violetta-seliger.png',     url: 'https://violettaelisaseliger.de/' },
  ];

  // sort alphabetically by display name (German collation)
  DESIGNERS.sort((a, b) => a.name.localeCompare(b.name, 'de'));

  // Load user-managed list from localStorage (managed via CRM).
  // Falls back to seed list above on first run / if storage empty.
  const STORAGE_KEY = 'schmuck_designers';
  let active = DESIGNERS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) active = parsed;
    } else {
      // seed storage so CRM starts with the full list
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DESIGNERS));
    }
  } catch (e) { /* ignore */ }

  active.sort((a, b) => a.name.localeCompare(b.name, 'de'));
  window.DESIGNERS = active;

  // canonical lookup helper (case-insensitive match → returns canonical entry)
  window.findDesigner = function (raw) {
    if (!raw) return null;
    const norm = String(raw).trim().toLowerCase();
    return (window.DESIGNERS || []).find(d => d.name.toLowerCase() === norm) || null;
  };
})();
