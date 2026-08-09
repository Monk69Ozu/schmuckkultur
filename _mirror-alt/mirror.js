// Spiegelt die alte Live-Website www.schmuckkultur.at (HTTP) nach _mirror-alt/
// Aufruf: node mirror.js
const fs = require('fs');
const path = require('path');
const http = require('http');

const BASE = 'http://www.schmuckkultur.at/';
const OUT = __dirname;

const CATS = ['ansteckschmuck','armschmuck','bluetooth','halsschmuck','maennersache','ohrschmuck','perlen','ringe','trauringe','uhren'];
const VIEWS = fs.readFileSync(path.join(OUT, 'designer-views.txt'), 'utf8').trim().split(/\r?\n/);

const pages = [
  ['home.php', 'home.html'],
  ['index.php', 'index.html'],
  ['schmuck.html', 'schmuck.html'],
  ['schmuckviewer_cliq.html', 'schmuckviewer_cliq.html'],
  ['designer.php', 'designer.html'],
  ['kooperationen.php', 'kooperationen.html'],
  ['firma.html', 'firma.html'],
  ['kontakt.html', 'kontakt.html'],
  ['cliq.html', 'cliq.html'],
  ['links.html', 'links.html'],
  ['impressum.html', 'impressum.html'],
];
for (const c of CATS) pages.push([`schmuckviewer.php?category=${c}`, `schmuckviewer_${c}.html`]);
for (const v of VIEWS) pages.push([`designer.php?view=${v}`, `designer_${v}.html`]);

function fetch(url) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: 20000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = new URL(res.headers.location, url).href;
        res.resume();
        return fetch(loc).then(resolve);
      }
      if (res.statusCode !== 200) { res.resume(); return resolve(null); }
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.on('error', () => resolve(null));
  });
}

async function pool(items, worker, size) {
  const results = [];
  let i = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx]);
    }
  }));
  return results;
}

function extractAssets(html) {
  const urls = new Set();
  const attrRe = /(?:src|href|data-rsbigimg|data-rsBigImg|data-src)=["']([^"']+)["']/gi;
  let m;
  while ((m = attrRe.exec(html))) urls.add(m[1]);
  const cssRe = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  while ((m = cssRe.exec(html))) urls.add(m[1]);
  return [...urls];
}

function normalize(u) {
  if (!u || u.startsWith('data:') || u.startsWith('mailto:') || u.startsWith('tel:') || u.startsWith('#')) return null;
  if (/^https?:\/\//i.test(u)) {
    if (!u.includes('schmuckkultur.at')) return null; // extern ignorieren
    u = u.replace(/^https?:\/\/(www\.)?schmuckkultur\.at\/?/i, '');
  }
  u = u.replace(/^\.\//, '').replace(/^\//, '').split('#')[0];
  if (!u || u.endsWith('.php') || u.endsWith('.html') || u.includes('.php?')) return null; // Seiten separat
  if (!/\.(jpe?g|png|gif|css|js|ico|svg|webp|pdf|vcf)(\?.*)?$/i.test(u)) return null;
  return u.split('?')[0];
}

(async () => {
  // 1) Seiten laden
  const assetSet = new Set();
  let pageOk = 0, pageFail = [];
  for (const [remote, local] of pages) {
    const buf = await fetch(BASE + remote);
    if (!buf) { pageFail.push(remote); continue; }
    fs.writeFileSync(path.join(OUT, local), buf);
    pageOk++;
    for (const a of extractAssets(buf.toString('utf8'))) {
      const n = normalize(a);
      if (n) assetSet.add(n);
    }
  }

  // 2) CSS laden + darin referenzierte Assets finden
  const cssFiles = [...assetSet].filter((a) => a.endsWith('.css'));
  for (const c of cssFiles) {
    const buf = await fetch(BASE + c);
    if (!buf) continue;
    const dir = path.join(OUT, path.dirname(c));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(OUT, c), buf);
    for (const a of extractAssets(buf.toString('utf8'))) {
      const rel = a.startsWith('/') ? a.slice(1) : path.posix.join(path.posix.dirname(c), a);
      const n = normalize(rel);
      if (n) assetSet.add(n);
    }
  }

  // 3) @2x-Varianten für Bilder zusätzlich versuchen (Retina = bessere Qualität)
  for (const a of [...assetSet]) {
    if (/\.(jpe?g|gif|png)$/i.test(a) && !a.includes('@2x')) {
      assetSet.add(a.replace(/\.(jpe?g|gif|png)$/i, '@2x.$1'));
    }
  }

  // 4) Alle Assets laden
  const assets = [...assetSet].filter((a) => !a.endsWith('.css'));
  let ok = 0, fail = [];
  await pool(assets, async (a) => {
    const dest = path.join(OUT, a);
    if (fs.existsSync(dest)) { ok++; return; }
    const buf = await fetch(BASE + encodeURI(a));
    if (!buf) { fail.push(a); return; }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    ok++;
  }, 6);

  const fail2x = fail.filter((f) => f.includes('@2x'));
  const failReal = fail.filter((f) => !f.includes('@2x'));
  console.log(`Seiten: ${pageOk}/${pages.length} ok` + (pageFail.length ? ` | FEHLER: ${pageFail.join(', ')}` : ''));
  console.log(`Assets: ${ok} geladen, ${fail2x.length} @2x nicht vorhanden (normal), ${failReal.length} echte Fehler`);
  if (failReal.length) console.log('Echte Fehler:\n' + failReal.slice(0, 30).join('\n'));
})();
