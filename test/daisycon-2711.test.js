// Daisycon 27-11: HomeWizard-partnerknop plus redactionele Frank Energie en energiedirect.
// Zelfde patroon als NextEnergy: voorbeeldzin, geen merkenvergelijking, geen E-TAM-1, geen tariefbron omzetten.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { IDS } from '../src/lib/merken.js';
import { PARTNERLINKS, PARTNER_NOOT, knop, redactiePartner } from '../src/lib/partnerlinks.js';
import { netwerkenVan } from '../src/privacy-avg.mjs';

const HW = 'https://partner.homewizard.com/c/?si=18407&li=1796814&wi=439450&ws=';
const FRANK = 'https://jf79.net/c/?si=16978&li=1838994&wi=439450&ws=';
const ED = 'https://lt45.net/c/?si=924&li=1782260&wi=439450&ws=';
const PADEN = ['/thuisaccu-dynamisch-energiecontract/', '/blog/thuisbatterij-dynamisch-contract/'];
const VERBODEN = ['/thuisaccu-terugverdientijd/', '/onderzoek/thuisbatterij-dynamisch-contract-2026/', '/blog/thuisbatterij-terugleverkosten-2027/', '/vergelijken/', '/merken/'];
const read = (p) => readFileSync(p, 'utf8');
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });

test('Daisycon 27-11: exacte links, redactionele plaatsing, HomeWizard-knop, privacyhosts', () => {
  assert.equal(PARTNERLINKS.homewizard, HW);
  assert.equal(PARTNERLINKS.frankenergie, FRANK);
  assert.equal(PARTNERLINKS.energiedirect, ED);
  assert.equal(
    redactiePartner('frankenergie', 'gids_dyn', 'Frank Energie'),
    `<a href="${FRANK}" rel="sponsored nofollow noopener" target="_blank" data-vendor="frankenergie" data-pos="gids_dyn" data-cta="outbound" data-partner-slot="frankenergie">Frank Energie</a>`,
  );
  assert.equal(
    redactiePartner('energiedirect', 'blog_dyn', 'energiedirect'),
    `<a href="${ED}" rel="sponsored nofollow noopener" target="_blank" data-vendor="energiedirect" data-pos="blog_dyn" data-cta="outbound" data-partner-slot="energiedirect">energiedirect</a>`,
  );
  assert.throws(() => redactiePartner('homewizard', 'x', 'HomeWizard'), /knop/);
  assert.match(knop('homewizard', 'merk_top'), new RegExp(`href="${HW.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" rel="sponsored nofollow noopener"`));
  assert.match(knop('homewizard', 'merk_top'), />Naar de site van HomeWizard</);
  assert.ok(!IDS.includes('frankenergie') && !IDS.includes('energiedirect'));
  assert.deepEqual(netwerkenVan({ homewizard: HW, frankenergie: FRANK, energiedirect: ED }).map((n) => n.naam), ['Daisycon']);

  execSync('node build.mjs', { env: { ...process.env, BUILD_DATE: '2026-11-27', PUSH_DATE: '2026-11-27', BASE: '', PREVIEW: '', GO_LIVE: '1', LEADS_PREVIEW: '' }, stdio: 'ignore' });

  for (const pad of PADEN) {
    const h = read('dist' + pad + 'index.html');
    for (const [id, link, tekst] of [['frankenergie', FRANK, 'Frank Energie'], ['energiedirect', ED, 'energiedirect'], ['nextenergy', PARTNERLINKS.nextenergy, 'NextEnergy']]) {
      const sponsored = h.match(/<a\s[^>]*rel="[^"]*sponsored[^"]*"[^>]*>/g) || [];
      const hits = sponsored.filter((a) => a.includes(link));
      assert.equal(hits.length, 1, pad + ': precies één ' + id);
      assert.match(hits[0], /rel="sponsored nofollow noopener"/);
      assert.match(hits[0], new RegExp(`data-vendor="${id}"`));
      assert.match(hits[0], /data-pos="(?:gids_dyn|blog_dyn)"/);
      assert.match(hits[0], new RegExp(`data-partner-slot="${id}"`));
      assert.doesNotMatch(hits[0], /class="[^"]*\bbtn\b/);
      const zin = (h.match(new RegExp(`voorbeeld van een aanbieder van een dynamisch contract is <a [^>]+>${tekst.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</a>\\.`)) || [])[0] || '';
      assert.ok(zin, pad + ': voorbeeldzin ' + tekst);
      assert.doesNotMatch(zin, /beste/i);
      assert.doesNotMatch(h, new RegExp(`<h[1-6][^>]*>[^<]*${tekst}`), pad + ': niet in kop');
      assert.doesNotMatch(h, new RegExp(`<summary[^>]*>[^<]*${tekst}|<script type="application/ld\\+json">[^<]*${tekst}`), pad + ': niet in FAQ/schema');
      assert.doesNotMatch(h, new RegExp(`<p class="src">[^<]*${tekst}`), pad + ': niet in bronregel');
    }
    assert.ok(h.includes(PARTNER_NOOT), pad + ': partnerzin');
    assert.match(h, /bijgewerkt[^<]*<time datetime="2026-11-27">/i);
  }

  for (const pad of VERBODEN) {
    const h = read('dist' + pad + 'index.html');
    assert.doesNotMatch(h, /jf79\.net|lt45\.net|data-vendor="frankenergie"|data-vendor="energiedirect"/, pad);
  }
  const tlk = read('dist/blog/thuisbatterij-terugleverkosten-2027/index.html');
  assert.match(tlk, /href="https:\/\/www\.energiedirect\.nl\/energie\/referentieproducten"/);
  assert.doesNotMatch(tlk, /lt45\.net|jf79\.net|partner\.homewizard\.com/);

  const hw = read('dist/merken/homewizard/index.html');
  assert.equal((hw.match(new RegExp(HW.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length, 2);
  assert.ok(hw.includes(PARTNER_NOOT));
  assert.doesNotMatch(hw, /jf79\.net|lt45\.net|Frank Energie|energiedirect|NextEnergy/);
  assert.match(hw, /bijgewerkt[^<]*<time datetime="2026-11-27">/i);

  const hosts = [
    ['partner.homewizard.com', new Set(['dist/merken/index.html', 'dist/merken/homewizard/index.html'])],
    ['jf79.net', new Set(PADEN.map((p) => 'dist' + p + 'index.html'))],
    ['lt45.net', new Set(PADEN.map((p) => 'dist' + p + 'index.html'))],
  ];
  for (const f of walk('dist').filter((x) => x.endsWith('.html'))) {
    const t = read(f);
    for (const [host, ok] of hosts) {
      if (t.includes(host)) assert.ok(ok.has(f), `${host} hoort niet op ${f}`);
    }
  }

  const privacy = read('dist/privacy/index.html');
  assert.match(privacy, /affiliatenetwerk \(Impact, Daisycon\)/);
  assert.match(privacy, /bijgewerkt[^<]*<time datetime="2026-11-26">/i);
  assert.doesNotMatch(privacy, /partner\.homewizard\.com|jf79\.net|lt45\.net/);
});
