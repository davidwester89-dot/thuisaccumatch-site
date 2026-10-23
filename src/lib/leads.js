// Offertemodule ThuisaccuMatch (zelfde module als WarmtepompenMatch en VerduurzaamMatch, één categorie: vaste thuisaccu).
// Regels:
// - LEADPARTNERS blijft LEEG tot er een partner is goedgekeurd (nog geen partner aangevraagd).
//   Leeg = geen offertepagina, geen offerteknoppen, geen formulieren.
// - Elke aanvraag gaat naar precies één partner.
// - Contactgegevens vult de bezoeker in het formulier van de partner in (iframe of doorverwijzing). Wij ontvangen en bewaren ze niet.
// - De keuzehulp (match.js) en de checklist lezen dit bestand NOOIT: offertepartners hebben geen invloed op advies, score of volgorde.
// - Naar Analytics gaan alleen type, termijn en partner-id. Nooit postcode of andere invoer.

export const CATEGORIEEN = {
  thuisaccu: { naam: 'Vaste thuisaccu', kort: 'geplaatst door een installateur', maatregelen: ['vast'], gids: '/thuisaccu-kosten/' },
};
export const WANNEER = { direct: 'Binnen 3 maanden', half: 'Over 3 tot 6 maanden', later: 'Later dan 6 maanden', orienteren: 'Ik oriënteer me nog' };
export const POSTCODE_RE = /^[1-9][0-9]{3} ?[A-Za-z]{2}$/;

/**
 * Goedgekeurde offertepartners. Volgorde = voorkeur per categorie.
 * type 'iframe': formulier van de partner op onze pagina (url + origin verplicht; prefill: ons veld -> hun parameter).
 * type 'redirect': trackinglink naar het formulier op de site van de partner.
 * Voorbeeld (pas invullen na goedkeuring en akkoord):
 * partner: { naam: 'Partnernaam', type: 'redirect', url: 'https://…', privacy: 'https://…/privacy', voor: ['thuisaccu'], max: 1 },
 */
export const LEADPARTNERS = {};

/** Alleen voor een preview-build (LEADS_PREVIEW=1): nepformulier dat niets verstuurt of bewaart. */
export const VOORBEELD = {
  voorbeeld: { naam: 'Voorbeeldpartner', type: 'voorbeeld', privacy: '/privacy/#offertes', voor: Object.keys(CATEGORIEEN), max: 3 },
};

export function actievePartners({ preview = false, partners = LEADPARTNERS } = {}) {
  const p = Object.keys(partners).length ? partners : preview ? VOORBEELD : {};
  for (const [id, x] of Object.entries(p)) {
    if (!x.naam || !Array.isArray(x.voor) || !x.voor.every((c) => c in CATEGORIEEN)) throw new Error(`Leadpartner ${id}: naam/voor ongeldig`);
    if (x.type === 'iframe' && !(/^https:\/\//.test(x.url) && /^https:\/\/[^/]+$/.test(x.origin) && x.url.startsWith(x.origin))) throw new Error(`Leadpartner ${id}: iframe vraagt https-url binnen origin`);
    if (x.type === 'redirect' && !/^https:\/\//.test(x.url)) throw new Error(`Leadpartner ${id}: redirect vraagt https-url`);
    if (!['iframe', 'redirect', 'voorbeeld'].includes(x.type)) throw new Error(`Leadpartner ${id}: onbekend type ${x.type}`);
  }
  return p;
}

/** Per categorie precies één partner: de eerste in de lijst. */
export function routing(partners) {
  const r = {};
  for (const [id, x] of Object.entries(partners)) for (const c of x.voor) if (!r[c]) r[c] = id;
  return r;
}

export const categorieVan = (type) => Object.keys(CATEGORIEEN).find((c) => CATEGORIEEN[c].maatregelen.includes(type)) || null;

export function valideer(a, panelen, verbruiken) {
  const fout = {};
  if (!(a.maatregel in CATEGORIEEN)) fout.maatregel = 'Kies wat je wilt laten plaatsen.';
  if (!POSTCODE_RE.test(String(a.postcode || '').trim())) fout.postcode = 'Vul een postcode in zoals 1234 AB.';
  if (!(a.panelen in panelen)) fout.panelen = 'Kies hoeveel zonnepanelen je hebt.';
  if (!(a.verbruik in verbruiken)) fout.verbruik = 'Kies je stroomverbruik.';
  if (!(a.wanneer in WANNEER)) fout.wanneer = 'Kies wanneer je wilt beginnen.';
  return fout;
}

export const normPostcode = (s) => String(s || '').trim().toUpperCase().replace(/^(\d{4}) ?([A-Z]{2})$/, '$1 $2');

/** Iframe-URL met alleen de velden die de partner wil (prefill) en een sub-id. Geen contactgegevens. */
export function iframeUrl(partner, a, subid = 'tam') {
  const u = new URL(partner.url);
  for (const [ons, hun] of Object.entries(partner.prefill || {})) {
    if (!['maatregel', 'postcode', 'panelen', 'verbruik', 'wanneer'].includes(ons)) continue;
    const v = ons === 'postcode' ? normPostcode(a.postcode) : a[ons];
    if (v) u.searchParams.set(hun, v);
  }
  if (partner.subidParam) u.searchParams.set(partner.subidParam, `${subid}_${a.maatregel}`);
  return u.toString();
}

/** Parameters voor GA4. Bewust zonder postcode, panelen of verbruik. */
export const analytics = (a, partnerId) => ({ maatregel: a.maatregel in CATEGORIEEN ? a.maatregel : 'onbekend', termijn: a.wanneer in WANNEER ? a.wanneer : 'onbekend', partner: partnerId || 'geen' });

/** Origins voor frame-src in de CSP (alleen iframe-partners). */
export const frameOrigins = (partners) => [...new Set(Object.values(partners).filter((x) => x.type === 'iframe').map((x) => x.origin))];
