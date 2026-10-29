// Offertemodule (van VerduurzaamMatch, leadtest-offerte). Alleen gebouwd als er een actieve offertepartner is (zie leads.config.mjs).
// Nu: geen partner → geen pagina's, geen knoppen, geen formulieren. Placeholder voor een offertepartner voor vaste thuisaccu's.
import { SITE, esc } from './layout.mjs';
import { CATEGORIEEN, WANNEER, categorieVan } from './lib/leads.js';
import { VRAAG } from './lib/match.js';
import { LEADS, ROUTING, LEADS_AAN, LEADS_PREVIEW } from './leads.config.mjs';

const LABEL = `We krijgen een vergoeding per aanvraag van de offertepartner. Dat staat los van ons advies en verandert niets aan de volgorde in de ${SITE.name}.`;
const partnerVan = (cat) => (ROUTING[cat] ? LEADS[ROUTING[cat]] : null);

/** Offerteblok voor gidsen en merkpagina's (type: vast). Leeg zonder partner. */
export function leadCta(type, pos = 'gids') {
  const cat = categorieVan(type);
  const p = cat && partnerVan(cat);
  if (!p) return '';
  const c = CATEGORIEEN[cat];
  return `<aside class="leadcta" aria-label="Offertes aanvragen"><div><p class="fh">Offertes vergelijken voor een ${esc(c.naam.toLowerCase())}</p><p>Gratis en vrijblijvend, van maximaal ${p.max} vakbedrijven bij jou in de buurt. Vijf korte vragen.</p></div><a class="btn" href="/offerte/?m=${cat}" data-lead="${cat}" data-pos="${pos}">Offertes aanvragen</a><p class="src">Via ${esc(p.type === 'voorbeeld' ? 'onze offertepartner' : p.naam)}. ${LABEL}</p></aside>`;
}

const radios = (name, opts, req = true) => `<div class="opts">${Object.entries(opts).map(([k, v]) => `<label><input type="radio" name="${name}" value="${k}"${req ? ' required' : ''}><span>${v}</span></label>`).join('')}</div>`;
const maatOpts = Object.fromEntries(Object.entries(CATEGORIEEN).filter(([k]) => ROUTING[k]).map(([k, c]) => [k, `${esc(c.naam)} <small>${esc(c.kort)}</small>`]));
const opts = (id) => Object.fromEntries(VRAAG[id].opties);

