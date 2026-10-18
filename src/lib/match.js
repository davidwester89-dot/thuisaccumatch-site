// ThuisaccuMatch keuzehulp: 6 vragen → advies (geen accu, stekkerbatterij of vaste thuisaccu), capaciteit, terugverdientijd en merken.
// Regels: Milieu Centraal (batterij vooral voor eigen zonnestroom of handel met een dynamisch contract; niet groter dan avond- en nachtverbruik),
// Belastingdienst (btw), Brandweer (plaatsing). Leest nooit partnerafspraken of offertepartners.
import { capaciteit, terugverdien, saldering, PRIJS_KWH, OPWEK_PANEEL, ZELFVERBRUIK } from './kosten.js';
import { MERKEN, FEATURES } from './merken.js';
import { metSoort } from './checklist.js';

export const VRAGEN = [
  { id: 'panelen', vraag: 'Hoeveel zonnepanelen heb je?', opties: [['0', 'Geen'], ['6', '1 tot 8'], ['12', '9 tot 14'], ['18', '15 of meer']] },
  { id: 'verbruik', vraag: 'Hoeveel stroom verbruik je per jaar?', hint: 'Staat op je jaarafrekening. Gebruik je verbruik vóór aftrek van zonnestroom als je dat weet.', opties: [['2000', 'Minder dan 2.500 kWh'], ['3200', '2.500 tot 4.000 kWh'], ['5000', '4.000 tot 6.000 kWh'], ['7000', 'Meer dan 6.000 kWh']] },
  { id: 'contract', vraag: 'Welk energiecontract heb je?', opties: [['vast', 'Vast of variabel'], ['dynamisch', 'Dynamisch'], ['weetniet', 'Weet ik niet']] },
  { id: 'doel', vraag: 'Waarvoor wil je de thuisaccu vooral?', opties: [['zon', 'Zonnestroom zelf gebruiken'], ['handel', 'Slim laden op de stroomprijs'], ['nood', 'Stroom bij een storing'], ['weetniet', 'Weet ik nog niet']] },
  { id: 'installatie', vraag: 'Hoe wil je hem aansluiten?', opties: [['zelf', 'Zelf, met een stekker'], ['installateur', 'Door een installateur'], ['maakniet', 'Maakt me niet uit']] },
  { id: 'budget', vraag: 'Wat is je budget?', opties: [['1', 'Tot € 1.500'], ['5', '€ 1.500 tot € 5.000'], ['10', '€ 5.000 tot € 10.000'], ['meer', 'Meer dan € 10.000']] },
];
export const VRAAG = Object.fromEntries(VRAGEN.map((v) => [v.id, v]));
export const label = (id, val) => (VRAAG[id].opties.find(([v]) => v === val) || [])[1] || '';
export const TYPES = {
  geen: { naam: 'Nog geen thuisaccu', kort: 'Eerst zelf meer zonnestroom gebruiken' },
  stekker: { naam: 'Stekkerbatterij', kort: 'Klein, zelf in het stopcontact' },
  vast: { naam: 'Vaste thuisaccu', kort: 'Door een installateur, op een eigen groep' },
};
const BUDGET = { 1: 1500, 5: 5000, 10: 10000, meer: 20000 };

