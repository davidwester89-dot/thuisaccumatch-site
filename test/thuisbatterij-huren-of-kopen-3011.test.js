// Wk48 batch 3: blog thuisbatterij huren of kopen (push 30-11). Alleen de bestaande Anker-partnerlink; geen huurbedragen;
// koopbedragen exact gelijk aan /thuisaccu-kosten/; geen CTA-component (E-CTA-1 golf 2); nooit batterijmatch.nl.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const PAD = '/blog/thuisbatterij-huren-of-kopen/';
const PUSH = '2026-11-30';
test('huren of kopen: title/meta, byline, datums 30-11, interne links, alleen Anker-knop', () => {
  execSync('node build.mjs', { env: { ...process.env, BUILD_DATE: PUSH, PUSH_DATE: PUSH, BASE: '', PREVIEW: '' }, stdio: 'ignore' });
  const h = readFileSync('dist' + PAD + 'index.html', 'utf8');
  assert.ok(h.match(/<title>([^<]*)<\/title>/)[1].startsWith('Thuisbatterij huren of kopen: wat is voordeliger?'));
  const meta = h.match(/<meta name="description" content="([^"]*)"/)[1];
  assert.ok(meta.length >= 120 && meta.length <= 155, String(meta.length));
  assert.match(h, /Door Redactie ThuisaccuMatch/);
  for (const m of h.matchAll(/"dateModified": ?"([^"]+)"/g)) assert.equal(m[1], PUSH);
  assert.ok(readFileSync('dist/sitemap.xml', 'utf8').includes(`<loc>https://thuisaccumatch.nl${PAD}</loc><lastmod>${PUSH}</lastmod>`));
  for (const l of ['/thuisaccu-keuzehulp/', '/thuisaccu-kosten/', '/terugverdientijd-thuisaccu-berekenen/', '/thuisaccu-terugverdientijd/', '/stekkerbatterij-of-vaste-thuisaccu/', '/salderingsregeling-stopt-2027/', '/blog/thuisbatterij-5-kwh/', '/merken/anker-solix/', 'https://warmtepompenmatch.nl/blog/warmtepomp-huren-of-kopen/'])
    assert.ok(h.includes(`href="${l}"`), l);
  const sponsored = h.match(/<a\s[^>]*rel="[^"]*sponsored[^"]*"[^>]*>/g) || [];
  assert.equal(sponsored.length, 1);
  assert.match(sponsored[0], /href="https:\/\/ankersolixnl\.sjv\.io\/AgOYVR"/);
  assert.doesNotMatch(h, /batterijmatch\.nl/);
  assert.doesNotMatch(h, /class="[^"]*(ecta|keuzebox)/);
});

test('huren of kopen: alleen bronbedragen (thuisaccu-kosten) + gelabeld rekenvoorbeeld; geen Black Friday; huisregels', () => {
  const h = readFileSync('dist' + PAD + 'index.html', 'utf8');
  const art = h.slice(h.indexOf('<article'), h.indexOf('</article>'));
  const t = art.replace(/<[^>]+>/g, ' ');
  const k = readFileSync('dist/thuisaccu-kosten/index.html', 'utf8');
  for (const b of ['€ 1.195', '€ 3.550', '€ 5.500', '€ 9.400', '€ 443', '€ 710', '€ 550', '€ 627']) { assert.ok(t.includes(b), b); assert.ok(k.includes(b), 'kostenpagina ' + b); }
  const bedragen = [...t.matchAll(/€ ?([\d.,]+)/g)].map((m) => m[1]);
  for (const b of bedragen) assert.ok(['1.195', '3.550', '5.500', '9.400', '443', '710', '550', '627', '45,83'].includes(b), 'onbekend bedrag ' + b);
  assert.match(t, /Rekenvoorbeeld/);
  assert.match(t, /geen huurprijs van een aanbieder/);
  assert.doesNotMatch(t, /black friday|1\.075|korting/i);
  assert.doesNotMatch(t, /\b(volgens|aldus)\b|reddit|disclaimer/i);
  assert.doesNotMatch(t, /Essent|Eneco|Zonneplan|Vattenfall|Zelfstroom/);
  const w = Number(h.match(/"wordCount": ?(\d+)/)[1]);
  assert.ok(w >= 700 && w <= 1200, 'woorden ' + w);
});
