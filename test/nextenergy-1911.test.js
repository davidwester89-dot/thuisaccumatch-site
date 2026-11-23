// NextEnergy redactionele partnerplaatsing (push 24-11). Alleen gids + blog dynamisch contract; geen merkenvergelijking, geen E-TAM-1.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { PARTNERLINKS, PARTNER_NOOT, redactiePartner } from '../src/lib/partnerlinks.js';
import { IDS } from '../src/lib/merken.js';

const LINK = 'https://partners.nextenergy.nl/c/?si=17689&li=1765747&wi=439450&ws=&dl=';
const PADEN = ['/thuisaccu-dynamisch-energiecontract/', '/blog/thuisbatterij-dynamisch-contract/'];
const VERBODEN = ['/thuisaccu-terugverdientijd/', '/onderzoek/thuisbatterij-dynamisch-contract-2026/'];

test('NextEnergy: redactionele vermelding op gids en blog, niet in vergelijking of E-TAM-1', () => {
  assert.equal(PARTNERLINKS.nextenergy, LINK);
  assert.equal(
    redactiePartner('nextenergy', 'gids_dyn', 'NextEnergy'),
    `<a href="${LINK}" rel="sponsored nofollow noopener" target="_blank" data-vendor="nextenergy" data-pos="gids_dyn" data-cta="outbound" data-partner-slot="nextenergy">NextEnergy</a>`,
  );
  assert.throws(() => redactiePartner('anker', 'x', 'Anker'), /knop/);
  assert.ok(!IDS.includes('nextenergy'));
  execSync('node build.mjs', { env: { ...process.env, BUILD_DATE: '2026-11-26', PUSH_DATE: '2026-11-26', BASE: '', PREVIEW: '', GO_LIVE: '1', LEADS_PREVIEW: '' }, stdio: 'ignore' });

  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  for (const pad of PADEN) {
    const h = readFileSync('dist' + pad + 'index.html', 'utf8');
    const sponsored = h.match(/<a\s[^>]*rel="[^"]*sponsored[^"]*"[^>]*>/g) || [];
    const next = sponsored.filter((a) => a.includes(LINK));
    assert.equal(next.length, 1, pad + ': precies één NextEnergy-partnerlink');
    assert.match(next[0], /rel="sponsored nofollow noopener"/);
    assert.match(next[0], /data-vendor="nextenergy"/);
    assert.match(next[0], /data-pos="(?:gids_dyn|blog_dyn)"/);
    assert.match(next[0], /data-partner-slot="nextenergy"/);
    assert.doesNotMatch(next[0], /class="[^"]*\bbtn\b/);
    assert.match(h, /voorbeeld van een aanbieder van een dynamisch contract is <a [^>]+>NextEnergy<\/a>/);
    const zin = (h.match(/voorbeeld van een aanbieder van een dynamisch contract is <a [^>]+>NextEnergy<\/a>\./) || [])[0] || '';
    assert.doesNotMatch(zin, /beste/i);
    assert.ok(h.includes(PARTNER_NOOT), pad + ': partnerzin');
    assert.match(h, new RegExp(`bijgewerkt[^<]*<time datetime="2026-11-26">`, 'i'));
    assert.match(h, /"dateModified": ?"2026-11-26"/);
    assert.ok(sm.includes(`<loc>https://thuisaccumatch.nl${pad}</loc><lastmod>2026-11-26</lastmod>`), pad);
    assert.match(h, /<p>Een voorbeeld van een aanbieder van een dynamisch contract is <a [^>]*data-vendor="nextenergy"/, pad + ': eerste vermelding in p');
    assert.doesNotMatch(h, /<h[1-6][^>]*>[^<]*NextEnergy/, pad + ': niet in kop');
    assert.doesNotMatch(h, /<summary[^>]*>[^<]*NextEnergy|<script type="application\/ld\+json">[^<]*NextEnergy/, pad + ': niet in FAQ/schema');
    assert.doesNotMatch(h, /<p class="src">[^<]*NextEnergy/, pad + ': niet in bronregel');
  }

  for (const pad of VERBODEN) {
    const h = readFileSync('dist' + pad + 'index.html', 'utf8');
    assert.doesNotMatch(h, /nextenergy|partners\.nextenergy/i, pad);
  }
  const merken = readFileSync('dist/merken/index.html', 'utf8');
  const vs = readFileSync('dist/vergelijken/index.html', 'utf8');
  assert.doesNotMatch(merken, /partners\.nextenergy|data-vendor="nextenergy"/);
  assert.doesNotMatch(vs, /partners\.nextenergy|data-vendor="nextenergy"/);
  assert.deepEqual([...merken.matchAll(/<li class="pcard" data-id="([^"]+)"/g)].map((m) => m[1]),
    ['anker', 'sessy', 'homewizard', 'zonneplan', 'solaredge', 'byd', 'huawei']);

  const privacy = readFileSync('dist/privacy/index.html', 'utf8');
  assert.match(privacy, /affiliatenetwerk \(Impact, Daisycon\)/);
  assert.match(privacy, /bijgewerkt[^<]*<time datetime="2026-11-26">/i);
  assert.ok(sm.includes('<loc>https://thuisaccumatch.nl/privacy/</loc><lastmod>2026-11-26</lastmod>'));
});
