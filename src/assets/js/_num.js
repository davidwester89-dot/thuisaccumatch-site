// Gedeelde invoerhulp voor de rekentools: "3.550" en "0,26" worden getallen.
export const $ = (id) => document.getElementById(id);
export const num = (id) => {
  const s = String($(id).value).trim().replace(/\s/g, '');
  const v = parseFloat(/,/.test(s) ? s.replace(/\./g, '').replace(',', '.') : /^\d{1,3}(\.\d{3})+$/.test(s) ? s.replace(/\./g, '') : s);
  return Number.isFinite(v) && v >= 0 ? v : 0;
};
