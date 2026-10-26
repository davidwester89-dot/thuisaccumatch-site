import { SITE, esc, ORG, GA_ID, ICONS, fmtDate } from './layout.mjs';
import { PRIVACY_UPDATED, cookieTabel, partnerNetwerk, grondslag, doorgifte, bewaartermijnen, rechten } from './privacy-avg.mjs';
import { CONSENT_KEY } from './lib/consent.js';
import { PARTNERLINKS } from './lib/partnerlinks.js';
import { HERO_ART } from './hero-art.mjs';
import { IDS, CHECKED, FEATURES, STERK_IN } from './lib/merken.js';
import { knop } from './lib/partnerlinks.js';
import { VRAGEN } from './lib/match.js';
import { BRON, STROOMPRIJS, LEVERING, ENERGIEBELASTING, KAAL, MIN_VERGOEDING, NETTO_TERUG, OPWEK_PANEEL, ZOMERDAG_PANEEL, WINTERDAG_PANEEL, ZELFVERBRUIK, PRIJS_KWH, AANNAMES, terugverdien, saldering, capaciteit, komma } from './lib/kosten.js';
import { GROEPEN, PUNTEN, IDS_PUNTEN, score, fmtScore, ranglijst } from './lib/checklist.js';
import { M, by, bron, B, featureBronnen, matchCta, article, faqHtml, pcard, matrix, methodBox, scoreBlock, scoreBadge, bars, fv, checklistTable, aanbodTekst, logoImg, eur } from './parts.mjs';
import { leadCta, privacyOffertes } from './offerte.mjs';
import { LEADS_AAN } from './leads.config.mjs';

