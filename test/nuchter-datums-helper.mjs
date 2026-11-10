// Onafhankelijke verwachting voor de stijlrelease van 18 november 2026.
export const STIJL_PADEN = new Set([
  "/onderzoek/thuisbatterij-dynamisch-contract-2026/",
  "/blog/thuisbatterij-10-kwh/",
  "/blog/thuisbatterij-dynamisch-contract/",
  "/blog/thuisbatterij-met-noodstroom/",
  "/blog/thuisbatterij-rendabel-2027/",
  "/blog/thuisbatterij-zonder-zonnepanelen/",
  "/btw-thuisaccu/",
  "/einde-salderen-berekenen/",
  "/merken/",
  "/merken/anker-solix/",
  "/merken/byd/",
  "/merken/huawei/",
  "/merken/sessy/",
  "/merken/zonneplan/",
  "/terugleverkosten/",
  "/thuisaccu-dynamisch-energiecontract/",
  "/thuisaccu-keuzehulp/",
  "/thuisaccu-kosten/",
  "/thuisaccu-terugverdientijd/",
  "/thuisaccu-veiligheid/"
]);
export const revisieDatum = (pad, vorige) => STIJL_PADEN.has(pad) ? '2026-11-18' : vorige;

// Exacte tekstregels van de stijlronde; operatoren, getallen en alle andere bytes blijven onder de regressiecheck.
const STIJL_REGELS = new Map([
  [
    "    if (dyn) notes.push('Met een dynamisch contract kun je laden als stroom goedkoop is. Handel je met een EMS en krijg je een terugleververgoeding, dan staat de Belastingdienst toe dat je de btw op de accu terugvraagt; je doet dan wel btw-aangifte.');",
    "    if (dyn) notes.push('Met een dynamisch contract kun je laden als stroom goedkoop is. Handel je met een EMS en krijg je een terugleververgoeding, dan kun je volgens de Belastingdienst de btw op de accu terugvragen; je doet dan wel btw-aangifte.');"
  ],
  [
    "    lijnen: [['Sessy 5 kWh', 'Sessy adviseert deze voor zo’n 3.000 kWh verbruik per jaar'], ['Sessy 10 kWh', 'Sessy adviseert deze vanaf 5.000 kWh verbruik per jaar'], ['Sessy 15 kWh (Plus)', 'Met noodstroom ingebouwd; op order gebouwd']],",
    "    lijnen: [['Sessy 5 kWh', 'Volgens Sessy voor zo’n 3.000 kWh verbruik per jaar'], ['Sessy 10 kWh', 'Volgens Sessy vanaf 5.000 kWh verbruik per jaar'], ['Sessy 15 kWh (Plus)', 'Met noodstroom ingebouwd; op order gebouwd']],"
  ],
  [
    "    lijnen: [['Thuisbatterij 10 en 15 kWh', 'Zonneplan noemt deze geschikt voor een 1-fase-aansluiting'], ['Thuisbatterij 20 tot 35 kWh', 'Stapelbaar met modules'], ['Noodstroom', 'Optie voor € 250 extra']],",
    "    lijnen: [['Thuisbatterij 10 en 15 kWh', 'Volgens Zonneplan geschikt voor een 1-fase-aansluiting'], ['Thuisbatterij 20 tot 35 kWh', 'Stapelbaar met modules'], ['Noodstroom', 'Optie voor € 250 extra']],"
  ],
  [
    "    plus: ['Prijzen inclusief installatie op de site', 'Productgarantie 10 jaar of 6.000 cycli, minimaal 70% capaciteit', 'Zonneplan ondersteunt vaste, variabele en dynamische contracten'],",
    "    plus: ['Prijzen inclusief installatie op de site', 'Productgarantie 10 jaar of 6.000 cycli, minimaal 70% capaciteit', 'Werkt volgens Zonneplan met vaste, variabele en dynamische contracten'],"
  ],
  [
    "    plus: ['Modules van 5 en 6,9 kWh te combineren tot 20,7 kWh', 'Huawei noemt deze geschikt voor binnen en buiten, –20 °C tot +55 °C', 'FusionSolar-app'],",
    "    plus: ['Modules van 5 en 6,9 kWh te combineren tot 20,7 kWh', 'Volgens Huawei geschikt voor binnen en buiten, –20 °C tot +55 °C', 'FusionSolar-app'],"
  ],
  [
    "    extra: `<h2>Welke combinatie: capaciteit en vermogen</h2><p>Een LUNA2000-S1 bestaat uit één powermodule met 1 tot 3 batterijmodules van 5 of 6,9 kWh. Je mag ze mengen. Dit zijn de combinaties uit het specificatieblad van Huawei:</p><div class=\"table-wrap\"><table class=\"data stack\"><thead><tr><th scope=\"col\">Batterijmodules</th><th scope=\"col\">Bruikbare energie</th><th scope=\"col\">Max. laden en ontladen</th><th scope=\"col\">Gewicht met vloerstandaard</th></tr></thead><tbody><tr><th scope=\"row\">1 (5 of 7)</th><td data-l=\"Bruikbaar\">5 of 6,9 kWh</td><td data-l=\"Vermogen\">3,5 kW</td><td data-l=\"Gewicht\">80 kg</td></tr><tr><th scope=\"row\">2 (5+5, 5+7, 7+7)</th><td data-l=\"Bruikbaar\">10, 11,9 of 13,8 kWh</td><td data-l=\"Vermogen\">7 kW</td><td data-l=\"Gewicht\">148 kg</td></tr><tr><th scope=\"row\">3 (5+5+5 tot 7+7+7)</th><td data-l=\"Bruikbaar\">15, 16,9, 18,8 of 20,7 kWh</td><td data-l=\"Vermogen\">10,5 kW</td><td data-l=\"Gewicht\">216 kg</td></tr></tbody></table></div><p>Huawei meet de bruikbare energie bij 100% ontlaaddiepte aan het begin van de levensduur. Je kunt later een module bijplaatsen zonder die vooraf te laden of te kalibreren. Hoeveel kWh jij nodig hebt, reken je uit met de <a href=\"/capaciteit-thuisaccu-berekenen/\">capaciteitsberekening</a>.</p>",
    "    extra: `<h2>Welke combinatie: capaciteit en vermogen</h2><p>Een LUNA2000-S1 bestaat uit één powermodule met 1 tot 3 batterijmodules van 5 of 6,9 kWh. Je mag ze mengen. Dit zijn de combinaties volgens het specificatieblad van Huawei:</p><div class=\"table-wrap\"><table class=\"data stack\"><thead><tr><th scope=\"col\">Batterijmodules</th><th scope=\"col\">Bruikbare energie</th><th scope=\"col\">Max. laden en ontladen</th><th scope=\"col\">Gewicht met vloerstandaard</th></tr></thead><tbody><tr><th scope=\"row\">1 (5 of 7)</th><td data-l=\"Bruikbaar\">5 of 6,9 kWh</td><td data-l=\"Vermogen\">3,5 kW</td><td data-l=\"Gewicht\">80 kg</td></tr><tr><th scope=\"row\">2 (5+5, 5+7, 7+7)</th><td data-l=\"Bruikbaar\">10, 11,9 of 13,8 kWh</td><td data-l=\"Vermogen\">7 kW</td><td data-l=\"Gewicht\">148 kg</td></tr><tr><th scope=\"row\">3 (5+5+5 tot 7+7+7)</th><td data-l=\"Bruikbaar\">15, 16,9, 18,8 of 20,7 kWh</td><td data-l=\"Vermogen\">10,5 kW</td><td data-l=\"Gewicht\">216 kg</td></tr></tbody></table></div><p>Huawei meet de bruikbare energie bij 100% ontlaaddiepte aan het begin van de levensduur. Volgens Huawei kun je later een module bijplaatsen zonder die vooraf te laden of te kalibreren. Hoeveel kWh jij nodig hebt, reken je uit met de <a href=\"/capaciteit-thuisaccu-berekenen/\">capaciteitsberekening</a>.</p>"
  ],
  [
    "<h2>Instellingen in de app</h2><p>Huawei geeft in de FusionSolar-app keuze tussen drie standen: laden en ontladen op tijd (TOU), maximaal eigen verbruik en volledige teruglevering aan het net. Met een dynamisch contract is de tijdstand het interessantst; zie <a href=\"/thuisaccu-dynamisch-energiecontract/\">thuisaccu met een dynamisch contract</a>.</p>`,",
    "<h2>Instellingen in de app</h2><p>In de FusionSolar-app kies je volgens Huawei tussen drie standen: laden en ontladen op tijd (TOU), maximaal eigen verbruik en volledige teruglevering aan het net. Met een dynamisch contract is de tijdstand het interessantst; zie <a href=\"/thuisaccu-dynamisch-energiecontract/\">thuisaccu met een dynamisch contract</a>.</p>`,"
  ],
  [
    "    plus: ['LFP-cellen (lithium-ijzerfosfaat)', '10 jaar garantie', 'Modulair: 2 tot 5 modules, tot 38,4 kWh'],",
    "    plus: ['LFP-cellen (lithium-ijzerfosfaat)', '10 jaar garantie volgens het garantiedocument', 'Modulair: 2 tot 5 modules, tot 38,4 kWh'],"
  ]
]);
export const normaliseerStijl = (code) => code.split("\n").map((regel) => STIJL_REGELS.get(regel) || regel).join("\n");
