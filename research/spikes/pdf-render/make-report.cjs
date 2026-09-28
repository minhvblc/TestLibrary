// Builds a synthetic "full report" print page (SCR-APP-03 ?print=1 shape) for the PDF spike.
// Content is generated from a fixed word list with a seeded PRNG: no real report copy.
// Usage: node make-report.cjs <chapters> <out.html> [--sensitive]
'use strict';
const fs = require('fs');
const path = require('path');

const chapters = parseInt(process.argv[2] || '12', 10);
const out = process.argv[3] || `report-${chapters}.html`;
const sensitive = process.argv.includes('--sensitive');

let seed = 20260928;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const pick = (a) => a[Math.floor(rnd() * a.length)];

const WORDS = ('you often notice small details before others do and like to finish what you start people ' +
  'around you rely on your sense of order when plans change quickly this can feel tiring because your mind ' +
  'keeps checking what could go wrong a steady routine helps you recover energy after busy weeks at work you ' +
  'prefer clear goals honest feedback and time to think before answering in close relationships you show care ' +
  'through reliable actions more than words when stress builds you may tighten control over tasks or become ' +
  'quietly critical of yourself small experiments can loosen that pattern try naming one thing that is good ' +
  'enough today and one thing you can let others handle this chapter explains where the tendency comes from ' +
  'how it shows up in daily choices and which habits research on personality links to wellbeing').split(' ');

function sentence() {
  const n = 12 + Math.floor(rnd() * 14);
  const w = [];
  for (let i = 0; i < n; i++) w.push(pick(WORDS));
  const s = w.join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}
function paragraph() {
  const n = 4 + Math.floor(rnd() * 3);
  return Array.from({ length: n }, sentence).join(' ');
}

const SCALES = ['Order', 'Care', 'Drive', 'Curiosity', 'Calm', 'Warmth', 'Focus', 'Openness', 'Resilience'];
function scoreBars() {
  const rowH = 34, w = 640;
  let y = 0, rows = '';
  for (const name of SCALES) {
    const v = 20 + Math.floor(rnd() * 75);
    rows += `<g transform="translate(0,${y})"><text x="0" y="20" class="lbl">${name}</text>` +
      `<rect x="150" y="8" width="${w - 210}" height="14" rx="7" fill="#e9e4dc"/>` +
      `<rect x="150" y="8" width="${((w - 210) * v) / 100}" height="14" rx="7" fill="#2f5d50"/>` +
      `<text x="${w - 40}" y="20" class="val">${v}</text></g>`;
    y += rowH;
  }
  return `<svg class="bars" viewBox="0 0 ${w} ${y}" role="img" aria-label="Your scores">${rows}</svg>`;
}
function doodle() {
  // vector illustration with ~40 cubic paths, similar weight to a hand-drawn spot illustration
  let d = '';
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(rnd() * 560) + 20, y = Math.floor(rnd() * 180) + 10;
    d += `<path d="M${x} ${y} C ${x + 30} ${y - 40}, ${x + 60} ${y + 40}, ${x + 90} ${y}" ` +
      `stroke="${pick(['#2f5d50', '#c8743b', '#6b5b95', '#3d6fb6'])}" stroke-width="${1 + Math.floor(rnd() * 3)}" fill="none" stroke-linecap="round"/>`;
  }
  return `<svg class="doodle" viewBox="0 0 640 200" aria-hidden="true">${d}</svg>`;
}

const fontDir = path.join(__dirname, 'node_modules');
const css = `
@font-face{font-family:"Newsreader";src:url("file://${fontDir}/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2") format("woff2");font-weight:200 800;}
@font-face{font-family:"Atkinson Hyperlegible Next";src:url("file://${fontDir}/@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2") format("woff2");font-weight:200 800;}
@font-face{font-family:"IBM Plex Mono";src:url("file://${fontDir}/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2") format("woff2");font-weight:400;}
@page{size:A4;margin:18mm 18mm 20mm 18mm;}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:"Atkinson Hyperlegible Next",sans-serif;font-size:11.5pt;line-height:1.55;color:#1d1b18;margin:0;}
main{max-width:680px;margin:0 auto;}
h1,h2,.type{font-family:"Newsreader",serif;}
h1{font-weight:300;font-size:34pt;line-height:1.05;margin:0 0 6pt;}
.type{font-size:26pt;font-weight:600;margin:12pt 0 4pt;}
h2{font-weight:600;font-size:20pt;line-height:1.15;margin:0 0 10pt;break-after:avoid;}
.meta,.lbl,.val,.chip{font-family:"IBM Plex Mono",monospace;font-size:9pt;}
.hero{border-bottom:1px solid #d9d2c7;padding-bottom:14pt;margin-bottom:14pt;}
.bars{width:100%;height:auto;margin:6pt 0 14pt;}
.notice{background:#f3ece2;border-left:4px solid #c8743b;padding:8pt 10pt;margin:10pt 0;}
.toc{break-after:page;} .toc ol{padding-left:18pt;} .toc li{margin:3pt 0;}
section.chapter{break-before:page;}
blockquote{font-family:"Newsreader",serif;font-size:15pt;font-style:italic;border-left:3px solid #2f5d50;margin:12pt 0;padding-left:12pt;}
.doodle{width:100%;height:auto;margin:8pt 0;}
.try{background:#eef3f1;padding:8pt 12pt;border-radius:8pt;break-inside:avoid;}
p{margin:0 0 8pt;orphans:3;widows:3;}
`;

let body = `<main><header class="hero"><div class="meta">PERSONALITY TEST · TAKEN SEPTEMBER 28, 2026 · SCORING v1 · CONTENT v1</div>` +
  `<h1>Your full report</h1><div class="type">The Steady Organizer</div><p>${sentence()} ${sentence()}</p>` +
  (sensitive ? `<div class="notice"><strong>This is a self-reflection tool, not a diagnosis.</strong> ${sentence()}</div>` : '') +
  `<h2>Your scores</h2>${scoreBars()}<p>${paragraph()}</p></header>`;
body += `<nav class="toc"><h2>Contents</h2><ol>`;
const titles = [];
for (let i = 1; i <= chapters; i++) titles.push(`Chapter ${i}: ${pick(['Where', 'How', 'Why', 'When'])} ${pick(['order', 'care', 'focus', 'calm', 'drive'])} ${pick(['helps', 'hides', 'grows', 'costs'])} you`);
body += titles.map((t) => `<li>${t}</li>`).join('') + `</ol></nav>`;
for (let i = 0; i < chapters; i++) {
  body += `<section class="chapter"><h2>${titles[i]}</h2>`;
  for (let p = 0; p < 7; p++) {
    body += `<p>${paragraph()}</p>`;
    if (p === 1) body += `<blockquote>${sentence()}</blockquote>`;
    if (p === 3) body += doodle();
  }
  body += `<div class="try"><div class="chip">TRY THIS</div><ul><li>${sentence()}</li><li>${sentence()}</li><li>${sentence()}</li></ul></div></section>`;
}
body += `</main>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Report</title><style>${css}</style></head><body>${body}</body></html>`;
fs.writeFileSync(out, html);
const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
console.log(JSON.stringify({ out, chapters, words, bytes: Buffer.byteLength(html) }));
