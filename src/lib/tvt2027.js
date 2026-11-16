// Alleen de terugverdientijdtool 2027; geen import door match.js of kosten.js.
// Jaarmodel zonder saldering: gemiste vergoeding geldt voor alle geladen zonne-kWh, ook het verlies.
export const TVT2027 = Object.freeze({ capaciteit: 5, teruglevering: 2450, stroomprijs: 0.26, netto: 0.005, dagen: 200, rendement: 0.9, onderhoud: 0 });
export const SCENARIOS2027 = Object.freeze([
  { naam: 'Geen accu', prijs: 0, capaciteit: 0 },
  { naam: 'Kleine stekkeraccu (rekenaanname)', prijs: 1195, capaciteit: 2.7 },
  { naam: 'Vaste accu (rekenaanname)', prijs: 3550, capaciteit: 5 },
]);
export function bereken2027(invoer = {}) {
  const x = { ...TVT2027, ...invoer };
  for (const k of ['capaciteit','teruglevering','dagen','rendement','onderhoud','stroomprijs','netto']) {
    if (!Number.isFinite(x[k])) throw new RangeError('Ongeldige invoer: ' + k);
  }
  if (['capaciteit','teruglevering','dagen','onderhoud'].some((k) => x[k] < 0) || x.dagen > 365 || x.rendement <= 0 || x.rendement > 1) throw new RangeError('Invoer buiten bereik');
  if (x.prijs != null && (!Number.isFinite(x.prijs) || x.prijs < 0)) throw new RangeError('Ongeldige totaalprijs');
  const geladen = Math.min(x.teruglevering, x.capaciteit * x.dagen);
  const geleverd = geladen * x.rendement;
  const vermedenInkoop = geleverd * x.stroomprijs;
  const gemisteVergoeding = geladen * x.netto;
  const besparing = vermedenInkoop - gemisteVergoeding - x.onderhoud;
  const jaren = x.prijs != null && x.capaciteit > 0 && x.prijs > 0 && besparing > 0 ? x.prijs / besparing : null;
  return { geladen, geleverd, verlies: geladen - geleverd, vermedenInkoop, gemisteVergoeding, besparing, jaren };
}
