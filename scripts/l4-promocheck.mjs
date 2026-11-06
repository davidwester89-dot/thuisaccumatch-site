// l4-promocheck.mjs — L4: actiewoord + prijs zonder parseerbare einddatum, of een einddatum in het verleden.
// Zonder dependencies (Node >= 20). Gebruik vanuit een test (test/l4-promocheck.test.js) of als CLI:
//   node scripts/l4-promocheck.mjs
//   L4_VANDAAG=2026-11-06 node scripts/l4-promocheck.mjs     (vandaag vastzetten)
//   L4_OUT=dist node scripts/l4-promocheck.mjs              (scan een bestaande build, geen temp-build)
//
// Regels (GO 6-11):
//   A. In dezelfde passage als een actiewoord én een prijs (€ of eurobedrag) zonder parseerbare einddatum → rood.
//   B. Einddatum < vandaag (Europe/Amsterdam, of L4_VANDAAG) → rood.
//   C. Een data-veld `actie` (platforms.js / aanbieders.js / merken, hier src/lib/merken.js) is leeg/null, of bevat een
//      parseerbare einddatum. Vrije tekst zonder einddatum → rood. Een verlopen datum in zo'n veld is regel B.
// Einddatum-context: t/m | tot en met | geldig tot | eindigt, plus een NL-datum of ISO. parseDate uit l7check,
// plus maandafkortingen (nov, okt, …) die in actieteksten voorkomen.
// Actiewoord (woordgrens, zodat 'transactie' / 'transactiekosten' niet meetellen): actie|korting|introductieprijs|
// tijdelijk|Black Friday|welkomst. 'actief' / 'actieve' / 'actiever' is geen actie. 'pakketkorting' is geen losse korting.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, existsSync, realpathSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { parseDate, decode, walk, fileToPath, materialize, amsterdamToday } from './l7check.mjs';

export const vandaag = () => process.env.L4_VANDAAG || amsterdamToday();
export const bekendActief = (b, dag = vandaag()) => !b.tot || dag <= b.tot;
// Zelfde vorm als isBekend in l7check: pad aan het begin, optioneel 'alleen' op de hele melding, 'tot' inclusief.
export const isBekend = (regel, lijst = [], dag = vandaag()) => lijst.some((b) => bekendActief(b, dag)
  && (regel.startsWith(b.pad + ':') || regel.startsWith(b.pad + ' (')) && (!b.alleen || b.alleen.test(regel)));

const p2 = (n) => String(n).padStart(2, '0');
const NL_ABBR = { jan: 1, feb: 2, mrt: 3, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, okt: 10, oct: 10, nov: 11, dec: 12 };

export function parsePromoDate(s) {
  const iso = parseDate(s);
  if (iso) return realDate(iso);
  const m = decode(String(s)).replace(/\s+/g, ' ').trim().match(/\b(\d{1,2})\s+([a-z]+)\.?\s+(\d{4})/i);
  if (!m) return null;
  const month = NL_ABBR[m[2].toLowerCase()];
  if (!month) return null;
  return realDate(`${m[3]}-${p2(month)}-${p2(m[1])}`);
}

function realDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d ? iso : null;
}

