// Expliciet jaarmodel 2027. Geen vaste arbitrage-opslag, geen leverancierstarieven in de code.
import { bereken2027 } from './lib/tvt2027.js';
const $ = (id) => document.getElementById(id);
const geld = (v) => v.toLocaleString('nl-NL', {style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:2});
const dec = (v) => v.toLocaleString('nl-NL', {maximumFractionDigits:1});
function waarde(id) {
  const s = $(id).value.trim().replace(/\s/g,'');
  if (!s) return null;
  const v = Number(s.includes(',') ? s.replace(/\./g,'').replace(',','.') : /^-?\d{1,3}(\.\d{3})+$/.test(s) ? s.replace(/\./g,'') : s);
  return Number.isFinite(v) ? v : NaN;
}
function reken() {
  try {
    const keys = { prijs:'prijs', capaciteit:'cap', teruglevering:'terug', stroomprijs:'stroom', netto:'netto', dagen:'dagen', rendement:'rend', onderhoud:'onderhoud' };
    const x = Object.fromEntries(Object.entries(keys).map(([k,id]) => [k,waarde(id)]));
    x.rendement = x.rendement == null ? NaN : x.rendement / 100;
    const r = bereken2027(x);
    $('r-jaren').textContent = x.prijs == null ? 'Vul je totaalprijs in' : x.capaciteit === 0 ? 'Niet van toepassing: geen accu' : r.jaren == null ? 'Geen eindige terugverdientijd' : dec(r.jaren) + ' jaar';
    $('r-kwh').textContent = dec(r.geleverd) + ' kWh';
    $('r-geladen').textContent = dec(r.geladen) + ' kWh';
    $('r-verlies').textContent = dec(r.verlies) + ' kWh';
    $('r-zon').textContent = geld(r.vermedenInkoop);
    $('r-gemist').textContent = geld(r.gemisteVergoeding);
    $('r-besp').textContent = geld(r.besparing);
    $('r-noot').textContent = 'Indicatief jaarmodel zonder saldering; geen voorspelling van tarieven of levensduur. Geen vaste opbrengst uit handel opgeteld.';
  } catch {
    $('r-jaren').textContent = 'Controleer je invoer';
    for (const id of ['r-kwh','r-geladen','r-verlies','r-zon','r-gemist','r-besp']) $(id).textContent = '–';
    $('r-noot').textContent = 'Vul alle rekenwaarden in. Dagen: 0–365; rendement: meer dan 0 tot en met 100%; totaalprijs mag leeg blijven.';
  }
}
$('form').addEventListener('input', reken);
$('form').addEventListener('change', reken);
$('form').addEventListener('submit', (e) => e.preventDefault());
reken();
