import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { bereken2027, TVT2027, SCENARIOS2027 } from '../src/lib/tvt2027.js';
import { TVT_DATUM, TVT_PADEN } from '../src/tvt2027.mjs';
import { ONDERZOEK_PAD } from '../src/onderzoek.mjs';
import { buildLive } from './helpers.js';
const read = (p) => readFileSync(p,'utf8');
const near = (a,b) => assert.ok(Math.abs(a-b)<1e-9, a+' != '+b);
test('2027: drie scenario’s exact vastgelegd; geen ongedocumenteerde standaardwaarden', () => {
  assert.deepEqual(TVT2027,{capaciteit:5,teruglevering:2450,stroomprijs:0.26,netto:0.005,dagen:200,rendement:0.9,onderhoud:0});
  assert.deepEqual(SCENARIOS2027.map((x)=>[x.prijs,x.capaciteit]),[[0,0],[1195,2.7],[3550,5]]);
  const [geen,klein,vast]=SCENARIOS2027.map(bereken2027);
  assert.deepEqual(geen,{geladen:0,geleverd:0,verlies:0,vermedenInkoop:0,gemisteVergoeding:0,besparing:0,jaren:null});
  near(klein.geladen,540); near(klein.geleverd,486); near(klein.besparing,123.66); near(klein.jaren,1195/123.66);
  near(vast.geladen,1000); near(vast.geleverd,900); near(vast.verlies,100); near(vast.vermedenInkoop,234); near(vast.gemisteVergoeding,5); near(vast.besparing,229); near(vast.jaren,3550/229);
  near(bereken2027({prijs:3550,dagen:160}).jaren,3550/183.2);
  near(bereken2027({prijs:3550,dagen:240}).jaren,3550/274.8);
});
test('2027: geen gratis verlies, dubbele arbitrage, gefingeerde prijs of positieve-opbrengstclamp', () => {
  near(bereken2027({teruglevering:100,netto:0.1,stroomprijs:0.3,rendement:0.8,onderhoud:2,prijs:500}).besparing,12);
  assert.equal(bereken2027({prijs:null}).jaren,null);
  assert.equal(bereken2027({prijs:1000,teruglevering:0}).jaren,null);
  near(bereken2027({netto:1,stroomprijs:0.1,prijs:1000}).besparing,-910);
  assert.equal(bereken2027({netto:1,stroomprijs:0.1,prijs:1000}).jaren,null);
  near(bereken2027({netto:-0.01}).besparing,244);
  for (const x of [{dagen:366},{dagen:-1},{rendement:0},{rendement:1.01},{capaciteit:NaN},{onderhoud:-1},{prijs:-1},{stroomprijs:Infinity}]) assert.throws(()=>bereken2027(x),RangeError);
  assert.doesNotMatch(read('src/lib/tvt2027.js'),/dynDagen|spread|dynamisch|arbitrage/);
});
test('2027: browserberekening volgt echte module, Nederlands decimaal en foutinvoer', async () => {
  buildLive();
  const values={prijs:'',cap:'5',terug:'2.450',stroom:'0,26',netto:'0,005',dagen:'200',rend:'90',onderhoud:'0'};
  const elems=Object.fromEntries([...Object.keys(values),'form','r-jaren','r-kwh','r-geladen','r-verlies','r-zon','r-gemist','r-besp','r-noot'].map((id)=>[id,{value:values[id]??'',textContent:'',events:{},addEventListener(k,v){this.events[k]=v;}}]));
  const old=globalThis.document;
  globalThis.document={getElementById:(id)=>{assert.ok(elems[id],id);return elems[id];}};
  try {
    await import(pathToFileURL(process.cwd()+'/dist/js/terugverdientijd.js').href+'?tvt2027test');
    assert.equal(elems['r-jaren'].textContent,'Vul je totaalprijs in');
    elems.prijs.value='3.550';elems.form.events.input();
    assert.equal(elems['r-jaren'].textContent,'15,5 jaar');
    assert.match(elems['r-besp'].textContent,/229,00/);
    elems.rend.value='80';elems.form.events.change();assert.match(elems['r-besp'].textContent,/203,00/);
    elems.cap.value='0';elems.form.events.input();assert.match(elems['r-jaren'].textContent,/geen accu/);
    elems.cap.value='ongeldig';elems.form.events.input();assert.equal(elems['r-jaren'].textContent,'Controleer je invoer');
    assert.equal(elems['r-besp'].textContent,'–');
    elems.cap.value='5';elems.prijs.value='1.23x';elems.form.events.input();assert.equal(elems['r-jaren'].textContent,'Controleer je invoer');
  } finally {if(old===undefined)delete globalThis.document;else globalThis.document=old;}
});
test('2027: zichtbaar bron/aannames, lege aanschafprijs, exacte L7 en geen datumlift op onderzoek/blog', () => {
  buildLive();const h=read('dist/terugverdientijd-thuisaccu-berekenen/index.html');
  for(const text of ['<h1>Thuisbatterij terugverdientijd 2027 berekenen</h1>','id="prijs" name="prijs" value=""','rekenaannames, geen actuele aanbiedingen','geen vastgesteld','10 november 2026','CET (Europe/Amsterdam)','gemiste teruglevering','geen statistisch betrouwbaarheidsinterval','geen vaste','1 januari 2027']) assert.ok(h.toLowerCase().includes(text.toLowerCase()),text);
  const home=read('dist/index.html');
  const hub=read('dist/rekentools/index.html');
  assert.match(hub,/Bij de terugverdientijdtool zijn de ingevulde waarden rekenaannames \(geen actuele leveranciersprijs of vastgesteld 2027-tarief\)/);
  assert.match(hub,/Waar de andere tools CBS, Milieu Centraal of merkenprijzen als standaard gebruiken, staat dat bij die tool/);
  assert.doesNotMatch(hub,/Standaardwaarden komen van het CBS, Milieu Centraal en de prijzen van de merken/);
  assert.match(home,/De terugverdientijdtool vult geen leveranciersprijs in; overige standaardwaarden komen, waar dat zo is, van Milieu Centraal, het CBS of de merken en staan bij de tool/);
  assert.doesNotMatch(home,/Standaardwaarden komen van Milieu Centraal, het CBS en de prijzen van de merken/);

  assert.doesNotMatch(h,/id="dyn"|id="spread"|id="dyndagen"/);
  for(const p of [...TVT_PADEN,'/']) {
    const html=read('dist'+p+'index.html');
    assert.ok(read('dist/sitemap.xml').includes('<loc>https://thuisaccumatch.nl'+p+'</loc><lastmod>'+TVT_DATUM+'</lastmod>'),p);
    assert.match(html,new RegExp('bijgewerkt(?: op)? <time datetime="'+TVT_DATUM+'">','i'));
  }
  for(const p of [ONDERZOEK_PAD,'/blog/','/blog/thuisbatterij-dynamisch-contract/','/salderingsregeling-stopt-2027/']) assert.ok(read('dist/sitemap.xml').includes('<loc>https://thuisaccumatch.nl'+p+'</loc><lastmod>2026-11-13</lastmod>'),p);
  for(const f of ['src/lib/match.js','src/lib/kosten.js','src/lib/checklist.js','src/lib/merken.js','src/lib/partnerlinks.js']) assert.equal(read(f),execFileSync('git',['show','d08406914ff26aa215b70fe15fa77e75df67edbf:'+f],{encoding:'utf8'}),f+' matchbasis ongewijzigd');
});
