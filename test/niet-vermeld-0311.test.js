import { revisieDatum } from './nuchter-datums-helper.mjs';
import { TVT_DATUM } from '../src/tvt2027.mjs';
import { ONDERZOEK_DATUM } from '../src/onderzoek.mjs';
// Externe feedback nov: 'Niet vermeld' overal dezelfde, ware uitleg. Code: checklist.js punt(null) = 0 (net als nee),
// ranglijst = meeste punten; /vergelijken/ zei 'telt niet mee', /over/ en de merkpagina's 'telt als 0'. Nu overal:
// 'Niet vermeld levert geen punt op, net als nee.' L7: EF_PADEN op 2026-11-03.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { EF_UPD, EF_PADEN, GIDSEN_UPD, ANKER_PADEN, ANKER_UPD } from '../src/pages.mjs'; // 6-11: pagina's in ANKER_PADEN opnieuw bijgewerkt (test/anker-solix-0611.test.js)
import { punt } from '../src/lib/checklist.js';

const read = (p) => readFileSync(p, 'utf8');
const files = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : p.endsWith('.html') ? [p] : []; });
const zichtbaar = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');

test('Niet vermeld: één uitleg die klopt met de code', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '' }, stdio: 'ignore' });
  assert.equal(punt(null), 0, 'checklist: niet vermeld = 0 punten (anders klopt de uitleg niet meer)');
  for (const f of files('dist')) assert.doesNotMatch(zichtbaar(read(f)), /[Nn]iet vermeld telt (als 0|niet mee)|telt het als 0/, f);
  for (const p of ['/over/']) assert.match(zichtbaar(read(`dist${p}index.html`)), /levert (het )?geen punt op, net als nee/, p);
  // SC-review f9d7645: onder de filters gaat het om meetellen (vergelijk.js: alleen ja of deels komt door een filter);
  // /over/ noemt ook het soort-filter van de keuzehulp (match.js: metSoort(type), bij noodstroom alleen ja of deels).
  assert.ok(read('dist/vergelijken/index.html').includes('<p class="sub">"Deels" telt mee. Niet vermeld telt, net als nee, niet mee.</p>'));
  assert.ok(read('dist/over/index.html').includes('De keuzehulp toont alleen merken van de geadviseerde soort (stekkerbatterij of vaste thuisaccu), in dezelfde volgorde; kies je noodstroom, dan alleen merken die noodstroom zelf noemen (ja of deels).'));
});

test('L7 3-11: lastmod, zichtbare bijgewerkt-regel en dateModified', () => {
  const sm = read('dist/sitemap.xml');
  for (const p of [...EF_PADEN].filter((x) => !ANKER_PADEN.has(x))) {
    assert.ok(sm.includes(`<loc>https://thuisaccumatch.nl${p}</loc><lastmod>${revisieDatum(p, EF_UPD)}</lastmod>`), p);
    const h = read(`dist${p}index.html`);
    assert.match(h, new RegExp(`bijgewerkt (op )?<time datetime="${revisieDatum(p, EF_UPD)}">`, 'i'), p);
    assert.doesNotMatch(h, new RegExp(`"dateModified": ?"(?!${revisieDatum(p, EF_UPD)})`), p);
  }
});

test('L7-hubregel D: /gidsen/ met zichtbare bijgewerkt-regel en lastmod op 2026-10-30 (deploy nieuwste kind)', () => {
  const h = read('dist/gidsen/index.html');
  const g = TVT_DATUM; // hubregel D: kind /thuisaccu-keuzehulp/ gewijzigd 6-11
  assert.match(h, new RegExp(`bijgewerkt <time datetime="${g}">`));
  assert.ok(read('dist/sitemap.xml').includes(`<loc>https://thuisaccumatch.nl/gidsen/</loc><lastmod>${g}</lastmod>`));
});
