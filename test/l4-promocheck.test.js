// L4-promocheck: actiewoord + prijs zonder einddatum (A), verlopen einddatum (B), actie-veld zonder einddatum (C).
// Kern: scripts/l4-promocheck.mjs, siteconfig: scripts/l4.config.mjs. Draait mee in npm test (node --test test/*.js).
// Vandaag = Europe/Amsterdam, of L4_VANDAAG. Einddatum-cues: t/m | tot en met | geldig tot | eindigt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { FEATURES } from '../src/lib/merken.js';
import {
  beoordeelActie, beoordeelPassage, endDates, isBekend, bekendActief, parsePromoDate, scanActieModules, scanHtml, vandaag, walkActie, runL4,
} from '../scripts/l4-promocheck.mjs';
import { CFG, BEKEND_L4 } from '../scripts/l4.config.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DAG = '2026-11-06';
const page = (body) => `<html><head><title>Test</title></head><body>${body}</body></html>`;

test('mutatie: actie + prijs zonder einddatum faalt (regel A)', () => {
  const html = page('<p>Black Friday actie: nu € 9,99 per maand.</p>');
  const f = scanHtml('promo.html', html, DAG);
  assert.equal(f.length, 1);
  assert.match(f[0], /^\/promo\.html \(A\): actie en prijs zonder einddatum: Black Friday actie: nu € 9,99 per maand\.$/);
});

test('mutatie: verlopen einddatum faalt (regel B)', () => {
  const html = page('<p>Korting € 5, geldig tot 1 januari 2020.</p>');
  const f = scanHtml('promo.html', html, DAG);
  assert.equal(f.length, 1);
  assert.match(f[0], /^\/promo\.html \(B\): einddatum 2020-01-01 < 2026-11-06:/);
  assert.match(f[0], /geldig tot 1 januari 2020/);
  assert.equal(scanHtml('promo.html', page('<p>Introductieprijs € 1, t/m 5 november 2026.</p>'), DAG).length, 1);
});

test('mutatie: geldige einddatum ≥ vandaag is groen', () => {
  assert.deepEqual(scanHtml('promo.html', page('<p>Welkomstkorting € 10, geldig tot 6 november 2026.</p>'), DAG), []);
  assert.deepEqual(scanHtml('promo.html', page('<p>Black Friday: € 1 per maand, tot en met 30 november 2026.</p>'), DAG), []);
  assert.deepEqual(scanHtml('promo.html', page('<p>Actie € 4, t/m 2026-11-06.</p>'), DAG), []);
  assert.deepEqual(scanHtml('promo.html', page('<p>Tijdelijke korting 50%, eindigt op 13-11-2026. Je betaalt € 2,99.</p>'), DAG), []);
});

test('passage is het blok: de einddatum in de volgende alinea dekt de prijs niet', () => {
  const html = page('<p>Black Friday actie: nu € 9,99.</p><p>Geldig tot 1 december 2026.</p>');
  assert.equal(scanHtml('promo.html', html, DAG).length, 1);
  const samen = page('<p>Black Friday actie: nu € 9,99. Geldig tot 1 december 2026.</p>');
  assert.deepEqual(scanHtml('promo.html', samen, DAG), []);
});

test('geen false positive op actief, actieprijs zonder bedrag of korting zonder prijs', () => {
  assert.equal(beoordeelPassage('Vanaf € 20 per maand per actieve terminal.', DAG), null);
  assert.equal(beoordeelPassage(FEATURES.solaredge.prijs.t, DAG), null);
  assert.match(FEATURES.solaredge.prijs.t, /actieprijs/);
  assert.equal(beoordeelPassage('Ze doen dat met een bedrag per teruggeleverde kWh, hogere vaste kosten of minder korting.', DAG), null);
  assert.equal(beoordeelPassage('Acties bijhouden, zoals tijdelijke kortingen en gratis maanden.', DAG), null);
  assert.equal(beoordeelActie(null, DAG), null);
});

test('regel C: actie-veld is leeg of heeft een einddatum; vrije tekst en een verlopen datum falen', () => {
  assert.equal(beoordeelActie(null, DAG), null);
  assert.equal(beoordeelActie(undefined, DAG), null);
  assert.equal(beoordeelActie('', DAG), null);
  assert.equal(beoordeelActie(' ', DAG), null);
  const los = beoordeelActie('Eerste 12 maanden de helft, daarna € 10.', DAG);
  assert.equal(los.regel, 'C');
  assert.match(los.tekst, /actie-veld zonder einddatum/);
  const oud = beoordeelActie('Actie t/m 31 okt 2026, € 5.', DAG);
  assert.equal(oud.regel, 'B');
  assert.match(oud.tekst, /einddatum 2026-10-31 < 2026-11-06/);
  assert.equal(beoordeelActie('t/m 30 nov 2026, eerste 12 maanden 50%.', DAG), null);
  const out = [];
  walkActie({
    anker: { actie: 'tot en met 1 december 2026' },
    sessy: { actie: null },
    homewizard: { actie: '' },
    fout: { actie: 'welkomstkorting € 3' },
  }, 'src/lib/merken.js', 'MERKEN', DAG, out);
  assert.deepEqual(out, ['src/lib/merken.js (C): MERKEN.fout.actie: actie-veld zonder einddatum: welkomstkorting € 3']);
});

