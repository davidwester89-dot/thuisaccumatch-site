import { revisieDatum } from './nuchter-datums-helper.mjs';
// Deep-dive Anker SOLIX (12-11-2026): Solarbank Max AC in Modellen en Prijzen, title/meta uit de briefing.
// Checklist, telling en ranking ongewijzigd. L7: /merken/anker-solix/ blijft DD_UPD; hub /merken/ is op 17-11 opnieuw bijgewerkt (test/onbetaald-neutraal-1711.test.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DD_UPD, DD_PADEN } from '../src/pages.mjs';
import { FEATURES } from '../src/lib/merken.js';

const read = (p) => readFileSync(p, 'utf8');

test('L7 12-11: /merken/anker-solix/ draagt DD_UPD (hub /merken/ zit in NEUTRAAL_PADEN)', () => {
  assert.equal(DD_UPD, '2026-11-12');
  const sm = read('dist/sitemap.xml');
  const p = '/merken/anker-solix/';
  assert.ok(DD_PADEN.has(p) && DD_PADEN.has('/merken/'));
  assert.ok(sm.includes(`<loc>https://thuisaccumatch.nl${p}</loc><lastmod>${revisieDatum(p, DD_UPD)}</lastmod>`), p);
  const h = read(`dist${p}index.html`);
  assert.match(h, new RegExp(`bijgewerkt (op )?<time datetime="${revisieDatum(p, DD_UPD)}">`, 'i'), p);
  assert.doesNotMatch(h, new RegExp(`"dateModified": ?"(?!${revisieDatum(p, DD_UPD)})`), p);
});

test('Anker SOLIX 12-11: title, meta, Solarbank Max AC met prijs en bron, checklist ongewijzigd', () => {
  const h = read('dist/merken/anker-solix/index.html');
  const t = h.match(/<title>([^<]+)<\/title>/)[1];
  const d = h.match(/<meta name="description" content="([^"]+)"/)[1];
  assert.ok(t.startsWith('Anker SOLIX thuisbatterij 2026: Solarbank-modellen en prijs'), t);
  assert.ok(d.length >= 120 && d.length <= 155, String(d.length));
  assert.match(h, /<th scope="row">Solarbank Max AC \(7 kWh\)<\/th><td data-l="Prijs"><strong>€ 2\.499<\/strong>/);
  assert.match(h, /<th scope="row">BP7000-uitbreidingsbatterij<\/th>/);
  assert.match(h, /href="https:\/\/www\.ankersolix\.com\/nl\/plug-and-play-thuisbatterij\/thuisbatterij-a17e2"/);
  for (const l of ['/stekkerbatterij-of-vaste-thuisaccu/', '/thuisaccu-kosten/', '/blog/thuisbatterij-10-kwh/']) assert.ok(h.includes(`href="${l}"`), l);
  assert.equal(FEATURES.anker.noodstroom.v, 'deels');
  // SEO-B1 2dce507: checklist verduidelijkt (Solarbank 3 Pro), kaart 'Noodstroom (Solarbank 3 Pro)'.
  assert.match(h, /Checklist: wat biedt Anker SOLIX\?<\/h2><p>De checklist en de telling gaan over de Solarbank 3 Pro\. De Solarbank Max AC staat hierboven bij Modellen en Prijzen\.<\/p>/);
  assert.match(h, /<li><span>Noodstroom \(Solarbank 3 Pro\)<\/span>/);
  assert.doesNotMatch(read('dist/merken/sessy/index.html'), /Solarbank 3 Pro\)<\/span>|gaan over de Solarbank/);
  assert.equal(FEATURES.anker.prijs.t, '€ 1.599 (Solarbank 3 E2700 Pro) in de eigen webshop');
});
