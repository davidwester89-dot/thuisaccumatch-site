// Mobiele controle op 360/390/414/768/1280: geen horizontale scroll, tapdoelen >= 48px (mobiel en tablet),
// tekst >= 14px (kleine lettertjes alleen in .fine/.src/sup), werkend menu, keuzehulp en rekentools met één duim.
import { createRequire } from 'node:module';
const require = createRequire('/home/box/.local/lib/node_modules/');
const { chromium } = require('playwright-core');
const base = process.argv[2] || 'http://localhost:8083';
const fs = await import('node:fs');
const urls = fs.readFileSync('dist/urls.txt', 'utf8').trim().split('\n').map(u => new URL(u).pathname);
const exe = process.env.CHROME || '/usr/bin/google-chrome';
const MIN_TAP = 48; const MIN_FONT = 14;
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
let fail = 0;
const W = [360, 390, 414, 768, 1280];
for (const w of W) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, isMobile: w < 900, hasTouch: w < 900, deviceScaleFactor: w < 900 ? 2 : 1 });
  const page = await ctx.newPage();
  for (const p of urls) {
    await page.goto(base + p, { waitUntil: 'load' });
    const r = await page.evaluate(({ w, MIN_TAP, MIN_FONT }) => {
      const out = { over: document.documentElement.scrollWidth - window.innerWidth, wide: [], small: [], font: [] };
      const hidden = (el) => el.closest('details:not([open])') && el.tagName !== 'SUMMARY' && !el.closest('summary');
      for (const el of document.querySelectorAll('body *')) {
        if (hidden(el)) continue;
        const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
        if (b.width && b.left < window.innerWidth && b.right > window.innerWidth + 1 && !el.closest('.tablewrap,.table-wrap,[data-scroll],.scroll-x') && cs.position !== 'fixed') out.wide.push(el.tagName + '.' + el.className + ' ' + Math.round(b.right));
        if (b.width && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(cs.fontSize) < MIN_FONT && !el.closest('.fine,sup,.sr-only,.visually-hidden') && cs.visibility !== 'hidden') out.font.push(el.tagName + '.' + el.className + ' ' + cs.fontSize + ' "' + el.textContent.trim().slice(0, 25) + '"');
      }
      if (w < 900) for (const el of document.querySelectorAll('a,button,input,select,textarea,summary,label[for]')) {
        if (hidden(el)) continue;
        const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
        if (!b.width || cs.visibility === 'hidden' || b.right <= 0 || b.bottom <= 0 || b.left >= window.innerWidth) continue;
        if (el.tagName === 'LABEL') { const c = el.querySelector('select,input') || document.getElementById(el.htmlFor); if (c && c.getBoundingClientRect().height >= MIN_TAP) continue; }
        if (el.tagName === 'INPUT' && (el.type === 'radio' || el.type === 'checkbox')) { const l = el.closest('label'); if (l && l.getBoundingClientRect().height >= MIN_TAP) continue; }
        if (el.tagName === 'INPUT' && el.type === 'hidden') continue;
        const inline = el.tagName === 'A' && el.closest('p,li,td,figcaption,dd,small') && cs.display === 'inline';
        if (inline) continue;
        if (b.height < MIN_TAP - 0.5 || b.width < MIN_TAP - 0.5) out.small.push(el.tagName + (el.type ? '[' + el.type + ']' : '') + ' "' + (el.textContent || el.name || '').trim().slice(0, 30) + '" ' + Math.round(b.width) + 'x' + Math.round(b.height));
      }
      out.wide = out.wide.slice(0, 5); out.small = [...new Set(out.small)].slice(0, 8); out.font = [...new Set(out.font)].slice(0, 6); return out;
    }, { w, MIN_TAP, MIN_FONT });
    if (r.over > 0 || r.wide.length || r.small.length || r.font.length) { fail++; console.log(w, p, JSON.stringify(r)); }
  }
  // Menu (mobiel): openen, links zichtbaar en klikbaar.
  if (w < 900) {
    await page.goto(base + '/', { waitUntil: 'load' });
    await page.tap('details.menu summary');
    const n = await page.locator('details.menu[open] nav a').evaluateAll((as) => as.filter((a) => a.getBoundingClientRect().height >= 48).length);
    if (n < 5) { fail++; console.log(w, 'menu: te weinig zichtbare links', n); }
    await page.tap('details.menu summary');
    if (await page.locator('details.menu[open]').count()) { fail++; console.log(w, 'menu sluit niet'); }
    // Keuzehulp met tikken (één duim): alle 6 vragen, dan advies zichtbaar.
    await page.goto(base + '/thuisaccu-keuzehulp/', { waitUntil: 'load' });
    for (const [k, v] of [['panelen', '12'], ['verbruik', '3200'], ['contract', 'vast'], ['doel', 'zon'], ['installatie', 'installateur'], ['budget', '5']]) {
      const lab = page.locator(`input[name="${k}"][value="${v}"]`).locator('xpath=..');
      await lab.scrollIntoViewIfNeeded(); await lab.tap();
    }
    const adv = await page.locator('#result .big').textContent().catch(() => '');
    if (!/thuisaccu|stekker/i.test(adv || '')) { fail++; console.log(w, 'keuzehulp: geen advies na tikken'); }
    // Rekentool: invoer met numeriek toetsenbord, uitkomst verandert.
    await page.goto(base + '/terugverdientijd-thuisaccu-berekenen/', { waitUntil: 'load' });
    const im = await page.getAttribute('#prijs', 'inputmode');
    await page.tap('#prijs'); await page.fill('#prijs', '1195'); await page.fill('#cap', '2,7');
    const j = await page.textContent('#r-jaren');
    if (im !== 'decimal' || !/9,6/.test(j)) { fail++; console.log(w, 'rekentool', im, j); }
  }
  await ctx.close();
}
await browser.close();
console.log(fail ? `FOUT: ${fail} controles` : `OK: ${urls.length} pagina's x ${W.length} breedtes, menu, keuzehulp en rekentool`);
process.exit(fail ? 1 : 0);
