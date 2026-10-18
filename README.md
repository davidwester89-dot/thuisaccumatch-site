# ThuisaccuMatch.nl

Onafhankelijke keuzehulp en vergelijker voor thuisaccu's (thuisbatterijen): keuzehulp, 6 merkpagina's met een vaste checklist van 10 punten, een vergelijking met filters, 3 rekentools (terugverdientijd, capaciteit, einde salderen 2027) en 8 gidsen.

- Statische build zonder framework: `npm run build` → `dist/`
- Tests: `npm test` (logica, site, SEO, leads)
- Lokaal: `npm run serve` (poort 8083)
- Controle layout/tapdoelen: `node scripts/check-layout.mjs http://localhost:8083`
- Screenshots: `node scripts/screenshots.mjs http://localhost:8083`
- OG-kaarten en iconen: `npm run images`

Varianten:
- Testversie (nu, in `.github/workflows/pages.yml`): `BASE=/thuisaccumatch-site` → noindex, robots `Disallow: /`, geen CNAME.
- Live sinds 19-10-2026: `BASE=` en `GO_LIVE=1` → CNAME thuisaccumatch.nl, indexeerbaar (pages.yml, deploy bij push op main).

Regels: alle bedragen en checklistpunten met bron (naam + link). Byline "Redactie ThuisaccuMatch", geen verzonnen experts, reviews of beoordelingen. Partners tellen nooit mee in score, volgorde of advies. Offertemodule staat uit zolang `LEADPARTNERS` leeg is; partnerlinks zijn leeg tot een goedgekeurd partnerprogramma. Google Analytics (G-S8PV3K139J) laadt alleen na toestemming.
