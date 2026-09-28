// Variant C of the PDF spike: 10 noisy 1200x800 PNG illustrations (~1.8 MB total) replace the
// vector doodles of a generated report. Usage: node make-image-variant.cjs report-10.html report-10-img.html
'use strict';
const fs = require('fs');
const path = require('path');
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); } // global install in the cloud container
const { chromium } = pw;

const src = process.argv[2] || 'report-10.html';
const out = process.argv[3] || 'report-10-img.html';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  for (let i = 0; i < 10; i++) {
    await page.setContent(`<style>body{margin:0}</style><canvas id="c" width="1200" height="800"></canvas><script>
      const c = document.getElementById('c').getContext('2d');
      const g = c.createLinearGradient(0, 0, 1200, 800); g.addColorStop(0, '#2f5d50'); g.addColorStop(1, '#c8743b');
      c.fillStyle = g; c.fillRect(0, 0, 1200, 800);
      const d = c.getImageData(0, 0, 1200, 800);
      for (let k = 0; k < d.data.length; k += 4) { const n = (Math.random() * 80) | 0; d.data[k] += n; d.data[k + 1] += n; d.data[k + 2] += n; }
      c.putImageData(d, 0, 0);</script>`);
    await page.screenshot({ path: `img-${i}.png`, clip: { x: 0, y: 0, width: 1200, height: 800 } });
  }
  await browser.close();
  let n = 0;
  const html = fs.readFileSync(src, 'utf8').replace(/<svg class="doodle"[\s\S]*?<\/svg>/g, () =>
    `<img src="file://${path.resolve(`img-${n++ % 10}.png`)}" style="width:100%;height:auto;margin:8pt 0" alt="">`);
  fs.writeFileSync(out, html);
  console.log(JSON.stringify({ out, replaced: n }));
})().catch((e) => { console.error(e); process.exit(1); });