const pages = [];
if (LEADS_AAN) {
  pages.push({
    path: '/offerte/', title: `Offertes voor een thuisaccu | ${SITE.name}`, h1: 'Offertes aanvragen', crumb: 'Offertes aanvragen', og: 'home', noindex: true, noCta: true,
    description: 'Vergelijk gratis offertes voor een vaste thuisaccu van installateurs bij jou in de buurt.',
    scripts: ['/js/offerte.js'],
    body: `${LEADS_PREVIEW ? '<p class="alert"><strong>Preview, niet live.</strong> Het formulier van de offertepartner is hier een voorbeeld dat niets verstuurt of bewaart.</p>' : ''}<h1>Offertes aanvragen</h1>
<p class="lead">Vergelijk vrijblijvend offertes van vakbedrijven bij jou in de buurt. Vijf korte vragen, daarna vul je je gegevens in bij onze offertepartner.</p>
<p class="src leadlabel">${LABEL}</p>
<form class="quiz card stap lead" id="lead" novalidate>
<div class="qprog"><p id="l-prog">Vraag 1 van 5</p><div class="qbar" role="progressbar" aria-label="Voortgang" aria-valuemin="0" aria-valuemax="5" aria-valuenow="0"><span id="l-bar"></span></div></div>
<fieldset data-q="maatregel" class="nu"><legend>Wat wil je laten plaatsen?</legend>${radios('maatregel', maatOpts)}</fieldset>
<fieldset data-q="postcode"><legend>Wat is je postcode?</legend><div class="field"><label for="l-postcode">Postcode <span class="hint">zodat vakbedrijven uit je regio reageren</span></label><input type="text" name="postcode" id="l-postcode" inputmode="text" autocomplete="postal-code" maxlength="7" placeholder="1234 AB" required aria-describedby="l-postcode-fout"></div><p class="fout" id="l-postcode-fout" role="alert" hidden></p><button type="button" class="btn" data-volgende>Volgende vraag</button></fieldset>
<fieldset data-q="panelen"><legend>${esc(VRAAG.panelen.vraag)}</legend>${radios('panelen', opts('panelen'))}</fieldset>
<fieldset data-q="verbruik"><legend>${esc(VRAAG.verbruik.vraag)}</legend>${radios('verbruik', opts('verbruik'))}</fieldset>
<fieldset data-q="wanneer"><legend>Wanneer wil je beginnen?</legend>${radios('wanneer', WANNEER)}</fieldset>
<div class="stapnav" id="l-nav" hidden><button type="button" class="btn ghost" id="l-terug">Vorige vraag</button></div>
</form>
<section class="leadstap card" id="l-gegevens" hidden aria-labelledby="l-gegevens-h">
<h2 id="l-gegevens-h">Je gegevens</h2>
<p id="l-samenvatting" class="src"></p>
<p>Je naam en contactgegevens vul je in bij <strong data-pnaam></strong>. Die partner stuurt je aanvraag naar maximaal <span data-pmax></span> vakbedrijven bij jou in de buurt. ${SITE.name} ontvangt en bewaart je gegevens niet.</p>
<label class="check toestemming"><input type="checkbox" id="l-ok"><span>Ik geef <strong data-pnaam></strong> toestemming om mijn aanvraag te ontvangen en te delen met maximaal <span data-pmax></span> vakbedrijven. Zij mogen mij over deze offerte bellen en mailen. Ik kan deze toestemming altijd intrekken bij <span data-pnaam></span>.</span></label>
<p class="fout" id="l-ok-fout" role="alert" hidden>Zet een vinkje als je verder wilt. Zonder toestemming sturen we niets door.</p>
<div class="actions"><button type="button" class="btn" id="l-door">Verder naar het offerteformulier</button><button type="button" class="btn ghost" id="l-wijzig">Antwoorden wijzigen</button></div>
<p class="src">Meer over je gegevens: <a href="/privacy/#offertes">privacy bij offertes</a> en de <a data-pprivacy href="/privacy/#offertes" rel="noopener">privacyverklaring van de partner</a>.</p>
<div id="l-partner" aria-live="polite"></div>
</section>
<noscript><p class="alert">Zet JavaScript aan om offertes aan te vragen.</p></noscript>
<h2>Zo werkt het</h2>
<ol class="steps"><li>Beantwoord vijf vragen over je zonnepanelen, verbruik en plannen.</li><li>Vul je gegevens in bij onze offertepartner.</li><li>Maximaal ${Math.max(...Object.values(LEADS).map((p) => p.max))} vakbedrijven nemen contact op. Vergelijk prijs, aanpak en garantie.</li></ol>
<h2>Waar let je op bij offertes?</h2>
<ul><li>Vraag naar de bruikbare capaciteit in kWh en reken de prijs per kWh uit (zie <a href="/thuisaccu-kosten/">wat kost een thuisaccu</a>).</li><li>Vraag of de accu op een eigen groep komt en waar hij komt te hangen (zie <a href="/thuisaccu-veiligheid/">veilig plaatsen</a>).</li><li>Twijfel je over de grootte? <a href="/capaciteit-thuisaccu-berekenen/">Bereken de capaciteit</a>.</li></ul>`,
  });
  pages.push({
    path: '/offerte/bedankt/', title: `Aanvraag verstuurd | ${SITE.name}`, h1: 'Aanvraag verstuurd', crumb: 'Aanvraag verstuurd', parents: [['/offerte/', 'Offertes aanvragen']], og: 'home', noindex: true, noCta: true,
    description: 'Je offerteaanvraag voor een thuisaccu is verstuurd. Dit gebeurt er nu, en zo vergelijk je de offertes die je krijgt.',
    scripts: ['/js/offerte-bedankt.js'],
    body: `<h1>Je aanvraag is verstuurd</h1>
<p class="lead" id="b-lead">Bedankt. Onze offertepartner heeft je aanvraag ontvangen.</p>
<h2>Wat gebeurt er nu?</h2>
<ol class="steps"><li>De offertepartner controleert je aanvraag.</li><li>Vakbedrijven bij jou in de buurt nemen contact op voor een afspraak of offerte.</li><li>Vergelijk de offertes rustig. Je zit nergens aan vast.</li></ol>
<h2>Handig bij het vergelijken</h2>
<ul><li><a href="/btw-thuisaccu/">Btw op een thuisaccu</a>: wanneer je de btw kunt terugvragen.</li><li><a href="/terugverdientijd-thuisaccu-berekenen/">Terugverdientijd berekenen</a> met de prijs uit je offerte.</li></ul>`,
  });
}
export const offertePages = pages;

/** Extra privacytekst (alleen als de module actief is). */
export function privacyOffertes() {
  if (!LEADS_AAN) return '';
  const lijst = Object.values(LEADS).map((p) => `<li><strong>${esc(p.naam)}</strong>${p.type === 'voorbeeld' ? ' (voorbeeld in de preview)' : ''}: <a href="${esc(p.privacy)}" rel="noopener">privacyverklaring</a></li>`).join('');
  return `<h2 id="offertes">Offertes aanvragen</h2>
<p>Vraag je via ${SITE.name} offertes aan, dan gaat dat via een offertepartner.</p>
<ul><li><strong>Je vijf antwoorden</strong> (wat je wilt laten plaatsen, postcode, aantal zonnepanelen, stroomverbruik en wanneer je wilt beginnen) blijven in je browser tot je toestemming geeft. Wij bewaren ze niet.</li>
<li><strong>Je naam en contactgegevens</strong> vul je in het formulier van de offertepartner in. ${SITE.name} ontvangt en bewaart die gegevens niet.</li>
<li><strong>De offertepartner is verantwoordelijk</strong> voor je aanvraag. Intrekken, inzien of verwijderen regel je bij de partner.</li>
<li><strong>Statistieken:</strong> heb je Google Analytics toegestaan, dan meten we alleen dat een aanvraag is gestart of verstuurd, voor welk type, de termijn en via welke partner. Nooit je postcode of contactgegevens.</li>
<li><strong>Vergoeding:</strong> we krijgen een vergoeding per goedgekeurde aanvraag. Dat heeft geen invloed op het advies of de volgorde.</li></ul>
<p>Onze offertepartners:</p><ul>${lijst}</ul>`;
}