export function advies(a) {
  const panelen = Number(a.panelen) || 0;
  const verbruik = Number(a.verbruik) || 3200;
  const dyn = a.contract === 'dynamisch';
  const budget = BUDGET[a.budget] ?? 5000;
  const notes = [];
  const cap = capaciteit({ verbruik, panelen });
  let type; let kwh;
  if (panelen === 0 && !dyn) {
    type = 'geen'; kwh = 0;
    notes.push('Zonder zonnepanelen en zonder dynamisch contract heeft een thuisaccu niets om op te slaan of mee te handelen. Milieu Centraal ziet een thuisaccu vooral als manier om meer eigen zonnestroom te gebruiken, of om met een dynamisch contract goedkoop in te kopen.');
  } else {
    kwh = panelen === 0 ? Math.max(5, Math.round(verbruik / 365 / 2)) : Math.max(cap.advies, 2.5);
    const zelf = a.installatie === 'zelf';
    type = zelf || budget <= 1500 || (kwh < 3 && a.installatie !== 'installateur') ? 'stekker' : 'vast';
    if (type === 'vast' && kwh * PRIJS_KWH.vast > budget) {
      if (budget <= 5000 && a.installatie !== 'installateur') { type = 'stekker'; notes.push('Met je budget past een stekkerbatterij beter dan een vaste thuisaccu.'); }
      else kwh = Math.max(5, Math.floor(budget / PRIJS_KWH.vast));
    }
    if (type === 'stekker') kwh = Math.min(10.8, Math.max(2.7, Math.round(kwh / 2.7) * 2.7));
    kwh = Math.round(kwh * 10) / 10;
    if (panelen > 0) notes.push(`Milieu Centraal: kies niet te groot, de accu hoeft alleen je avond- en nachtverbruik te dekken. Bij jou is dat ongeveer ${String(cap.avond).replace('.', ',')} kWh per dag (aanname: de helft van je verbruik valt 's avonds en 's nachts; meet het met een P1-meter).`);
    if (type === 'stekker') notes.push('Een stekkerbatterij sluit je zelf aan op een geaard stopcontact, zonder verlengsnoer, en liefst op een eigen groep (Brandweer). Milieu Centraal wijst op brandrisico als er al zware apparaten op dezelfde groep zitten.');
    else notes.push('Laat een vaste thuisaccu plaatsen door een erkend installateur, op een koele, geventileerde plek buiten je vluchtroute, met een rookmelder erbij (Brandweer).');
    if (dyn) notes.push('Met een dynamisch contract kun je laden als stroom goedkoop is. Handel je met een EMS en krijg je een terugleververgoeding, dan kun je volgens de Belastingdienst de btw op de accu terugvragen; je doet dan wel btw-aangifte.');
    else if (a.doel === 'handel') notes.push('Slim laden op de stroomprijs werkt alleen met een dynamisch contract. Bij een vast of variabel contract staat de prijs per kWh vast.');
    if (a.doel === 'nood') notes.push('Noodstroom zit niet standaard op een thuisaccu. Bij de meeste merken is het een uitbreiding met een extra kast of schakelaar.');
  }
  notes.push('Milieu Centraal: een thuisaccu verdien je op dit moment hoogstwaarschijnlijk niet terug. Zelf meer zonnestroom gebruiken als de zon schijnt, kost niets.');
  const opwek = panelen * OPWEK_PANEEL;
  const terug = Math.round(opwek * (1 - ZELFVERBRUIK));
  const prijs = type === 'stekker' ? Math.round(kwh / 2.7) * 1195 : Math.max(3550, Math.round((kwh * PRIJS_KWH.vast) / 10) * 10); // kleinste vaste accu met openbare prijs: Sessy 5 kWh, € 3.550
  const reken = type === 'geen' ? null : terugverdien({ prijs, capaciteit: kwh, teruglevering: terug, dynamisch: dyn });
  const sal = panelen > 0 ? saldering({ opwek, verbruik }) : null;
  let merken = type === 'geen' ? [] : metSoort(type);
  if (type !== 'geen' && a.doel === 'nood') merken = merken.filter((id) => ['ja', 'deels'].includes(FEATURES[id].noodstroom.v));
  return { type, naam: TYPES[type].naam, kwh, cap, notes, reken, sal, merken, opwek, terug };
}
export const compleet = (a) => VRAGEN.every((v) => a[v.id]);
export const OPTIES = Object.fromEntries(VRAGEN.map((v) => [v.id, Object.fromEntries(v.opties)]));
export { MERKEN };
