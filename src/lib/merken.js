// Merkdata thuisaccu's. Alleen feiten van de eigen site van het merk (of een officieel datasheet of garantiedocument), met bron en controledatum.
// Geen reviews, geen sterren, geen verzonnen ervaringen. Partnerlinks spelen hier geen rol.
export const CHECKED = '2026-10-18';

// Bronnen per merk (één plek, zodat checklist en pagina's dezelfde URL gebruiken).
export const S = {
  hwBat: 'https://www.homewizard.com/nl/plug-in-battery/',
  hwGarantie: 'https://helpdesk.homewizard.com/nl/articles/12683881-hoe-zit-het-met-garantie-op-de-plug-in-battery',
  seHome: 'https://www.sessy.nl/',
  sePrijs: 'https://www.sessy.nl/prijsinformatie',
  seSpecs: 'https://www.sessy.nl/specificaties',
  zpHome: 'https://www.zonneplan.nl/thuisbatterij',
  zpKosten: 'https://www.zonneplan.nl/thuisbatterij/kosten',
  huLuna: 'https://solar.huawei.com/nl/products/luna2000-7-14-21-s1/',
  huSpecs: 'https://solar.huawei.com/nl/products/luna2000-7-14-21-s1/specs/',
  sdNl: 'https://www.solaredge.com/nl/producten/thuis/batterijen',
  sdDyn: 'https://marketing.solaredge.com/nl/dynamisch-tarief',
  sd48: 'https://www.solaredge.com/en/products/residential/storage-and-backup/solaredge-home-battery-48v',
  bydDs: 'https://bydbatterybox.com/uploads/downloads/BCU2.0_BBOX_HVS_Datasheet_EN_V1.0_250328-67ee42d4ced21.pdf',
  bydGarantie: 'https://bydbatterybox.com/uploads/downloads/BYD%20Battery-Box%20Premium%20HVS&HVM%20Limited%20Warranty-Europe-EN%20V1.2-61a729716cbb5.pdf',
};

