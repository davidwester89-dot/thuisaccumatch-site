import { TVT_DATUM, TVT_PADEN } from '../src/tvt2027.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { buildLive } from './helpers.js';
import { ONDERZOEK_DATUM, ONDERZOEK_PAD } from '../src/onderzoek.mjs';
const read = (p) => readFileSync(p, 'utf8');
const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');
const ROOT = 'src/root/onderzoek/data/';
test('onderzoek: offline exports zijn byte-reproduceerbaar uit ongewijzigde brondata', () => {
  assert.equal(sha('scripts/arbitrage/prijzen-2026.json'), 'c6baf52b697241188ffc3dd44d024b4eb3b3c2170784ee106d72e778bdccdee6');
  const tmp = mkdtempSync(join(tmpdir(), 'tam-data-'));
  try {
    execFileSync('python3', ['scripts/arbitrage/exporteer.py'], {env:{...process.env, ONDERZOEK_OUT:tmp}});
    const manifest = JSON.parse(read(ROOT + 'manifest.json'));
    for (const [f, hash] of Object.entries(manifest.bestanden)) {
      assert.equal(sha(ROOT + f), hash, f); assert.equal(sha(join(tmp,f)), hash, f + ' gereproduceerd');
    }
  } finally { rmSync(tmp, {recursive:true,force:true}); }
});
test('onderzoek: uurdata compleet (DST), CSV-daguitkomsten sommeren naar de bestaande totalen', () => {
  const result = JSON.parse(execFileSync('python3', ['-c', `
import csv,json,collections,datetime,zoneinfo
from pathlib import Path
root=Path('src/root/onderzoek/data')
uren=list(csv.DictReader((root/'uurprijzen-2026.csv').open()))
dagen=collections.Counter(x['datum_europe_amsterdam'] for x in uren)
assert len(dagen)==291
assert len(set(x['tijd_utc'] for x in uren))==len(uren)
assert len(uren)==291*24-1
assert dagen['2026-03-29']==23
raw=json.load(open('scripts/arbitrage/prijzen-2026.json'))
for x in uren: assert float(x['beursprijs_eur_kwh_excl_btw_en_energiebelasting'])==raw[x['tijd_utc']]
assert all(datetime.datetime.fromisoformat(b['tijd_utc'].replace('Z','+00:00'))-datetime.datetime.fromisoformat(a['tijd_utc'].replace('Z','+00:00'))==datetime.timedelta(hours=1) for a,b in zip(uren,uren[1:]))
rows=list(csv.DictReader((root/'scenarios-per-dag-2026.csv').open()))
assert len(rows)==291*7
sommen=collections.defaultdict(float)
for r in rows:
 assert int(r['uren'])==dagen[r['datum_europe_amsterdam']]
 if r['scenario']=='geen accu': assert float(r['voordeel_eur_tov_geen_accu'])==0
 else: sommen[r['scenario']+' | '+r['waardering']]+=float(r['voordeel_eur_tov_geen_accu'])
print(json.dumps({k:round(v) for k,v in sommen.items()}))
`], {encoding:'utf8'}));
  const old = JSON.parse(read('scripts/arbitrage/resultaten.json'));
  for (const [k,v] of Object.entries(result)) assert.equal(v, old.batterijen[k].totaal, k);
  assert.deepEqual(Object.values(result), [105,21,234,54,468,108]);
});
test('onderzoek: eigen canonical, CSVs, Dataset, eerlijke meetperiode en geen verkoop-CTA', () => {
  buildLive();
  const h = read('dist' + ONDERZOEK_PAD + 'index.html');
  const main = h.split('<article class="prose">')[1].split('</article>')[0];
  assert.match(h, new RegExp('<link rel="canonical" href="https://thuisaccumatch.nl'+ONDERZOEK_PAD+'">'));
  assert.doesNotMatch(main, /class="[^" ]*(?:btn|cta)|sponsored|nofollow|sjv\.io|partnernoot|data-cta=/);
  for (const f of ['uurprijzen-2026.csv','scenarios-per-dag-2026.csv','rekenpakket-2026.zip']) assert.ok(main.includes('href="/onderzoek/data/'+f+'" download'));
  for (const txt of ['geen gegevens uit 2025','geen praktijktest','niet naar een volledig jaar','Afrondingsmarge','geen statistisch betrouwbaarheidsinterval','90%','0,09161','2026-01-01/2026-10-18','Dataset','Citeer dit onderzoek']) assert.ok(h.includes(txt),txt);
  assert.equal(ONDERZOEK_PAD, '/onderzoek/thuisbatterij-dynamisch-contract-2026/');
  assert.doesNotMatch(h, /thuisbatterij-dynamisch-contract-2025-2026/);
  assert.doesNotMatch(h, /De vaste URL noemt 2025/);
  assert.match(h, /fromDate=2025-12-31T23:00:00\.000Z/);
  assert.doesNotMatch(h, /fromDate=2026-01-01T00:00:00\.000Z/);

  for (const p of ['/', '/gidsen/', '/salderingsregeling-stopt-2027/', '/blog/', '/blog/thuisbatterij-dynamisch-contract/', '/terugverdientijd-thuisaccu-berekenen/', ONDERZOEK_PAD]) {
    const page = read('dist'+p+'index.html');
    const date = p === '/' || TVT_PADEN.has(p) ? TVT_DATUM : ONDERZOEK_DATUM;
    assert.ok(page.includes('href="'+ONDERZOEK_PAD+'"') || p===ONDERZOEK_PAD,p+' inkomende link');
    assert.ok(read('dist/sitemap.xml').includes('<loc>https://thuisaccumatch.nl'+p+'</loc><lastmod>'+date+'</lastmod>'),p);
    assert.match(page,new RegExp('bijgewerkt(?: op)? <time datetime="'+date+'">','i'));
  }
});
