// Stijlronde: uitsluitend gewijzigde pagina's (incl. clientdata) en hun L7-hubs.
// Geen nieuwe broncontrole: publicatie- en controledatums blijven staan.
const UPD = '2026-11-13';
const PADEN = new Set([
  "/blog/",
  "/blog/thuisbatterij-10-kwh/",
  "/blog/thuisbatterij-dynamisch-contract/",
  "/blog/thuisbatterij-met-noodstroom/",
  "/blog/thuisbatterij-rendabel-2027/",
  "/blog/thuisbatterij-zonder-zonnepanelen/",
  "/btw-thuisaccu/",
  "/einde-salderen-berekenen/",
  "/gidsen/",
  "/merken/",
  "/merken/byd/",
  "/merken/huawei/",
  "/merken/sessy/",
  "/merken/zonneplan/",
  "/terugleverkosten/",
  "/thuisaccu-dynamisch-energiecontract/",
  "/thuisaccu-keuzehulp/",
  "/thuisaccu-kosten/",
  "/thuisaccu-terugverdientijd/",
  "/thuisaccu-veiligheid/"
]);
const DATUM = '13 november 2026';
const updatedTime = /((?:[Ll]aatst\s+)?(?:[Bb]ijgewerkt|[Uu]pdated)(?:\s+(?:op|on))?\s*:?\s*)(<time\b[^>]*datetime=")[^"]+("[^>]*>)[^<]*(<\/time>)/g;
const updatedText = /((?:[Ll]aatst\s+)?(?:[Bb]ijgewerkt|[Uu]pdated)(?:\s+(?:op|on))?\s*:?\s*)(?:\d{4}-\d{2}-\d{2}|\d{1,2}\s+[A-Za-z]+\s+\d{4})/g;
export function nuchterDatum(p) {
  if (!PADEN.has(p.path)) return p;
  let body = p.body.replace(updatedTime, (_, label, open, close, end) => `${label}${open}${UPD}${close}${DATUM}${end}`).replace(updatedText, (_, label) => `${label}${DATUM}`);
  const hasUpdated = /(?:bijgewerkt|updated)\s*(?:op\s*|on\s*)?(?::\s*)?(?:<time|\d)/i.test(body);
  if (p.full && !hasUpdated) body = body.replace(/<\/h1>/, `$&<p class="stamp">Laatst bijgewerkt <time datetime="${UPD}">${DATUM}</time></p>`);
  return { ...p, body, lastmod: UPD, stamp: { ...p.stamp, updated: UPD },
    ...(p.article ? { article: { ...p.article, updated: UPD } } : {}),
    ...(p.schema ? { schema: p.schema.map((x) => ('dateModified' in x ? { ...x, dateModified: UPD } : x)) } : {}) };
}
