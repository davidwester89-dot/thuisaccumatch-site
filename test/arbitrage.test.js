import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

test('arbitrage: bedragen in de blog volgen uit het script en de prijsdata', () => {
  execSync('python3 scripts/arbitrage/bereken.py');
  const r = JSON.parse(readFileSync('scripts/arbitrage/resultaten.json', 'utf8'));
  assert.equal(r.dagen, 291); assert.equal(r.negatieve_uren, 391);
  const post = readFileSync('content/blog/2026-10-19-thuisbatterij-dynamisch-contract.md', 'utf8');
  for (const [naam, cap] of [['2,7 kWh, 0,8 kW', '2,7 kWh, 0,8 kW'], ['5 kWh, 2,5 kW', '5 kWh, 2,5 kW'], ['10 kWh, 5 kW', '10 kWh, 5 kW']]) {
    const z = r.batterijen[`${naam} | zelf`].totaal; const h = r.batterijen[`${naam} | handel`].totaal;
    assert.ok(post.includes(`| ${cap} | € ${z} | € ${h} |`), `${naam}: € ${z} / € ${h} in de tabel`);
  }
  const vijf = r.batterijen['5 kWh, 2,5 kW | zelf'];
  assert.ok(readFileSync('content/blog/2026-10-19-thuisbatterij-rendabel-2027.md', 'utf8').includes(`hooguit **€ ${vijf.totaal}**`));
  assert.ok(post.includes(`januari € ${String(vijf.per_maand['1']).replace('.', ',')}0`));
  assert.ok(post.includes(`${String(r.gemiddelde_prijs).replace('.', ',')}`) && post.includes(`In ${r.negatieve_uren} uren`));
});