test('datums: ISO, d-m-jjjj, maandnaam en afkorting; 31 november is niet parseerbaar', () => {
  assert.equal(parsePromoDate('2026-11-30'), '2026-11-30');
  assert.equal(parsePromoDate('30-11-2026'), '2026-11-30');
  assert.equal(parsePromoDate('30 november 2026'), '2026-11-30');
  assert.equal(parsePromoDate('30 nov 2026'), '2026-11-30');
  assert.equal(parsePromoDate('13 november 2026'), '2026-11-13');
  assert.equal(parsePromoDate('1 december 2026'), '2026-12-01');
  assert.equal(parsePromoDate('31 november 2026'), null);
  assert.deepEqual(endDates('was t/m 1 januari 2020, nu geldig tot 1 december 2026'), ['2020-01-01', '2026-12-01']);
  assert.equal(beoordeelPassage('Korting € 5, was t/m 1 januari 2020, nu geldig tot 1 december 2026.', DAG), null);
});

test('BEKEND_L4 Anker Black Friday: hercheck 13-11 en 01-12, daarna weer rood, en alleen die tekst', () => {
  const bf = '/merken/anker-solix/ (A): actie en prijs zonder einddatum: Black Friday nu € 1.599';
  const andere = '/merken/anker-solix/ (A): actie en prijs zonder einddatum: korting € 1.599';
  assert.deepEqual(BEKEND_L4.map((b) => b.tot).sort(), ['2026-11-13', '2026-12-01']);
  assert.ok(BEKEND_L4.every((b) => b.pad === '/merken/anker-solix/' && b.alleen.test(bf)));
  assert.ok(isBekend(bf, BEKEND_L4, '2026-11-06') && isBekend(bf, BEKEND_L4, '2026-11-13'));
  assert.ok(isBekend(bf, BEKEND_L4, '2026-11-14'), 'na 13-11 dekt de hercheck van 01-12 nog');
  assert.ok(isBekend(bf, BEKEND_L4, '2026-12-01'));
  assert.ok(!isBekend(bf, BEKEND_L4, '2026-12-02'), 'na de laatste hercheckdag weer rood');
  assert.ok(!isBekend(andere, BEKEND_L4, '2026-11-06'), 'andere actie op dezelfde pagina blijft rood');
  assert.ok(!isBekend('/merken/ (A): actie en prijs zonder einddatum: Black Friday € 1', BEKEND_L4, '2026-11-06'));
  assert.ok(bekendActief(BEKEND_L4[0], DAG) && bekendActief(BEKEND_L4[1], DAG));
  assert.ok(!bekendActief(BEKEND_L4[0], '2026-11-14') && bekendActief(BEKEND_L4[1], '2026-11-14'));
  assert.ok(!bekendActief({ pad: '/x/', tot: '2026-11-05' }, DAG));
});

test('CLI: exit ≠ 0 en de melding noemt pad plus snippet', () => {
  const dir = mkdtempSync(join(tmpdir(), 'l4cli-'));
  try {
    writeFileSync(join(dir, 'promo.html'), page('<p>Black Friday actie: nu € 9,99 per maand.</p>'));
    const r = spawnSync(process.execPath, [join(ROOT, 'scripts/l4-promocheck.mjs')], {
      cwd: ROOT,
      env: { ...process.env, L4_OUT: dir, L4_VANDAAG: DAG, L4_SKIP_DATA: '1' },
      encoding: 'utf8',
    });
    assert.notEqual(r.status, 0, r.stderr);
    assert.match(r.stdout, /L4 \| \/promo\.html \(A\): actie en prijs zonder einddatum: Black Friday actie: nu € 9,99 per maand\./);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('L4: gebouwde site en actie-velden groen (of alleen een actieve BEKEND_L4)', async (t) => {
  const r = await runL4(ROOT, CFG);
  const open = r.failures.filter((f) => !isBekend(f, BEKEND_L4, r.vandaag));
  for (const f of r.failures.filter((f) => isBekend(f, BEKEND_L4, r.vandaag))) t.diagnostic('BEKEND_L4: ' + f);
  for (const b of BEKEND_L4) {
    if (!bekendActief(b, r.vandaag)) t.diagnostic(`BEKEND_L4 verlopen op ${b.tot}, telt weer als fout: ${b.pad}`);
    else if (!r.failures.some((f) => isBekend(f, [b], r.vandaag))) t.diagnostic(`BEKEND_L4 ${b.pad} (tot ${b.tot}): geen treffer in deze build. ${b.reden}`);
  }
  t.diagnostic(`vandaag ${r.vandaag}, ${r.html} html, ${r.failures.length} meldingen`);
  assert.ok(r.html >= 15, `build leverde te weinig HTML (${r.html})`);
  assert.deepEqual(open, []);
});

test('regel C op de bronmodules van deze site', async () => {
  assert.deepEqual(CFG.actieModules, ['src/lib/merken.js']);
  assert.deepEqual(await scanActieModules(ROOT, CFG.actieModules, vandaag()), []);
  assert.deepEqual(await scanActieModules(ROOT, CFG.actieModules, '2027-01-01'), []);
  assert.equal(endDates('Black Friday t/m 13 november 2026, daarna t/m 1 december 2026').at(-1), '2026-12-01');
});
