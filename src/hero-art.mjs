// Hero-illustratie ThuisaccuMatch (redesign-v1): thuisaccu aan de muur met laadniveau, stroom van de zonnepanelen naar de accu.
// Eigen SVG, geen stockfoto, geen personen, geen merklogo's. Kleuren uit de TAM-huisstijl (blauw, amber).
export const HERO_ART = `<svg viewBox="0 0 520 440" role="img" aria-labelledby="hero-art-t" focusable="false"><title id="hero-art-t">Illustratie: thuisaccu met laadniveau die zonnestroom opslaat</title>
<defs>
<pattern id="tam-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="#1f5fa8" opacity=".16"/></pattern>
<linearGradient id="tam-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e4edf8"/><stop offset="1" stop-color="#d2e2f5"/></linearGradient>
<linearGradient id="tam-lvl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1f5fa8"/><stop offset="1" stop-color="#4f8fd8"/></linearGradient>
</defs>
<rect x="70" y="40" width="380" height="360" rx="64" fill="url(#tam-bg)" transform="rotate(-6 260 220)"/>
<rect x="24" y="250" width="150" height="150" fill="url(#tam-dots)"/>
<rect x="370" y="24" width="132" height="110" fill="url(#tam-dots)"/>
<circle cx="76" cy="60" r="22" fill="#e7a33e"/>
<g transform="translate(46 70) skewX(-12)"><rect width="126" height="78" rx="8" fill="#173a63"/><g stroke="#4f8fd8" stroke-width="3"><path d="M42 4v70M84 4v70M4 39h118"/></g></g>
<path d="M150 150c40 0 50 40 92 40" fill="none" stroke="#e7a33e" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 14"/>
<rect x="230" y="96" width="170" height="270" rx="30" fill="#fff" stroke="#173a63" stroke-width="6"/>
<rect x="296" y="82" width="38" height="18" rx="6" fill="#173a63"/>
<rect x="256" y="128" width="118" height="206" rx="16" fill="#e4edf8"/>
<g fill="url(#tam-lvl)"><rect x="268" y="292" width="94" height="30" rx="8"/><rect x="268" y="254" width="94" height="30" rx="8"/><rect x="268" y="216" width="94" height="30" rx="8"/><rect x="268" y="178" width="94" height="30" rx="8"/></g>
<rect x="268" y="140" width="94" height="30" rx="8" fill="none" stroke="#9db9dc" stroke-width="3" stroke-dasharray="6 6"/>
<path d="M322 186l-22 34h18l-8 28 26-38h-18l8-24z" fill="#e7a33e" stroke="#173a63" stroke-width="2" stroke-linejoin="round"/>
<path d="M60 384h400" stroke="#173a63" stroke-width="6" stroke-linecap="round"/>
<path d="M315 366v18" stroke="#173a63" stroke-width="6"/>
<g transform="translate(372 286)"><rect width="122" height="70" rx="12" fill="#fff" stroke="#dbe3ee" stroke-width="2"/><g fill="#1f5fa8"><rect x="16" y="38" width="12" height="18" rx="3"/><rect x="34" y="28" width="12" height="28" rx="3"/><rect x="52" y="20" width="12" height="36" rx="3"/></g><rect x="70" y="14" width="12" height="42" rx="3" fill="#e7a33e"/><rect x="90" y="24" width="18" height="6" rx="3" fill="#dbe3ee"/><rect x="90" y="36" width="12" height="6" rx="3" fill="#dbe3ee"/></g>
<circle cx="476" cy="200" r="7" fill="#e7a33e" opacity=".7"/><circle cx="196" cy="300" r="6" fill="#1f5fa8" opacity=".35"/>
</svg>`;
