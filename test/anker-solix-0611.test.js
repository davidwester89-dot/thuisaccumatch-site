// Anker SOLIX als 7e merk (6-11-2026): merkpagina op feiten van ankersolix.com/nl, geen partnerlink, L7 op ANKER_UPD.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { ANKER_UPD, ANKER_PADEN } from '../src/pages.mjs';
import { MERKEN, FEATURES } from '../src/lib/merken.js';

const read = (p) => readFileSync(p, 'utf8');
const files = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : [p]; });

test('Anker SOLIX: merkpagina, bronnen alleen ankersolix.com, geen partnerlink', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '' }, stdio: 'ignore' });
  assert.equal(MERKEN.anker.slug, 'anker-solix');
  const h = read('dist/merken/anker-solix/index.html');
  assert.match(h, /<h1>Anker SOLIX-thuisaccu/);
  for (const [, u] of MERKEN.anker.bronnen) assert.match(u, /^https:\/\/www\.ankersolix\.com\/nl\//);
  for (const f of Object.values(FEATURES.anker)) if (f.s) assert.match(f.s, /^https:\/\/www\.ankersolix\.com\/nl\//);
  for (const f of files('dist').filter((x) => /\.(html|js|xml|json|txt)$/.test(x))) assert.doesNotMatch(read(f), /sjv\.io|AgOYVR|impact\.com/i, f);
  assert.doesNotMatch(h, /\$|USD|dollar/);
});

test('L7 6-11: pagina\'s die de merken opsommen hebben ANKER_UPD', () => {
  const sm = read('dist/sitemap.xml');
  for (const p of ANKER_PADEN) {
    assert.ok(sm.includes(`<loc>https://thuisaccumatch.nl${p}</loc><lastmod>${ANKER_UPD}</lastmod>`), p);
    assert.doesNotMatch(read(`dist${p}index.html`), new RegExp(`"dateModified": ?"(?!${ANKER_UPD})`), p);
  }
});
