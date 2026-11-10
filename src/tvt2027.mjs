import { SITE, ORG } from './layout.mjs';
import { bereken2027, TVT2027, SCENARIOS2027 } from './lib/tvt2027.js';
import { ONDERZOEK_PAD } from './onderzoek.mjs';
export const TVT_DATUM = '2026-11-16';
export const TVT_PADEN = new Set(['/terugverdientijd-thuisaccu-berekenen/', '/rekentools/', '/gidsen/']);
const geld = (v) => '€ ' + v.toLocaleString('nl-NL', {minimumFractionDigits:2,maximumFractionDigits:2});
const dec = (v) => v.toLocaleString('nl-NL',{maximumFractionDigits:1});
const jaren = (r) => r.jaren == null ? 'Niet van toepassing' : dec(r.jaren) + ' jaar';
const veld = (id, label, waarde, eenheid, hint) => `<div class="field"><label for="${id}">${label}</label><div class="inline"><input type="text" inputmode="decimal" id="${id}" name="${id}" value="${waarde}"><span class="unit">${eenheid}</span></div><span class="hint">${hint}</span></div>`;
const rijen = SCENARIOS2027.map((x) => {
  const r = bereken2027(x);
  const laag = bereken2027({...x, dagen:TVT2027.dagen * 0.8});
  const hoog = bereken2027({...x, dagen:TVT2027.dagen * 1.2});
  return `<tr><th scope="row">${x.naam}</th><td data-l="Totaalprijs-aanname">${geld(x.prijs)}</td><td data-l="Bruikbare capaciteit">${dec(x.capaciteit)} kWh</td><td data-l="Uit de accu">${dec(r.geleverd)} kWh</td><td data-l="Netto jaarvoordeel">${geld(r.besparing)}</td><td data-l="Terugverdientijd">${jaren(r)}</td><td data-l="Gevoeligheid 160–240 dagen">${x.capaciteit ? dec(hoog.jaren) + '–' + dec(laag.jaren) + ' jaar' : 'Niet van toepassing'}</td></tr>`;
}).join('');
export const calcTvt2027 = {
  path:'/terugverdientijd-thuisaccu-berekenen/', title:'Thuisbatterij terugverdientijd 2027 berekenen', h1:'Thuisbatterij terugverdientijd 2027 berekenen', crumb:'Terugverdientijd 2027', parents:[['/rekentools/','Rekentools']], navPath:'/rekentools/', og:'rekenhulp',
  description:'Bereken de terugverdientijd van je thuisbatterij vanaf 2027, zonder salderen. Met je eigen totaalprijs, zichtbare aannames, verliezen en drie scenario’s.',
  lastmod:TVT_DATUM, stamp:{updated:TVT_DATUM}, scripts:['/js/terugverdientijd.js'],
  schema:[{'@context':'https://schema.org','@type':'WebApplication',name:'Thuisbatterij terugverdientijd 2027 berekenen',applicationCategory:'UtilitiesApplication',operatingSystem:'Web',url:SITE.domain+'/terugverdientijd-thuisaccu-berekenen/',publisher:ORG,offers:{'@type':'Offer',price:'0',priceCurrency:'EUR'},dateModified:TVT_DATUM}],
  body:`<article class="prose"><h1>Thuisbatterij terugverdientijd 2027 berekenen</h1>
<p class="lead">Vanaf 1 januari 2027 stopt de salderingsregeling. Bereken hier of extra eigen zonnestroomgebruik je investering terugverdient. Gebruik je eigen offerte en contract: de ingevulde rekenwaarden zijn <strong>aannames, geen vastgestelde tarieven voor 2027</strong>.</p>
<p>Vergelijk direct <a href="#scenarios">geen accu, een kleine stekkeraccu en een vaste accu</a>. Voor de interactieve terugverdientijd staat de aanschafprijs bewust leeg: een actuele totaalprijs inclusief installatie, accessoires en btw is niet door ons vastgesteld.</p>
<div class="grid calc"><form class="calc-form card" id="form" novalidate>
${veld('prijs','Totaalprijs inclusief installatie, accessoires en btw','','€','Eigen offerte. Geen leveranciersprijs vooraf ingevuld; leeg = geen terugverdientijd.')}
${veld('cap','Bruikbare capaciteit',5,'kWh','Rekenaanname; neem de bruikbare waarde uit je offerte of datasheet.')}
${veld('terug','Zonnestroom teruggeleverd zonder accu per jaar',2450,'kWh','Rekenaanname; vervang door je eigen jaarafrekening, niet je totale opwek.')}
${veld('stroom','Vermeden inkoopprijs inclusief belastingen','0,26','€ per kWh','Rekenaanname, geen bevestigd 2027-tarief; gebruik je contract.')}
${veld('netto','Netto terugleververgoeding na variabele terugleverkosten','0,005','€ per kWh','Rekenaanname, geen gegarandeerde minimumvergoeding; gebruik je contract.')}
${veld('dagen','Volle equivalente laadcycli per jaar',200,'cycli','Rekenaanname: 0–365, maximaal één volle cyclus per dag in dit jaarmodel.')}
${veld('rend','Rendement heen en terug',90,'%','Rekenaanname, niet gemeten. Het verlies telt ook mee als gemiste teruglevering.')}
${veld('onderhoud','Extra jaarlijkse kosten',0,'€ per jaar','Rekenaanname: 0. Voeg eigen onderhoud, abonnement of extra vaste kosten toe.')}
</form><aside class="card result" aria-live="polite" id="result"><h2>Jouw uitkomst</h2><p class="big" id="r-jaren">Vul je totaalprijs in</p>
<table class="kv"><tbody><tr><td>Zonnestroom geladen</td><td id="r-geladen">1.000 kWh</td></tr><tr><td>Uit de accu gebruikt</td><td id="r-kwh">900 kWh</td></tr><tr><td>Verlies</td><td id="r-verlies">100 kWh</td></tr><tr><td>Vermeden inkoop</td><td id="r-zon">€ 234,00</td></tr><tr><td>Gemiste netto vergoeding</td><td id="r-gemist">€ 5,00</td></tr><tr><td>Netto jaarvoordeel</td><td id="r-besp">€ 229,00</td></tr></tbody></table><p class="src" id="r-noot">Indicatief jaarmodel zonder saldering. Geen vaste arbitrage-opbrengst opgeteld.</p></aside></div>
<noscript><p>De interactieve berekening werkt met JavaScript. De reproduceerbare voorbeelden en formules hieronder zijn ook zonder JavaScript leesbaar.</p></noscript>
<h2 id="methode">Zo rekenen we: verlies en gemiste teruglevering apart</h2>
<ol><li><strong>Geladen zonnestroom Q</strong> = minimum(jaarlijkse teruglevering zonder accu, bruikbare capaciteit × equivalente cycli).</li><li><strong>Uit de accu gebruikt</strong> = Q × rendement. We nemen aan dat je deze stroom helemaal zelf kunt gebruiken; zonder uurprofiel is dat niet bewezen.</li><li><strong>Netto jaarvoordeel</strong> = Q × rendement × inkoopprijs − Q × netto terugleververgoeding − extra jaarlijkse kosten. Ook de verloren kWh zou je zonder accu hebben teruggeleverd: daarom trekken we de vergoeding over Q af, niet alleen over de geleverde kWh.</li><li><strong>Eenvoudige terugverdientijd</strong> = totaalprijs / netto jaarvoordeel. Geen positieve besparing of geen totaalprijs: geen eindige uitkomst. Geen accu: niet van toepassing. Een uitkomst langer dan de levensduur betekent niet dat de accu zichzelf echt terugverdient.</li></ol>
<p>Voorbeeld vaste accu: minimum(2.450, 5 × 200) = 1.000 kWh geladen; 900 kWh gebruikt; 100 kWh verlies. 900 × € 0,26 − 1.000 × € 0,005 − € 0 = € 229,00 per jaar. Totaalprijs-aanname € 3.550 / € 229 = 15,5 jaar, afgerond op één decimaal.</p>
<h2 id="scenarios">Drie reproduceerbare scenario’s vanaf 2027</h2>
<p><strong>Alle bedragen in deze tabel zijn rekenaannames, geen actuele aanbiedingen of marktprijzen.</strong> De totaalprijs-aanname omvat voor de som installatie, accessoires en btw; er is niet vastgesteld dat je daarvoor een complete installatie kunt kopen. Geen subsidie of btw-teruggave ingerekend. De capaciteiten zijn ook scenario-aannames; er staat geen merkadvies in deze tabel.</p>
<div class="table-wrap"><table class="data stack"><thead><tr><th scope="col">Scenario</th><th scope="col">Totaalprijs-aanname</th><th scope="col">Bruikbare capaciteit</th><th scope="col">Uit de accu per jaar</th><th scope="col">Netto jaarvoordeel</th><th scope="col">Terugverdientijd</th><th scope="col">Gevoeligheid</th></tr></thead><tbody>${rijen}</tbody></table></div>
<p><strong>Onzekerheidsmarge als gevoeligheid, niet als voorspelling:</strong> de laatste kolom varieert alleen 200 equivalente cycli met −20% en +20% (160–240). Die band is een gekozen aanname, geen statistisch betrouwbaarheidsinterval. Tarieven, eigen verbruik en levensduur kunnen méér afwijken. We rekenen zonder tussentijds afronden; geld op centen, jaren op één decimaal.</p>
<h2 id="aannames">Elke aanname, herkomst en controle</h2>
<p>Model en onderstaande aannames gecontroleerd op <strong>10 november 2026, CET (Europe/Amsterdam)</strong>. Er is geen bron die deze waarden voor jouw huis of voor 2027 vastlegt. <a href="#methode">Bron van de rekenaannames: onze expliciete modelkeuze</a>; je kunt alle interactieve waarden aanpassen.</p>
<ul><li>Prijs: eigen offerte; standaard niet vermeld. Scenario’s € 0 / € 1.195 / € 3.550: uitsluitend totaalprijs-aannames, overgenomen als rekengetallen uit de eerdere tool, niet opnieuw bevestigd als leveranciersprijs.</li>
<li>Capaciteit 0 / 2,7 / 5 kWh en 2.450 kWh jaarlijkse teruglevering: scenario-aannames, geen gemeten huis.</li>
<li>Inkoop € 0,26 en netto vergoeding € 0,005 per kWh: rekenaannames uit de eerdere tool, niet als 2027-contract bevestigd. Het wettelijke minimum betreft de bruto vergoeding vóór kosten en legt deze netto aanname niet vast.</li>
<li>200 equivalente cycli, 90% rendement, volledig eigen gebruik van de ontladen stroom en € 0 extra jaarlijkse kosten: modelaannames; geen bron of meting die deze voor jouw accu bevestigt.</li>
<li>160–240 cycli: gekozen gevoeligheid van ±20%; geen kansverdeling of garantie.</li></ul>
<h2 id="salderen">Bevestigd: salderen stopt op 1 januari 2027</h2>
<p>De Rijksoverheid bevestigt dat je vanaf die datum opgewekte en teruggeleverde stroom niet meer mag wegstrepen tegen je verbruik. Tot 2030 moet de terugleververgoeding minimaal 50% van het kale leveringstarief zijn. Leveranciers mogen daarnaast terugleverkosten rekenen. Dit bepaalt niet je uiteindelijke netto vergoeding. Bron gecontroleerd op 10 november 2026 (CET): <a href="https://www.rijksoverheid.nl/themas/klimaat-milieu-en-natuur/energie-thuis/salderingsregeling" rel="noopener">Rijksoverheid: salderingsregeling</a>.</p>
<h2>Waarom geen vaste opbrengst uit dynamische handel erbij?</h2>
<p>Hetzelfde accuvermogen en dezelfde laaduren kun je niet onbeperkt twee keer inzetten. Deze tool rekent alleen met verschoven zonnestroom, niet met netladen of saldering. Een dynamisch contract vraagt uur- of kwartiertarieven en je eigen afnameprofiel; één gemiddelde inkoopprijs kan dat niet exact nabootsen. Het <a href="${ONDERZOEK_PAD}">onderzoek met 291 dagen uurprijzen en downloadbare CSV</a> laat de historische arbitrageberekening met zijn eigen beperkingen zien. Tel die uitkomsten niet bij deze jaarbesparing op.</p>
<h2>Wat nog niet in dit model zit</h2>
<p>Geen degradatie of vervanging, financiering, rente, inflatie, veranderingen in tarieven, vast terugleverkostenstaffelvoordeel, kwartierprofiel, winteroverschot per dag of vermogensgrens. Bij weinig eigen avondverbruik valt de besparing lager uit. Vraag een installateur om de bruikbare capaciteit en complete prijs; controleer de levensduur in de productdocumentatie. Deze eenvoudige terugverdientijd is geen netto-contantewaardeberekening.</p>
<p>Meer context: <a href="/thuisaccu-terugverdientijd/">verdien je een thuisaccu terug?</a> en de <a href="/salderingsregeling-stopt-2027/">uitleg over het einde van salderen</a>. Voor de maat is er de <a href="/capaciteit-thuisaccu-berekenen/">capaciteitstool</a>.</p></article>`,
};
