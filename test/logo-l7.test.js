// L7 30-10: pagina's waar logo's in de tabellen bijkwamen hebben dateModified, sitemap-lastmod en de zichtbare bijwerkdatum 30-10-2026.
import test from 'node:test';
import assert from 'node:assert/strict';
import { EF_PADEN } from '../src/pages.mjs'; // op 3-11 opnieuw bijgewerkt ('Niet vermeld'): test/niet-vermeld-0311.test.js
import { readFileSync } from 'node:fs';

// Op 3-11 opnieuw bijgewerkt: de teaser 'Meer op de blog' toont de nieuwe post /blog/thuisbatterij-10-kwh/; de L7-check (l7-naamgrep) bewaakt die datum.
const TEASER_0311 = new Set(['/blog/thuisbatterij-met-noodstroom/', '/blog/thuisbatterij-dynamisch-contract/', '/blog/thuisbatterij-zonder-zonnepanelen/']);
const PAGINAS = ['/thuisaccu-terugverdientijd/', '/merken/sessy/', '/thuisaccu-kosten/', '/blog/thuisbatterij-met-noodstroom/', '/blog/thuisbatterij-dynamisch-contract/', '/blog/thuisbatterij-zonder-zonnepanelen/'];
const ZICHTBAAR = /bijgewerkt <time datetime="2026-10-30">/;

test('L7 30-10: pagina\'s met logo\'s in de tabellen', () => {
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  for (const p of PAGINAS.filter((x) => !EF_PADEN.has(x) && !TEASER_0311.has(x))) {
    const h = readFileSync(`dist${p}index.html`, 'utf8');
    assert.match(h, /"dateModified": ?"2026-10-30"/, p);
    assert.match(h, ZICHTBAAR, p);
    assert.match(sm, new RegExp(`${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>2026-10-30</lastmod>`), p);
  }
});
