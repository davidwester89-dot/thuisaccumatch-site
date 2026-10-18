// Rekentool capaciteit thuisaccu: rekent met ./lib/kosten.js. Niets verlaat de browser.
import { capaciteit, komma } from './lib/kosten.js';
import { $, num } from './_num.js';
const form = $('form');
function reken() {
  const r = capaciteit({ verbruik: num('verbruik'), panelen: num('panelen'), avondDeel: Math.min(100, num('avond')) / 100 });
  $('r-advies').textContent = `${komma(r.advies)} kWh`;
  $('r-soort').textContent = r.soort === 'stekker' ? 'Een stekkerbatterij kan volstaan' : r.soort === 'vast' ? 'Een vaste thuisaccu past hierbij' : 'Zonder zonnepanelen is er niets op te slaan';
  $('r-avond').textContent = `${komma(r.avond)} kWh`;
  $('r-zomer').textContent = `${komma(r.zomer)} kWh`;
  $('r-winter').textContent = `${komma(r.winter)} kWh`;
}
form.addEventListener('input', reken);
form.addEventListener('submit', (e) => e.preventDefault());
reken();
