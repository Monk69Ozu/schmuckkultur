// Komprimiert alle JPGs in v2/images (mozjpeg q80, progressiv) und erzeugt v2/favicon.png.
// Nach jedem `node _build/build.js` einmal laufen lassen: node _build/optimize-images.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMG = path.join(ROOT, 'v2', 'images');

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.jpe?g$/i.test(e.name)) yield p;
  }
}

(async () => {
  let before = 0, after = 0, done = 0, skipped = 0, failed = 0;
  for (const f of walk(IMG)) {
    const orig = fs.readFileSync(f);
    before += orig.length;
    try {
      const out = await sharp(orig).jpeg({ quality: 80, progressive: true, mozjpeg: true }).toBuffer();
      if (out.length < orig.length * 0.95) {
        fs.writeFileSync(f, out);
        after += out.length;
        done++;
      } else {
        after += orig.length;
        skipped++;
      }
    } catch {
      after += orig.length;
      failed++;
    }
  }
  const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB';
  console.log(`Bilder: ${done} komprimiert, ${skipped} bereits klein, ${failed} Fehler`);
  console.log(`Größe: ${mb(before)} → ${mb(after)}`);

  // Favicon: kreisrundes Ornament aus dem Logo (logo@2x, 660x180) ausschneiden
  const logo = path.join(ROOT, '_mirror-alt', 'images', 'logo@2x.jpg');
  const crop = { left: 280, top: 118, width: 60, height: 60 }; // Kreis-Element der Wortmarke
  await sharp(logo).extract(crop).resize(64, 64).png().toFile(path.join(ROOT, 'v2', 'favicon.png'));
  console.log('favicon.png erzeugt');
})();
