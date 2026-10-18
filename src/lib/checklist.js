// ThuisaccuMatch-checklist: de score is een telling, geen oordeel of review.
// 10 vaste punten. Per punt: ja = 1, deels = 0,5, nee of niet vermeld op de site van het merk = 0.
// Partnerlinks en offertepartners spelen hier geen rol: dit bestand leest ze niet.
import { MERKEN, FEATURES } from './merken.js';

export const GROEPEN = [
  { id: 'aansluiten', naam: 'Aansluiten', punten: ['stekker', 'bestaand', 'noodstroom'] },
  { id: 'batterij', naam: 'Batterij', punten: ['lfp', 'modulair', 'groot'] },
  { id: 'slim', naam: 'Slim gebruik', punten: ['app', 'dynamisch'] },
  { id: 'kopen', naam: 'Kopen en garantie', punten: ['garantie', 'prijs'] },
];
export const PUNTEN = {
  stekker: { kort: 'Stekker', lang: 'Zelf aan te sluiten met een stekker' },
  bestaand: { kort: 'Bestaande omvormer', lang: 'Werkt met je bestaande omvormer' },
  noodstroom: { kort: 'Noodstroom', lang: 'Noodstroom bij stroomuitval' },
  lfp: { kort: 'LFP', lang: 'LFP-cellen (lithium-ijzerfosfaat)' },
  modulair: { kort: 'Uitbreidbaar', lang: 'Uit te breiden met extra modules' },
  groot: { kort: '10 kWh+', lang: '10 kWh of meer mogelijk' },
  app: { kort: 'App', lang: 'App voor inzicht en instellingen' },
  dynamisch: { kort: 'Dynamisch', lang: 'Slim laden op dynamische stroomprijzen' },
  garantie: { kort: 'Garantie 10 jaar', lang: 'Minstens 10 jaar garantie op de batterij' },
  prijs: { kort: 'Prijs openbaar', lang: 'Consumentenprijs op de eigen site' },
};
export const IDS_PUNTEN = GROEPEN.flatMap((g) => g.punten);
export const MAX = IDS_PUNTEN.length;
const W = { ja: 1, deels: 0.5, nee: 0 };
export const punt = (v) => W[v] ?? 0;
export const WAARDE = { ja: 'Ja', deels: 'Deels', nee: 'Nee' };
export const waardeTekst = (v) => WAARDE[v] || 'Niet vermeld';

/** Score per merk: totaal (0-10) en per groep. */
export function score(id) {
  const f = FEATURES[id];
  if (!f) throw new Error('Onbekend merk ' + id);
  const groepen = GROEPEN.map((g) => ({ id: g.id, naam: g.naam, max: g.punten.length, score: g.punten.reduce((s, k) => s + punt(f[k]?.v), 0) }));
  return { id, totaal: groepen.reduce((s, g) => s + g.score, 0), max: MAX, groepen };
}
export const fmtScore = (n) => String(n).replace('.', ',');

/** Vaste volgorde voor lijsten: hoogste checklistscore, bij gelijke stand op naam (A-Z). */
export function ranglijst(ids = Object.keys(MERKEN)) {
  return [...ids].sort((a, b) => score(b).totaal - score(a).totaal || MERKEN[a].naam.localeCompare(MERKEN[b].naam, 'nl'));
}
/** Merken met een checklistpunt (ja of deels), in vaste volgorde. */
export const metPunt = (k, ids = Object.keys(MERKEN)) => ranglijst(ids.filter((id) => ['ja', 'deels'].includes(FEATURES[id][k]?.v)));
/** Merken van een soort (stekker of vast), in vaste volgorde. */
export const metSoort = (soort, ids = Object.keys(MERKEN)) => ranglijst(ids.filter((id) => MERKEN[id].soort === soort));
