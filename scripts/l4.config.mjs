// Siteconfig voor scripts/l4-promocheck.mjs (L4: actie/korting met prijs en einddatum).
// ThuisaccuMatch heeft geen platforms.js of aanbieders.js: een veld `actie` hoort op het merk in src/lib/merken.js.
// Er is nu geen veld `actie`. Een veld dat erbij komt is leeg/null, of bevat een parseerbare einddatum.
// BEKEND_L4: { pad, reden, tot?: 'JJJJ-MM-DD', alleen?: RegExp op de hele melding }.
// Met 'tot' vervalt de uitzondering ná die kalenderdag (Europe/Amsterdam; L4_VANDAAG alleen voor tests).
// Geen stille content-delete: een open hercheck blijft hier staan tot de dag, daarna is de melding weer rood.
//
// Anker Black Friday (deze site): handmatige hercheck 13-11-2026 en 01-12-2026. De kopie staat nu niet in de
// boom. Duikt ze op de merkpagina op, dan blokkeert ze de suite niet zolang een van deze regels actief is.
// isBekend is waar als één regel past: na 13-11 dekt de 01-12-regel de pagina nog, na 01-12 is Black Friday weer rood.
// Andere paden of andere actiewoorden (korting, actieprijs, …) blijven rood.
import { execSync } from 'node:child_process';
import { join } from 'node:path';

export const CFG = {
  build: (dir, env) => { execSync('node build.mjs', { cwd: dir, env, stdio: 'ignore' }); return join(dir, 'dist'); },
  // Data-modules met een veld `actie` (regel C). Ontbreekt een bestand, dan slaat de check het over.
  actieModules: ['src/lib/merken.js'],
};

export const BEKEND_L4 = [
  {
    pad: '/merken/anker-solix/',
    reden: 'Anker Black Friday: eerste handmatige hercheck 13-11-2026. Kopie staat nu niet in de site. Geen automatische contentfix.',
    tot: '2026-11-13',
    alleen: /black friday/i,
  },
  {
    pad: '/merken/anker-solix/',
    reden: 'Anker Black Friday: tweede handmatige hercheck 01-12-2026. Kopie staat nu niet in de site. Geen automatische contentfix.',
    tot: '2026-12-01',
    alleen: /black friday/i,
  },
];
