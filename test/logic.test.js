import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { advies, VRAGEN, compleet } from '../src/lib/match.js';
import { terugverdien, saldering, capaciteit, verschoven, STROOMPRIJS, LEVERING, ENERGIEBELASTING, KAAL, MIN_VERGOEDING, NETTO_TERUG, PRIJS_KWH, BRON } from '../src/lib/kosten.js';
import { IDS, FEATURES, MERKEN, STERK_IN } from '../src/lib/merken.js';
import { IDS_PUNTEN, MAX, score, ranglijst, punt, metSoort } from '../src/lib/checklist.js';
import { uitgaand, knop, PARTNERLINKS } from '../src/lib/partnerlinks.js';

const A = { panelen: '12', verbruik: '3200', contract: 'vast', doel: 'zon', installatie: 'maakniet', budget: '5' };

test('stroomprijs en terugleververgoeding volgen CBS, Rijksoverheid en Milieu Centraal', () => {
  assert.equal(Math.round((LEVERING + ENERGIEBELASTING) * 100) / 100, STROOMPRIJS); // CBS sept. 2026
  assert.ok(Math.abs(KAAL - LEVERING / 1.21) < 0.001); // kaal = zonder btw
  assert.ok(Math.abs(MIN_VERGOEDING - KAAL / 2) < 0.001); // tot 2030 minstens 50%
  assert.equal(NETTO_TERUG, 0.005); // "rond de halve cent"
  assert.equal(PRIJS_KWH.stekker, Math.round(1195 / 2.7)); assert.equal(PRIJS_KWH.vast, 5500 / 10);
  for (const b of Object.values(BRON)) assert.match(b.url, /^https:\/\/(www\.)?(milieucentraal|rijksoverheid|consument\.acm|acm|cbs|belastingdienst|brandweer|nipv)\.nl\//);
});

test('rekenvoorbeeld 10 panelen: saldering, terugverdientijd en capaciteit', () => {
  const s = saldering({ opwek: 3500, verbruik: 3500 });
  assert.deepEqual(s, { direct: 1050, terug: 2450, voor: 910, na: 285, verschil: 625 });
  // Overschot boven verbruik kreeg ook vóór 2027 alleen de vergoeding.
  assert.equal(saldering({ opwek: 6000, verbruik: 3000 }).voor, Math.round(3000 * STROOMPRIJS + 3000 * NETTO_TERUG));
  const t = terugverdien({ prijs: 3550, capaciteit: 5, teruglevering: 2450 });
  assert.equal(t.kwh, 900); assert.equal(t.besparing, 230); assert.equal(t.jaren, 15.4); assert.equal(t.perKwh, 710);
  assert.ok(terugverdien({ prijs: 3550, capaciteit: 5, teruglevering: 2450, dynamisch: true }).besparing > t.besparing);
  assert.equal(terugverdien({ prijs: 3550, capaciteit: 5, teruglevering: 0 }).jaren, null);
  assert.equal(verschoven({ capaciteit: 20, teruglevering: 500 }), 450); // nooit meer dan je teruglevert
  const c = capaciteit({ verbruik: 3500, panelen: 10 });
  assert.equal(c.advies, 5.5); assert.equal(c.zomer, 10.5); assert.equal(c.winter, 2.5); assert.equal(c.soort, 'vast');
  assert.equal(capaciteit({ verbruik: 3500, panelen: 0 }).soort, null);
  assert.equal(capaciteit({ verbruik: 1500, panelen: 4 }).soort, 'stekker');
});

test('keuzehulp: regels', () => {
  assert.equal(advies({ ...A, panelen: '0', contract: 'vast' }).type, 'geen');
  assert.equal(advies({ ...A, panelen: '0', contract: 'vast' }).merken.length, 0);
  assert.notEqual(advies({ ...A, panelen: '0', contract: 'dynamisch' }).type, 'geen');
  assert.equal(advies({ ...A, installatie: 'zelf' }).type, 'stekker');
  assert.equal(advies({ ...A, budget: '1' }).type, 'stekker');
  assert.equal(advies({ ...A, installatie: 'installateur', budget: '10' }).type, 'vast');
  for (const a of [{ ...A, installatie: 'zelf' }, { ...A, budget: '1' }]) {
    const r = advies(a); assert.ok(r.kwh <= 10.8 && r.kwh >= 2.7); assert.equal(r.reken.prijs % 1195, 0);
  }
  assert.ok(advies({ ...A, installatie: 'installateur' }).reken.prijs >= 3550);
  // Merken in de uitslag hebben de juiste soort, in de vaste volgorde; bij noodstroom alleen merken die het noemen.
  for (const s of ['stekker', 'vast']) for (const id of metSoort(s)) assert.equal(MERKEN[id].soort, s);
  for (const id of advies({ ...A, installatie: 'installateur', budget: '10', doel: 'nood' }).merken) assert.ok(['ja', 'deels'].includes(FEATURES[id].noodstroom.v), id);
  assert.ok(advies(A).notes.some((n) => /hoogstwaarschijnlijk niet terug/.test(n)));
  assert.ok(compleet(A)); assert.ok(!compleet({ panelen: '0' }));
  for (const v of VRAGEN) for (const [val] of v.opties) assert.match(val, /^[a-z0-9]+$/);
});

test('checklist: 10 punten per merk, alleen ja/deels/nee/niet vermeld, met bron', () => {
  assert.equal(MAX, 10); assert.equal(IDS.length, 6);
  for (const id of IDS) {
    assert.deepEqual(Object.keys(FEATURES[id]).sort(), [...IDS_PUNTEN].sort(), id);
    for (const k of IDS_PUNTEN) {
      const f = FEATURES[id][k];
      assert.ok([null, 'ja', 'deels', 'nee'].includes(f.v), `${id}.${k}`);
      if (f.v) assert.match(f.s || '', /^https:\/\//, `${id}.${k} zonder bron`);
      if (f.v === null) assert.ok(!f.t && !f.s, `${id}.${k}: niet vermeld hoort geen toelichting te hebben`);
    }
    assert.ok(STERK_IN[id] && MERKEN[id].bronnen.length && MERKEN[id].plus.length && MERKEN[id].min.length);
    assert.ok(['stekker', 'vast'].includes(MERKEN[id].soort));
  }
});

test('score = som van de punten; volgorde = score, dan naam', () => {
  for (const id of IDS) assert.equal(score(id).totaal, IDS_PUNTEN.reduce((t, k) => t + punt(FEATURES[id][k].v), 0));
  const r = ranglijst();
  for (let i = 1; i < r.length; i++) {
    const [a, b] = [score(r[i - 1]).totaal, score(r[i]).totaal];
    assert.ok(a > b || (a === b && MERKEN[r[i - 1]].naam.localeCompare(MERKEN[r[i]].naam, 'nl') < 0));
  }
});

test('partnerlinks leeg; gevuld = sponsored nofollow, geen zichtbaar label; nooit in keuzehulp of checklist', () => {
  assert.deepEqual(PARTNERLINKS, {});
  for (const id of IDS) { const o = uitgaand(id); assert.equal(o.partner, false); assert.equal(o.href, MERKEN[id].url); assert.ok(!knop(id, 't').includes('partner"')); }
  const k = knop('sessy', 't', 'btn', { sessy: 'https://example.com/aff' });
  assert.match(k, /rel="sponsored nofollow noopener"/); assert.match(k, /<\/a>$/); assert.ok(!/<span class="partner"|>\s*partnerlink\s*</i.test(k));
  for (const f of ['../src/lib/checklist.js', '../src/lib/match.js', '../src/lib/kosten.js']) {
    const s = readFileSync(new URL(f, import.meta.url), 'utf8');
    assert.ok(!/partnerlinks|leads|LEADPARTNERS|ROUTING/.test(s), f);
  }
});