export const MERKEN = {
  homewizard: {
    naam: 'HomeWizard', slug: 'homewizard', url: 'https://www.homewizard.com/nl/plug-in-battery/', soort: 'stekker',
    kort: 'Nederlands merk met een stekkerbatterij van 2,7 kWh die je zelf in het stopcontact steekt. Werkt samen met de HomeWizard P1 Meter.',
    lijnen: [['Plug-In Battery', '2,7 kWh, 800 watt laden en ontladen, eigen micro-omvormer'], ['Tot 4 batterijen', '10,8 kWh; boven één batterij adviseert HomeWizard een aparte groep voor meer vermogen'], ['P1 Meter', 'Apart nodig: meet via je slimme meter wat je afneemt en teruglevert']],
    prijzen: [['Plug-In Battery (2,7 kWh)', '€ 1.195', 'Per batterij, geen installatiekosten; P1 Meter apart'], ['Swap Service jaar 3 tot 7', '€ 329', 'Vervanging bij een defect na de fabrieksgarantie']],
    plus: ['Zelf aan te sluiten op een stopcontact, zonder installateur', 'Werkt met alle merken zonnepanelen en omvormers', 'Prijs op de site: € 1.195 per batterij'],
    min: ['Twee jaar fabrieksgarantie; daarna een Swap Service voor € 329', 'Kleine capaciteit per batterij (2,7 kWh) en 800 watt per batterij op een stopcontact'],
    voor: 'Wie een kleine batterij zoekt zonder installateur, bij weinig tot gemiddeld overschot aan zonnestroom.',
    bronnen: [['HomeWizard Plug-In Battery', S.hwBat], ['HomeWizard: garantie Plug-In Battery', S.hwGarantie]],
  },
  sessy: {
    naam: 'Sessy', slug: 'sessy', url: 'https://www.sessy.nl/', soort: 'vast',
    kort: 'Nederlandse thuisbatterij uit Andelst van 5, 10 of 15 kWh die op je bestaande omvormer en groep past. Adviesprijzen staan op de site.',
    lijnen: [['Sessy 5 kWh', 'Volgens Sessy voor zo’n 3.000 kWh verbruik per jaar'], ['Sessy 10 kWh', 'Volgens Sessy vanaf 5.000 kWh verbruik per jaar'], ['Sessy 15 kWh (Plus)', 'Met noodstroom ingebouwd; op order gebouwd']],
    prijzen: [['Sessy 5 kWh', '€ 3.550', 'Adviesprijs inclusief btw'], ['Sessy 10 kWh', '€ 5.500', 'Adviesprijs inclusief btw'], ['Sessy 15 kWh', '€ 9.400', 'Adviesprijs inclusief btw']],
    plus: ['Past op je bestaande omvormer: geen hybride omvormer nodig', '10 jaar garantie op de batterij en 6.000 cycli of meer', 'Adviesprijzen inclusief btw op de site'],
    min: ['Omvormer 5 jaar garantie (batterij 10 jaar)', 'Noodstroom alleen met een uitbreiding door een installatiepartner, behalve bij de 15 kWh'],
    voor: 'Wie zonnepanelen heeft en een vaste batterij wil die op de bestaande installatie past, met prijzen vooraf.',
    bronnen: [['Sessy prijsinformatie', S.sePrijs], ['Sessy specificaties', S.seSpecs], ['Sessy', S.seHome]],
  },
  zonneplan: {
    naam: 'Zonneplan', slug: 'zonneplan', url: 'https://www.zonneplan.nl/thuisbatterij', soort: 'vast',
    kort: 'Nederlandse energieleverancier en installateur met eigen thuisbatterijen van 10 tot 35 kWh, inclusief installatie door eigen monteurs.',
    lijnen: [['Thuisbatterij 10 en 15 kWh', 'Volgens Zonneplan geschikt voor een 1-fase-aansluiting'], ['Thuisbatterij 20 tot 35 kWh', 'Stapelbaar met modules'], ['Noodstroom', 'Optie voor € 250 extra']],
    prijzen: [['10 kWh', '€ 4.690', 'Inclusief installatie, na teruggave van de btw'], ['20 kWh', '€ 7.290', 'Inclusief installatie, na teruggave van de btw'], ['35 kWh', '€ 9.090', 'Inclusief installatie, na teruggave van de btw']],
    plus: ['Prijzen inclusief installatie op de site', 'Productgarantie 10 jaar of 6.000 cycli, minimaal 70% capaciteit', 'Werkt volgens Zonneplan met vaste, variabele en dynamische contracten'],
    min: ['De prijzen op de site zijn na teruggave van de btw; zonder teruggave betaal je 21% meer', 'Noodstroom kost € 250 extra'],
    voor: 'Wie een grote batterij (10 kWh of meer) wil met installatie in één prijs.',
    bronnen: [['Zonneplan thuisbatterij', S.zpHome], ['Zonneplan: kosten thuisbatterij', S.zpKosten]],
  },
  huawei: {
    naam: 'Huawei', slug: 'huawei', url: 'https://solar.huawei.com/nl/', soort: 'vast',
    kort: 'Chinees merk met de LUNA2000-S1: batterijmodules van 5 en 6,9 kWh, samen tot 20,7 kWh, voor binnen of buiten. Je koopt via een installateur.',
    lijnen: [['LUNA2000-5-E1', 'Batterijmodule van 5 kWh'], ['LUNA2000-7-E1', 'Batterijmodule van 6,9 kWh'], ['Powermodule LUNA2000-10KW-C1', 'Tot 3 batterijmodules, maximaal 10,5 kW']],
    plus: ['Modules van 5 en 6,9 kWh te combineren tot 20,7 kWh', 'Volgens Huawei geschikt voor binnen en buiten, –20 °C tot +55 °C', 'FusionSolar-app'],
    min: ['Geen consumentenprijzen op de site', 'Noodstroom met een extra Huawei-product (Smart Guard)'],
    voor: 'Wie een modulaire batterij zoekt die buiten mag staan, via een installateur.',
    bronnen: [['Huawei LUNA2000-S1', S.huLuna], ['Huawei LUNA2000-S1 specificaties', S.huSpecs]],

    // Extra merkuitleg, gecontroleerd 23-10-2026 op de product- en specificatiepagina van solar.huawei.com/nl.
    extraChecked: '2026-10-23',
    extra: `<h2>Welke combinatie: capaciteit en vermogen</h2><p>Een LUNA2000-S1 bestaat uit één powermodule met 1 tot 3 batterijmodules van 5 of 6,9 kWh. Je mag ze mengen. Dit zijn de combinaties volgens het specificatieblad van Huawei:</p><div class="table-wrap"><table class="data stack"><thead><tr><th scope="col">Batterijmodules</th><th scope="col">Bruikbare energie</th><th scope="col">Max. laden en ontladen</th><th scope="col">Gewicht met vloerstandaard</th></tr></thead><tbody><tr><th scope="row">1 (5 of 7)</th><td data-l="Bruikbaar">5 of 6,9 kWh</td><td data-l="Vermogen">3,5 kW</td><td data-l="Gewicht">80 kg</td></tr><tr><th scope="row">2 (5+5, 5+7, 7+7)</th><td data-l="Bruikbaar">10, 11,9 of 13,8 kWh</td><td data-l="Vermogen">7 kW</td><td data-l="Gewicht">148 kg</td></tr><tr><th scope="row">3 (5+5+5 tot 7+7+7)</th><td data-l="Bruikbaar">15, 16,9, 18,8 of 20,7 kWh</td><td data-l="Vermogen">10,5 kW</td><td data-l="Gewicht">216 kg</td></tr></tbody></table></div><p>Huawei meet de bruikbare energie bij 100% ontlaaddiepte aan het begin van de levensduur. Volgens Huawei kun je later een module bijplaatsen zonder die vooraf te laden of te kalibreren. Hoeveel kWh jij nodig hebt, reken je uit met de <a href="/capaciteit-thuisaccu-berekenen/">capaciteitsberekening</a>.</p>
<h2>Past hij bij je omvormer?</h2><p>De LUNA2000-S1 is een DC-gekoppelde batterij: hij werkt met een Huawei-omvormer. Huawei noemt onder meer de SUN2000-L1, -LB0 en -LC0 (1-fase) en de SUN2000-M1, -MAP0 en -MB0 (3-fase) als compatibel. Heb je zonnepanelen met een omvormer van een ander merk, dan past deze accu daar niet zomaar op. Het verschil lees je in <a href="/stekkerbatterij-of-vaste-thuisaccu/">AC- of DC-gekoppeld</a>.</p>
<h2>Plaatsing: binnen of buiten</h2><ul><li><strong>Buiten wordt aanbevolen</strong> door Huawei; voor binnen verwijst Huawei naar de handleiding.</li><li><strong>Weer:</strong> IP66 en een bedrijfstemperatuur van –20 °C tot +55 °C. Bij kou start de accu zelf de celverwarming.</li><li><strong>Geluid:</strong> minder dan 29 dB op 1 meter, zonder ventilator (natuurlijke koeling).</li><li><strong>Maat:</strong> 59 cm breed en 25,5 cm diep; met drie modules 123 cm hoog. Standaard op een vloerstandaard, aan de wand kan met een muurbeugel.</li></ul><p>Meer over een veilige plek lees je in <a href="/thuisaccu-veiligheid/">een thuisaccu veilig plaatsen</a>.</p>
<h2>Instellingen in de app</h2><p>In de FusionSolar-app kies je volgens Huawei tussen drie standen: laden en ontladen op tijd (TOU), maximaal eigen verbruik en volledige teruglevering aan het net. Met een dynamisch contract is de tijdstand het interessantst; zie <a href="/thuisaccu-dynamisch-energiecontract/">thuisaccu met een dynamisch contract</a>.</p>`,
    faq: [['Hoeveel kWh kan een Huawei LUNA2000-S1 opslaan?', 'Van 5 kWh (één module) tot 20,7 kWh bruikbaar (drie modules van 6,9 kWh) per systeem. Met de omvormer SUN2000-MB0 kunnen volgens Huawei tot 4 systemen parallel werken.'], ['Kan ik een Huawei-accu op mijn bestaande omvormer aansluiten?', 'Alleen als dat een compatibele Huawei-omvormer is, zoals de SUN2000-L1 of -MAP0. Bij een omvormer van een ander merk past een AC-gekoppelde accu meestal beter.'], ['Wat kost een Huawei thuisaccu?', 'Huawei noemt geen consumentenprijzen. Je koopt via een installateur; vraag in de offerte naar de bruikbare kWh, zodat je de prijs per kWh kunt vergelijken.']],
  },
  solaredge: {
    naam: 'SolarEdge', slug: 'solaredge', url: 'https://www.solaredge.com/nl/producten/thuis/batterijen', soort: 'vast',
    kort: 'Israëlisch merk met de SolarEdge Home Battery, die werkt met een SolarEdge-omvormer. Je koopt via een installateur.',
    lijnen: [['Home Battery 48V (3-fase)', 'Tot 4,85 kWh per module, vijf modules: 23 kWh'], ['Home Battery 400V (1-fase)', 'Tot 9,7 kWh, drie stuks: 29,1 kWh'], ['Backup Interface', 'Voor volledige of gedeeltelijke back-up']],
    plus: ['10 jaar garantie (Home Battery 48V)', 'Tot 23 kWh (3-fase) of 29,1 kWh (1-fase)', 'Energiebeheer met stroomtarieven via SolarEdge ONE'],
    min: ['Werkt met een SolarEdge Home Hub- of Home Wave-omvormer', 'Noodstroom alleen met de Backup Interface'],
    voor: 'Wie al een SolarEdge-installatie heeft of zonnepanelen en batterij tegelijk laat plaatsen.',
    bronnen: [['SolarEdge Home thuisbatterijen', S.sdNl], ['SolarEdge Home Battery 48V', S.sd48]],
  },
  byd: {
    naam: 'BYD', slug: 'byd', url: 'https://bydbatterybox.com/', soort: 'vast',
    kort: 'Chinees merk met de Battery-Box Premium HVS: hoogspanningsbatterij van 5,12 tot 12,8 kWh, voor een compatibele hybride omvormer van een ander merk.',
    lijnen: [['Battery-Box Premium HVS 5.1 tot 12.8', '2 tot 5 modules van 2,56 kWh'], ['Drie HVS 12.8 parallel', 'Tot 38,4 kWh']],
    plus: ['LFP-cellen (lithium-ijzerfosfaat)', '10 jaar garantie volgens het garantiedocument', 'Modulair: 2 tot 5 modules, tot 38,4 kWh'],
    min: ['Geen consumentenprijzen op de site', 'Werkt alleen met een compatibele hybride omvormer'],
    voor: 'Wie via een installateur een batterij wil die past bij een hybride omvormer van een ander merk.',
    bronnen: [['BYD Battery-Box Premium HVS datasheet', S.bydDs], ['BYD Battery-Box Premium garantie (Europa)', S.bydGarantie]],
  },
};
export const IDS = Object.keys(MERKEN);