const RANG = ranglijst();
const logo = (id, maat = 'md') => logoImg(id, { maat });
const ct = (n) => komma(n * 100, 1).replace(/,0$/, '') + ' cent';
const faqSchema = (faq) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) });
const app = (name, path) => ({ '@context': 'https://schema.org', '@type': 'WebApplication', name, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web', url: SITE.domain + path, offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, publisher: ORG });

// Rekenvoorbeeld (Milieu Centraal): 10 panelen ≈ 3.500 kWh (≈ 350 kWh/paneel), ongeveer het verbruik van een rijtjeshuis. VerduurzaamMatch gebruikt elders het MC-voorbeeld met 435 Wp (10 panelen ≈ 3.800 kWh).
const EX = { panelen: 10, opwek: 10 * OPWEK_PANEEL, verbruik: 3500 };
EX.terug = Math.round(EX.opwek * (1 - ZELFVERBRUIK));
const SAL = saldering({ opwek: EX.opwek, verbruik: EX.verbruik });
const T5 = terugverdien({ prijs: 3550, capaciteit: 5, teruglevering: EX.terug });
const T27 = terugverdien({ prijs: 1195, capaciteit: 2.7, teruglevering: EX.terug });
const T10 = terugverdien({ prijs: 5500, capaciteit: 10, teruglevering: EX.terug });
const T10D = terugverdien({ prijs: 5500, capaciteit: 10, teruglevering: EX.terug, dynamisch: true });
const CAP = capaciteit({ verbruik: EX.verbruik, panelen: EX.panelen });
const jr = (t) => (t.jaren == null ? 'niet' : `${komma(t.jaren)} jaar`);

const TOOLS = [['/terugverdientijd-thuisaccu-berekenen/', 'Terugverdientijd van een thuisaccu berekenen', 'Wat levert een thuisaccu jou per jaar op, en na hoeveel jaar heb je hem terugverdiend?'], ['/capaciteit-thuisaccu-berekenen/', 'Hoeveel kWh thuisaccu heb je nodig?', 'Bereken de capaciteit uit je verbruik en je zonnepanelen, zonder te groot te kopen.'], ['/einde-salderen-berekenen/', 'Wat kost het einde van salderen jou?', 'Zie wat je zonnepanelen vanaf 1 januari 2027 minder opleveren, en wat een thuisaccu terugwint.']];
const GIDSLINKS = [['/salderingsregeling-stopt-2027/', 'Salderingsregeling stopt in 2027: wat verandert er?'], ['/thuisaccu-kosten/', 'Wat kost een thuisaccu in 2026?'], ['/thuisaccu-terugverdientijd/', 'Verdien je een thuisaccu terug?'], ['/stekkerbatterij-of-vaste-thuisaccu/', 'Stekkerbatterij of vaste thuisaccu?'], ['/thuisaccu-dynamisch-energiecontract/', 'Thuisaccu met een dynamisch energiecontract'], ['/terugleverkosten/', 'Terugleverkosten en terugleververgoeding'], ['/btw-thuisaccu/', 'Btw op een thuisaccu terugvragen'], ['/thuisaccu-veiligheid/', 'Een thuisaccu veilig plaatsen']];

// ---- Home ----
const homeFaq = [
  ['Is een thuisaccu nu al slim?', 'Milieu Centraal verwacht dat je een thuisaccu op dit moment hoogstwaarschijnlijk niet terugverdient met wat je bespaart op je stroomrekening. Wel kun je er meer van je eigen zonnestroom mee gebruiken en ben je wat minder afhankelijk van het net. Reken het voor jouw situatie uit met de <a href="/terugverdientijd-thuisaccu-berekenen/">rekentool</a>.'],
  ['Wat verandert er op 1 januari 2027?', 'De salderingsregeling stopt. Teruggeleverde zonnestroom mag je dan niet meer wegstrepen tegen je verbruik. Je krijgt een terugleververgoeding die tot 2030 minstens de helft van het kale leveringstarief is, maar veel leveranciers rekenen ook terugleverkosten. Zie <a href="/salderingsregeling-stopt-2027/">saldering stopt in 2027</a>.'],
  ['Is er subsidie op een thuisaccu?', 'Nee. Volgens Milieu Centraal is er geen rijkssubsidie op een thuisbatterij. Je betaalt 21% btw; het 0%-tarief van zonnepanelen geldt niet voor een thuisaccu (Belastingdienst). In sommige gevallen kun je de btw terugvragen, zie <a href="/btw-thuisaccu/">btw op een thuisaccu</a>.'],
  ['Hoe komt de checklistscore tot stand?', 'We tellen 10 vaste punten, zoals LFP-cellen, uitbreidbaarheid, noodstroom, garantie en of de prijs openbaar is. Ja is 1 punt, deels een half punt, nee of niet vermeld 0. Zie <a href="/over/#methode">zo vergelijken we</a>.'],
  ['Verdient ThuisaccuMatch aan de merken?', 'Nu niet. Komt er later een partnerlink of offertepartner, dan wordt die bij de knoppen vermeld en telt die nooit mee in de score, de volgorde of het advies.'],
];
const miniRows = RANG.map((id) => `<tr><th scope="row"><span class="rowlogo">${logo(id, 'sm')}</span><a href="/merken/${M[id].slug}/">${esc(M[id].naam)}</a></th><td data-l="Score">${scoreBadge(id)}</td>${[['stekker', 'Stekker'], ['bestaand', 'Bestaande omvormer'], ['noodstroom', 'Noodstroom'], ['garantie', 'Garantie 10 jaar'], ['prijs', 'Prijs openbaar']].map(([k, l]) => `<td data-l="${l}">${fv(FEATURES[id][k], false)}</td>`).join('')}</tr>`).join('');
// Lijn-iconen voor de rekentoolkaarten (redesign-v1, Lucide-stijl): klok (terugverdientijd), batterij (capaciteit), zon (einde salderen).
const svgI = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const TOOL_ICO = [svgI('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'), svgI('<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2"/><path d="M6 10v4M10 10v4"/>'), svgI('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>')];
// Kopniveau volgt de pagina: op /rekentools/ staan de kaarten direct onder de H1 (dus H2), op de homepage onder de H2 "Rekentools" (dus H3).
const toolCards = (h = 'h3') => `<div class="grid cards">${TOOLS.map(([href, t, d], i) => `<a class="card" href="${href}"><span class="ci" aria-hidden="true">${TOOL_ICO[i] || ''}</span><${h}${h === 'h2' ? ' class="h3"' : ''}>${esc(t)}</${h}><p>${esc(d)}</p><span class="more">Naar de rekentool →</span></a>`).join('')}</div>`;

export const home = {
  lastmod: '2026-10-19',
  path: '/', title: 'Thuisaccu kiezen: keuzehulp, merken, kosten | ThuisaccuMatch', ogTitle: 'ThuisaccuMatch: past een thuisaccu bij jou?', h1: 'Thuisaccu kiezen? Reken eerst.', og: 'home',
  description: 'Past een thuisaccu bij jou? Doe de keuzehulp, vergelijk 6 merken op een vaste checklist en reken uit wat een accu oplevert als de saldering in 2027 stopt.',
  schema: [faqSchema(homeFaq)],
  full: true,
  body: `<section class="hero"><div class="wrap hero-in"><div class="hero-txt">
<p class="h1-brand">Thuisaccu<b>Match</b>.nl</p>
<h1 class="tagline">Thuisaccu kiezen? Reken eerst.</h1>
<p class="lead">Op 1 januari 2027 <a href="/salderingsregeling-stopt-2027/">stopt de salderingsregeling</a>. Is een thuisaccu dan slim, hoe groot moet hij zijn en welk merk past? Zes vragen en je krijgt een advies met capaciteit en terugverdientijd. Zes merken naast elkaar op 10 vaste punten.</p>
<div class="actions"><a class="btn" href="/thuisaccu-keuzehulp/" data-cta="home_hero">Start de keuzehulp</a><a class="btn ghost" href="/vergelijken/">Vergelijk alle 6 merken</a></div>
<ul class="trustbar">
<li>${ICONS.kalender}<span>Gegevens gecontroleerd op <time datetime="${CHECKED}">${fmtDate(CHECKED)}</time></span></li>
<li>${ICONS.bron}<span>Bron bij elk bedrag en elk punt</span></li>
<li>${ICONS.schild}<span>Volgorde nooit betaald</span></li>
<li>${ICONS.gratis}<span>Gratis, zonder account</span></li>
</ul>
</div>
<div class="hero-art">${HERO_ART}</div></div></section>
<div class="wrap qwrap"><div class="hero-q"><p class="hero-q-step">Vraag 1 van ${VRAGEN.length}</p><p class="hero-q-title" id="hq">${esc(VRAGEN[0].vraag)}</p><div class="hero-q-opts" role="group" aria-labelledby="hq">${VRAGEN[0].opties.map(([v, l]) => `<a class="choice" href="/thuisaccu-keuzehulp/?panelen=${v}" rel="nofollow">${esc(l)}<span aria-hidden="true">→</span></a>`).join('')}</div><p class="hero-q-foot">Daarna nog ${VRAGEN.length - 1} korte vragen. Gratis, zonder account.</p></div></div>
<section class="logobar" aria-labelledby="h-pl"><div class="wrap"><h2 id="h-pl">Deze 6 merken vergelijken we</h2><div class="logos six">${[...IDS].sort((a, b) => M[a].naam.localeCompare(M[b].naam, 'nl')).map((id) => `<a class="logo-tile" href="/merken/${M[id].slug}/">${logo(id, 'lg')}</a>`).join('')}</div></div></section>
<section class="sec tint"><div class="wrap split-txt">
<h2>Wat verandert er in 2027?</h2>
<p>Tot en met 2026 streep je teruggeleverde zonnestroom weg tegen de stroom die je op andere momenten van het net haalt. Vanaf 1 januari 2027 kan dat niet meer (Rijksoverheid). Voor teruggeleverde stroom krijg je dan een vergoeding van je leverancier, maar na aftrek van terugleverkosten is dat bij een vast of variabel contract netto rond de halve cent per kWh (Milieu Centraal). Stroom die je inkoopt kost gemiddeld zo'n € ${komma(STROOMPRIJS, 2)} per kWh (CBS, september 2026). Elke kWh zonnestroom die je zelf gebruikt in plaats van teruglevert, is dus veel meer waard. Een thuisaccu is één manier om dat te doen, maar niet de enige en niet altijd de goedkoopste.</p>
<p>In het rekenvoorbeeld van 10 zonnepanelen (${EX.opwek.toLocaleString('nl-NL')} kWh per jaar) leveren je panelen vanaf 2027 ongeveer ${eur(SAL.verschil)} per jaar minder op. Een thuisaccu van 5 kWh voor € 3.550 wint daarvan ongeveer ${eur(T5.besparing)} per jaar terug: terugverdiend in ${jr(T5)}. Met je eigen verbruik en accu <a href="/terugverdientijd-thuisaccu-berekenen/">bereken je de terugverdientijd van je thuisaccu</a>. <a href="/einde-salderen-berekenen/">Of reken uit wat het einde van salderen jouw dak kost →</a></p>
</div></section>
<section class="sec"><div class="wrap">
<h2>Rekentools</h2>
<p class="sub">Vul je eigen cijfers in. Standaardwaarden komen van Milieu Centraal, het CBS en de prijzen van de merken. Uitleg en aannames per tool staan op <a href="/rekentools/">alle rekentools voor je thuisaccu</a>.</p>
${toolCards()}
</div></section>
<section class="sec tint"><div class="wrap">
<h2>De merken op een rij</h2>
<p class="sub">Gesorteerd op checklistscore, bij gelijke stand op naam. De score telt wat het merk zelf op de eigen site noemt.</p>
<div class="table-wrap"><table class="data stack"><thead><tr><th scope="col">Merk</th><th scope="col">Score</th><th scope="col">Stekker</th><th scope="col">Bestaande omvormer</th><th scope="col">Noodstroom</th><th scope="col">Garantie 10 jaar</th><th scope="col">Prijs openbaar</th></tr></thead><tbody>${miniRows}</tbody></table></div>
<p><a href="/vergelijken/">Alle 10 checklistpunten, met filters →</a></p>
</div></section>
<section class="sec warm method-band"><div class="wrap">
<div class="sec-head"><p class="eyebrow">Onze werkwijze</p><h2>Zo vergelijken we</h2></div>
<ol class="steps how">
<li><strong>Bron bij alles.</strong> Merkgegevens komen van de site van het merk, stroomprijzen van het CBS, regels van de Rijksoverheid, de ACM en de Belastingdienst.</li>
<li><strong>Een vaste checklist.</strong> Tien punten, van LFP-cellen en noodstroom tot garantie. De score telt wat het merk zelf noemt.</li>
<li><strong>Partners veranderen niets.</strong> Partnerlinks en offertepartners tellen nooit mee in de score, de volgorde of het advies.</li>
</ol>
<p class="author">Door <a href="/over/">${SITE.owner}</a> · <a href="/over/#methode">Hoe de score werkt</a></p>
</div></section>
<section class="sec"><div class="wrap split2"><div>
<h2>Gidsen</h2><ul class="gidslijst">${GIDSLINKS.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul>
</div><div>
{{latest}}
</div></div></section>
<section class="sec tint"><div class="wrap faq">
${faqHtml(homeFaq)}
<div class="cta-band"><div><h2>Past een thuisaccu bij jou?</h2><p>Zes vragen en je krijgt een advies met capaciteit en terugverdientijd.</p></div><a class="btn" href="/thuisaccu-keuzehulp/" data-cta="home_band">Start de keuzehulp</a></div>
</div></section>`,
};

// ---- Keuzehulp ----
export const quiz = {
  lastmod: '2026-10-19',
  path: '/thuisaccu-keuzehulp/', title: 'Thuisaccu keuzehulp: past een thuisbatterij bij jou?', h1: 'Past een thuisaccu bij jou?', crumb: 'Keuzehulp', og: 'match', noCta: true,
  description: 'Zes vragen over je zonnepanelen, verbruik, contract en budget. Advies: geen accu, stekkerbatterij of vaste thuisaccu, met capaciteit en merken.',
  scripts: ['/js/keuzehulp.js'],
  schema: [app('ThuisaccuMatch keuzehulp', '/thuisaccu-keuzehulp/')],
  body: `<h1>Past een thuisaccu bij jou?</h1><p class="lead">Beantwoord ${VRAGEN.length} korte vragen. Je ziet meteen of een thuisaccu zin heeft, welke soort en hoe groot, wat hij ongeveer kost en wanneer je hem terugverdient.</p>
<div class="mgrid">
<form id="form" class="quiz card" novalidate>
<div class="qprog"><p id="q-prog" aria-live="polite">0 van ${VRAGEN.length} vragen beantwoord</p><div class="qbar"><span id="q-bar"></span></div></div>
${VRAGEN.map((v, i) => `<fieldset class="q"><legend>${i + 1}. ${esc(v.vraag)}</legend>${v.hint ? `<p class="hint">${esc(v.hint)}</p>` : ''}<div class="opts">${v.opties.map(([val, t]) => `<label><input type="radio" name="${v.id}" value="${val}" required><span>${esc(t)}</span></label>`).join('')}</div></fieldset>`).join('')}
<div class="qdone"><button class="btn" type="submit">Toon mijn advies</button><p class="sub">Gratis, zonder account. Je antwoorden blijven in je browser.</p></div>
</form>
<aside class="card mpanel" id="result" aria-live="polite"><h2>Jouw advies</h2><p class="mwait">Beantwoord de vragen. Je advies verschijnt hier, met de capaciteit, de terugverdientijd en de merken die passen.</p><p class="sub">Of bekijk <a href="/vergelijken/">alle 6 merken naast elkaar</a>.</p></aside>
</div>
<p>Wil je liever zelf rekenen met je eigen cijfers? Met de <a href="/terugverdientijd-thuisaccu-berekenen/">rekentool terugverdientijd</a> zie je wat een thuisaccu jou per jaar oplevert. Wil je ook weten hoeveel kWh je nodig hebt of wat het einde van salderen kost? Kijk bij de <a href="/rekentools/">rekentools voor je thuisaccu</a>.</p>
<noscript><p class="alert">De keuzehulp werkt met JavaScript. Zonder JavaScript lees je de regels in <a href="/stekkerbatterij-of-vaste-thuisaccu/">stekkerbatterij of vaste thuisaccu</a>.</p></noscript>
<section class="method" id="methode"><h2>Zo werkt de keuzehulp</h2><ol><li><strong>Eerst: heb je iets om op te slaan?</strong> Milieu Centraal ziet een thuisaccu vooral als manier om meer eigen zonnestroom te gebruiken, of om met een dynamisch contract goedkoop in te kopen. Zonder zonnepanelen en zonder dynamisch contract raden we nog geen accu aan.</li><li><strong>Dan de grootte.</strong> Milieu Centraal: kies niet te groot, de accu hoeft alleen je avond- en nachtverbruik te dekken. We nemen aan dat de helft van je verbruik 's avonds en 's nachts valt, en rekenen met het zomeroverschot van je panelen (${komma(ZOMERDAG_PANEEL)} kWh per paneel op een junidag, waarvan je 30% direct zelf gebruikt).</li><li><strong>Dan de soort.</strong> Wil je zelf aansluiten, is je budget tot € 1.500 of is de benodigde capaciteit kleiner dan 3 kWh, dan wordt het een stekkerbatterij. Anders een vaste thuisaccu door een installateur.</li><li><strong>Dan de cijfers.</strong> Prijs per kWh opslag: stekkerbatterij € ${PRIJS_KWH.stekker} (HomeWizard, € 1.195 voor 2,7 kWh), vaste accu € ${PRIJS_KWH.vast} (Sessy 10 kWh, € 5.500), met als minimum € 3.550 (Sessy 5 kWh, de kleinste vaste accu met een openbare prijs). Stroom € ${komma(STROOMPRIJS, 2)} per kWh (CBS), teruglevering netto ${ct(NETTO_TERUG)} per kWh (Milieu Centraal).</li><li><strong>Merken:</strong> alleen merken van de juiste soort, in de vaste volgorde (checklistscore, dan naam). Wil je noodstroom, dan alleen merken die dat noemen.</li></ol><p>Het advies is een indicatie. Je eigen verbruiksprofiel meet je met een P1-meter op je slimme meter; een installateur kan je meterkast en de plek voor de accu beoordelen. De keuzehulp verandert nooit door partners: er zijn nu geen partnerlinks en geen offertepartners.</p><p class="src">Bronnen: <a href="${BRON.mcAccu.url}" rel="noopener">${BRON.mcAccu.naam}</a> · <a href="${BRON.cbs.url}" rel="noopener">${BRON.cbs.naam}</a> · <a href="${BRON.mcNa2027.url}" rel="noopener">${BRON.mcNa2027.naam}</a> · <a href="${BRON.brandweerStekker.url}" rel="noopener">${BRON.brandweerStekker.naam}</a> · <a href="${BRON.bdBtw.url}" rel="noopener">${BRON.bdBtw.naam}</a></p></section>`,
};

// ---- Merkpagina's ----
const RELATED = {
  homewizard: [['/stekkerbatterij-of-vaste-thuisaccu/', 'Stekkerbatterij of vaste thuisaccu?'], ['/thuisaccu-veiligheid/', 'Een stekkerbatterij veilig aansluiten']],
  sessy: [['/thuisaccu-kosten/', 'Wat kost een thuisaccu?'], ['/capaciteit-thuisaccu-berekenen/', 'Hoeveel kWh heb je nodig?']],
  zonneplan: [['/btw-thuisaccu/', 'Btw op een thuisaccu terugvragen'], ['/thuisaccu-dynamisch-energiecontract/', 'Thuisaccu met een dynamisch contract']],
  huawei: [['/thuisaccu-veiligheid/', 'Een thuisaccu veilig plaatsen'], ['/capaciteit-thuisaccu-berekenen/', 'Hoeveel kWh heb je nodig?']],
  solaredge: [['/stekkerbatterij-of-vaste-thuisaccu/', 'AC- of DC-gekoppeld: wat is het verschil?'], ['/thuisaccu-kosten/', 'Wat kost een thuisaccu?']],
  byd: [['/stekkerbatterij-of-vaste-thuisaccu/', 'AC- of DC-gekoppeld: wat is het verschil?'], ['/thuisaccu-terugverdientijd/', 'Verdien je een thuisaccu terug?']],
};
const ALG_PRIJS = `Ter vergelijking: Milieu Centraal noemt voor een gemiddelde thuisaccu van 6 kWh, inclusief omvormer en installatie, "een paar duizend euro". Bij de merken die wel prijzen tonen, ligt de prijs per kWh opslag tussen € ${PRIJS_KWH.stekker} (HomeWizard) en € 710 (Sessy 5 kWh), inclusief btw. Zie <a href="/thuisaccu-kosten/">wat kost een thuisaccu</a>.`;
const merkPagesRaw = IDS.map((id) => {
  const p = M[id];
  const path = `/merken/${p.slug}/`;
  const h1 = `${p.naam}-thuisaccu: aanbod, checklist en voor wie`;
  const pos = RANG.indexOf(id) + 1;
  const alt = RANG.filter((x) => x !== id).slice(0, 3);
  const t = [`${p.naam}-thuisaccu 2026: aanbod en checklist`, `${p.naam}-thuisaccu 2026`].find((x) => x.length <= 60);
  const lc = (x) => (/^[A-Z][a-z]/.test(x) ? x[0].toLowerCase() + x.slice(1) : x);
  const d = [`${p.naam}-thuisaccu: ${lc(aanbodTekst(id))}. Checklist van 10 punten met bron, prijs, sterke punten en voor wie hij past.`, `${p.naam}-thuisaccu: ${lc(aanbodTekst(id))}. Checklist van 10 punten met bron en voor wie hij past.`, `${p.naam}-thuisaccu: aanbod, prijs, checklist van 10 punten met bron, sterke punten, aandachtspunten en voor wie hij past.`].find((x) => x.length <= 155 && x.length >= 70);
  const prijsBlok = p.prijzen
    ? `<h2>Prijzen</h2><p class="sub">Zoals ${esc(p.naam)} ze op de eigen site toont.</p><div class="table-wrap"><table class="data stack"><thead><tr><th scope="col">Model</th><th scope="col">Prijs</th><th scope="col">Toelichting</th></tr></thead><tbody>${p.prijzen.map(([n, pr, w]) => `<tr><th scope="row">${esc(n)}</th><td data-l="Prijs"><strong>${esc(pr)}</strong></td><td data-l="Toelichting">${esc(w)}</td></tr>`).join('')}</tbody></table></div><p>${ALG_PRIJS}</p>`
    : `<h2>Prijzen</h2><p>${esc(p.naam)} noemt geen consumentenprijzen op de eigen site; je koopt via een installateur en de prijs staat in je offerte. Vraag altijd naar de bruikbare capaciteit in kWh, zodat je de prijs per kWh kunt vergelijken.</p><p>${ALG_PRIJS}</p>`;
  const f = FEATURES[id];
  return {
    ...article({ path, title: t, h1, description: d, og: `merk-${id}`, parents: [['/merken/', 'Merken']], faq: p.faq }),
    ...(p.extraChecked ? { stamp: { checked: p.extraChecked }, lastmod: p.extraChecked } : {}),
    navPath: '/merken/',
    body: `<article><div class="phead"><span class="phead-logo">${logoImg(id, { maat: 'lg', eager: true })}</span><span class="tag best">${esc(STERK_IN[id])}</span></div><h1>${esc(h1)}</h1>${by()}<p class="lead">${esc(p.kort)}</p>
<div class="pcard first"><div class="pc-head"><span class="sc-lbl">Aanbod</span><p class="pc-price"><strong>${esc(aanbodTekst(id))}</strong></p></div>
<ul class="pc-facts"><li><span>LFP-cellen</span><span>${fv(f.lfp, false)}</span></li><li><span>Noodstroom</span><span>${fv(f.noodstroom, false)}</span></li><li><span>Garantie 10 jaar</span><span>${fv(f.garantie, false)}</span></li><li><span>Plek in de vergelijking</span><span>${pos} van ${IDS.length}</span></li></ul>
${scoreBlock(id)}
<div class="pc-cta">${knop(id, 'merk_top')}<a href="/thuisaccu-keuzehulp/">Past het bij mij? Start de keuzehulp →</a></div></div>
<h2>Modellen</h2><div class="table-wrap"><table class="data stack"><thead><tr><th scope="col">Model of lijn</th><th scope="col">Wat</th></tr></thead><tbody>${p.lijnen.map(([n, w]) => `<tr><th scope="row">${esc(n)}</th><td data-l="Wat">${esc(w)}</td></tr>`).join('')}</tbody></table></div>
${p.extra || ''}${prijsBlok}
<h2>Checklist: wat biedt ${esc(p.naam)}?</h2><p class="sub">Tien vaste punten, uit de site, het datasheet of het garantiedocument van het merk. Niet vermeld telt als 0. <a href="/over/#methode">Zo tellen we</a></p>${checklistTable(id)}
<h2>Sterk en let op</h2><div class="pm"><div class="card plus"><h3>Sterk</h3><ul>${p.plus.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div><div class="card min"><h3>Let op</h3><ul>${p.min.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
<h2>Voor wie?</h2><p>${esc(p.voor)}</p>
<p>Of een ${p.soort === 'stekker' ? 'stekkerbatterij' : 'vaste thuisaccu'} van ${esc(p.naam)} zich voor jou terugbetaalt, hangt vooral af van hoeveel zonnestroom je teruglevert en welk energiecontract je hebt. Milieu Centraal verwacht dat je een thuisaccu op dit moment hoogstwaarschijnlijk niet terugverdient. Reken het na met de <a href="/terugverdientijd-thuisaccu-berekenen/">rekentool terugverdientijd</a> en bepaal de grootte met de <a href="/capaciteit-thuisaccu-berekenen/">capaciteitsberekening</a>.</p>
${p.faq ? faqHtml(p.faq) : ''}${p.soort === 'vast' ? leadCta('vast', 'merk') : ''}
<div class="out">${knop(id, 'merk_bottom')}</div>
<h2>Alternatieven</h2><ul class="gidslijst">${alt.map((x) => `<li class="withlogo">${logo(x, 'sm')}<a href="/merken/${M[x].slug}/">${esc(M[x].naam)}</a> · ${esc(STERK_IN[x])} · ${fmtScore(score(x).totaal)} van 10 checklistpunten (<a href="/over/#methode">hoe de score werkt</a>)</li>`).join('')}${(RELATED[id] || []).map(([h, tt]) => `<li><a href="${h}">${esc(tt)}</a></li>`).join('')}<li><a href="/vergelijken/">Alle merken naast elkaar</a></li></ul>
<p class="sub">Alle merken: ${IDS.filter((x) => x !== id).map((x) => `<a href="/merken/${M[x].slug}/">${esc(M[x].naam)}</a>`).join(' · ')}</p>
<h2>Voor je koopt</h2><ul class="gidslijst"><li><a href="/thuisaccu-veiligheid/">Een thuisaccu veilig plaatsen</a></li><li><a href="/btw-thuisaccu/">Btw op een thuisaccu</a></li><li><a href="/salderingsregeling-stopt-2027/">Saldering stopt in 2027</a></li></ul>
${matchCta(`Past ${esc(p.naam)} bij jou?`)}${bron(p.bronnen, featureBronnen(id), B('mcAccu'))}</article>`,
  };
});

// Merken met extra uitleg (extraChecked): bijgewerkt-datum in artikel en schema gelijk aan de controledatum. Bij push gelijkzetten aan de pushdatum.
export const merkPages = merkPagesRaw.map((pg, i) => { const c = M[IDS[i]].extraChecked; if (!c) return pg; return { ...pg, article: { ...pg.article, updated: c }, schema: pg.schema.map((x, j) => (j === 0 ? { ...x, dateModified: c } : x)) }; });
export const merkHub = {
  path: '/merken/', title: 'Thuisaccu merken 2026: 6 merken op een rij | ThuisaccuMatch', h1: 'Alle thuisaccumerken op een rij', crumb: 'Merken', og: 'merken', stamp: { checked: CHECKED, updated: CHECKED },
  description: 'HomeWizard, Sessy, Zonneplan, Huawei, SolarEdge en BYD: per merk het aanbod, de checklistscore met bron, de prijs als die openbaar is en voor wie het past.',
  schema: [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: RANG.map((id, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.domain}/merken/${M[id].slug}/`, name: M[id].naam })) }],
  body: `<h1>Alle thuisaccumerken op een rij</h1><p class="lead">Zes merken die in Nederland thuisaccu's leveren: een stekkerbatterij en vijf vaste systemen. Gesorteerd op checklistscore, bij gelijke stand op naam.</p>
<div class="actions"><a class="btn" href="/thuisaccu-keuzehulp/">Liever advies op maat? Start de keuzehulp</a><a class="btn ghost" href="/vergelijken/">Filter en vergelijk</a></div>
<ol class="plist">${RANG.map((id, i) => pcard(id, { rank: i + 1, pos: 'lijst' })).join('')}</ol>
<section class="prose"><h2>Hoe kies je een merk?</h2><p>Begin niet bij het merk, maar bij je situatie. Heb je al zonnepanelen met een gewone omvormer, dan zoek je een accu die op die bestaande omvormer past (AC-gekoppeld), zoals HomeWizard en Sessy. Laat je zonnepanelen en accu tegelijk plaatsen, of heb je al een hybride omvormer, dan kan een DC-gekoppeld systeem van hetzelfde merk passen, zoals SolarEdge of Huawei. BYD levert alleen de batterij en werkt met een compatibele hybride omvormer van een ander merk.</p><p>Let daarna op de bruikbare capaciteit in kWh, de garantie op de batterij (en apart op de omvormer), of noodstroom mogelijk is en wat de totaalprijs inclusief installatie is. De checklist hierboven telt wat elk merk daarover zelf zegt, met link naar de bron. Het is geen oordeel over kwaliteit of betrouwbaarheid en geen review.</p></section>
${methodBox()}`,
};

// ---- Vergelijken ----
const FILTERS = ['stekker', 'bestaand', 'noodstroom', 'lfp', 'modulair', 'groot', 'app', 'dynamisch', 'garantie', 'prijs'];
const sel = (id, label, opts) => `<div class="field"><label for="${id}">${label}</label><select id="${id}" name="${id}">${opts.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join('')}</select></div>`;
export const vsHub = {
  path: '/vergelijken/', title: 'Beste thuisaccu 2026? 6 merken vergeleken | ThuisaccuMatch', h1: 'Thuisaccu’s vergelijken: welke past het best?', crumb: 'Vergelijken', og: 'vergelijken', stamp: { checked: CHECKED, updated: CHECKED },
  scripts: ['/js/vergelijk.js'],
  description: 'Welke thuisaccu is de beste voor jou? Zes merken in één tabel: stekker of vast, noodstroom, LFP, garantie en prijs. Filter op wat je nodig hebt.',
  body: `<h1>Thuisaccu’s vergelijken: welke past het best?</h1><p class="lead">Zes merken op 10 vaste punten. Filter op wat jij zoekt.</p>
<p>Zoek je de beste thuisaccu? Die bestaat niet voor iedereen. Een stekkerbatterij is de beste keus als je hem zelf wilt aansluiten en weinig wilt uitgeven; een grote vaste thuisaccu als je veel zonnepanelen hebt of noodstroom wilt. De checklistscore telt hoeveel van de 10 punten een merk zelf noemt. Het is geen beoordeling. Wat bij jou past, hangt af van je zonnepanelen, je verbruik en je contract: de <a href="/thuisaccu-keuzehulp/">keuzehulp</a> rekent het uit, en in <a href="/stekkerbatterij-of-vaste-thuisaccu/">stekkerbatterij of vaste thuisaccu</a> lees je de verschillen.</p>
<div class="actions"><a class="btn" href="/thuisaccu-keuzehulp/">Liever advies op maat? Start de keuzehulp</a></div>
<form class="filters card" id="filters" aria-labelledby="h-f"><h2 id="h-f">Filter de merken</h2>
<fieldset class="q"><legend>Moet het merk hebben</legend><div class="fchecks">${FILTERS.map((k) => `<label class="check"><input type="checkbox" name="need" value="${k}"><span>${esc(PUNTEN[k].lang)}</span></label>`).join('')}</div></fieldset>
<p class="sub">"Deels" telt mee. Niet vermeld telt niet mee.</p>
<p class="count" id="f-count" aria-live="polite">${IDS.length} van ${IDS.length} merken</p>
</form>
<div class="sortbar"><h2 style="margin:0">Alle merken naast elkaar</h2>${sel('f-sort', 'Sorteer op', [['score', 'Checklistscore'], ['naam', 'Naam']])}</div>
${matrix(RANG)}
<p class="empty" id="f-empty" hidden>Geen merk voldoet aan alles. Zet een filter uit of <a href="/thuisaccu-keuzehulp/">start de keuzehulp</a>.</p>
<p class="src">De bron van elk punt staat op de pagina van elk merk.</p>
<section class="prose"><h2>Waar let je op bij het vergelijken?</h2><ul><li><strong>Bruikbare capaciteit.</strong> Niet alle opgeslagen energie is bruikbaar. Reken met de bruikbare kWh uit het datasheet.</li><li><strong>Prijs per kWh.</strong> Deel de totaalprijs (inclusief installatie en btw) door de bruikbare capaciteit. Zo vergelijk je een kleine stekkerbatterij eerlijk met een grote vaste accu.</li><li><strong>Vermogen.</strong> Een stekkerbatterij op een stopcontact levert maar een paar honderd watt; een vaste accu meestal meer. Voor een wasmachine of kookplaat heb je vermogen nodig.</li><li><strong>Garantie.</strong> Kijk naar het aantal jaren én de voorwaarden, zoals een minimum aan capaciteit na tien jaar of een maximum aantal cycli.</li><li><strong>Plaatsing.</strong> De Brandweer raadt een koele, geventileerde plek aan, buiten je vluchtroute en met een rookmelder. Zie <a href="/thuisaccu-veiligheid/">veilig plaatsen</a>.</li></ul></section>
${methodBox()}${matchCta()}`,
};

// ---- Gidsen ----
const G = [['/gidsen/', 'Gidsen']];
const g = (path, title, h1, description, og, faq, body) => ({ ...article({ path, title, h1, description, og, parents: G, faq }), navPath: '/gidsen/', body: `<article class="prose"><h1>${esc(h1)}</h1>${by()}${body}${faq ? faqHtml(faq) : ''}` });
const end = (cta, ...bronnen) => `${matchCta(cta)}${bron(...bronnen)}</article>`;

const salFaq = [
  ['Kan mijn leverancier het einde van salderen uitstellen?', 'Nee. De wettelijke salderingsregeling stopt op 1 januari 2027 en je leverancier kan die datum niet uitstellen. Wel kan het zijn dat je volgens je eigen contract nog recht hebt op salderen (ACM ConsuWijzer).'],
  ['Hoeveel krijg ik vanaf 2027 voor teruggeleverde stroom?', `Tot 1 januari 2030 minstens 50% van de kale leveringsprijs, zonder energiebelasting en btw. Bij een kale prijs van ongeveer ${ct(KAAL)} is dat minstens ${ct(MIN_VERGOEDING)} per kWh. Veel leveranciers rekenen daarnaast terugleverkosten; netto houd je bij een vast of variabel contract rond de halve cent per kWh over (Milieu Centraal).`],
  ['Zijn zonnepanelen na 2027 nog de moeite waard?', 'Volgens Milieu Centraal wel: stroom die je zelf direct gebruikt, hoef je niet in te kopen. Zelfopgewekte stroom is bij een vast of variabel contract vaak 3 tot 4 keer goedkoper dan ingekochte stroom.'],
];
export const salderingGids = g('/salderingsregeling-stopt-2027/', 'Salderen stopt 1 januari 2027: wat verandert er voor jou?', 'Salderingsregeling stopt in 2027: wat verandert er?', 'Op 1 januari 2027 stopt het salderen. Wat je dan krijgt voor teruggeleverde stroom, wat terugleverkosten zijn en wat het je kost, met bronnen.', 'salderingsregeling-stopt-2027', salFaq,
  `<p class="lead">Op 1 januari 2027 stopt de salderingsregeling. Zonnestroom die je teruglevert, mag je dan niet meer wegstrepen tegen de stroom die je op andere momenten van het net haalt (Rijksoverheid). Wat betekent dat voor jou, en is een thuisaccu dan het antwoord?</p>
<h2>Hoe salderen nu werkt</h2><p>Tot en met 31 december 2026 verrekent je leverancier de stroom die je afneemt met de stroom die je teruglevert, inclusief energiebelasting en btw (ACM ConsuWijzer). Lever je overdag 1 kWh terug en neem je 's avonds 1 kWh af, dan betaal je daar netto niets voor. Je net is in feite een gratis batterij.</p>
<h2>Wat er vanaf 2027 verandert</h2><ul><li><strong>Geen verrekening meer.</strong> Je betaalt energiebelasting en btw over alle stroom die je afneemt. Over stroom die je zelf opwekt en direct gebruikt, betaal je geen belasting (ACM ConsuWijzer).</li><li><strong>Een terugleververgoeding.</strong> Voor teruggeleverde stroom krijg je een redelijke vergoeding. Tot 1 januari 2030 is dat minstens 50% van het kale leveringstarief, de prijs zonder belastingen (Rijksoverheid).</li><li><strong>Terugleverkosten blijven.</strong> Leveranciers mogen kosten rekenen die ze maken om teruggeleverde stroom te verwerken. De ACM houdt toezicht (Rijksoverheid). Die kosten kunnen soms hoger zijn dan de vergoeding (ACM ConsuWijzer).</li><li><strong>Uitsplitsing.</strong> Loopt je contract over de jaargrens, dan moet je leverancier je verbruik en teruglevering splitsen in de periode tot en met 31 december 2026 en de periode vanaf 1 januari 2027.</li></ul>
<h2>Wat het je kost: een rekenvoorbeeld</h2><p>Milieu Centraal rekent met 10 zonnepanelen die samen ongeveer ${EX.opwek.toLocaleString('nl-NL')} kWh per jaar opwekken, ongeveer evenveel als een rijtjeshuis verbruikt. Je gebruikt gemiddeld 30% van je zonnestroom direct zelf. De rest, ${EX.terug.toLocaleString('nl-NL')} kWh, lever je terug.</p>
<div class="table-wrap"><table class="data stack"><thead><tr><th scope="col"></th><th scope="col">Tot en met 2026</th><th scope="col">Vanaf 2027</th></tr></thead><tbody>
<tr><th scope="row">Zelf direct gebruikt (${SAL.direct.toLocaleString('nl-NL')} kWh)</th><td data-l="Tot en met 2026">€ ${komma(STROOMPRIJS, 2)} per kWh</td><td data-l="Vanaf 2027">€ ${komma(STROOMPRIJS, 2)} per kWh</td></tr>
<tr><th scope="row">Teruggeleverd (${SAL.terug.toLocaleString('nl-NL')} kWh)</th><td data-l="Tot en met 2026">Gesaldeerd: € ${komma(STROOMPRIJS, 2)} per kWh</td><td data-l="Vanaf 2027">Netto ${ct(NETTO_TERUG)} per kWh</td></tr>
<tr><th scope="row">Waarde per jaar</th><td data-l="Tot en met 2026"><strong>${eur(SAL.voor)}</strong></td><td data-l="Vanaf 2027"><strong>${eur(SAL.na)}</strong></td></tr>
</tbody></table></div>
<p>Het verschil is ongeveer <strong>${eur(SAL.verschil)} per jaar</strong>. Stroomprijs: CBS, september 2026 (variabel leveringstarief € ${komma(LEVERING, 4)} plus energiebelasting € ${komma(ENERGIEBELASTING, 5)} per kWh, inclusief btw). Netto vergoeding: Milieu Centraal, rond de halve cent bij een vast of variabel contract. Je eigen contract kan anders zijn. <a href="/einde-salderen-berekenen/">Reken het uit met je eigen cijfers</a>.</p>
<h2>Wat kun je doen?</h2><ol><li><strong>Meer zonnestroom direct gebruiken.</strong> Zet de wasmachine en vaatwasser aan als de zon schijnt en laad een elektrische auto slim op zonnestroom. Dat kost niets (Milieu Centraal). Wat panelen na 2027 nog opleveren, lees je bij <a href="https://verduurzaammatch.nl/zonnepanelen-na-2027/">zonnepanelen na 2027</a> op VerduurzaamMatch (daar: 10 panelen van 435 Wp ≈ 3.800 kWh; wij gebruiken het Milieu Centraal-voorbeeld ≈ 3.500 kWh / 350 kWh per paneel — beide geldig).</li><li><strong>Kijk naar je contract.</strong> Vergelijk de terugleververgoeding en de terugleverkosten, of overweeg een dynamisch contract. Zie <a href="/terugleverkosten/">terugleverkosten</a>.</li><li><strong>Een thuisaccu.</strong> Die slaat overdag stroom op voor 's avonds. In het voorbeeld wint een accu van 5 kWh ongeveer ${eur(T5.besparing)} per jaar terug. Voor € 3.550 (Sessy 5 kWh) is dat ${jr(T5)}. Zie <a href="/thuisaccu-terugverdientijd/">verdien je een thuisaccu terug?</a></li></ol>
${end('Past een thuisaccu bij jou na 2027?', B('rijkSaldering', 'acmSalderen', 'mcSaldering', 'mcNa2027', 'mcAccu', 'acm2027', 'cbs'))}`);

const kostenFaq = [
  ['Wat kost een thuisaccu van 5 kWh?', 'Sessy noemt een adviesprijs van € 3.550 inclusief btw voor 5 kWh. Milieu Centraal noemt voor een gemiddelde accu van 6 kWh, inclusief omvormer en installatie, een paar duizend euro.'],
  ['Wat kost een stekkerbatterij?', 'HomeWizard noemt € 1.195 voor de Plug-In Battery van 2,7 kWh, zonder installatiekosten. Je hebt wel een HomeWizard P1 Meter nodig (apart).'],
  ['Is er subsidie op een thuisaccu?', 'Nee, er is geen rijkssubsidie op een thuisbatterij (Milieu Centraal).'],
];
export const kostenGids = g('/thuisaccu-kosten/', 'Thuisaccu kosten 2026: prijzen per kWh en per merk', 'Wat kost een thuisaccu in 2026?', 'Van € 1.195 voor een stekkerbatterij tot € 9.400 voor 15 kWh. Prijzen van de merken, prijs per kWh, installatie, btw en waarom er geen subsidie is.', 'thuisaccu-kosten', kostenFaq,
  `<p class="lead">Milieu Centraal noemt voor een gemiddelde thuisaccu van 6 kWh, inclusief omvormer en installatie, "een paar duizend euro". De merken die prijzen tonen, zitten tussen € 1.195 voor een stekkerbatterij van 2,7 kWh en € 9.400 voor een vaste accu van 15 kWh.</p>
<h2>Prijzen van de merken</h2><div class="table-wrap"><table class="data stack"><thead><tr><th scope="col">Merk en model</th><th scope="col">Capaciteit</th><th scope="col">Prijs</th><th scope="col">Per kWh</th></tr></thead><tbody>
<tr><th scope="row"><a href="/merken/homewizard/">HomeWizard</a> Plug-In Battery<span class="fnote">Stekker, zonder installatie; P1 Meter apart</span></th><td data-l="Capaciteit">2,7 kWh</td><td class="n" data-l="Prijs">€ 1.195</td><td class="n" data-l="Per kWh">€ 443</td></tr>
<tr><th scope="row"><a href="/merken/sessy/">Sessy</a> 5 kWh<span class="fnote">Adviesprijs inclusief btw</span></th><td data-l="Capaciteit">5 kWh</td><td class="n" data-l="Prijs">€ 3.550</td><td class="n" data-l="Per kWh">€ 710</td></tr>
<tr><th scope="row">Sessy 10 kWh<span class="fnote">Adviesprijs inclusief btw</span></th><td data-l="Capaciteit">10 kWh</td><td class="n" data-l="Prijs">€ 5.500</td><td class="n" data-l="Per kWh">€ 550</td></tr>
<tr><th scope="row">Sessy 15 kWh<span class="fnote">Adviesprijs inclusief btw</span></th><td data-l="Capaciteit">15 kWh</td><td class="n" data-l="Prijs">€ 9.400</td><td class="n" data-l="Per kWh">€ 627</td></tr>
<tr><th scope="row"><a href="/merken/zonneplan/">Zonneplan</a> 10 kWh<span class="fnote">Inclusief installatie, na teruggave van de btw</span></th><td data-l="Capaciteit">10 kWh</td><td class="n" data-l="Prijs">€ 4.690</td><td class="n" data-l="Per kWh">€ 469</td></tr>
<tr><th scope="row">Zonneplan 35 kWh<span class="fnote">Inclusief installatie, na teruggave van de btw</span></th><td data-l="Capaciteit">35 kWh</td><td class="n" data-l="Prijs">€ 9.090</td><td class="n" data-l="Per kWh">€ 260</td></tr>
</tbody></table></div>
<p>Huawei, SolarEdge en BYD noemen geen consumentenprijzen; je koopt via een installateur. Let op het verschil tussen prijzen inclusief btw en prijzen "na teruggave van de btw". Die teruggave kan alleen onder voorwaarden, zie <a href="/btw-thuisaccu/">btw op een thuisaccu</a>.</p>
<h2>Reken met de prijs per kWh</h2><p>Een grote accu kost meer, maar vaak minder per kWh. Deel de totaalprijs inclusief installatie en btw door de bruikbare capaciteit. Zo vergelijk je offertes eerlijk. Vraag de installateur daarom altijd naar de bruikbare capaciteit, niet alleen naar de nominale capaciteit.</p>
<h2>Wat komt er nog bij?</h2><ul><li><strong>Installatie.</strong> Zonneplan noemt voor de installatie van een thuisaccu € 850 tot € 1.450 (bij Zonneplan zit die in de prijs). Een stekkerbatterij sluit je zelf aan.</li><li><strong>Meterkast.</strong> Een eigen groep, een hoofdschakelaar (circa € 200 volgens Zonneplan) of een nieuwe groepenkast voor 3-fase (circa € 600 tot € 900).</li><li><strong>Noodstroom.</strong> Zit niet standaard op een thuisaccu. Zonneplan noemt vanaf ongeveer € 200 voor één stopcontact tot circa € 3.000 voor de hele woning.</li><li><strong>Btw.</strong> 21%. Het 0%-tarief voor zonnepanelen geldt niet voor een thuisaccu (Belastingdienst).</li></ul>
<h2>Geen subsidie</h2><p>Er is geen rijkssubsidie op een thuisbatterij (Milieu Centraal). Milieu Centraal verwacht wel dat de aanschafkosten de komende jaren dalen. Kijk ook naar je gemeente of provincie, maar reken er niet op.</p>
<p><a class="btn" href="/terugverdientijd-thuisaccu-berekenen/" data-tool="terugverdientijd">Bereken je terugverdientijd</a></p>
${leadCta('vast', 'gids_kosten')}${end('Welke thuisaccu past bij jouw budget?', B('mcAccu', 'bdZon'), M.homewizard.bronnen, M.sessy.bronnen, M.zonneplan.bronnen)}`);

const tvtFaq = [
  ['Verdien je een thuisaccu terug?', 'Milieu Centraal verwacht dat je een thuisaccu op dit moment hoogstwaarschijnlijk niet terugverdient met de besparing op je stroomrekening. Of het bij jou wel lukt, hangt af van de prijs per kWh, hoeveel je teruglevert en je energiecontract.'],
  ['Hoe lang gaat een thuisaccu mee?', 'Dat verschilt per merk. Sessy en Zonneplan noemen 6.000 cycli of meer, Zonneplan garandeert minimaal 70% capaciteit na tien jaar. HomeWizard noemt een verwachte levensduur tot 15 jaar.'],
];
export const tvtGids = g('/thuisaccu-terugverdientijd/', 'Thuisbatterij terugverdientijd: verdien je hem terug?', 'Verdien je een thuisaccu terug?', `Terugverdientijd = prijs gedeeld door wat je per jaar bespaart. In het voorbeeld van 10 zonnepanelen: 2,7 kWh in ${jr(T27)}, 5 kWh in ${jr(T5)}.`, 'thuisaccu-terugverdientijd', tvtFaq,
  `<p class="lead">Milieu Centraal is duidelijk: een thuisaccu kost vooral geld, en je verdient hem op dit moment hoogstwaarschijnlijk niet terug met de besparing op je stroomrekening. Na het einde van de saldering wordt elke kWh die je zelf gebruikt wel meer waard. Zo reken je het uit.</p>
<h2>De formule</h2><p><strong>Terugverdientijd = prijs van de accu ÷ besparing per jaar.</strong> De besparing is het aantal kWh dat je uit de accu gebruikt in plaats van terug te leveren, keer het verschil tussen wat je voor stroom betaalt en wat je voor teruglevering krijgt. Met een dynamisch contract kan daar opbrengst bij komen door goedkoop te laden en duur te gebruiken.</p>
<h2>Rekenvoorbeeld: 10 zonnepanelen</h2><p>Opwek ${EX.opwek.toLocaleString('nl-NL')} kWh, waarvan je ${EX.terug.toLocaleString('nl-NL')} kWh teruglevert (Milieu Centraal: 30% gebruik je direct zelf). Stroom kost € ${komma(STROOMPRIJS, 2)} per kWh (CBS), teruglevering levert netto ${ct(NETTO_TERUG)} op (Milieu Centraal).</p>
<div class="table-wrap"><table class="data stack"><thead><tr><th scope="col">Accu</th><th scope="col">Prijs</th><th scope="col">Uit de accu per jaar</th><th scope="col">Besparing</th><th scope="col">Terugverdiend</th></tr></thead><tbody>
${[['HomeWizard 2,7 kWh', 1195, T27], ['Sessy 5 kWh', 3550, T5], ['Sessy 10 kWh', 5500, T10], ['Sessy 10 kWh met dynamisch contract', 5500, T10D]].map(([n, p, t]) => `<tr><th scope="row">${n}</th><td class="n" data-l="Prijs">${eur(p)}</td><td class="n" data-l="Uit de accu">${t.kwh.toLocaleString('nl-NL')} kWh</td><td class="n" data-l="Besparing">${eur(t.besparing)}</td><td class="n" data-l="Terugverdiend"><strong>${jr(t)}</strong></td></tr>`).join('')}
</tbody></table></div>
<p>Aannames van ThuisaccuMatch, omdat geen bron ze vastlegt: de accu raakt op ${AANNAMES.volDagen} dagen per jaar vol (in de winter leveren je panelen te weinig op, zie Milieu Centraal), ${komma(AANNAMES.rendement * 100, 0)}% van de opgeslagen stroom komt er weer uit, en met een dynamisch contract laad je op ${AANNAMES.dynDagen} andere dagen goedkoop met € ${komma(AANNAMES.spread, 2)} prijsverschil per kWh. Pas ze aan in de <a href="/terugverdientijd-thuisaccu-berekenen/">rekentool</a>.</p>
<h2>Waarom een grotere accu niet altijd beter is</h2><p>Een accu levert alleen op als hij elke dag vol raakt én leeg gaat. Milieu Centraal rekent voor: 10 panelen wekken op een junidag zo'n 15 kWh op, op een decemberdag maar 2,5 kWh. In de winter raakt een grote accu dus niet vol. Daarom adviseert Milieu Centraal: kies niet te groot, de accu hoeft alleen je avond- en nachtverbruik te dekken. Bereken je capaciteit met de <a href="/capaciteit-thuisaccu-berekenen/">capaciteitsberekening</a>.</p>
<h2>Wat maakt het sneller?</h2><ul><li><strong>Een lage prijs per kWh.</strong> De grootste factor.</li><li><strong>Veel teruglevering.</strong> Meer panelen en overdag weinig thuis.</li><li><strong>Een dynamisch contract.</strong> Extra opbrengst door slim laden, maar de prijzen zijn onzeker (ACM ConsuWijzer).</li><li><strong>Btw terug.</strong> Onder voorwaarden kun je de btw terugvragen (Belastingdienst), zie <a href="/btw-thuisaccu/">btw op een thuisaccu</a>.</li></ul>
<h2>Eerst je verbruik omlaag?</h2><p>Volgens Milieu Centraal levert isoleren of een (hybride) warmtepomp meer op dan een thuisbatterij. Welke stap bij jouw huis past, lees je in <a href="https://verduurzaammatch.nl/blog/huis-verduurzamen-waar-beginnen/">huis verduurzamen: waar begin je</a> op VerduurzaamMatch. Wat een warmtepomp kost, staat bij <a href="https://warmtepompenmatch.nl/warmtepomp-kosten/">warmtepomp kosten</a> op WarmtepompenMatch.</p>
${end('Hoe snel verdien jij een thuisaccu terug?', B('mcAccu', 'mcNa2027', 'cbs', 'acmAanbod', 'bdBtw'), M.homewizard.bronnen, M.sessy.bronnen)}`);

const soortFaq = [
  ['Mag ik een stekkerbatterij zelf aansluiten?', 'De Brandweer zegt dat je een plug-and-play thuisbatterij zelf kunt aansluiten: rechtstreeks op een geaard stopcontact, zonder verlengsnoer of stekkerblok, niet op dezelfde groep als zware apparaten, liefst op een aparte groep en maximaal één batterij per groep.'],
  ['Wat is een hybride omvormer?', 'Een omvormer die zowel je zonnepanelen als een batterij aanstuurt. Een DC-gekoppelde accu, zoals die van SolarEdge, werkt met zo’n omvormer van hetzelfde merk. Een AC-gekoppelde accu, zoals Sessy, werkt naast je bestaande omvormer.'],
];
export const soortGids = g('/stekkerbatterij-of-vaste-thuisaccu/', 'Stekkerbatterij of vaste thuisaccu: de verschillen', 'Stekkerbatterij of vaste thuisaccu?', 'Een stekkerbatterij sluit je zelf aan, een vaste thuisaccu laat je plaatsen. Verschillen in capaciteit, vermogen, veiligheid, prijs en AC- of DC-koppeling.', 'stekkerbatterij-of-vaste-thuisaccu', soortFaq,
  `<p class="lead">Er zijn grofweg twee soorten thuisaccu's. Een stekkerbatterij steek je zelf in het stopcontact. Een vaste thuisaccu laat je door een installateur aansluiten op een eigen groep in de meterkast. Welke past bij jou?</p>
<h2>De verschillen</h2><div class="table-wrap"><table class="data stack"><thead><tr><th scope="col"></th><th scope="col">Stekkerbatterij</th><th scope="col">Vaste thuisaccu</th></tr></thead><tbody>
<tr><th scope="row">Aansluiten</th><td data-l="Stekkerbatterij">Zelf, op een geaard stopcontact</td><td data-l="Vaste thuisaccu">Installateur, op een eigen groep</td></tr>
<tr><th scope="row">Capaciteit</th><td data-l="Stekkerbatterij">Bijvoorbeeld 2,7 kWh per batterij (HomeWizard)</td><td data-l="Vaste thuisaccu">5 tot 35 kWh (Sessy, Zonneplan)</td></tr>
<tr><th scope="row">Vermogen</th><td data-l="Stekkerbatterij">800 watt per batterij op een stopcontact (HomeWizard)</td><td data-l="Vaste thuisaccu">Hoger, bijvoorbeeld 3,5 kW per module (Huawei)</td></tr>
<tr><th scope="row">Prijs</th><td data-l="Stekkerbatterij">€ 1.195 (HomeWizard)</td><td data-l="Vaste thuisaccu">Vanaf € 3.550 (Sessy 5 kWh)</td></tr>
<tr><th scope="row">Noodstroom</th><td data-l="Stekkerbatterij">Niet vermeld</td><td data-l="Vaste thuisaccu">Bij de meeste merken als uitbreiding</td></tr>
</tbody></table></div>
<h2>Stekkerbatterij: let op de groep</h2><p>Milieu Centraal vindt een stekkerbatterij, net als een vaste accu, nog geen aanrader en wijst extra op brandrisico. Bij een stekkerbatterij kan stroom op één groep van twee kanten komen: van het net en van de batterij. Dan kan er meer stroom door de bedrading gaan zonder dat de zekering uitschakelt, zeker als er ook een wasmachine of droger op die groep zit. Vakmensen volgen de NEN 1010-norm en sluiten een accu daarom aan op een aparte groep. De Brandweer geeft dezelfde tip: gebruik bij voorkeur een aparte groep en zet maximaal één batterij per groep.</p>
<h2>AC- of DC-gekoppeld</h2><p>Bij een vaste accu hoor je vaak deze termen. Een <strong>AC-gekoppelde</strong> accu werkt naast je bestaande omvormer: handig als je al zonnepanelen hebt. Sessy schrijft bijvoorbeeld dat je geen hybride omvormer nodig hebt en dat de accu op je bestaande omvormer en groep past. Een <strong>DC-gekoppelde</strong> accu hangt aan een hybride omvormer van hetzelfde systeem. SolarEdge schrijft dat je de Home Battery installeert met de eigen Home Hub- of Home Wave-omvormer. Dat past vooral als je panelen en accu tegelijk laat plaatsen of je omvormer toch aan vervanging toe is.</p>
<h2>Welke kies je?</h2><ul><li><strong>Weinig overschot, klein budget, zelf aansluiten:</strong> een stekkerbatterij. Zie <a href="/merken/homewizard/">HomeWizard</a>.</li><li><strong>Veel overschot, groot avondverbruik of noodstroom:</strong> een vaste accu. Zie <a href="/merken/">alle merken</a>.</li><li><strong>Twijfel over de grootte:</strong> <a href="/capaciteit-thuisaccu-berekenen/">bereken de capaciteit</a>.</li></ul>
${end('Stekker of vast: wat past bij jou?', B('mcAccu', 'brandweerStekker', 'brandweer'), M.homewizard.bronnen, M.sessy.bronnen, M.solaredge.bronnen, [['Huawei LUNA2000-S1', 'https://solar.huawei.com/nl/products/luna2000-7-14-21-s1/']])}`);

const dynFaq = [
  ['Wanneer weet ik de prijzen van morgen?', 'Klanten met een dynamisch contract zien elke dag rond 16.00 uur de stroomprijzen voor de volgende dag (ACM).'],
  ['Betaal ik een opzegvergoeding bij een dynamisch contract?', 'Nee. Bij contracten met variabele en dynamische tarieven betaal je geen opzegvergoeding (ACM ConsuWijzer).'],
];
export const dynGids = g('/thuisaccu-dynamisch-energiecontract/', 'Thuisaccu en dynamisch energiecontract: zo werkt het', 'Thuisaccu met een dynamisch energiecontract', 'Met een dynamisch contract laadt je accu als stroom goedkoop is en gebruik je hem als stroom duur is. Hoe het werkt, de risico’s en de btw.', 'thuisaccu-dynamisch-energiecontract', dynFaq,
  `<p class="lead">Met een dynamisch energiecontract verandert de stroomprijs per kwartier of per uur. Een thuisaccu kan dan laden als stroom goedkoop is en ontladen als stroom duur is. Dat kan extra opleveren, maar de prijzen zijn niet te voorspellen.</p>
<h2>Hoe een dynamisch contract werkt</h2><ul><li>De stroomprijs volgt de marktprijs en kan per kwartier of per uur veranderen; de gasprijs per dag (ACM ConsuWijzer).</li><li>Sinds oktober 2025 worden de prijzen voor de volgende dag (day-ahead) per kwartier verhandeld: 96 prijzen per dag in plaats van 24. Niet alle leveranciers geven die kwartierprijzen door (ACM).</li><li>Je ziet de prijzen van morgen elke dag rond 16.00 uur, via een app of de website (ACM).</li><li>Je hebt een slimme meter nodig, en de prijzen in de toekomst zijn niet te voorspellen (ACM ConsuWijzer).</li></ul>
<h2>Wat een accu daarmee doet</h2><p>Een accu met slimme aansturing laadt op momenten met een lage prijs, bijvoorbeeld 's middags bij veel zon en wind, en levert de stroom als de prijs hoog is, vaak in de avond. HomeWizard schrijft dat de Plug-In Battery in de winter op de voordeligste momenten uit het net laadt. Sessy, Zonneplan en SolarEdge noemen ook aansturing op stroomprijzen. Milieu Centraal noemt dat sommige grotere accu's ook zonder zonnepanelen worden gebruikt om te handelen op de elektriciteitsmarkt, maar verwacht dat je ook zo'n accu op dit moment hoogstwaarschijnlijk niet terugverdient.</p>
<h2>Wat levert het op?</h2><p>Dat hangt af van het verschil tussen goedkope en dure uren, en hoe vaak dat verschil er is. Geen onafhankelijke bron legt een vast bedrag vast. In onze <a href="/terugverdientijd-thuisaccu-berekenen/">rekentool</a> staat als aanname € ${komma(AANNAMES.spread, 2)} prijsverschil per kWh op ${AANNAMES.dynDagen} dagen per jaar; pas die aan aan je eigen contract. In het voorbeeld met 10 zonnepanelen en een accu van 10 kWh gaat de terugverdientijd daarmee van ${jr(T10)} naar ${jr(T10D)}.</p>
<h2>Btw terugvragen</h2><p>Gebruik je de accu voor in- en verkoop van stroom met een dynamisch contract en een energiemanagementsysteem (EMS), dan kun je volgens de Belastingdienst de btw op aanschaf en installatie terugvragen. Je bent dan btw-ondernemer en doet elk kwartaal btw-aangifte over je terugleververgoeding. Zie <a href="/btw-thuisaccu/">btw op een thuisaccu</a>.</p>
<h2>En een warmtepomp?</h2><p>Ook een warmtepomp kan op stroomprijzen sturen. RVO is van plan om vanaf 2027 € 200 extra ISDE te geven voor een slimme warmtepomp (EEBus, S2 of Matter); dat is nog voorgenomen. Hoe snel een warmtepomp zichzelf terugbetaalt, lees je bij <a href="https://warmtepompenmatch.nl/warmtepomp-terugverdientijd/">terugverdientijd van een warmtepomp</a> op WarmtepompenMatch.</p>
<h2>Risico's</h2><ul><li>Je kunt ook meer gaan betalen dan met een vast contract (ACM ConsuWijzer).</li><li>Een aanbod met dynamische tarieven is moeilijk te vergelijken met een vast of variabel aanbod (ACM ConsuWijzer).</li><li>Je leverancier kan niet inschatten wat je per jaar betaalt (ACM ConsuWijzer).</li></ul>
${end('Past een thuisaccu bij jouw contract?', B('acmAanbod', 'acmKiezen', 'acmKwartier', 'mcAccu', 'bdBtw'), M.homewizard.bronnen.slice(0, 1), M.zonneplan.bronnen.slice(0, 1))}`);

const tlkFaq = [
  ['Mogen terugleverkosten hoger zijn dan de vergoeding?', 'Dat kan. Volgens ACM ConsuWijzer kunnen de terugleverkosten soms hoger uitvallen dan de vergoeding voor de teruggeleverde stroom. Milieu Centraal noemt dat enkele kleine energiemaatschappijen netto een negatief bedrag rekenen; volgens de ACM is dat in hun geval niet verboden.'],
  ['Betaal ik terugleverkosten over stroom die ik zelf gebruik?', 'Nee. Stroom die je zelf gebruikt, telt niet mee voor de terugleverkosten (Milieu Centraal).'],
];
export const tlkGids = g('/terugleverkosten/', 'Terugleverkosten en terugleververgoeding vanaf 2027', 'Terugleverkosten en terugleververgoeding', 'Wat terugleverkosten zijn, waarom leveranciers ze rekenen, wat de terugleververgoeding na 2027 minimaal is en wat je netto overhoudt per kWh.', 'terugleverkosten', tlkFaq,
  `<p class="lead">Vanaf 2027 krijg je voor teruggeleverde zonnestroom een terugleververgoeding, en betaal je bij veel leveranciers terugleverkosten. Wat je netto overhoudt, bepaalt hoeveel een thuisaccu kan opleveren.</p>
<h2>Waarom leveranciers terugleverkosten rekenen</h2><p>Huishoudens met zonnepanelen veroorzaken extra kosten bij leveranciers, schrijft Milieu Centraal. Ten eerste onbalanskosten: het is moeilijk te voorspellen hoeveel zonnestroom er het net op komt, en de netbeheerder rekent de kosten van onbalans door aan de leverancier. Ten tweede hogere inkoopkosten: mensen met zonnepanelen nemen relatief vaker stroom af op dure momenten. De ACM heeft bepaald dat het terecht is dat leveranciers deze kosten doorrekenen. Ze doen dat met een bedrag per teruggeleverde kWh, hogere vaste kosten of minder korting.</p>
<h2>De terugleververgoeding na 2027</h2><p>Vanaf 1 januari 2027 krijg je voor alle teruggeleverde stroom een redelijke vergoeding van je leverancier. Tot 1 januari 2030 is dat minstens 50% van het kale leveringstarief, de prijs zonder energiebelasting en btw (Rijksoverheid, ACM ConsuWijzer). Het CBS meldt voor september 2026 een gemiddeld variabel leveringstarief van € ${komma(LEVERING, 4)} per kWh inclusief btw, dus ongeveer ${ct(KAAL)} zonder btw. De minimale vergoeding is dan ongeveer ${ct(MIN_VERGOEDING)} per kWh.</p>
<h2>Wat je netto overhoudt</h2><p>Vergoeding min terugleverkosten. Bij een vast of variabel contract is dat volgens Milieu Centraal netto rond de halve cent per kWh. Tegenover de ongeveer € ${komma(STROOMPRIJS, 2)} die je betaalt voor een kWh uit het net, is dat bijna niets. Zelfopgewekte stroom is daarom bij een vast of variabel contract vaak 3 tot 4 keer goedkoper dan ingekochte stroom (Milieu Centraal).</p>
<h2>Hoe je terugleverkosten beperkt</h2><ol><li><strong>Meer zelf gebruiken.</strong> Was, droog en laad overdag. Stroom die je zelf gebruikt, telt niet mee voor de terugleverkosten. Koop je nog panelen, lees dan bij <a href="https://verduurzaammatch.nl/blog/zonnepanelen-kosten-2026/">zonnepanelen kopen in 2026: aantal en prijs</a> op VerduurzaamMatch waarom je het aantal kiest bij je verbruik.</li><li><strong>Contract vergelijken.</strong> De kosten verschillen veel per bedrijf en worden op verschillende manieren berekend (Milieu Centraal). Let bij een nieuw contract op beide bedragen.</li><li><strong>Een vast contract loopt door.</strong> Bij een vast tarief mag je leverancier de terugleververgoeding niet tussentijds wijzigen (ACM ConsuWijzer).</li><li><strong>Een thuisaccu.</strong> Die verplaatst overdag overschot naar de avond. Zie <a href="/thuisaccu-terugverdientijd/">verdien je een thuisaccu terug?</a></li></ol>
<p><a class="btn" href="/einde-salderen-berekenen/" data-tool="saldering">Bereken wat het einde van salderen jou kost</a></p>
${end('Verplaats je overschot naar de avond', B('mcSaldering', 'mcNa2027', 'rijkSaldering', 'acmSalderen', 'cbs'))}`);

const btwFaq = [
  ['Krijg ik 0% btw als ik de accu samen met zonnepanelen koop?', 'Nee. De Belastingdienst noemt "de levering en installatie van een accupakket en thuisbatterij (thuisaccu)" uitdrukkelijk als iets waarvoor het 21%-tarief blijft gelden.'],
  ['Geldt er een forfait voor de btw op een thuisaccu?', 'Nee. Voor de thuisbatterij geldt geen forfait; je berekent de btw die je moet betalen zelf (Belastingdienst).'],
];
export const btwGids = g('/btw-thuisaccu/', 'Btw op een thuisaccu: 21%, en wanneer je hem terugkrijgt', 'Btw op een thuisaccu terugvragen', 'Op een thuisaccu betaal je 21% btw, ook samen met zonnepanelen. Onder welke voorwaarden je de btw terugvraagt en wat je daarvoor moet doen.', 'btw-thuisaccu', btwFaq,
  `<p class="lead">Op zonnepanelen bij een woning is het btw-tarief 0%. Op een thuisaccu niet: daarop betaal je 21% btw (Belastingdienst). Onder voorwaarden kun je die btw wel terugvragen.</p>
<h2>21% btw, ook samen met zonnepanelen</h2><p>De Belastingdienst noemt in de lijst van wat niet onder het 0%-tarief valt letterlijk "de levering en installatie van een accupakket en thuisbatterij (thuisaccu)". Dat geldt ook als je de accu tegelijk met zonnepanelen koopt. Krijg je een offerte met 0% btw op de accu, vraag de installateur dan om uitleg.</p>
<h2>Wanneer kun je de btw terugvragen?</h2><p>Volgens de Belastingdienst kun je de btw op aanschaf en installatie terugvragen als:</p><ul><li>je de accu gebruikt voor de in- en verkoop van stroom bij je energiemaatschappij, en daar een vergoeding voor krijgt. Daardoor ben je ondernemer voor de btw;</li><li>de accu een energiemanagementsysteem (EMS) heeft om in stroom te handelen;</li><li>je een dynamisch energiecontract hebt;</li><li>de factuur van de accu en het energiecontract op jouw naam staan;</li><li>je bij aanschaf en installatie geen deelnemer bent aan de kleineondernemersregeling (KOR).</li></ul><p>Gebruik je de accu alleen privé, of krijg je geen vergoeding voor teruggeleverde stroom, dan kun je de btw niet terugvragen.</p>
<h2>Wat het je daarna kost</h2><p>Vraag je de btw terug, dan ben je btw-plichtig en doe je elk kwartaal btw-aangifte. Je geeft 21% btw aan over de vergoeding die je het afgelopen kwartaal van je energiemaatschappij kreeg. Voor de thuisbatterij geldt geen forfait, dus je rekent het zelf uit (Belastingdienst). Laat het narekenen voordat je koopt.</p>
<h2>Prijzen "na btw-teruggave"</h2><p>Sommige aanbieders tonen prijzen na teruggave van de btw. <a href="/merken/zonneplan/">Zonneplan</a> noemt bijvoorbeeld € 4.690 voor 10 kWh "na teruggave btw". Daarvoor moet je aan de voorwaarden van de Belastingdienst hierboven voldoen. Kun of wil je de btw niet terugvragen, dan betaal je 21% meer: voor dat voorbeeld ongeveer ${eur(4690 * 1.21)}. Vergelijk offertes daarom altijd inclusief btw.</p>
${end('Past een thuisaccu bij jouw situatie?', B('bdBtw', 'bdZon'), M.zonneplan.bronnen)}`);

const veiligFaq = [
  ['Waar hang ik een thuisaccu het best?', 'Volgens de Brandweer het liefst in de schuur: koel en goed geventileerd. Geen schuur? Dan in de garage of op zolder, maar niet in je vluchtweg.'],
  ['Moet ik mijn verzekeraar inlichten?', 'Ja, de Brandweer raadt aan je verzekering te informeren over de plaatsing van een thuisbatterij en te checken of er aanvullende voorwaarden gelden.'],
];
export const veiligGids = g('/thuisaccu-veiligheid/', 'Brandgevaar thuisbatterij: zo plaats je hem veilig', 'Brandgevaar thuisbatterij: zo plaats je een thuisaccu veilig', 'Brandgevaar van een thuisbatterij beperken: waar je de accu hangt, waarom niet in je vluchtroute, een rookmelder erbij en tips voor een stekkerbatterij.', 'thuisaccu-veiligheid', veiligFaq,
  `<p class="lead">Een thuisaccu is veilig als hij goed gekozen, geplaatst en aangesloten is. Het Nederlands Instituut Publieke Veiligheid (NIPV) concludeert wel dat een thuisbatterij de kans op een incident verhoogt en dat een brand groter kan zijn, door snelle brandgroei en explosierisico. Zo beperk je dat risico.</p>
<h2>De plek</h2><ul><li><strong>Een aparte ruimte.</strong> Het NIPV noemt twee maatregelen die samen het risico ongeveer terugbrengen tot dat van een woning zonder accu: de accu in een aparte ruimte plaatsen (niet in een verblijfsruimte of vluchtroute) en de verschijnselen van thermal runaway detecteren.</li><li><strong>Koel en geventileerd.</strong> De Brandweer noemt de schuur als meest brandveilige plek, anders de garage of zolder. Milieu Centraal: een kast is geen goed geventileerde plek.</li><li><strong>Niet in je vluchtroute.</strong> Bij brand wil je snel naar buiten; rook kan je weg blokkeren (Brandweer).</li><li><strong>Onbrandbare ondergrond.</strong> Laat de accu op of aan een onbrandbare ondergrond monteren (Brandweer).</li><li><strong>Rookmelder.</strong> Hang een werkende rookmelder in de ruimte van de accu. Milieu Centraal noemt ook een koolmonoxidemelder.</li></ul>
<h2>De accu zelf</h2><p>Een thuisaccu bestaat uit honderden accucellen, aangestuurd door een batterijmanagementsysteem (BMS). Brand ontstaat vaak in één cel, door kortsluiting, overladen of diep ontladen. Vraag de leverancier of het BMS uitschakelt bij storing of temperatuurstijging, en kijk in het datasheet of de accu gekwalificeerd is volgens de norm IEC-EN 62619 (Brandweer). De meeste thuisaccu's hebben LFP-cellen (lithium-ijzerfosfaat), schrijft Milieu Centraal. In onze <a href="/vergelijken/">vergelijking</a> zie je per merk of het LFP noemt.</p>
<h2>Een vaste accu: laat hem plaatsen</h2><p>Laat de installatie doen door een erkend installateur. De Brandweer verwijst naar echteinstallateur.nl voor een gecertificeerde installateur die ook thuisaccu's plaatst, en raadt een onderhoudscontract aan.</p>
<h2>Een stekkerbatterij: zo sluit je hem aan</h2><ul><li>Rechtstreeks op een geaard stopcontact, zonder verlengsnoer of stekkerblok.</li><li>Niet op dezelfde groep als zware apparaten zoals een wasmachine; liefst op een aparte groep.</li><li>Maximaal één accu per groep. Meer? Schakel een erkend installateur in.</li><li>Markeer in de meterkast dat er een accu is aangesloten, met het (nood)nummer van de leverancier.</li><li>Controleer twee keer per jaar stekker, kabels en behuizing op schade.</li></ul><p class="src">Zie de Brandweer over de plug-and-play thuisbatterij en Milieu Centraal over brandrisico bij stekkerbatterijen.</p>
${end('Welke thuisaccu past bij jouw huis?', B('brandweer', 'brandweerStekker', 'nipv', 'mcAccu'))}`);

const LEES = {
  '/salderingsregeling-stopt-2027/': ['/terugleverkosten/', '/thuisaccu-terugverdientijd/', '/thuisaccu-dynamisch-energiecontract/', '/einde-salderen-berekenen/'],
  '/thuisaccu-kosten/': ['/btw-thuisaccu/', '/thuisaccu-terugverdientijd/', '/stekkerbatterij-of-vaste-thuisaccu/', '/vergelijken/'],
  '/thuisaccu-terugverdientijd/': ['/thuisaccu-kosten/', '/salderingsregeling-stopt-2027/', '/thuisaccu-dynamisch-energiecontract/', '/terugverdientijd-thuisaccu-berekenen/', '/blog/thuisbatterij-rendabel-2027/'],
  '/stekkerbatterij-of-vaste-thuisaccu/': ['/thuisaccu-veiligheid/', '/thuisaccu-kosten/', '/merken/homewizard/', '/capaciteit-thuisaccu-berekenen/'],
  '/thuisaccu-dynamisch-energiecontract/': ['/btw-thuisaccu/', '/salderingsregeling-stopt-2027/', '/terugleverkosten/', '/terugverdientijd-thuisaccu-berekenen/', '/blog/thuisbatterij-dynamisch-contract/'],
  '/terugleverkosten/': ['/salderingsregeling-stopt-2027/', '/thuisaccu-dynamisch-energiecontract/', '/thuisaccu-terugverdientijd/', '/einde-salderen-berekenen/', '/blog/thuisbatterij-terugleverkosten-2027/'],
  '/btw-thuisaccu/': ['/thuisaccu-kosten/', '/thuisaccu-dynamisch-energiecontract/', '/merken/zonneplan/', '/terugverdientijd-thuisaccu-berekenen/'],
  '/thuisaccu-veiligheid/': ['/stekkerbatterij-of-vaste-thuisaccu/', '/thuisaccu-kosten/', '/vergelijken/', '/capaciteit-thuisaccu-berekenen/'],
};
const NAMEN = Object.fromEntries([...GIDSLINKS, ...TOOLS.map(([h, t]) => [h, t]), ['/vergelijken/', 'Alle thuisaccu’s vergelijken'], ['/blog/thuisbatterij-rendabel-2027/', 'Blog: is een thuisbatterij rendabel in 2027?'], ['/blog/thuisbatterij-dynamisch-contract/', 'Blog: welke thuisbatterij past bij een dynamisch contract?'], ['/blog/thuisbatterij-terugleverkosten-2027/', 'Blog: thuisbatterij en terugleverkosten 2027'], ...IDS.map((id) => [`/merken/${M[id].slug}/`, `${M[id].naam}-thuisaccu`])]);
export const leesOok = (path) => (LEES[path] ? `<h2>Lees ook</h2><ul class="gidslijst">${LEES[path].map((h) => `<li><a href="${h}">${esc(NAMEN[h])}</a></li>`).join('')}</ul>` : '');
const BIJGEWERKT = { '/thuisaccu-veiligheid/': '2026-10-26', '/salderingsregeling-stopt-2027/': '2026-10-19', '/thuisaccu-terugverdientijd/': '2026-10-19', '/thuisaccu-dynamisch-energiecontract/': '2026-10-19' };
export const guides = [salderingGids, kostenGids, tvtGids, soortGids, dynGids, tlkGids, btwGids, veiligGids].map((x) => (BIJGEWERKT[x.path] ? { ...x, lastmod: BIJGEWERKT[x.path], article: { ...x.article, updated: BIJGEWERKT[x.path] }, schema: x.schema.map((o) => (o['@type'] === 'Article' ? { ...o, dateModified: BIJGEWERKT[x.path] } : o)) } : x)).map((x) => ({ ...x, body: x.body.replace('<p class="src">Bronnen:', () => `${leesOok(x.path)}<p class="src">Bronnen:`) }));

// ---- Rekentools ----
const num = (id, label, val, unit, hint, attrs = '') => `<div class="field"><label for="${id}">${label}</label><div class="inline"><input type="text" inputmode="decimal" id="${id}" name="${id}" value="${val}" ${attrs}><span class="unit">${unit}</span></div>${hint ? `<span class="hint">${hint}</span>` : ''}</div>`;
const R = [['/rekentools/', 'Rekentools']];
const srcs = (...ids) => `<p class="src">Bronnen: ${ids.map((k) => `<a href="${BRON[k].url}" rel="noopener">${esc(BRON[k].naam)}</a>`).join(' · ')}</p>`;
const tool = (o) => ({ ...o, crumb: o.crumb, parents: R, navPath: '/rekentools/', stamp: { checked: CHECKED } });

// SEO-audit 20-10 (TAM-02): uitgewerkt voorbeeld en FAQ onder de rekentool, alleen met de rekenregels en standaardwaarden van de tool.
const T5D = terugverdien({ prijs: 3550, capaciteit: 5, teruglevering: EX.terug, dynamisch: true });
const tvtToolFaq = [
  ['Welke gegevens heb ik nodig om de terugverdientijd te berekenen?', 'De prijs van de accu inclusief installatie en btw, de bruikbare capaciteit in kWh (datasheet of offerte) en hoeveel stroom je per jaar teruglevert (jaarafrekening). Stroomprijs en terugleververgoeding staan al ingevuld; pas ze aan aan je eigen contract.'],
  ['Waarom geeft de rekentool een lange terugverdientijd?', `Omdat een accu maar een beperkt aantal kWh per jaar verschuift: hooguit capaciteit × ${AANNAMES.volDagen} dagen dat hij vol raakt, keer ${komma(AANNAMES.rendement * 100, 0)}% rendement. Per kWh bespaar je het verschil tussen de stroomprijs (€ ${komma(STROOMPRIJS, 2)}) en de netto terugleververgoeding (${ct(NETTO_TERUG)}). Milieu Centraal schrijft dat je een thuisaccu op dit moment hoogstwaarschijnlijk niet terugverdient.`],
  ['Verandert de terugverdientijd door het einde van salderen?', 'Ja. Tot en met 2026 streep je teruggeleverde stroom weg tegen je verbruik, dus een accu levert dan weinig extra op. Vanaf 1 januari 2027 krijg je voor teruglevering alleen een vergoeding; tot 2030 minstens 50% van het kale leveringstarief, minus eventuele terugleverkosten (Rijksoverheid). Elke kWh die je dan zelf uit de accu gebruikt, scheelt het verschil met de stroomprijs.'],
  ['Telt een dynamisch contract mee?', 'Alleen als je het vinkje zet. Dan rekent de tool er een opbrengst van slim laden uit het net bij: capaciteit × dagen × rendement × prijsverschil. Die dagen en dat prijsverschil zijn aannames, want dynamische prijzen zijn niet te voorspellen (ACM ConsuWijzer).'],
];
const GEV = [['5 kWh voor € 3.550, ' + EX.terug.toLocaleString('nl-NL') + ' kWh teruglevering', T5], ['Idem, met dynamisch contract', T5D], ['10 kWh voor € 5.500, ' + EX.terug.toLocaleString('nl-NL') + ' kWh teruglevering', T10], ['Idem, met dynamisch contract', T10D], ['10 kWh voor € 5.500, 1.000 kWh teruglevering', terugverdien({ prijs: 5500, capaciteit: 10, teruglevering: 1000 })]];
const tvtVoorbeeld = `<section id="voorbeeld"><h2>Rekenvoorbeeld met de standaardwaarden</h2>
<p>Een accu van 5 kWh voor ${eur(3550)} (adviesprijs Sessy 5 kWh), bij ${EX.terug.toLocaleString('nl-NL')} kWh teruglevering per jaar:</p>
<ol><li><strong>Uit de accu per jaar:</strong> het kleinste van ${EX.terug.toLocaleString('nl-NL')} kWh en 5 × ${AANNAMES.volDagen} = ${(5 * AANNAMES.volDagen).toLocaleString('nl-NL')} kWh, keer ${komma(AANNAMES.rendement * 100, 0)}% = ${T5.kwh.toLocaleString('nl-NL')} kWh.</li><li><strong>Besparing per kWh:</strong> € ${komma(STROOMPRIJS, 2)} die je niet inkoopt, min ${ct(NETTO_TERUG)} die je niet meer krijgt voor teruglevering.</li><li><strong>Besparing per jaar:</strong> ${eur(T5.besparing)}.</li><li><strong>Terugverdientijd:</strong> ${eur(3550)} ÷ ${eur(T5.besparing)} = ${jr(T5)}.</li></ol>
<p>Met een dynamisch contract en slim laden komt daar volgens de aannames van de tool ${eur(T5D.dyn)} per jaar bij: 5 kWh × ${AANNAMES.dynDagen} dagen × ${komma(AANNAMES.rendement * 100, 0)}% × € ${komma(AANNAMES.spread, 2)}. De besparing wordt dan afgerond ${eur(T5D.besparing)} per jaar en de terugverdientijd ${jr(T5D)}. Pas de waarden hierboven aan voor je eigen offerte en contract.</p></section>
<section id="salderen"><h2>Waarom 1 januari 2027 de som verandert</h2>
<p>Tot en met 31 december 2026 mag je de stroom die je teruglevert wegstrepen tegen je verbruik (salderen). Rijksoverheid geeft het voorbeeld: lever je in de zomer 2.500 kWh terug, dan gebruik je in de winter 2.500 kWh zonder stroomkosten, netwerkkosten en energiebelasting. Zolang je saldeert, levert een accu je op teruggeleverde stroom dus weinig extra op.</p>
<p>Vanaf 1 januari 2027 mag dat niet meer. Voor alles wat je teruglevert krijg je een vergoeding van je leverancier. Tot 2030 is die minstens 50% van het kale leveringstarief, de prijs zonder belastingen. Leveranciers rekenen vaak terugleverkosten, en daar houdt de ACM toezicht op. Over stroom die je zelf opwekt en direct gebruikt betaal je geen belasting en geen leverancierskosten (Rijksoverheid). Daarom rekent deze tool met het verschil tussen de stroomprijs en de netto vergoeding: dat is wat een accu je per verschoven kWh oplevert.</p></section>
<section id="gevoeligheid"><h2>Wat verandert de uitkomst het meest?</h2>
<p>Onze rekensom met de aannames van de tool (${AANNAMES.volDagen} volle dagen, ${komma(AANNAMES.rendement * 100, 0)}% rendement, stroom € ${komma(STROOMPRIJS, 2)}, netto teruglevering ${ct(NETTO_TERUG)}). Prijzen: adviesprijzen van Sessy, inclusief btw.</p>
<div class="table-wrap"><table class="data stack"><thead><tr><th scope="col">Situatie</th><th scope="col">Zonnestroom uit de accu per jaar</th><th scope="col">Besparing per jaar</th><th scope="col">Terugverdientijd</th></tr></thead><tbody>${GEV.map(([l, t]) => `<tr><th scope="row">${l}</th><td class="n" data-l="Uit de accu">${t.kwh.toLocaleString('nl-NL')} kWh</td><td class="n" data-l="Besparing">${eur(t.besparing)}</td><td class="n" data-l="Terugverdientijd">${jr(t)}</td></tr>`).join('')}</tbody></table></div>
<ul><li><strong>Grootte telt pas als je genoeg teruglevert.</strong> Een accu van 5 kWh verschuift hooguit ${(5 * AANNAMES.volDagen).toLocaleString('nl-NL')} kWh per jaar, wat je ook teruglevert. Lever je minder terug dan capaciteit × ${AANNAMES.volDagen}, dan staat een deel van een grote accu stil.</li><li><strong>Een dynamisch contract</strong> verkort de tijd het meest, maar de opbrengst is een aanname: dynamische prijzen zijn niet te voorspellen (ACM ConsuWijzer).</li><li><strong>De prijs uit je offerte</strong> werkt één op één door: 10% goedkoper is 10% kortere terugverdientijd.</li></ul>
<p>Controleer in je offerte of het om <strong>bruikbare</strong> capaciteit gaat, en of de prijs inclusief installatie en btw is. Of je de btw kunt terugvragen, lees je in <a href="/btw-thuisaccu/">btw op een thuisaccu</a>. Welke merken een openbare prijs hebben, zie je in <a href="/vergelijken/">de vergelijking</a>.</p><p class="src">Bronnen: <a href="${BRON.rijkSaldering.url}" rel="noopener">${esc(BRON.rijkSaldering.naam)}</a> · <a href="https://www.sessy.nl/prijsinformatie" rel="noopener">Sessy: prijsinformatie</a> · <a href="${BRON.acmAanbod.url}" rel="noopener">${esc(BRON.acmAanbod.naam)}</a></p></section>
${faqHtml(tvtToolFaq)}`;
export const calcTvt = tool({
  path: '/terugverdientijd-thuisaccu-berekenen/', title: 'Terugverdientijd thuisaccu berekenen (2027) | ThuisaccuMatch', h1: 'Terugverdientijd van je thuisaccu berekenen', crumb: 'Terugverdientijd', og: 'rekenhulp',
  description: 'Bereken wat een thuisaccu per jaar oplevert na het einde van de saldering en na hoeveel jaar je hem terugverdient. Met of zonder dynamisch contract.',
  scripts: ['/js/terugverdientijd.js'],
  schema: [app('Terugverdientijd thuisaccu berekenen', '/terugverdientijd-thuisaccu-berekenen/'), faqSchema(tvtToolFaq)],
  body: `<h1>Terugverdientijd van je thuisaccu berekenen</h1><p class="lead">Vul de prijs en capaciteit uit je offerte in en hoeveel stroom je teruglevert. De rest staat op de cijfers van het CBS en Milieu Centraal; pas ze aan aan je eigen contract.</p>
<div class="grid calc">
<form class="calc-form card" id="form" novalidate>
${num('prijs', 'Prijs van de accu, inclusief installatie en btw', 3550, '€', 'Standaard: Sessy 5 kWh, adviesprijs € 3.550.')}
${num('cap', 'Bruikbare capaciteit', 5, 'kWh', 'Staat in het datasheet of de offerte.')}
${num('terug', 'Teruglevering per jaar', EX.terug, 'kWh', 'Staat op je jaarafrekening. Standaard: 10 panelen, 70% teruggeleverd (Milieu Centraal).')}
<label class="check"><input type="checkbox" id="dyn" name="dyn"><span>Ik heb een dynamisch contract en laad ook slim uit het net</span></label>
<details><summary>Prijzen en aannames aanpassen</summary>${num('stroom', 'Stroomprijs (levering + energiebelasting)', komma(STROOMPRIJS, 2), '€ per kWh', 'CBS, september 2026.')}${num('netto', 'Netto terugleververgoeding', komma(NETTO_TERUG, 3), '€ per kWh', 'Na terugleverkosten. Milieu Centraal: rond de halve cent.')}${num('dagen', 'Dagen per jaar dat de accu vol raakt', AANNAMES.volDagen, 'dagen', 'Aanname: in de winter is er te weinig zon.')}${num('rend', 'Rendement', komma(AANNAMES.rendement * 100, 0), '%', 'Aanname: stroom die er weer uit komt.')}${num('dyndagen', 'Dagen met slim laden uit het net', AANNAMES.dynDagen, 'dagen', 'Aanname, alleen met dynamisch contract.')}${num('spread', 'Prijsverschil goedkoop en duur', komma(AANNAMES.spread, 2), '€ per kWh', 'Aanname, alleen met dynamisch contract.')}</details>
</form>
<aside class="card result" id="result" aria-live="polite"><h2>Jouw uitkomst</h2><p class="big" id="r-jaren">${jr(T5)}</p><p class="sub">terugverdientijd</p>
<table class="kv"><tbody><tr><td>Uit de accu per jaar</td><td id="r-kwh">${T5.kwh.toLocaleString('nl-NL')} kWh</td></tr><tr><td>Besparing zonnestroom</td><td id="r-zon">${eur(T5.zon)}</td></tr><tr><td>Opbrengst slim laden</td><td id="r-dyn">${eur(0)}</td></tr><tr class="total"><td>Besparing per jaar</td><td id="r-besp">${eur(T5.besparing)}</td></tr><tr><td>Prijs per kWh opslag</td><td id="r-pkwh">${eur(T5.perKwh)}</td></tr></tbody></table>
<p class="src" id="r-noot">Milieu Centraal: een thuisaccu verdien je op dit moment hoogstwaarschijnlijk niet terug.</p></aside>
</div>
<section class="method" id="methode"><h2>Zo rekenen we</h2><ul><li><strong>Uit de accu per jaar:</strong> het kleinste van je teruglevering en capaciteit × dagen dat de accu vol raakt, keer het rendement.</li><li><strong>Besparing zonnestroom:</strong> die kWh koop je niet in (€ ${komma(STROOMPRIJS, 2)}) en lever je niet terug (netto ${ct(NETTO_TERUG)}). Het verschil is je besparing per kWh.</li><li><strong>Slim laden:</strong> alleen met een dynamisch contract. Capaciteit × dagen × rendement × prijsverschil. De prijzen zijn niet te voorspellen (ACM ConsuWijzer), dus dit is een schatting.</li><li><strong>Stroomprijs:</strong> CBS, september 2026: variabel leveringstarief € ${komma(LEVERING, 4)} plus energiebelasting € ${komma(ENERGIEBELASTING, 5)} per kWh, inclusief btw.</li><li><strong>Niet meegerekend:</strong> slijtage van de accu, rente, prijsstijgingen en een eventuele btw-teruggave.</li></ul>
<p>Kijk ook naar de grootte: een te grote accu raakt in de winter niet vol en verlengt je terugverdientijd. Milieu Centraal raadt aan niet te groot te kiezen. Bereken je capaciteit met de <a href="/capaciteit-thuisaccu-berekenen/">capaciteitsberekening</a>, of zie met de <a href="/einde-salderen-berekenen/">rekentool einde salderen</a> wat het einde van salderen je kost.</p>${srcs('cbs', 'mcAccu', 'mcNa2027', 'acmAanbod')}</section>
${tvtVoorbeeld}
<p>Meer uitleg: <a href="/thuisaccu-terugverdientijd/">verdien je een thuisaccu terug?</a> · <a href="/thuisaccu-kosten/">wat kost een thuisaccu?</a> · <a href="/thuisaccu-keuzehulp/">past een thuisaccu bij jou?</a></p>`,
});
// Uitgebreid 23-10-2026 (Rijksoverheid salderen, Sessy-prijzen opnieuw gecontroleerd). Datum bij push gelijkzetten aan de pushdatum.
calcTvt.stamp = { checked: '2026-10-23', updated: '2026-10-23' };
calcTvt.lastmod = '2026-10-23';

export const calcCap = tool({
  path: '/capaciteit-thuisaccu-berekenen/', title: 'Hoeveel kWh thuisaccu heb je nodig? Bereken het', h1: 'Hoeveel kWh thuisaccu heb je nodig?', crumb: 'Capaciteit', og: 'capaciteit',
  description: 'Bereken hoeveel kWh thuisaccu je nodig hebt uit je verbruik en zonnepanelen. Niet groter dan je avond- en nachtverbruik, zoals Milieu Centraal adviseert.',
  scripts: ['/js/capaciteit.js'],
  schema: [app('Capaciteit thuisaccu berekenen', '/capaciteit-thuisaccu-berekenen/')],
  body: `<h1>Hoeveel kWh thuisaccu heb je nodig?</h1><p class="lead">Milieu Centraal: kies niet te groot. Een thuisaccu hoeft alleen je avond- en nachtverbruik te dekken, en hij moet overdag ook vol kunnen raken. Vul je verbruik en je zonnepanelen in.</p>
<div class="grid calc">
<form class="calc-form card" id="form" novalidate>
${num('verbruik', 'Stroomverbruik per jaar', EX.verbruik, 'kWh', 'Je totale verbruik, inclusief wat je zelf direct van je panelen gebruikt.')}
${num('panelen', 'Aantal zonnepanelen', EX.panelen, 'stuks', '')}
${num('avond', 'Deel van je verbruik in de avond en nacht', komma(AANNAMES.avondDeel * 100, 0), '%', 'Aanname. Meet het met een P1-meter op je slimme meter.')}
</form>
<aside class="card result" id="result" aria-live="polite"><h2>Jouw uitkomst</h2><p class="big" id="r-advies">${komma(CAP.advies)} kWh</p><p class="sub" id="r-soort">${CAP.soort === 'stekker' ? 'Een stekkerbatterij kan volstaan' : 'Een vaste thuisaccu past hierbij'}</p>
<table class="kv"><tbody><tr><td>Avond- en nachtverbruik per dag</td><td id="r-avond">${komma(CAP.avond)} kWh</td></tr><tr><td>Overschot op een zomerdag</td><td id="r-zomer">${komma(CAP.zomer)} kWh</td></tr><tr><td>Opwek op een winterdag</td><td id="r-winter">${komma(CAP.winter)} kWh</td></tr></tbody></table>
<p class="src" id="r-noot">In de winter raakt de accu niet vol: dan wekken je panelen minder op dan je accu kan opslaan.</p></aside>
</div>
<section class="method" id="methode"><h2>Zo rekenen we</h2><ul><li><strong>Avond- en nachtverbruik:</strong> je jaarverbruik ÷ 365 × het deel dat 's avonds en 's nachts valt. Dat deel is een aanname van ThuisaccuMatch; een P1-meter laat je echte verbruik zien (Milieu Centraal).</li><li><strong>Zomeroverschot:</strong> Milieu Centraal rekent voor dat 10 panelen op een gemiddelde junidag 15 kWh opwekken, dus ${komma(ZOMERDAG_PANEEL)} kWh per paneel. Gemiddeld gebruik je 30% direct zelf; de rest is overschot.</li><li><strong>Winterdag:</strong> op een decemberdag wekken 10 panelen 2,5 kWh op, ${komma(WINTERDAG_PANEEL, 2)} kWh per paneel (Milieu Centraal).</li><li><strong>Advies:</strong> het kleinste van avondverbruik en zomeroverschot, gedeeld door ${komma(AANNAMES.rendement * 100, 0)}% rendement (aanname), afgerond op een halve kWh. Onder 3 kWh kan een stekkerbatterij volstaan.</li></ul>
<h3>Waarom niet groter?</h3><p>Een accu kost per kWh opslag honderden euro's. Een kWh die nooit gebruikt wordt, verdient zich ook nooit terug. In de zomer heb je overdag vaak meer zonnestroom over dan je 's avonds verbruikt; dan beperkt je avondverbruik wat je accu kan doen. In de winter is het omgekeerd: je panelen wekken dan te weinig op om een grote accu te vullen. Daarom rekenen we met het kleinste van de twee.</p><p>Twijfel je tussen twee maten? Veel accu's zijn modulair: je kunt later uitbreiden als dat nodig blijkt (Milieu Centraal). In de <a href="/vergelijken/">vergelijking</a> zie je per merk of de accu uit te breiden is. Reken daarna uit wat de gekozen maat oplevert met de <a href="/terugverdientijd-thuisaccu-berekenen/">terugverdientijd-rekentool</a>.</p>${srcs('mcAccu')}</section>
<p>Meer uitleg: <a href="/stekkerbatterij-of-vaste-thuisaccu/">stekkerbatterij of vaste thuisaccu?</a> · <a href="/thuisaccu-keuzehulp/">past een thuisaccu bij jou?</a></p>`,
});

export const calcSal = tool({
  path: '/einde-salderen-berekenen/', title: 'Einde salderen 2027 berekenen: wat kost het jou?', h1: 'Wat kost het einde van salderen jou?', crumb: 'Einde salderen', og: 'saldering',
  description: 'Bereken wat je zonnepanelen vanaf 1 januari 2027 minder opleveren als de saldering stopt, en hoeveel een thuisaccu daarvan terugwint.',
  scripts: ['/js/saldering.js'],
  schema: [app('Einde salderen berekenen', '/einde-salderen-berekenen/')],
  body: `<h1>Wat kost het einde van salderen jou?</h1><p class="lead">Op 1 januari 2027 stopt de salderingsregeling (Rijksoverheid). Vul je opwek en verbruik in en zie wat je zonnepanelen vóór en na 2027 waard zijn, en wat een thuisaccu terugwint.</p>
<div class="grid calc">
<form class="calc-form card" id="form" novalidate>
${num('opwek', 'Opwek van je zonnepanelen per jaar', EX.opwek, 'kWh', 'Milieu Centraal: 10 panelen ≈ 3.500 kWh.')}
${num('verbruik', 'Stroomverbruik per jaar', EX.verbruik, 'kWh', 'Je totale verbruik.')}
${num('zelf', 'Zelf direct gebruikt', komma(ZELFVERBRUIK * 100, 0), '%', 'Milieu Centraal: gemiddeld ongeveer 30%.')}
${num('cap', 'Capaciteit thuisaccu', 5, 'kWh', 'Vul 0 in zonder accu.')}
<details><summary>Prijzen aanpassen</summary>${num('stroom', 'Stroomprijs (levering + energiebelasting)', komma(STROOMPRIJS, 2), '€ per kWh', 'CBS, september 2026.')}${num('netto', 'Netto terugleververgoeding', komma(NETTO_TERUG, 3), '€ per kWh', 'Na terugleverkosten. Milieu Centraal: rond de halve cent.')}</details>
</form>
<aside class="card result" id="result" aria-live="polite"><h2>Jouw uitkomst</h2><p class="big" id="r-verschil">${eur(SAL.verschil)}</p><p class="sub">per jaar minder vanaf 2027</p>
<table class="kv"><tbody><tr><td>Waarde zonnestroom tot en met 2026</td><td id="r-voor">${eur(SAL.voor)}</td></tr><tr><td>Waarde vanaf 2027</td><td id="r-na">${eur(SAL.na)}</td></tr><tr><td>Teruggeleverd</td><td id="r-terug">${SAL.terug.toLocaleString('nl-NL')} kWh</td></tr><tr class="total"><td>Thuisaccu wint terug</td><td id="r-accu">${eur(T5.besparing)}</td></tr></tbody></table>
<p class="src" id="r-noot">Met een thuisaccu van 5 kWh, die op ${AANNAMES.volDagen} dagen per jaar vol raakt (aanname).</p></aside>
</div>
<section class="method" id="methode"><h2>Zo rekenen we</h2><ul><li><strong>Tot en met 2026:</strong> wat je direct zelf gebruikt én wat je teruglevert tot aan je verbruik, telt tegen de volle stroomprijs. Een overschot boven je verbruik krijgt de terugleververgoeding.</li><li><strong>Vanaf 2027:</strong> alleen wat je direct zelf gebruikt telt tegen de volle prijs. Alles wat je teruglevert, krijgt de netto terugleververgoeding (Rijksoverheid, ACM ConsuWijzer).</li><li><strong>Netto vergoeding:</strong> rond de halve cent per kWh bij een vast of variabel contract (Milieu Centraal). Wettelijk minimum tot 2030: 50% van het kale leveringstarief, ongeveer ${ct(MIN_VERGOEDING)} per kWh, maar daar gaan terugleverkosten nog af.</li><li><strong>Thuisaccu:</strong> zie de <a href="/terugverdientijd-thuisaccu-berekenen/">terugverdientijd-rekentool</a> voor de aannames.</li></ul>
<p>Het verschil is wat salderen je nu oplevert. Zonnepanelen blijven volgens Milieu Centraal ook na 2027 lonen, omdat je de stroom die je zelf gebruikt niet hoeft in te kopen. Lees meer in <a href="/salderingsregeling-stopt-2027/">saldering stopt in 2027</a> en <a href="/terugleverkosten/">terugleverkosten</a>. Of je panelen zichzelf nog terugbetalen, reken je uit met <a href="https://verduurzaammatch.nl/terugverdientijd-berekenen/">de terugverdientijd-calculator voor zonnepanelen</a> op VerduurzaamMatch.</p>${srcs('rijkSaldering', 'acmSalderen', 'mcSaldering', 'mcNa2027', 'cbs')}</section>
<p>Meer uitleg: <a href="/thuisaccu-terugverdientijd/">verdien je een thuisaccu terug?</a> · <a href="/thuisaccu-keuzehulp/">past een thuisaccu bij jou?</a></p>`,
});

export const toolHub = {
  lastmod: '2026-10-19',
  path: '/rekentools/', title: 'Rekentools thuisaccu: terugverdientijd, kWh en saldering', h1: 'Rekentools voor je thuisaccu', crumb: 'Rekentools', og: 'rekenhulp',
  description: 'Drie gratis rekentools: de terugverdientijd van een thuisaccu, de capaciteit die je nodig hebt en wat het einde van salderen in 2027 jou kost.',
  body: `<h1>Rekentools voor je thuisaccu</h1><p class="lead">Drie rekentools met je eigen cijfers. Standaardwaarden komen van het CBS, Milieu Centraal en de prijzen van de merken; aannames staan er altijd bij.</p>${toolCards('h2')}
<section class="prose"><h2>In welke volgorde?</h2><ol><li><strong>Wat kost het einde van salderen jou?</strong> Begin hier als je zonnepanelen hebt. Je ziet wat je panelen vanaf 2027 minder opleveren. Dat is ongeveer het bedrag waar een thuisaccu een deel van kan terugwinnen.</li><li><strong>Hoeveel kWh heb je nodig?</strong> Een te grote accu raakt niet vol en verdient zich langzamer terug. Milieu Centraal adviseert: niet groter dan je avond- en nachtverbruik.</li><li><strong>Terugverdientijd.</strong> Vul de prijs uit je offerte in. Reken met de bruikbare capaciteit en de totaalprijs inclusief installatie en btw.</li></ol>
<p>De rekentools zijn een indicatie. Stroomprijzen veranderen, en je eigen verbruiksprofiel kan anders zijn dan het gemiddelde. Je antwoorden blijven in je browser; we slaan niets op. Wil je liever één advies? Doe de <a href="/thuisaccu-keuzehulp/">keuzehulp</a>: zes vragen en je krijgt de soort, de capaciteit, de terugverdientijd en de merken die passen.</p>
<h2>Welke cijfers gebruiken we?</h2><ul><li>Stroomprijs € ${komma(STROOMPRIJS, 2)} per kWh: CBS, september 2026 (levering plus energiebelasting, inclusief btw).</li><li>Netto teruglevering ${ct(NETTO_TERUG)} per kWh: Milieu Centraal, vast of variabel contract.</li><li>Opwek ${OPWEK_PANEEL} kWh per paneel per jaar en 30% direct zelf gebruikt: Milieu Centraal.</li><li>Prijzen van accu's: de eigen sites van HomeWizard, Sessy en Zonneplan.</li></ul></section>${matchCta()}`,
};

export const gidsHub = {
  path: '/gidsen/', title: 'Thuisaccu gidsen: saldering, kosten, btw | ThuisaccuMatch', h1: 'Thuisaccu kiezen: alle gidsen', crumb: 'Gidsen', og: 'gidsen',
  description: 'Gidsen over het einde van salderen in 2027, kosten en terugverdientijd van een thuisaccu, dynamische contracten, terugleverkosten, btw en veiligheid.',
  body: `<h1>Thuisaccu kiezen: alle gidsen</h1><p class="lead">Alles wat je wilt weten voordat je een thuisaccu koopt, met bronnen van Milieu Centraal, de Rijksoverheid, de ACM, de Belastingdienst en de Brandweer.</p><div class="grid cards two">${guides.map((x) => `<a class="card" href="${x.path}"><h2 class="h3">${esc(x.h1)}</h2><p>${esc(x.description)}</p><span class="more">Lees de gids →</span></a>`).join('')}${TOOLS.map(([h, t, d]) => `<a class="card" href="${h}"><h2 class="h3">${esc(t)}</h2><p>${esc(d)}</p><span class="more">Naar de rekentool →</span></a>`).join('')}</div>${matchCta()}`,
};

// ---- Statisch ----
export const over = {
  path: '/over/', title: 'Over ThuisaccuMatch: wie we zijn en hoe we werken', h1: 'Over ons', crumb: 'Over ons', og: 'home',
  description: 'ThuisaccuMatch helpt huiseigenaren beslissen of een thuisaccu past, hoe groot en welk merk. Hoe we gegevens controleren en hoe we onafhankelijk blijven.',
  schema: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'Over ThuisaccuMatch', about: ORG }],
  body: `<article class="prose"><h1>Over ons</h1><p class="lead">ThuisaccuMatch komt van het team achter BoekhoudMatch, VerduurzaamMatch, ShopMatch en WarmtepompenMatch. Nu de salderingsregeling in 2027 stopt, horen we steeds dezelfde vragen: is een thuisaccu slim, hoe groot moet hij zijn en welk merk past?</p>
<p>Veel informatie over thuisaccu's komt van merken en installateurs die je hun eigen product willen verkopen. Wij zetten de merken naast elkaar met wat ze zelf op hun site zetten, en rekenen met de onafhankelijke cijfers van Milieu Centraal en het CBS en de regels van de Rijksoverheid, de ACM en de Belastingdienst. Ook als die zeggen dat een accu zich nu meestal niet terugverdient.</p>
<h2>Hoe we werken</h2><ul><li><strong>Alleen de bron.</strong> Elk checklistpunt komt van de site, het datasheet of het garantiedocument van het merk, elk bedrag van het CBS, Milieu Centraal of het merk zelf, met link.</li><li><strong>Niets verzonnen.</strong> Staat iets niet op de site van het merk, dan staat er "niet vermeld". We plaatsen geen reviews of beoordelingen. Aannames in de rekentools staan er altijd als aanname bij.</li><li><strong>Onafhankelijk.</strong> We installeren geen thuisaccu's en verkopen niets.</li><li><strong>Partners tellen nooit mee</strong> in de score, de volgorde of het advies. Partnerlinks worden bij de knoppen vermeld met één zin per blok.</li></ul>
</article>${methodBox()}<article class="prose"><h2>Wat telt de checklist?</h2><ul>${GROEPEN.map((x) => `<li><strong>${esc(x.naam)}:</strong> ${x.punten.map((k) => esc(/^[A-Z][a-z]/.test(PUNTEN[k].lang) ? PUNTEN[k].lang[0].toLowerCase() + PUNTEN[k].lang.slice(1) : PUNTEN[k].lang)).join(', ')}.</li>`).join('')}</ul><p>"Minstens 10 jaar garantie op de batterij" is ja als het merk dat noemt, deels als het alleen met een voorwaarde kan en nee als de standaardgarantie korter is. "Noodstroom" is deels als het een uitbreiding of extra product vraagt. Noemt een merk een punt niet, dan staat er "niet vermeld" en telt het als 0. Mist er iets? Mail ons, dan passen we het aan met bron.</p>
<h2>Waar begin je?</h2><ul><li><a href="/thuisaccu-keuzehulp/">De keuzehulp</a>: zes vragen, één advies.</li><li><a href="/vergelijken/">Alle merken vergelijken</a> op de 10 punten.</li><li><a href="/rekentools/">De rekentools</a> voor terugverdientijd, capaciteit en het einde van salderen.</li><li><a href="/gidsen/">De gidsen</a>, van kosten tot veiligheid.</li></ul><p>Hoe we met je gegevens omgaan, lees je in <a href="/privacy/">privacy en cookies</a>. Fout gezien? Mail naar <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>${LEADS_AAN ? `<p>Offertes vraag je aan via een offertepartner. ${SITE.name} is geen partij bij de offerte of de opdracht en ontvangt een vergoeding per aanvraag.</p>` : ''}</article>`,
};

export const privacy = {
  path: '/privacy/', title: 'Privacy en cookies | ThuisaccuMatch', h1: 'Privacy en cookies', crumb: 'Privacy', og: 'home', stamp: { updated: PRIVACY_UPDATED },
  description: 'Hoe ThuisaccuMatch met je gegevens omgaat: geen account, je antwoorden blijven in je browser en statistieken alleen na jouw toestemming.',
  body: `<article class="prose"><h1>Privacy en cookies</h1>
<p>Vragen? Mail naar <a href="mailto:${SITE.email}">${SITE.email}</a>. Wie we zijn en hoe we werken, lees je bij <a href="/over/">over ons</a>.</p>
<h2>Wie is verantwoordelijk?</h2><p>Verantwoordelijk voor de verwerking van persoonsgegevens op deze site: ${SITE.name}, <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
<h2>Welke gegevens?</h2><p>Je antwoorden in de keuzehulp en de rekentools blijven in je browser. We slaan ze niet op en sturen ze nergens heen. We vragen geen naam, e-mailadres of andere persoonsgegevens.</p>
${GA_ID ? `<h2 id="cookies">Cookies en statistieken</h2><p>We gebruiken geen advertentiecookies. Statistieken met Google Analytics zetten we alleen aan als je in de cookiemelding op "Accepteren" klikt. Zonder toestemming laden we Google Analytics niet en gaat er niets naar Google.</p>
<p>Geef je toestemming, dan plaatst Google Analytics cookies (zoals <code>_ga</code>) en meten we welke pagina's bezocht worden en op welke knoppen en links wordt geklikt. Google Analytics 4 slaat geen IP-adressen op. We gebruiken de gegevens alleen voor statistieken (zie <a href="#bewaren">bewaartermijnen</a>). Google verwerkt de gegevens als verwerker; zie het <a href="https://policies.google.com/privacy" rel="noopener">privacybeleid van Google</a>.</p>
<p>Je keuze bewaren we 12 maanden in je browser (localStorage). Je kunt je toestemming altijd intrekken via <a href="/privacy/#cookies" data-consent-open>Cookie-instellingen</a> (ook onderaan elke pagina). Dan stoppen we Google Analytics en wissen we de <code>_ga</code>-cookies.</p>
<h3>Welke cookies en opslag?</h3>${cookieTabel(GA_ID, CONSENT_KEY)}` : '<h2 id="cookies">Cookies en statistieken</h2><p>We plaatsen geen cookies: geen advertentiecookies en geen statistiekcookies. Zetten we later statistieken aan, dan vragen we eerst je toestemming in een cookiemelding en passen we deze pagina aan.</p>'}
<h2>Links naar merken</h2><p>Klik je door naar een merk, dan geldt de privacyverklaring van dat merk.</p>
${partnerNetwerk(SITE.name, PARTNERLINKS)}
${privacyOffertes()}
<h2>Wat we niet doen</h2><ul><li>We verkopen of verhuren geen gegevens.</li><li>We gebruiken geen advertentienetwerken, geen social-mediapixels en geen tracking van andere partijen dan hieronder genoemd.</li><li>We maken geen profielen en nemen geen beslissingen op basis van je gegevens.</li><li>Je hoeft geen account aan te maken, en we sturen geen nieuwsbrief.</li></ul>
<h2>Keuzehulp en rekentools</h2><p>De <a href="/thuisaccu-keuzehulp/">keuzehulp</a> en de <a href="/rekentools/">rekentools</a> rekenen in je eigen browser. Je antwoorden staan alleen in de adresbalk (zodat je je advies kunt bewaren of delen) en worden niet naar ons verstuurd. Deel je de link, dan ziet de ontvanger dezelfde antwoorden.</p>
${grondslag()}
${doorgifte()}
${bewaartermijnen(14)}
<h2>Hosting</h2><p>De site draait op GitHub Pages. GitHub verwerkt technische gegevens zoals je IP-adres om de site te leveren (zie het <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">privacybeleid van GitHub</a>).</p>
${rechten(SITE.email)}</article>`,
};

export const notfound = {
  path: '/404.html', title: 'Pagina niet gevonden | ThuisaccuMatch', h1: 'Niet gevonden', noindex: true, og: 'home',
  description: 'Deze pagina bestaat niet.',
  body: `<div class="notfound"><h1>Deze pagina bestaat niet</h1><div class="actions"><a class="btn" href="/thuisaccu-keuzehulp/">Start de keuzehulp</a><a class="btn ghost" href="/merken/">Alle merken</a><a class="btn ghost" href="/">Homepage</a></div></div>`,
};
