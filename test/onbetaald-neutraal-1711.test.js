import { revisieDatum } from './nuchter-datums-helper.mjs';
// 17-11: onbetaalde merken-CTA's (geen PARTNERLINKS-entry) worden bronlink, geen knop.
// Faalt op parent fd317a3 (Sessy/HomeWizard-knoppen in de top 3); slaagt op deze hash.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildLive } from './helpers.js';
import { IDS, MERKEN } from '../src/lib/merken.js';
import { PARTNERLINKS, knop, bronlink } from '../src/lib/partnerlinks.js';
import { NEUTRAAL_DATUM, NEUTRAAL_PADEN } from '../src/pages.mjs';

export const PARENT = 'fd317a308f0e40bfaddabef22a410def8437b896';
const read = (p) => readFileSync(p, 'utf8');
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });

const isCta = (tag) => /class="[^"]*\bbtn\b/.test(tag) || /data-cta="outbound"/.test(tag) || /data-partner-slot=/.test(tag) || /data-vendor=/.test(tag);
const hrefOf = (tag) => (tag.match(/\shref="([^"]*)"/) || [])[1] || '';
const vendorOf = (tag, href) => {
  const id = (tag.match(/data-vendor="([^"]+)"/) || tag.match(/data-partner-slot="([^"]+)"/) || [])[1];
  if (id) return id;
  for (const [pid, u] of Object.entries(PARTNERLINKS)) if (href === u || href.startsWith(u + '?')) return pid;
  for (const id of IDS) {
    const u = MERKEN[id].url;
    if (href === u || href.startsWith(u) || href.replace(/\/$/, '') === u.replace(/\/$/, '')) return id;
  }
  return null;
};

/** Uitgaande knop/CTA naar een merk zonder PARTNERLINKS-entry, of sponsored zonder die entry. */
export function onbetaaldeCtas(html, page = '') {
  const found = [];
  for (const m of html.matchAll(/<a\b[^>]*>/g)) {
    const tag = m[0];
    const href = hrefOf(tag);
    if (!href || href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:')) continue;
    const id = vendorOf(tag, href);
    if (!id) continue;
    const paid = Boolean(PARTNERLINKS[id]);
    const sponsored = /rel="[^"]*\bsponsored\b/.test(tag);
    if ((isCta(tag) || sponsored) && !paid) found.push({ page, brand: id, href, tag: tag.slice(0, 240) });
  }
  return found;
}

export function top3Unpaid(hubHtml, page = '/merken/') {
  const plist = hubHtml.split('<ol class="plist">')[1];
  if (!plist) return { error: 'geen plist', items: [] };
  const starts = [...plist.matchAll(/<li class="pcard"[^>]*>/g)];
  const cards = starts.slice(0, 3).map((m, i, arr) => {
    const from = m.index;
    const to = i + 1 < arr.length ? arr[i + 1].index : (plist.indexOf('</ol>') < 0 ? plist.length : plist.indexOf('</ol>'));
    return plist.slice(from, to);
  });
  return { cards: cards.length, items: cards.flatMap((c, i) => onbetaaldeCtas(c, `${page}#top${i + 1}`)) };
}

function scanDist(root) {
  const files = walk(root).filter((f) => /\.(html|js)$/.test(f) && !/google[0-9a-f]+\.html$/.test(f));
  const sitewide = [];
  for (const f of files) sitewide.push(...onbetaaldeCtas(read(f), f.slice(root.length)));
  const hub = join(root, 'merken/index.html');
  const top3 = top3Unpaid(read(hub), '/merken/');
  return { sitewide, top3 };
}