// Woordgrens: 'transactie' bevat de letters actie, maar is geen actie.
// 'actief' / 'actieve' / 'actiever' / 'actieven' evenmin: de verbogen vormen schrijven 'v' ('per actieve terminal').
// Wel: 'actie', 'acties', 'actietarief', 'Clover-actie'. Een samenstelling als 'pakketkorting' telt niet als 'korting'.
export const PROMO_RE = /\b(?:actie(?!(?:f|ve|ver|ven|fst|fste)\b)|korting|introductieprijs|tijdelijk|black\s+friday|welkomst)/i;
// € 9,99 / EUR 10 / euro 10 / 10 euro. 'euro's' zonder bedrag telt niet.
export const PRICE_RE = /€\s*\d|(?:\beuro|\beur)\s*\d|\b\d[\d.]*(?:,\d{1,2})?\s*(?:euro|eur)\b/i;
const CUE_RE = /tot en met|geldig tot|eindigt|t\/m/i;
// Na de cue: leestekens, 'op' of 'en met' (bij 'geldig tot en met'), dan een datum.
const DATE_AFTER = /^[\s:,\-–—]{0,24}(?:op\s+|en met\s+)?(\d{4}-\d{2}-\d{2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\d{1,2}\s+[a-z]{3,}\.?(?:\s+\d{4})?)/i;

export function endDates(text) {
  const dates = [];
  const re = /tot en met|geldig tot|eindigt|t\/m/gi;
  for (const m of text.matchAll(re)) {
    const rest = text.slice(m.index + m[0].length);
    const d = DATE_AFTER.exec(rest);
    if (!d) continue;
    const iso = parsePromoDate(d[1]);
    if (iso) dates.push(iso);
  }
  return [...new Set(dates)].sort();
}

export function snippet(text, aroundRe) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  const flags = aroundRe ? aroundRe.flags.replace('g', '') : '';
  const m = aroundRe ? new RegExp(aroundRe.source, flags).exec(t) : null;
  const i = m ? m.index : 0;
  const len = m ? m[0].length : 0;
  let a = Math.max(0, i - 40);
  let b = Math.min(t.length, i + len + 80);
  if (b - a > 140) b = a + 140;
  return `${a ? '…' : ''}${t.slice(a, b).trim()}${b < t.length ? '…' : ''}`;
}

const norm = (s) => decode(String(s)).replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

// null = groen. { regel: 'A'|'B', tekst } = rood.
export function beoordeelPassage(text, dag = vandaag()) {
  const t = norm(text);
  if (!t || !PROMO_RE.test(t)) return null;
  const dates = endDates(t);
  if (dates.length) {
    // Meerdere cues: de laatste (nieuwste) einddatum geldt, zodat een verlenging niet rood blijft op de oude datum.
    const end = dates.at(-1);
    if (end < dag) return { regel: 'B', tekst: `einddatum ${end} < ${dag}: ${snippet(t, CUE_RE)}` };
    return null;
  }
  if (PRICE_RE.test(t)) return { regel: 'A', tekst: `actie en prijs zonder einddatum: ${snippet(t, PROMO_RE)}` };
  return null;
}

// Regel C (+ B als de datum verlopen is). null/'' = expliciet leeg = groen.
export function beoordeelActie(value, dag = vandaag()) {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return null;
  if (typeof value !== 'string') return { regel: 'C', tekst: `actie-veld zonder einddatum: geen tekst (${typeof value})` };
  const t = norm(value);
  const dates = endDates(t);
  if (!dates.length) return { regel: 'C', tekst: `actie-veld zonder einddatum: ${snippet(t, PROMO_RE)}` };
  const end = dates.at(-1);
  if (end < dag) return { regel: 'B', tekst: `einddatum ${end} < ${dag}: ${snippet(t, CUE_RE)}` };
  return null;
}

const BLOCK = /<(?:p|li|h[1-6]|td|th|dt|dd|figcaption|blockquote|caption|div|section|article|tr|header|footer|aside|nav|ul|ol|table|thead|tbody|main|figure)\b[^>]*>|<\/(?:p|li|h[1-6]|td|th|dt|dd|figcaption|blockquote|caption|div|section|article|tr|header|footer|aside|nav|ul|ol|table|thead|tbody|main|figure)>/gi;

