// Onafhankelijke verwachting voor de stijlrelease van 13 november 2026.
export const STIJL_PADEN = new Set([
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
export const revisieDatum = (pad, vorige) => STIJL_PADEN.has(pad) ? '2026-11-13' : vorige;
