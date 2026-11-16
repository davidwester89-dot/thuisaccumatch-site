// Wk47: blog thuisbatterij 5 kWh (push 23-11). Alleen de bestaande Anker-partnerlink; overige merken zonder knop.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { PARTNER_NOOT } from '../src/lib/partnerlinks.js';

const PAD = '/blog/thuisbatterij-5-kwh/';
test('thuisbatterij 5 kWh: title/meta, interne links, alleen Anker-knop, datum 23-11', () => {
  const env = { ...process.env, BUILD_DATE: '2026-11-23', PUSH_DATE: '2026-11-23', BASE: '', PREVIEW: '' };
  execSync('node build.mjs', { env, stdio: 'ignore' });
  const h = readFileSync('dist' + PAD + 'index.html', 'utf8');
  const title = h.match(/<title>([^<]*)<\/title>/)[1];
  assert.ok(title.startsWith('Thuisbatterij 5 kWh: prijs, stekker of vast en voor wie'), title);
  const meta = h.match(/<meta name="description" content="([^"]*)"/)[1];
  assert.ok(meta.length >= 120 && meta.length <= 155, String(meta.length));
  for (const l of ['/capaciteit-thuisaccu-berekenen/', '/thuisaccu-kosten/', '/stekkerbatterij-of-vaste-thuisaccu/', '/terugverdientijd-thuisaccu-berekenen/', '/blog/thuisbatterij-10-kwh/', '/merken/anker-solix/', '/salderingsregeling-stopt-2027/', '/thuisaccu-keuzehulp/']) assert.ok(h.includes(`href="${l}"`), l);
  const sponsored = h.match(/<a\s[^>]*rel="[^"]*sponsored[^"]*"[^>]*>/g) || [];
  assert.equal(sponsored.length, 1);
  assert.match(sponsored[0], /href="https:\/\/ankersolixnl\.sjv\.io\/AgOYVR"/);
  assert.ok(h.includes(PARTNER_NOOT));
  assert.equal((h.match(/data-cta="outbound"/g) || []).length, 1);
  assert.doesNotMatch(h, /Marstek|Enphase|\$|USD|Black Friday|korting|actieprijs/i);
  assert.doesNotMatch(h.replace(/<[^>]+>/g, ' '), /\b(volgens|aldus)\b/i);
  assert.match(h, /"datePublished": ?"2026-11-23"/);
  assert.match(h, /"dateModified": ?"2026-11-23"/);
});