export function passages(html) {
  let s = String(html)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|template|svg)\b[\s\S]*?<\/\1>/gi, ' ');
  const bits = [];
  const title = s.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (title) bits.push(title[1]);
  for (const m of s.matchAll(/<meta\b[^>]*(?:name|property)=["'](?:description|og:title|og:description)["'][^>]*>/gi)) {
    const c = m[0].match(/content=["']([^"']*)["']/i);
    if (c) bits.push(c[1]);
  }
  const body = (s.match(/<body\b[^>]*>([\s\S]*)<\/body>/i) || [, s])[1];
  bits.push(...body.split(BLOCK));
  return bits.map((b) => norm(b.replace(/<[^>]+>/g, ' '))).filter(Boolean);
}

export function scanHtml(file, html, dag = vandaag()) {
  const pad = fileToPath(String(file).split('\\').join('/'));
  const out = [];
  const seen = new Set();
  for (const p of passages(html)) {
    if (seen.has(p)) continue;
    seen.add(p);
    const hit = beoordeelPassage(p, dag);
    if (hit) out.push(`${pad} (${hit.regel}): ${hit.tekst}`);
  }
  return out;
}

export function htmlCount(outDir) {
  return walk(outDir).filter((f) => f.endsWith('.html')).length;
}

export function scanDir(outDir, dag = vandaag()) {
  const out = [];
  for (const f of walk(outDir)) {
    if (!f.endsWith('.html')) continue;
    out.push(...scanHtml(f, readFileSync(join(outDir, f), 'utf8'), dag));
  }
  return out;
}

export function walkActie(obj, bestand, veld, dag, out, seen = new Set()) {
  if (!obj || typeof obj !== 'object' || seen.has(obj)) return;
  seen.add(obj);
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => walkActie(v, bestand, `${veld}[${i}]`, dag, out, seen));
    return;
  }
  for (const [k, v] of Object.entries(obj)) {
    const next = `${veld}.${k}`;
    if (k === 'actie') {
      const hit = beoordeelActie(v, dag);
      if (hit) out.push(`${bestand} (${hit.regel}): ${next}: ${hit.tekst}`);
    } else walkActie(v, bestand, next, dag, out, seen);
  }
}

export async function scanActieModules(root, files, dag = vandaag()) {
  const out = [];
  for (const rel of files || []) {
    const abs = join(root, rel);
    if (!existsSync(abs)) continue;
    const mod = await import(pathToFileURL(abs).href);
    for (const [name, val] of Object.entries(mod)) walkActie(val, rel, name, dag, out);
  }
  return out;
}

const git = (root, args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

export async function runL4(root, cfg, opts = {}) {
  const dag = opts.vandaag || vandaag();
  if (process.env.L4_OUT && !opts.forceBuild) {
    const out = process.env.L4_OUT;
    const failures = [
      ...scanDir(out, dag),
      ...(process.env.L4_SKIP_DATA === '1' ? [] : await scanActieModules(root, cfg.actieModules, dag)),
    ];
    return { vandaag: dag, failures, out, html: htmlCount(out) };
  }
  const tmp = mkdtempSync(join(tmpdir(), 'l4-'));
  try {
    let ref = 'WORKTREE';
    if (process.env.L4_TIP) ref = git(root, ['rev-parse', '--verify', `${process.env.L4_TIP}^{commit}`]);
    materialize(root, ref, tmp);
    const env = { ...process.env, ...(cfg.env || {}) };
    if (process.env.PUSH_DATE) env.BUILD_DATE = process.env.BUILD_DATE || process.env.PUSH_DATE;
    const out = cfg.build(tmp, env);
    const html = htmlCount(out);
    const failures = [...scanDir(out, dag), ...await scanActieModules(tmp, cfg.actieModules, dag)];
    return { vandaag: dag, failures, out, html };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

export function applyBekend(failures, lijst, dag) {
  const fout = [];
  const bekend = [];
  for (const f of failures) (isBekend(f, lijst, dag) ? bekend : fout).push(f);
  return { fout, bekend };
}

export async function runCli(root = git(dirname(fileURLToPath(import.meta.url)), ['rev-parse', '--show-toplevel'])) {
  const here = dirname(fileURLToPath(import.meta.url));
  const { CFG, BEKEND_L4 = [] } = await import(pathToFileURL(join(here, 'l4.config.mjs')).href);
  const r = await runL4(root, CFG);
  const { fout, bekend } = applyBekend(r.failures, BEKEND_L4, r.vandaag);
  const lines = [`L4 vandaag ${r.vandaag}`];
  for (const f of bekend) lines.push('BEKEND L4 | ' + f);
  for (const b of BEKEND_L4.filter((b) => !bekendActief(b, r.vandaag))) lines.push(`BEKEND_L4 verlopen op ${b.tot}, telt weer als fout: ${b.pad}`);
  if (fout.length) lines.push(...fout.map((f) => 'L4 | ' + f));
  else lines.push('OK: L4-promocheck groen');
  return { code: fout.length ? 1 : 0, lines, vandaag: r.vandaag, fout, bekend };
}

function isMain() {
  if (!process.argv[1]) return false;
  try { return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]); } catch { return false; }
}
if (isMain()) {
  const r = await runCli();
  console.log(r.lines.join('\n'));
  process.exit(r.code);
}