test('onbetaalde CTA in top 3: faalt op fd317a3, slaagt op deze hash', () => {
  for (const id of ['sessy', 'homewizard', 'zonneplan', 'solaredge', 'byd', 'huawei']) {
    assert.ok(!(id in PARTNERLINKS), id);
    assert.equal(knop(id, 'lijst', 'btn ghost sm'), bronlink(id));
    assert.equal(bronlink(id), `<a href="${MERKEN[id].url}" rel="noopener">Bron: ${MERKEN[id].naam}</a>`);
    assert.doesNotMatch(bronlink(id), /class="[^"]*\bbtn\b|data-cta|data-vendor|data-partner-slot|sponsored|target=|[?&]ref=|utm_/i);
  }
  assert.equal(PARTNERLINKS.anker, 'https://ankersolixnl.sjv.io/AgOYVR');
  assert.match(knop('anker', 'lijst'), /class="btn"[^>]*rel="sponsored nofollow noopener"[^>]*>Naar de site van Anker SOLIX</);

  buildLive();
  const here = scanDist('dist');
  assert.equal(here.top3.cards, 3);
  assert.deepEqual(here.top3.items, [], 'geen onbetaalde CTA in de top 3');
  assert.deepEqual(here.sitewide, [], 'geen onbetaalde CTA sitewide');
  const hub = read('dist/merken/index.html');
  for (const id of ['sessy', 'homewizard', 'zonneplan', 'solaredge', 'byd', 'huawei']) {
    assert.ok(hub.includes(`<a href="/merken/${MERKEN[id].slug}/">${MERKEN[id].naam}</a>`), `merk blijft staan: ${id}`);
    assert.ok(hub.includes(bronlink(id)), `bronlink op hub: ${id}`);
    const detail = read(`dist/merken/${MERKEN[id].slug}/index.html`);
    assert.equal((detail.match(new RegExp(bronlink(id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length, 2, `twee bronlinks op ${id}`);
    assert.doesNotMatch(detail, /Naar de site van /);
  }
  assert.match(hub, /href="https:\/\/ankersolixnl\.sjv\.io\/AgOYVR"[^>]*rel="sponsored nofollow noopener"/);
  assert.match(read('dist/merken/anker-solix/index.html'), /Naar de site van Anker SOLIX/);

  const tmp = mkdtempSync(join(tmpdir(), 'tam-cta-fd317a3-'));
  try {
    const tar = join(tmp, 'src.tar');
    execFileSync('git', ['archive', '--format=tar', '-o', tar, PARENT], { cwd: process.cwd() });
    execFileSync('tar', ['-xf', tar], { cwd: tmp });
    execFileSync('node', ['build.mjs'], { cwd: tmp, env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1', BUILD_DATE: '2026-11-16' }, stdio: 'ignore' });
    const parent = scanDist(join(tmp, 'dist'));
    assert.ok(parent.top3.items.length >= 2, 'parent fd317a3 moet onbetaalde CTA in de top 3 hebben, vond ' + parent.top3.items.length);
    const brands = new Set(parent.top3.items.map((x) => x.brand));
    assert.ok(brands.has('sessy') && brands.has('homewizard'), 'parent top 3 bevat Sessy- en HomeWizard-knoppen: ' + [...brands]);
    assert.ok(parent.sitewide.some((x) => x.brand === 'sessy') && parent.sitewide.some((x) => x.brand === 'homewizard'));
    assert.ok(parent.sitewide.some((x) => x.brand === 'zonneplan' || x.brand === 'huawei' || x.brand === 'solaredge' || x.brand === 'byd'), 'parent heeft ook andere onbetaalde merken-CTA\'s');
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});

test('L7 17-11: alleen pagina’s met bodywijziging krijgen NEUTRAAL_DATUM', () => {
  buildLive();
  const sm = read('dist/sitemap.xml');
  assert.equal(NEUTRAAL_DATUM, '2026-11-17');
  for (const p of NEUTRAAL_PADEN) {
    assert.ok(sm.includes(`<loc>https://thuisaccumatch.nl${p}</loc><lastmod>${revisieDatum(p, NEUTRAAL_DATUM)}</lastmod>`), p);
    const h = read(`dist${p}index.html`);
    assert.match(h, new RegExp(`bijgewerkt (op )?<time datetime="${revisieDatum(p, NEUTRAAL_DATUM)}">`, 'i'), p);
    assert.doesNotMatch(h, new RegExp(`"dateModified": ?"(?!${revisieDatum(p, NEUTRAAL_DATUM)})`), p);
  }
  for (const [p, date] of [['/merken/anker-solix/', '2026-11-12'], ['/', '2026-11-16'], ['/vergelijken/', '2026-11-06'], ['/gidsen/', '2026-11-16'], ['/thuisaccu-keuzehulp/', '2026-11-06']]) {
    assert.ok(sm.includes(`<loc>https://thuisaccumatch.nl${p}</loc><lastmod>${revisieDatum(p, date)}</lastmod>`), `${p} niet getild, blijft ${revisieDatum(p, date)}`);
  }
});
