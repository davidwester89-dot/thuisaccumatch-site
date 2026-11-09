// Anker SOLIX als 7e merk (6-11-2026): merkpagina op feiten van ankersolix.com/nl; partnerlink via PARTNERLINKS; L7 op ANKER_UPD.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { ANKER_UPD, ANKER_PADEN, DD_PADEN } from '../src/pages.mjs'; // /merken/anker-solix/ en /merken/: op 12-11 opnieuw bijgewerkt, test/anker-solix-1211.test.js
import { MERKEN, FEATURES } from '../src/lib/merken.js';
import { PARTNERLINKS, PARTNER_NOOT } from '../src/lib/partnerlinks.js';

const read = (p) => readFileSync(p, 'utf8');
const files = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : [p]; });
const ANKER_LINK = 'https://ankersolixnl.sjv.io/AgOYVR';

test('Anker SOLIX: merkpagina, bronnen ankersolix.com, partnerlink sjv.io', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '' }, stdio: 'ignore' });
  assert.equal(MERKEN.anker.slug, 'anker-solix');
  assert.equal(PARTNERLINKS.anker, ANKER_LINK);
  const h = read('dist/merken/anker-solix/index.html');
  assert.match(h, /<h1>Anker SOLIX-thuisaccu/);
  for (const [, u] of MERKEN.anker.bronnen) assert.match(u, /^https:\/\/www\.ankersolix\.com\/nl\//);
  for (const f of Object.values(FEATURES.anker)) if (f.s) assert.match(f.s, /^https:\/\/www\.ankersolix\.com\/nl\//);
  // CTA op merkpagina: partnerlink + rel + partnernoot
  assert.match(h, /href="https:\/\/ankersolixnl\.sjv\.io\/AgOYVR"[^>]*rel="sponsored nofollow noopener"/);
  assert.ok(h.includes(PARTNER_NOOT), 'partnernoot na partnerblokken');
  // Hub /merken/ heeft ook Anker-pcard met dezelfde partnerlink
  const hub = read('dist/merken/index.html');
  assert.match(hub, /href="https:\/\/ankersolixnl\.sjv\.io\/AgOYVR"[^>]*rel="sponsored nofollow noopener"/);
  assert.ok(hub.includes(PARTNER_NOOT));
  // AgOYVR / sjv.io alleen op Anker-CTA-pagina's; impact.com alleen privacy (Impact-beleid)
  for (const f of files('dist').filter((x) => /\.(html|js|xml|json|txt)$/.test(x))) {
    const t = read(f);
    if (/AgOYVR|sjv\.io/i.test(t)) {
      assert.ok(f.includes('merken/anker-solix') || f.endsWith('merken/index.html'), `sjv.io/AgOYVR alleen Anker-CTA: ${f}`);
    }
    if (/impact\.com/i.test(t)) assert.ok(f.includes('/privacy/'), `impact.com alleen privacy: ${f}`);
  }
  assert.doesNotMatch(h, /\$|USD|dollar/);
});

test('L7 6-11: pagina\'s die de merken opsommen hebben ANKER_UPD', () => {
  const sm = read('dist/sitemap.xml');
  for (const p of [...ANKER_PADEN].filter((x) => !DD_PADEN.has(x))) {
    assert.ok(sm.includes(`<loc>https://thuisaccumatch.nl${p}</loc><lastmod>${ANKER_UPD}</lastmod>`), p);
    assert.doesNotMatch(read(`dist${p}index.html`), new RegExp(`"dateModified": ?"(?!${ANKER_UPD})`), p);
  }
});
