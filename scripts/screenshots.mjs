// Screenshots mobiel (390) en desktop (1280) naar /workspace/artifacts/thuisaccumatch/ (map via 3e argument)
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require = createRequire('/home/box/.local/lib/node_modules/');
const { chromium } = require('playwright-core');
const base = process.argv[2] || 'http://localhost:8083';
const dir = process.argv[3] || '/workspace/artifacts/thuisaccumatch'; mkdirSync(dir, { recursive: true });
const pages = [['home', '/'], ['keuzehulp', '/thuisaccu-keuzehulp/'], ['rekentools', '/rekentools/'], ['terugverdientijd', '/terugverdientijd-thuisaccu-berekenen/'], ['capaciteit', '/capaciteit-thuisaccu-berekenen/'], ['saldering', '/einde-salderen-berekenen/'], ['merken', '/merken/'], ['merk-sessy', '/merken/sessy/'], ['vergelijken', '/vergelijken/'], ['gids-saldering', '/salderingsregeling-stopt-2027/'], ['gids-veiligheid', '/thuisaccu-veiligheid/']];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
for (const [dev, w, h] of [['mobiel', 390, 844], ['desktop', 1280, 900]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dev === 'mobiel' ? 2 : 1, isMobile: dev === 'mobiel', hasTouch: dev === 'mobiel' });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  for (const [n, u] of pages) {
    await p.goto(base + u, { waitUntil: 'networkidle' });
    await p.screenshot({ path: `${dir}/${dev}-${n}.png`, fullPage: n === 'home' || n.startsWith('blog') });
  }
  // Keuzehulp invullen tot het advies
  await p.goto(base + '/thuisaccu-keuzehulp/', { waitUntil: 'networkidle' });
  for (const [k, v] of [['panelen', '12'], ['verbruik', '3200'], ['contract', 'vast'], ['doel', 'zon'], ['installatie', 'installateur'], ['budget', '5']]) {
    await p.locator(`input[name="${k}"][value="${v}"]`).evaluate((el) => { el.checked = true; el.dispatchEvent(new Event("change", { bubbles: true })); }); await p.waitForTimeout(250);
  }
  await p.waitForTimeout(400);
  const res = p.locator('#result'); await res.scrollIntoViewIfNeeded();
  console.log(dev, 'advies:', (await res.innerText()).slice(0, 160).replace(/\n/g, ' | '));
  await res.screenshot({ path: `${dir}/${dev}-keuzehulp-advies.png` });
  console.log(dev, 'JS-fouten:', errs.length ? errs : 'geen');
  await ctx.close();
}
await b.close();
