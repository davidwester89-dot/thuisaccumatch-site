// Siteconfig voor scripts/l7check.mjs (L7-datumcheck, naamgrep, repo-root-404). Wijzigingen in exempt/BEKEND_* alleen met SC-OK.
import { execSync, execFileSync } from 'node:child_process';
import { join } from 'node:path';
export const CFG = {
  // Geen datumlift door alleen een gewijzigd kind; bij eigen body geldt de gewone L7-plicht.
  bodyOnlyHubs: ["/blog/", "/gidsen/"],
  build: (dir, env) => { execSync('node build.mjs', { cwd: dir, env, stdio: 'ignore' }); return join(dir, 'dist'); },
  hubs: [{ hub: '/gidsen/', children: /^\/[^/]+\/$/ }],
  // Alleen ONTBREKENDE velden die de template van deze pagina niet heeft. Een aanwezig veld moet altijd kloppen.
  exempt: {
    '/thuisaccu-keuzehulp/': ['zichtbaar'], // keuzehulp zonder enige zichtbare datum: lastmod + dateModified verplicht (SC 30-10, besluit 3)
  },
  requireDateModified: ['/thuisaccu-keuzehulp/'], // WebApplication-JSON-LD moet dateModified (= lastmod) krijgen
  // Automatisch gegenereerde teaser 'Meer op de blog' onder elke post (src/blog.mjs) telt niet als bodywijziging van die post (L7: geen datum bij alleen een nieuwe teaser). Vraagt SC-OK.
  stripBlocks: [/<h2>Meer op de blog<\/h2><div class="grid cards two">[\s\S]*?<\/div>/],
};
export const ALLOW_NAME = [];
export const BEKEND_ORPHAN = []; // SC 30-10 besluit 2: geserveerd = publiek, geen allowlist; build-only modules uit de output (zie build.mjs)
// Hub-audit: bestaande bevindingen op origin/main (30-10). Haal een regel weg zodra de hub is gefixt; dan bewaakt de test hem.
export const BEKEND_HUB = []; // /gidsen/ gefixt 03-11 (zichtbare bijgewerkt-regel + lastmod), hub-audit bewaakt hem weer
export const BEKEND_L7 = [
  // SEO 23-11 (seo-review-tam-inhaal.md): /thuisaccu-keuzehulp/ heeft t.o.v. live 72d03c3 geen zichtbare bodywijziging
  // (main-vingerafdruk gelijk). dateModified, stempel en lastmod blijven 2026-11-06 (ANKER_UPD). L7 ziet wel een
  // wijziging in js/lib/match.js en js/lib/merken.js (nuchter/neutraal, al getild op de merkenpagina's). Geen lastmod-lift
  // zonder eigen zichtbare body. SC toetst deze uitzondering op de v2-hash.
  { pad: '/thuisaccu-keuzehulp/', reden: 'SEO 23-11: geen zichtbare bodywijziging; datums blijven 2026-11-06', alleen: /client-side data: js\/lib\/match\.js, js\/lib\/merken\.js/ },
];
