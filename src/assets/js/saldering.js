// Rekentool einde salderen: rekent met ./lib/kosten.js. Niets verlaat de browser.
import { saldering, terugverdien, eur } from './lib/kosten.js';
import { $, num } from './_num.js';
const form = $('form');
function reken() {
  const stroomprijs = num('stroom'); const netto = num('netto');
  const s = saldering({ opwek: num('opwek'), verbruik: num('verbruik'), zelf: Math.min(100, num('zelf')) / 100, stroomprijs, netto });
  const cap = num('cap');
  const t = terugverdien({ prijs: 0, capaciteit: cap, teruglevering: s.terug, stroomprijs, netto });
  $('r-verschil').textContent = eur(s.verschil);
  $('r-voor').textContent = eur(s.voor);
  $('r-na').textContent = eur(s.na);
  $('r-terug').textContent = `${s.terug.toLocaleString('nl-NL')} kWh`;
  $('r-accu').textContent = eur(t.besparing);
  $('r-noot').textContent = cap > 0 ? `Met een thuisaccu van ${String(cap).replace('.', ',')} kWh, die op 200 dagen per jaar vol raakt (aanname).` : 'Zonder thuisaccu.';
}
form.addEventListener('input', reken);
form.addEventListener('submit', (e) => e.preventDefault());
reken();