/** Waar het merk volgens de eigen site in uitblinkt (korte, feitelijke typering, geen oordeel). */
export const STERK_IN = {
  homewizard: 'Stekkerbatterij', sessy: 'Past op bestaande omvormer', zonneplan: 'Groot, met installatie',
  huawei: 'Modulair, ook buiten', solaredge: 'Bij een SolarEdge-omvormer', byd: 'Voor een hybride omvormer',
};

export const FEATURES = {
  homewizard: {
    stekker: { v: 'ja', t: 'Stekker in een bestaand stopcontact', s: S.hwBat },
    bestaand: { v: 'ja', t: 'Werkt met alle merken zonnepanelen en omvormers', s: S.hwBat },
    lfp: { v: 'ja', t: 'Lithium-ijzerfosfaatcellen (LFP)', s: S.hwBat },
    modulair: { v: 'ja', t: 'Tot 4 batterijen', s: S.hwBat },
    groot: { v: 'ja', t: '4 batterijen: 10,8 kWh', s: S.hwBat },
    noodstroom: { v: null },
    app: { v: 'ja', t: 'HomeWizard Energy-app', s: S.hwBat },
    dynamisch: { v: 'ja', t: 'Slim laden op de actuele stroomprijs', s: S.hwBat },
    garantie: { v: 'nee', t: '2 jaar fabrieksgarantie; jaar 3 tot 7 Swap Service voor € 329', s: S.hwGarantie },
    prijs: { v: 'ja', t: '€ 1.195 per batterij', s: S.hwBat },
  },
  sessy: {
    stekker: { v: 'nee', t: 'Vaste installatie; zelf installeren alleen met kennis van NEN 1010', s: S.sePrijs },
    bestaand: { v: 'ja', t: 'Past op bestaande omvormer en groep', s: S.sePrijs },
    lfp: { v: 'ja', t: 'IJzerfosfaatbatterij', s: S.seSpecs },
    modulair: { v: 'ja', t: '5, 10 of 15 kWh, ook te combineren', s: S.sePrijs },
    groot: { v: 'ja', t: '10 en 15 kWh', s: S.sePrijs },
    noodstroom: { v: 'deels', t: 'Uitbreiding door een installatiepartner; standaard bij 15 kWh', s: S.seHome },
    app: { v: 'ja', t: 'App en portal', s: S.sePrijs },
    dynamisch: { v: 'ja', t: 'Klaar voor dynamische tarieven', s: S.seHome },
    garantie: { v: 'ja', t: '10 jaar op de batterij, 5 jaar op de omvormer', s: S.seSpecs },
    prijs: { v: 'ja', t: 'Vanaf € 3.550 (5 kWh), adviesprijs inclusief btw', s: S.sePrijs },
  },
  zonneplan: {
    stekker: { v: 'nee', t: 'Installatie door monteurs van Zonneplan', s: S.zpKosten },
    bestaand: { v: null },
    lfp: { v: 'ja', t: 'LFP-cellen', s: S.zpHome },
    modulair: { v: 'ja', t: 'Stapelbaar met modules', s: S.zpHome },
    groot: { v: 'ja', t: '10 tot 35 kWh', s: S.zpHome },
    noodstroom: { v: 'deels', t: 'Noodstroomvoorziening voor € 250 extra', s: S.zpKosten },
    app: { v: null },
    dynamisch: { v: 'ja', t: 'Werkt met alle dynamische energiecontracten', s: S.zpHome },
    garantie: { v: 'ja', t: '10 jaar of 6.000 cycli, minimaal 70% capaciteit', s: S.zpKosten },
    prijs: { v: 'ja', t: '€ 4.690 (10 kWh) tot € 9.090 (35 kWh), na teruggave btw', s: S.zpKosten },
  },
  huawei: {
    stekker: { v: 'nee', t: 'Installatie door een installateur', s: S.huLuna },
    bestaand: { v: null },
    lfp: { v: 'ja', t: 'LFP-cellen', s: S.huLuna },
    modulair: { v: 'ja', t: '1 tot 3 modules van 5 of 6,9 kWh', s: S.huSpecs },
    groot: { v: 'ja', t: 'Tot 20,7 kWh', s: S.huSpecs },
    noodstroom: { v: 'deels', t: 'Back-upstroom met Smart Guard', s: S.huLuna },
    app: { v: 'ja', t: 'FusionSolar-app', s: S.huLuna },
    dynamisch: { v: null },
    garantie: { v: 'deels', t: 'Tot 15 jaar met Module+; voorwaarden in de garantiebrief', s: S.huLuna },
    prijs: { v: null },
  },
  solaredge: {
    stekker: { v: 'nee', t: 'Installatie met een SolarEdge-omvormer', s: S.sdNl },
    bestaand: { v: 'nee', t: 'Werkt met de SolarEdge Home Hub- of Home Wave-omvormer', s: S.sdNl },
    lfp: { v: null },
    modulair: { v: 'ja', t: 'Tot 5 modules (48V) of 3 batterijen (400V)', s: S.sdNl },
    groot: { v: 'ja', t: 'Tot 23 kWh (3-fase) of 29,1 kWh (1-fase)', s: S.sdNl },
    noodstroom: { v: 'deels', t: 'Met de SolarEdge Backup Interface', s: S.sdNl },
    app: { v: 'ja', t: 'mySolarEdge-app', s: S.sd48 },
    dynamisch: { v: 'ja', t: 'Modus Dynamisch Tarief in SolarEdge ONE', s: S.sdDyn },
    garantie: { v: 'ja', t: '10 jaar (Home Battery 48V)', s: S.sd48 },
    prijs: { v: 'deels', t: 'Alleen een actieprijs voor een pakket', s: S.sdNl },
  },
  byd: {
    stekker: { v: 'nee', t: 'Hoogspanningsbatterij (204,8 tot 512 V) voor een hybride omvormer', s: S.bydDs },
    bestaand: { v: 'deels', t: 'Werkt met compatibele 1- en 3-fase-omvormers', s: S.bydDs },
    lfp: { v: 'ja', t: 'Lithium-ijzerfosfaat (LiFePO4)', s: S.bydDs },
    modulair: { v: 'ja', t: '2 tot 5 modules van 2,56 kWh', s: S.bydDs },
    groot: { v: 'ja', t: 'Tot 12,8 kWh, drie parallel tot 38,4 kWh', s: S.bydDs },
    noodstroom: { v: 'deels', t: 'Back-upfunctie, via de omvormer', s: S.bydDs },
    app: { v: null },
    dynamisch: { v: null },
    garantie: { v: 'ja', t: '10 jaar, minimaal 60% bruikbare energie', s: S.bydGarantie },
    prijs: { v: null },
  },
};
