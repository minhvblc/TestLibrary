// Spike #2 (docs/overview/cong-nghe-loi.md §7): how long does Playwright take to render a 20+ page
// report PDF, and how much RAM does Chromium use? Modes: cold (launch per PDF), warm (reused browser),
// and a concurrency run on one warm browser.
// Usage: node spike.cjs <report.html> <runs> [--concurrency N --jobs M] [--label name]
'use strict';
const fs = require('fs');
const path = require('path');
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); } // global install in the cloud container
const { chromium } = pw;
const { PDFDocument } = require('pdf-lib');

const args = process.argv.slice(2);
const file = path.resolve(args[0]);
const runs = parseInt(args[1] || '5', 10);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const concurrency = parseInt(opt('--concurrency', '0'), 10);
const jobs = parseInt(opt('--jobs', '8'), 10);
const label = opt('--label', path.basename(file));

const PDF_OPTS = {
  format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#666"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
};

// --- RSS sampler over all Chromium processes (reads /proc every 25 ms) ---
function chromiumRssMB() {
  let kb = 0;
  for (const pid of fs.readdirSync('/proc')) {
    if (!/^\d+$/.test(pid)) continue;
    try {
      const cmd = fs.readFileSync(`/proc/${pid}/cmdline`, 'utf8');
      if (!/chrom|headless_shell/.test(cmd)) continue;
      const st = fs.readFileSync(`/proc/${pid}/status`, 'utf8');
      const m = st.match(/VmRSS:\s+(\d+)/);
      if (m) kb += parseInt(m[1], 10);
    } catch { /* process ended */ }
  }
  return kb / 1024;
}
function startSampler() {
  const s = { peak: 0, t: null };
  const tick = () => { const v = chromiumRssMB(); if (v > s.peak) s.peak = v; };
  tick();
  s.t = setInterval(tick, 25);
  return s;
}
const stop = (s) => { clearInterval(s.t); return Math.round(s.peak); };

async function renderOnce(browser) {
  const t0 = performance.now();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto('file://' + file, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready.then(() => document.fonts.size));
  const t1 = performance.now();
  const pdf = await page.pdf(PDF_OPTS);
  const t2 = performance.now();
  await ctx.close();
  const doc = await PDFDocument.load(pdf);
  return { loadMs: Math.round(t1 - t0), pdfMs: Math.round(t2 - t1), totalMs: Math.round(t2 - t0), bytes: pdf.length, pages: doc.getPageCount() };
}

const stats = (xs) => {
  const a = [...xs].sort((x, y) => x - y);
  const q = (p) => a[Math.min(a.length - 1, Math.ceil(p * a.length) - 1)];
  return { min: a[0], p50: q(0.5), p95: q(0.95), max: a[a.length - 1] };
};

(async () => {
  const result = { label, file: path.basename(file), node: process.version, cpus: require('os').cpus().length, cold: [], warm: [] };

  // Cold: launch + render + close, each run separately (worst case: no browser pool)
  for (let i = 0; i < runs; i++) {
    const s = startSampler();
    const t0 = performance.now();
    const browser = await chromium.launch();
    const t1 = performance.now();
    const r = await renderOnce(browser);
    await browser.close();
    r.launchMs = Math.round(t1 - t0);
    r.coldTotalMs = Math.round(performance.now() - t0);
    r.peakChromiumRssMB = stop(s);
    result.cold.push(r);
  }

  // Warm: one browser, 1 warm-up render, then N measured renders
  const browser = await chromium.launch();
  result.chromiumVersion = browser.version();
  await renderOnce(browser);
  for (let i = 0; i < runs; i++) {
    const s = startSampler();
    const r = await renderOnce(browser);
    r.peakChromiumRssMB = stop(s);
    result.warm.push(r);
  }

  // Concurrency: `jobs` renders, `concurrency` at a time, on the same warm browser
  if (concurrency > 0) {
    const s = startSampler();
    const t0 = performance.now();
    let next = 0;
    const times = [];
    const worker = async () => {
      while (next < jobs) { next++; const r = await renderOnce(browser); times.push(r.totalMs); }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
    const wall = performance.now() - t0;
    result.concurrent = { concurrency, jobs, wallMs: Math.round(wall), perJob: stats(times), pdfsPerMinute: +(jobs / (wall / 60000)).toFixed(1), peakChromiumRssMB: stop(s) };
  }
  await browser.close();

  result.summary = {
    pages: result.warm[0].pages,
    pdfBytes: result.warm[0].bytes,
    coldTotalMs: stats(result.cold.map((r) => r.coldTotalMs)),
    coldLaunchMs: stats(result.cold.map((r) => r.launchMs)),
    warmTotalMs: stats(result.warm.map((r) => r.totalMs)),
    warmPdfMs: stats(result.warm.map((r) => r.pdfMs)),
    peakChromiumRssMB: { cold: Math.max(...result.cold.map((r) => r.peakChromiumRssMB)), warm: Math.max(...result.warm.map((r) => r.peakChromiumRssMB)) },
  };
  console.log(JSON.stringify(result, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
