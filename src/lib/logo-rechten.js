// Gebruiksrecht van de logo's (nagekeken 30-10-2026 op de merkrichtlijn of perskit van de maker; SC 30-10).
// ZONDER_LOGO: de maker staat logogebruik alleen toe met toestemming, licentie of partnerovereenkomst.
// Die merken krijgen geen logo in de tabelcellen: de naam blijft gewoon staan, net als bij elk ander merk zonder logo.
// 'Geen gepubliceerde beperking gevonden' is geen toestemming: MM beslist; bij een bezwaar gaat het logo eruit.
export const ZONDER_LOGO = new Set(['byd', 'huawei', 'solaredge']);
export const LOGO_RECHTEN = {
  'byd': { richtlijn: 'https://www.byd.com/eu/terms-of-use', status: "GEEN LOGO: merken en logo's alleen met voorafgaande schriftelijke toestemming" },
  'homewizard': { richtlijn: 'geen merkrichtlijn gevonden (homewizard.com, 30-10)', status: 'logo: geen gepubliceerde beperking gevonden' },
  'huawei': { richtlijn: 'https://consumer.huawei.com/en/legal/intellectual-property/huawei-trademark-policy/', status: 'GEEN LOGO: elk gebruik van merk of logo met voorafgaande schriftelijke toestemming' },
  'sessy': { richtlijn: 'geen merkrichtlijn gevonden (sessy.nl, 30-10)', status: 'logo: geen gepubliceerde beperking gevonden' },
  'solaredge': { richtlijn: 'https://www.solaredge.com/en/terms-and-conditions', status: "GEEN LOGO: naam, merken en logo's alleen met voorafgaande schriftelijke toestemming" },
  'zonneplan': { richtlijn: 'geen merkrichtlijn gevonden (zonneplan.nl, 30-10)', status: 'logo: geen gepubliceerde beperking gevonden' },
};
