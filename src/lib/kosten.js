// Stroomprijzen, saldering en rekenregels voor thuisaccu's. Puur (ook in de browser gebruikt door de keuzehulp en de rekentools).
// Elk getal heeft een bron (BRON) of staat als aanname in AANNAMES, zichtbaar op de site. Partnerlinks spelen hier geen rol.
export const BRON = {
  mcAccu: { naam: 'Milieu Centraal: thuisbatterij', url: 'https://www.milieucentraal.nl/energie-besparen/zonnepanelen/thuisbatterij-zonne-energie-opslaan/' },
  mcSaldering: { naam: 'Milieu Centraal: salderingsregeling', url: 'https://www.milieucentraal.nl/energie-besparen/zonnepanelen/salderingsregeling-voor-zonnepanelen/' },
  mcNa2027: { naam: 'Milieu Centraal: zonnestroom als de saldering stopt', url: 'https://www.milieucentraal.nl/energie-besparen/zonnepanelen/zonnestroom-als-de-saldering-stopt-dit-moet-je-weten/' },
  rijkSaldering: { naam: 'Rijksoverheid: salderingsregeling stopt in 2027', url: 'https://www.rijksoverheid.nl/themas/klimaat-milieu-en-natuur/energie-thuis/salderingsregeling' },
  acmSalderen: { naam: 'ACM ConsuWijzer: salderen en terugleveren', url: 'https://consument.acm.nl/elektriciteit-en-gas/duurzame-energie/wat-is-salderen' },
  acmAanbod: { naam: 'ACM ConsuWijzer: aanbod van de energieleverancier', url: 'https://consument.acm.nl/vergelijken-en-overstappen/energie/aanbod-op-maat' },
  acmKiezen: { naam: 'ACM ConsuWijzer: energieleverancier kiezen', url: 'https://consument.acm.nl/elektriciteit-en-gas/overstappen-vergelijken-en-verhuizen/tips-bij-het-kiezen-van-een-energieleverancier' },
  acmKwartier: { naam: 'ACM: dynamische prijzen per kwartier', url: 'https://www.acm.nl/nl/publicaties/energiemonitor-acm-tarieven-licht-gedaald-start-verwarmingsseizoen-goed-moment-om-energiecontract-te-checken' },
  acm2027: { naam: 'ACM: veranderingen in 2027', url: 'https://www.acm.nl/nl/publicaties/energiemonitor-acm-leveranciers-moeten-klanten-goed-informeren-over-belangrijke-veranderingen-2027' },
  cbs: { naam: 'CBS: gemiddelde energietarieven voor consumenten', url: 'https://www.cbs.nl/nl-nl/cijfers/detail/85592NED' },
  bdBtw: { naam: 'Belastingdienst: thuisbatterij en btw', url: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/thuisbatterij-btw' },
  bdZon: { naam: 'Belastingdienst: btw-tarief zonnepanelen', url: 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/goederen_0_btw/btw-tarief-zonnepanelen' },
  brandweer: { naam: 'Brandweer: een veilige thuisbatterij', url: 'https://www.brandweer.nl/onderwerpen/een-veilige-thuisbatterij/' },
  brandweerStekker: { naam: 'Brandweer: plug-and-play thuisbatterij', url: 'https://www.brandweer.nl/onderwerpen/plug-and-play-thuisbatterij/' },
  nipv: { naam: 'NIPV: thuisbatterijen en brandveiligheid', url: 'https://nipv.nl/onderzoek/duurzaam-bouwen/thuisbatterijen-en-brandveiligheid/' },
};

// CBS, september 2026, inclusief btw: variabel leveringstarief € 0,1487 + energiebelasting € 0,11085 per kWh.
export const LEVERING = 0.1487;
export const ENERGIEBELASTING = 0.11085;
export const STROOMPRIJS = 0.26; // € per kWh die je inkoopt (levering + energiebelasting, afgerond)
export const KAAL = 0.123; // kale leveringsprijs zonder btw (0,1487 / 1,21)
export const MIN_VERGOEDING = 0.061; // tot 2030 minstens 50% van de kale leveringsprijs (Rijksoverheid)
export const NETTO_TERUG = 0.005; // netto na terugleverkosten, vast of variabel contract: rond de halve cent (Milieu Centraal)
// Milieu Centraal: 10 panelen ≈ 3.500 kWh per jaar; junidag 15 kWh, decemberdag 2,5 kWh; zelf direct verbruikt ≈ 30%.
export const OPWEK_PANEEL = 350;
export const ZOMERDAG_PANEEL = 1.5;
export const WINTERDAG_PANEEL = 0.25;
export const ZELFVERBRUIK = 0.3;
// Prijs per kWh opslag uit de prijzen van de merken (inclusief btw): HomeWizard € 1.195 / 2,7 kWh; Sessy 10 kWh € 5.500.
export const PRIJS_KWH = { stekker: 443, vast: 550 };

/** Aannames van ThuisaccuMatch (geen bron die dit vastlegt; staan zichtbaar op de rekentools en zijn aan te passen). */
export const AANNAMES = { rendement: 0.9, volDagen: 200, dynDagen: 150, spread: 0.1, avondDeel: 0.5 };

export const eur = (n) => '€ ' + Math.round(n).toLocaleString('nl-NL');
export const komma = (n, d = 1) => Number(n).toFixed(d).replace('.', ',');
export const jaarTekst = (j) => (j == null ? 'niet terug te verdienen' : j > 30 ? 'meer dan 30 jaar' : `${komma(j)} jaar`);

/** kWh per jaar die je uit de batterij gebruikt in plaats van terug te leveren. */
export function verschoven({ capaciteit, teruglevering, dagen = AANNAMES.volDagen, rendement = AANNAMES.rendement }) {
  const c = Math.max(0, Number(capaciteit) || 0); const t = Math.max(0, Number(teruglevering) || 0);
  return Math.round(Math.min(t, c * dagen) * rendement);
}

/** Terugverdientijd van een thuisaccu. */
export function terugverdien({ prijs, capaciteit, teruglevering, stroomprijs = STROOMPRIJS, netto = NETTO_TERUG, dagen = AANNAMES.volDagen, rendement = AANNAMES.rendement, dynamisch = false, dynDagen = AANNAMES.dynDagen, spread = AANNAMES.spread }) {
  const kwh = verschoven({ capaciteit, teruglevering, dagen, rendement });
  const zon = kwh * Math.max(0, stroomprijs - netto);
  const dyn = dynamisch ? Math.max(0, Number(capaciteit) || 0) * dynDagen * rendement * Math.max(0, spread) : 0;
  const besparing = Math.round(zon + dyn);
  const p = Math.max(0, Number(prijs) || 0);
  return { kwh, zon: Math.round(zon), dyn: Math.round(dyn), besparing, prijs: p, perKwh: capaciteit > 0 ? Math.round(p / capaciteit) : null, jaren: besparing > 0 ? Math.round((p / besparing) * 10) / 10 : null };
}

/** Wat het einde van de saldering (1 januari 2027) je kost. Saldering tot en met 2026: teruglevering tot je verbruik telt tegen de volle prijs. */
export function saldering({ opwek, verbruik, zelf = ZELFVERBRUIK, stroomprijs = STROOMPRIJS, netto = NETTO_TERUG }) {
  const o = Math.max(0, Number(opwek) || 0); const v = Math.max(0, Number(verbruik) || 0);
  const direct = Math.round(o * Math.min(1, Math.max(0, zelf)));
  const terug = o - direct;
  const saldeerbaar = Math.min(terug, Math.max(0, v - direct));
  const voor = direct * stroomprijs + saldeerbaar * stroomprijs + (terug - saldeerbaar) * netto;
  const na = direct * stroomprijs + terug * netto;
  return { direct, terug, voor: Math.round(voor), na: Math.round(na), verschil: Math.round(voor - na) };
}

/** Capaciteitsadvies: de batterij hoeft niet groter dan je avond- en nachtverbruik (Milieu Centraal) en niet groter dan je zomeroverschot. */
export function capaciteit({ verbruik, panelen, avondDeel = AANNAMES.avondDeel, rendement = AANNAMES.rendement }) {
  const v = Math.max(0, Number(verbruik) || 0); const n = Math.max(0, Number(panelen) || 0);
  const avond = (v / 365) * avondDeel;
  const zomer = n * ZOMERDAG_PANEEL * (1 - ZELFVERBRUIK);
  const winter = n * WINTERDAG_PANEEL;
  const nodig = Math.min(avond, zomer);
  const bruto = Math.round((nodig / rendement) * 2) / 2;
  return { avond: Math.round(avond * 10) / 10, zomer: Math.round(zomer * 10) / 10, winter: Math.round(winter * 10) / 10, advies: bruto, soort: bruto === 0 ? null : bruto < 3 ? 'stekker' : 'vast' };
}
