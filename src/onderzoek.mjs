import { SITE, ORG } from './layout.mjs';
export const ONDERZOEK_DATUM = '2026-11-13';
export const ONDERZOEK_PAD = '/onderzoek/thuisbatterij-dynamisch-contract-2026/';
export const ONDERZOEK_URL = SITE.domain + ONDERZOEK_PAD;
const bron = 'https://api.energyzero.nl/v1/energyprices?fromDate=2025-12-31T23:00:00.000Z&amp;tillDate=2026-10-18T21:59:59.999Z&amp;interval=4&amp;usageType=1&amp;inclBtw=false';
export const onderzoek = {
  path: ONDERZOEK_PAD, title: 'Thuisbatterij en dynamisch contract: 291 dagen data (2026)', h1: 'Thuisbatterij en dynamisch contract: 291 dagen uit 2026', crumb: 'Onderzoek uurprijzen', og: 'thuisaccu-dynamisch-energiecontract',
  description: 'Controleer onze analyse van 291 dagen uurprijzen uit 2026. Download prijsdata, scenario’s en rekencode. Met methode, afrondingsmarges en beperkingen.',
  lastmod: ONDERZOEK_DATUM, stamp: { updated: ONDERZOEK_DATUM },
  schema: [{ '@context': 'https://schema.org', '@type': 'Dataset', name: '291 dagen uurprijzen en thuisbatterij-arbitrage 2026', url: ONDERZOEK_URL,
    description: 'Historische uurprijsanalyse, geen praktijktest of voorspelling. Geen prijsdata uit 2025.', creator: ORG,
    temporalCoverage: '2026-01-01/2026-10-18', datePublished: ONDERZOEK_DATUM, dateModified: ONDERZOEK_DATUM,
    distribution: ['uurprijzen-2026.csv', 'scenarios-per-dag-2026.csv'].map((f) => ({ '@type': 'DataDownload', contentUrl: SITE.domain + '/onderzoek/data/' + f, encodingFormat: 'text/csv' })) }],
  body: `<article class="prose"><h1>Thuisbatterij en dynamisch contract: 291 dagen uit 2026</h1>
<p class="lead">Wat leverde slim laden uit het net op in onze bestaande rekensom? Hier staan de prijsdata en berekening achter het dynamisch-contractartikel, zonder merken, partnerlinks of verkoopadvies.</p>
<p><strong>Meetperiode: 1 januari tot en met 18 oktober 2026 (291 Nederlandse kalenderdagen).</strong> Er zijn in dit onderzoek <strong>geen gegevens uit 2025</strong>. We vullen ontbrekende jaren niet in. Dit is een historische modelberekening, geen gemeten batterijopbrengst en geen prognose voor 2027.</p>
<h2>Drie bevindingen, met hun onzekerheid</h2>
<ol><li><strong>Gemiddelde beursprijs: € 0,1118 per kWh</strong>, exclusief btw en energiebelasting. Afrondingsmarge: maximaal € 0,00005 per kWh. Dit is geen onzekerheidsinterval voor toekomstige prijzen of voor een eigen contract. De dagspreiding was gemiddeld € 0,157 (mediaan € 0,152); beide afgerond op € 0,001 per kWh, marge maximaal € 0,0005.</li>
<li><strong>391 uurprijzen waren negatief.</strong> Dit is een exacte telling in het bewaarde uurbestand (telmarge 0 uur), niet een telling van negatieve kwartieren en niet noodzakelijk een negatieve consumentenprijs. Een foutmarge voor de juistheid van de bron is niet bekend.</li>
<li><strong>5 kWh / 2,5 kW: hooguit € 234 bij eigen gebruik, € 54 bij terugleveren</strong> in deze 291 dagen. Afrondingsmarge maximaal € 0,50 per totaal. Dit is geen jaaropbrengst. De praktische afwijking is niet gekwantificeerd: verbruik, leveranciersopslag, sturing en slijtage ontbreken. Er is geen statistisch betrouwbaarheidsinterval; de bovengrens is geen opbrengstbelofte.</li></ol>
<h2>Scenario’s naast geen accu</h2>
<p>Geen accu is de referentie: € 0 extra arbitragevoordeel. Dit zegt niets over de totale energierekening. De twee waarderingen hieronder zijn alternatieven; tel ze niet op.</p>
<div class="table-wrap"><table class="data stack"><thead><tr><th scope="col">Scenario</th><th scope="col">Zelf gebruiken</th><th scope="col">Terugleveren</th></tr></thead><tbody>
<tr><th scope="row">Geen accu</th><td data-l="Zelf gebruiken">€ 0</td><td data-l="Terugleveren">€ 0</td></tr>
<tr><th scope="row">Kleine stekkeraccu: 2,7 kWh, 0,8 kW</th><td data-l="Zelf gebruiken">€ 105</td><td data-l="Terugleveren">€ 21</td></tr>
<tr><th scope="row">Vaste accu: 5 kWh, 2,5 kW</th><td data-l="Zelf gebruiken">€ 234</td><td data-l="Terugleveren">€ 54</td></tr>
<tr><th scope="row">Vaste accu: 10 kWh, 5 kW</th><td data-l="Zelf gebruiken">€ 468</td><td data-l="Terugleveren">€ 108</td></tr></tbody></table></div>
<p>Dit zijn rekenconfiguraties uit het oorspronkelijke onderzoek, geen producttests. Aanschaf en installatie zijn niet verwerkt; uit deze tabel volgt geen terugverdientijd.</p>
<h2>Downloads en controle</h2>
<ul><li><a href="/onderzoek/data/uurprijzen-2026.csv" download>Uurprijzen per Nederlandse dag (CSV)</a>: UTC-tijd, tijd met Amsterdamse UTC-offset, lokale datum en kale beursprijs in euro per kWh.</li>
<li><a href="/onderzoek/data/scenarios-per-dag-2026.csv" download>Berekening per dag en scenario (CSV)</a>: aantal uren, capaciteit, vermogen, waardering en voordeel tegenover geen accu. Punt als decimaalteken; geen aankoopprijzen.</li>
<li><a href="/onderzoek/data/rekenpakket-2026.zip" download>Oorspronkelijke invoer, rekencode en resultaten (ZIP)</a>. Pak uit en draai <code>python3 bereken.py</code> (Python 3.9+ met tijdzonedatabase). Geen internet nodig voor de berekening. Het ophaalscript is alleen ter documentatie: opnieuw ophalen kan andere brondata geven.</li>
<li><a href="/onderzoek/data/manifest.json">SHA-256-controlesommen</a> van de downloads en het oorspronkelijke prijsbestand.</li></ul>
<h2 id="methode">Methode: stap voor stap reproduceerbaar</h2>
<ol><li><strong>Invoer.</strong> Het bewaarde JSON-bestand van de openbare EnergyZero-API met <code>interval=4</code>, <code>usageType=1</code>, <code>inclBtw=false</code>. Het oorspronkelijke ophaalscript neemt ruime tijdgrenzen; de CSV en berekening filteren op 1 januari tot en met 18 oktober in Europe/Amsterdam. De bronlink hieronder gebruikt <code>fromDate=2025-12-31T23:00:00.000Z</code>: dat is 00:00 op 1 januari 2026 in Europe/Amsterdam, niet middernacht UTC. Geen ontbrekende prijzen ingevuld.</li>
<li><strong>Dagen.</strong> Sorteer de tijdstippen, zet UTC om naar Europe/Amsterdam en groepeer per kalenderdag. Het bestaande script neemt dagen met minstens 23 uur op: de zomertijdwissel telt 23 uur. Deze snapshot is afzonderlijk gecontroleerd op ontbrekende of dubbele uren; de 291 dagen zijn compleet.</li>
<li><strong>Accu.</strong> Begin en eindig elke dag leeg. Verdeel de capaciteit in <code>ceil(capaciteit / vermogen)</code> gelijke laadblokken; één blok laden of ontladen per uur, of niets doen. Daardoor is het effectieve laadvermogen bij 2,7 kWh / 0,8 kW afgerond naar beneden. Meerdere rondes per dag mogen.</li>
<li><strong>Kosten.</strong> Laden: blok × (beursprijs + € 0,09161 energiebelasting per kWh) × 1,21. Energiebelasting is het gebruikte tarief uit 2026, niet een vastgesteld tarief voor 2027.</li>
<li><strong>Waarde.</strong> Ontladen: blok × 90% rendement × (beursprijs + energiebelasting) × 1,21 bij zelf gebruiken. Bij handel: blok × 90% × kale beursprijs, zonder energiebelastingteruggave en zonder btw-verrekening. Dat is een modelvariant zonder saldering, niet ieders afrekening in 2026.</li>
<li><strong>Optimalisatie.</strong> Dynamisch programmeren bewaart per uur en vullingsniveau het hoogste saldo. Kies het hoogste saldo dat eindigt met een lege batterij, minimaal nul. Het scenario zonder accu doet niets en blijft nul. Sommeer de dagwaarden; rond het totaal pas aan het einde af op hele euro’s. De CSV bewaart negen decimalen; optellen kan daardoor een minieme afrondingsafwijking geven.</li></ol>
<h2>Wat de analyse niet bewijst</h2>
<p>Perfecte voorkennis van alle uurprijzen en voldoende eigen verbruik tijdens ieder ontlaaduur maken dit een bovengrens. Geen zonnepanelenprofiel, kwartierprijzen, degradatie, stand-byverbruik, vermogensbeperkingen van het huis, leveranciersopslag, vaste kosten, onbalansvergoedingen, aanschafprijs of fiscale individuele situatie. De 90% is een modelaanname, geen gemeten rendement. Een negatieve uurprijs is niet automatisch gratis laden na belastingen. De uitkomsten zijn niet naar een volledig jaar geëxtrapoleerd.</p>
<p>Vanaf 1 januari 2027 stopt salderen volgens de Rijksoverheid. Daardoor is een berekening zonder saldering relevant, maar de oude prijsdata voorspellen geen 2027-tarieven. De <a href="/terugverdientijd-thuisaccu-berekenen/">terugverdientijdtool</a> is een andere, vereenvoudigde jaarberekening met eigen aannames; tel de historische arbitragecijfers daar niet automatisch bij op.</p>
<h2>Bronnen en controledatum</h2>
<p>Gecontroleerd op <strong>10 november 2026, CET (Europe/Amsterdam)</strong>: bestaand bronbestand en rekenscript opnieuw doorgerekend; de API-steekproef voor 1 januari komt overeen. Dit is geen nieuwe download van de hele meetperiode. Prijsdata oorspronkelijk gebruikt in het artikel van 19 oktober 2026.</p>
<ul><li><a href="${bron}" rel="noopener">EnergyZero: openbare uurprijs-API</a> (prijzen zonder btw en energiebelasting).</li>
<li><a href="https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/overige_belastingen/belastingen_op_milieugrondslag/energiebelasting/energiebelasting" rel="noopener">Belastingdienst: energiebelasting 2026</a> (€ 0,09161 per kWh in de eerste twee verbruiksschijven).</li>
<li><a href="https://www.rijksoverheid.nl/themas/klimaat-milieu-en-natuur/energie-thuis/salderingsregeling" rel="noopener">Rijksoverheid: einde salderen per 1 januari 2027</a>.</li>
<li>De oorspronkelijke <a href="/blog/thuisbatterij-dynamisch-contract/">toelichting op het dynamische contract</a> bevat de context bij het onderzoek.</li></ul>
<h2>Citeer dit onderzoek</h2>
<blockquote>Redactie ThuisaccuMatch, “Thuisbatterij en dynamisch contract: 291 dagen uit 2026”. Meetperiode 1 januari–18 oktober 2026; controle 10 november 2026 (CET). Historische modelberekening, geen praktijktest. Vaste bron: <a href="${ONDERZOEK_URL}">${ONDERZOEK_URL}</a>.</blockquote>
<p>Versie: brondata bevroren; controlesommen bij de downloads. Een volgende editie wordt afzonderlijk gedateerd. Er zijn op deze datapagina geen partnerlinks of commerciële aanbevelingen.</p></article>`,
};
