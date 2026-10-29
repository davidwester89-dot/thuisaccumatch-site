// ThuisaccuMatch keuzehulp: leest de antwoorden, rekent met ./lib/match.js en toont het advies. Niets verlaat de browser.
import { advies, compleet, VRAGEN, label, TYPES } from './lib/match.js';
import { MERKEN, STERK_IN } from './lib/merken.js';
import { eur, komma, jaarTekst } from './lib/kosten.js';
import { logoImg } from './lib/logos.js';
import { LEADS, ROUTING } from './lib/leads.config.js';
import { categorieVan } from './lib/leads.js';
import { track } from './consent.js';

const BASE = document.body.dataset.base || '';
const form = document.getElementById('form');
// Statistieken (alleen na toestemming, zie consent.js): start = eerste eigen antwoord,
// afgerond = de uitslag verschijnt na een eigen antwoord. Elk één keer per paginaweergave, nooit de antwoorden zelf.
let qStart = false, qDone = false;
const quizStart = () => { if (!qStart) { qStart = true; track('quiz_start', {}); } };
const quizKlaar = (params) => { if (qStart && !qDone) qDone = track('quiz_complete', params); };
form.addEventListener('change', (e) => { if (e.isTrusted) quizStart(); });
const out = document.getElementById('result');
const prog = document.getElementById('q-prog');
const bar = document.getElementById('q-bar');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const WACHT = out.innerHTML;

function antwoorden() {
  const fd = new FormData(form); const a = {};
  for (const v of VRAGEN) if (fd.get(v.id)) a[v.id] = fd.get(v.id);
  return a;
}
// Offerteknop: alleen met een goedgekeurde offertepartner (nu leeg). Verandert niets aan het advies of de volgorde.
function offerte(type) {
  const c = categorieVan(type);
  if (!c || !ROUTING[c]) return '';
  return `<p class="leadlink"><a class="btn" href="${BASE}/offerte/?m=${c}" data-lead="${c}" data-pos="keuzehulp">Offertes aanvragen</a></p>`;
}

function toon(a, scroll) {
  const r = advies(a); const c = r.reken;
  const merken = r.merken.slice(0, 4);
  let html = `<h2>Jouw advies</h2><p class="big">${esc(r.naam)}</p><p class="pc-price">${esc(TYPES[r.type].kort)}</p>`;
  if (c) {
    html += `<table class="kv"><tbody><tr><td>Capaciteit</td><td>${komma(r.kwh).replace(/,0$/, '')} kWh</td></tr><tr><td>Indicatie prijs</td><td>${eur(c.prijs)}</td></tr><tr><td>Besparing per jaar</td><td>${eur(c.besparing)}</td></tr><tr class="total"><td>Terugverdientijd</td><td>${jaarTekst(c.jaren)}</td></tr></tbody></table>`
      + `<p class="src">${a.panelen === '0' ? 'Zonder zonnepanelen' : `Met ${esc(label('panelen', a.panelen).toLowerCase())} zonnepanelen`}, een verbruik van ${esc(label('verbruik', a.verbruik).replace(/^M/, 'm'))} en de cijfers van het CBS en Milieu Centraal. <a href="${BASE}/terugverdientijd-thuisaccu-berekenen/">Reken na met je offerte</a></p>`;
  }
  if (r.sal && r.sal.verschil > 0) html += `<p>Het einde van salderen kost je vanaf 2027 ongeveer <strong>${eur(r.sal.verschil)} per jaar</strong>. <a href="${BASE}/einde-salderen-berekenen/">Bereken het precies</a></p>`;
  html += `<ul class="why">${r.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` + offerte(r.type);
  if (r.type === 'geen') html += `<p><a class="btn ghost" href="${BASE}/salderingsregeling-stopt-2027/">Wat verandert er in 2027?</a></p>`;
  else if (merken.length) {
    html += `<h3>Merken: ${esc(r.naam.toLowerCase())}</h3><ol class="mtop">${merken.map((id, i) => {
      const p = MERKEN[id];
      return `<li${i === 0 ? ' class="first"' : ''}><div class="mhead">${logoImg(id, { maat: 'sm', base: BASE })}<h3>${esc(p.naam)}</h3></div><p class="pc-price">${esc(STERK_IN[id])}</p><div class="mini-cta"><a href="${BASE}/merken/${p.slug}/">Alles over ${esc(p.naam)}</a></div></li>`;
    }).join('')}</ol>`;
    if (r.merken.length > merken.length) html += `<p><a href="${BASE}/vergelijken/">Alle ${r.merken.length} merken vergelijken</a></p>`;
  } else html += `<p>Geen van de 6 merken noemt noodstroom bij deze soort. <a href="${BASE}/vergelijken/">Vergelijk alle merken</a></p>`;
  html += `<p class="mlinks"><button type="button" class="linkbtn" id="m-reset">Opnieuw beginnen</button><button type="button" class="linkbtn" id="m-share">Deel of bewaar: kopieer de link</button></p>`
    + `<p class="sub">Merken op het aantal checklistpunten, bij gelijke stand op naam. Partnerlinks tellen niet mee.${Object.keys(LEADS).length ? ' Offertes lopen via een offertepartner (partnerlink); die vergoeding heeft geen invloed op dit advies.' : ''}</p>`;
  out.innerHTML = html;
  history.replaceState(null, '', `${location.pathname}?${new URLSearchParams(a)}`);
  document.getElementById('m-reset').addEventListener('click', () => { form.reset(); history.replaceState(null, '', location.pathname); update(); out.innerHTML = WACHT; form.querySelector('input').focus(); });
  document.getElementById('m-share').addEventListener('click', async (e) => { try { await navigator.clipboard.writeText(location.href); e.target.textContent = 'Link gekopieerd'; } catch { e.target.textContent = location.href; } });
  quizKlaar({ advies: r.type });
  if (scroll && matchMedia('(max-width: 899px)').matches) out.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

function update() {
  const a = antwoorden(); const n = Object.keys(a).length;
  prog.textContent = `${n} van ${VRAGEN.length} vragen beantwoord`;
  bar.style.width = `${(n / VRAGEN.length) * 100}%`;
  return a;
}

const params = new URLSearchParams(location.search);
for (const v of VRAGEN) { const val = params.get(v.id); const el = val && form.querySelector(`input[name="${v.id}"][value="${CSS.escape(val)}"]`); if (el) el.checked = true; }
const start = update();
if (compleet(start)) toon(start, false);

form.addEventListener('change', () => { const a = update(); if (compleet(a)) toon(a, false); });
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (e.isTrusted) quizStart();
  const a = update();
  if (!compleet(a)) {
    const open = VRAGEN.find((v) => !a[v.id]);
    const el = form.querySelector(`input[name="${open.id}"]`);
    if (el) el.focus();
    out.innerHTML = `<h2>Jouw advies</h2><p class="alert">Beantwoord nog: ${esc(open.vraag)}</p>`;
    return;
  }
  toon(a, true);
});
