// Rekentool terugverdientijd thuisaccu: rekent met ./lib/kosten.js. Niets verlaat de browser.
import { terugverdien, eur, jaarTekst } from './lib/kosten.js';
import { $, num } from './_num.js';
const form = $('form');
function reken() {
  const dyn = $('dyn').checked;
  const r = terugverdien({ prijs: num('prijs'), capaciteit: num('cap'), teruglevering: num('terug'), stroomprijs: num('stroom'), netto: num('netto'), dagen: Math.min(365, num('dagen')), rendement: Math.min(100, num('rend')) / 100, dynamisch: dyn, dynDagen: Math.min(365, num('dyndagen')), spread: num('spread') });
  $('r-jaren').textContent = jaarTekst(r.jaren);
  $('r-kwh').textContent = `${r.kwh.toLocaleString('nl-NL')} kWh`;
  $('r-zon').textContent = eur(r.zon);
  $('r-dyn').textContent = eur(r.dyn);
  $('r-besp').textContent = eur(r.besparing);
  $('r-pkwh').textContent = r.perKwh == null ? '–' : eur(r.perKwh);
  $('r-noot').textContent = r.jaren != null && r.jaren <= 15 ? 'Let op: de aannames zijn ruim. Controleer of je accu echt zo vaak vol raakt.' : 'Milieu Centraal: een thuisaccu verdien je op dit moment hoogstwaarschijnlijk niet terug.';
}
form.addEventListener('input', reken);
form.addEventListener('change', reken);
form.addEventListener('submit', (e) => e.preventDefault());
reken();
