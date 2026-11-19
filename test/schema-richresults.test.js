// GSC-schema 19-11 (SEO-briefing B): elk Product heeft offers|review|aggregateRating, elke Dataset heeft license.
// JSON-LD (arrays, @graph, geneste objecten) én microdata-itemtype die op Product/Dataset eindigt.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLive, htmlFiles, read } from './helpers.js';

const types = (o) => [o['@type']].flat().filter(Boolean).map(String);
const isT = (o, t) => types(o).some((x) => x === t || x.endsWith('/' + t));
export function schemaFouten(html, file = 'inline') {
  const f = [];
  const walk = (o, pad) => {
    if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${pad}[${i}]`));
    if (!o || typeof o !== 'object') return;
    if (isT(o, 'Product') && !('offers' in o || 'review' in o || 'aggregateRating' in o)) f.push(`${file} ${pad}: Product zonder offers/review/aggregateRating`);
    if (isT(o, 'Dataset') && !('license' in o)) f.push(`${file} ${pad}: Dataset zonder license`);
    for (const [k, v] of Object.entries(o)) walk(v, `${pad}.${k}`);
  };
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    let j; try { j = JSON.parse(m[1]); } catch (e) { f.push(`${file}: JSON-LD niet te parsen (${e.message})`); continue; }
    walk(j, '$');
  }
  for (const m of html.matchAll(/\bitemtype=["']([^"']+)["']/gi)) {
    for (const t of m[1].split(/\s+/)) {
      if (/(^|\/)Product$/.test(t)) f.push(`${file}: microdata Product (${t}) — controleer offers/review/aggregateRating handmatig`);
      if (/(^|\/)Dataset$/.test(t)) f.push(`${file}: microdata Dataset (${t}) — controleer license handmatig`);
    }
  }
  return f;
}

test('schema: elk Product heeft offers|review|aggregateRating, elke Dataset heeft license (dist)', () => {
  buildLive();
  let n = 0;
  const fout = htmlFiles().flatMap((p) => { const h = read(p); n += (h.match(/"@type":\s*"(Product|Dataset)"/g) || []).length; return schemaFouten(h, p); });
  assert.deepEqual(fout, []);
  assert.ok(n >= 1, 'verwacht minstens de onderzoeks-Dataset');
});

test('schema: negatieve fixtures falen zonder de velden', () => {
  const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`;
  assert.equal(schemaFouten(ld({ '@type': 'Dataset', name: 'x' })).length, 1);
  assert.equal(schemaFouten(ld({ '@type': 'Product', name: 'x' })).length, 1);
  assert.equal(schemaFouten(ld({ '@type': ['Product', 'Thing'], name: 'x' })).length, 1);
  assert.equal(schemaFouten(ld({ '@graph': [{ '@type': 'NewsArticle', about: [{ '@type': 'Product', name: 'x' }] }] })).length, 1);
  assert.equal(schemaFouten(ld([{ '@type': 'Dataset', creator: { '@type': 'Product' } }])).length, 2);
  assert.equal(schemaFouten('<div itemscope itemtype="https://schema.org/Product"></div>').length, 1);
  assert.equal(schemaFouten('<script type="application/ld+json">{kapot</script>').length, 1);
  assert.deepEqual(schemaFouten(ld({ '@type': 'Product', name: 'x', review: {} }) + ld({ '@type': 'Dataset', license: 'u' }) + ld({ '@type': 'Thing', name: 'x' })), []);
});
