import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { buildLive, buildPreview, htmlFiles, read, DOMAIN } from './helpers.js';
import { IDS, MERKEN } from '../src/lib/merken.js';
import { PARTNERLINKS } from '../src/lib/partnerlinks.js';
import { ranglijst, score } from '../src/lib/checklist.js';
import { loadPosts } from '../src/blog.mjs';

const VERBODEN = [/Dave/i, /Wester/i, /batterijmatch/i, /goodfellas/i, /reddit/i, /geraadpleegd op/i, /check altijd/i, /controleer altijd/i, /kan veranderen/i, /dit is geen advies/i, /shopmatch-site/i];
const NEP = [/★/, /aggregateRating/, /reviewCount/, /ratingValue/, /sterren/i, /klantbeoordeling/i, /AI-gegenereerd/i, /gemaakt met AI/i, /\bAI-disclaimer/i, /trustpilot/i];

test('build (productie): pagina’s, sitemap, robots, IndexNow, CNAME, huisregels', () => {
  buildLive();
  const html = htmlFiles();
  assert.equal(html.length, 27 + loadPosts().length); // 25 pagina's + blogindex + 404 + gepubliceerde blogposts (datum <= vandaag)
  const sm = read('dist/sitemap.xml');
  assert.equal((sm.match(/<loc>/g) || []).length, html.length - 1);
  assert.match(read('dist/robots.txt'), /Sitemap: https:\/\/thuisaccumatch.nl\/sitemap.xml/);
  assert.equal(read('dist/CNAME').trim(), 'thuisaccumatch.nl');
  const key = readdirSync('dist').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  assert.ok(key && read(join('dist', key)) === key.replace('.txt', ''), 'IndexNow-sleutelbestand');
  assert.equal(read('dist/urls.txt').trim().split('\n').length, html.length - 1);
  // Daisycon-verificatie (mediaregistratie thuisaccumatch.nl, 19-10-2026): alleen op de homepage.
  assert.ok(read('dist/index.html').includes('<meta name="e08923fead07e26" content="c805cc3c2262098e1a99fce841da04b0" />'), 'Daisycon-meta op /');
  for (const f of html) if (f !== join('dist', 'index.html')) assert.ok(!read(f).includes('e08923fead07e26'), `${f}: Daisycon-meta hoort alleen op /`);
  const impact = "<meta name='impact-site-verification' value='3863a096-87d6-4ae8-aea8-c856e59d324b'>";
  assert.ok(read(join('dist', 'index.html')).includes("<meta name='impact-site-verification' value='bcdec9e7-96e8-449e-b059-a1ed69bdb69c'>"), 'tweede Impact-meta op /');
  assert.ok(read('dist/index.html').includes(impact), 'Impact-verificatie op /');
  for (const f of html) if (f !== join('dist', 'index.html')) assert.ok(!read(f).includes('impact-site-verification'), `${f}: Impact-meta hoort alleen op /`);
  for (const f of html) {
    const s = read(f);
    for (const r of [...VERBODEN, ...NEP]) assert.ok(!r.test(s), `${f} bevat ${r}`);
    if (!f.endsWith('404.html')) { assert.match(s, /<link rel="canonical" href="https:\/\/thuisaccumatch.nl\//); assert.ok(!s.includes('noindex'), f); }
    const title = s.match(/<title>(.*?)<\/title>/)[1]; assert.ok(title.length <= 60, `${f}: titel te lang (${title.length})`);
    assert.match(s, /Ook van ons/);
    const net = s.slice(s.indexOf('<div class="net">'), s.indexOf('<p class="fine">'));
    assert.deepEqual([...net.matchAll(/href="([^"]+)"/g)].map((m) => m[1]), ['https://boekhoudmatch.nl/', 'https://verduurzaammatch.nl/', 'https://shopmatch.nl/', 'https://warmtepompenmatch.nl/', 'https://kassamatch.nl/'], `${f}: netwerkfooter`);
    for (const m of s.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(m[1]);
    for (const m of s.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const p = m[1]; const t = p.endsWith('/') ? join('dist', p, 'index.html') : join('dist', p);
      assert.ok(existsSync(t), `${f}: kapotte link ${p}`);
    }
    for (const m of s.matchAll(/<a [^>]*data-partner-slot="([^"]+)"[^>]*>/g)) {
      const href = m[0].match(/href="([^"]+)"/)[1];
      assert.equal(href, MERKEN[m[1]].url, `${f}: ${m[1]}`); assert.match(m[0], /rel="noopener"/);
    }
    assert.ok(!/class="partner"/.test(s), `${f}: partnerlabel zonder goedgekeurde partner`);
    assert.ok(!/rel="[^"]*sponsored/.test(s), `${f}: sponsored link zonder goedgekeurde partner`);
    if (/<article/.test(s) && /class="src">Door/.test(s)) assert.match(s, /Door Redactie ThuisaccuMatch/);
    // Minstens 300 woorden zichtbare tekst in <main>.
    if (!f.endsWith('404.html')) { const main = s.split('<main')[1].split('</main>')[0].replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' '); const w = main.split(/\s+/).filter((x) => /[a-zà-ü0-9]/i.test(x)).length; assert.ok(w >= 300, `${f}: ${w} woorden`); }
    // Logo's: lokaal, vaste maat, alt = '<merknaam> logo' (30-10).
    for (const m of s.matchAll(/<img class="plogo plogo-(sm|md|lg)[^"]*" src="\/logos\/([a-z]+)\.webp" alt="([^"]+)" width="(\d+)" height="(\d+)"/g)) {
      assert.equal(m[3], MERKEN[m[2]].naam + ' logo');
      assert.deepEqual([m[4], m[5]], { sm: ['100', '30'], md: ['120', '36'], lg: ['160', '48'] }[m[1]]);
    }
    assert.ok(!/<img(?![^>]*\balt=)/.test(s), `${f}: img zonder alt`);
  }
  for (const id of IDS) assert.ok(existsSync(`dist/logos/${id}.webp`), `logo ${id}`);
});

test('build: componenten, vergelijking in vaste volgorde, keuzehulp en rekentools', () => {
  buildLive();
  const css = read('src/assets/css/style.css');
  assert.match(css, /--brand:#1f5fa8/); assert.match(css, /font-family:Inter/);
  assert.ok(!/#b44d22|#0e6b63|#4b3fc4|#2f7a3a/i.test(css), 'geen BM-, VM-, SM- of WPM-accent');
  const v = read('dist/vergelijken/index.html');
  const rows = [...v.matchAll(/<tr data-id="(\w+)" data-naam="[^"]+" data-score="([\d.]+)"/g)];
  assert.deepEqual(rows.map((r) => r[1]), ranglijst());
  for (const [, id, sc] of rows) assert.equal(Number(sc), score(id).totaal);
  const h = read('dist/index.html');
  for (const k of ['class="hero-q"', 'class="trustbar"', 'class="logobar"', 'method-band']) assert.ok(h.includes(k), k);
  assert.equal((h.match(/class="logo-tile"/g) || []).length, 6);
  // Echte H1 op de homepage (geen logo).
  assert.match(h, /<h1 class="tagline">Thuisaccu kiezen\? Reken eerst\.<\/h1>/);
  assert.ok(!/<h1[^>]*>[^<]*<(svg|b)/.test(h));
  const q = read('dist/thuisaccu-keuzehulp/index.html');
  assert.match(q, /id="result"/); assert.match(q, /Zo werkt de keuzehulp/); assert.equal((q.match(/<fieldset class="q">/g) || []).length, 6);
  for (const [p, js, id] of [['terugverdientijd-thuisaccu-berekenen', 'terugverdientijd', 'r-jaren'], ['capaciteit-thuisaccu-berekenen', 'capaciteit', 'r-advies'], ['einde-salderen-berekenen', 'saldering', 'r-verschil']]) {
    const c = read(`dist/${p}/index.html`);
    assert.match(c, new RegExp(`id="${id}"`)); assert.match(c, new RegExp(`src="/js/${js}\\.js"`)); assert.match(c, /Zo rekenen we/);
    assert.ok(existsSync(`dist/js/${js}.js`));
  }
  assert.match(read('dist/einde-salderen-berekenen/index.html'), /€ 625/);
  assert.match(read('dist/terugverdientijd-thuisaccu-berekenen/index.html'), /15,4 jaar/);
  for (const id of IDS) assert.match(read(`dist/merken/${MERKEN[id].slug}/index.html`), /Checklist: wat biedt/);
  const sal = read('dist/salderingsregeling-stopt-2027/index.html');
  for (const t of ['1 januari 2027', '50%', '2030']) assert.ok(sal.includes(t), `saldering mist ${t}`);
  assert.match(read('dist/btw-thuisaccu/index.html'), /21%/);
  assert.match(read('dist/merken/sessy/index.html'), /€ 3\.550/);
  assert.match(read('dist/merken/homewizard/index.html'), /€ 1\.195/);
  // Blog: index, 3 posts met kopfoto, naamsvermelding, BlogPosting + FAQPage, in sitemap en feed.
  assert.ok(existsSync('dist/blog/index.html')); assert.match(h, /href="\/blog\/"/);
  const sm = read('dist/sitemap.xml'); assert.ok(existsSync('dist/blog/feed.xml'));
  for (const slug of ['thuisbatterij-rendabel-2027', 'thuisbatterij-dynamisch-contract', 'thuisbatterij-terugleverkosten-2027']) {
    const b = read(`dist/blog/${slug}/index.html`);
    assert.ok(sm.includes(`<loc>https://thuisaccumatch.nl/blog/${slug}/</loc>`), `${slug} in sitemap`);
    assert.match(b, /"@type":"BlogPosting"/); assert.match(b, /"@type":"FAQPage"/); assert.match(b, /Door Redactie ThuisaccuMatch/);
    assert.ok(!/<figcaption/.test(b), `${slug}: geen fotografenbijschrift (CC0)`); assert.match(b, /href="\/thuisaccu-keuzehulp\/"/);
    for (const w of [600, 900, 1200]) assert.ok(existsSync(`dist/img/blog/${slug}-${w}.webp`), `${slug}-${w}.webp`);
    assert.ok(existsSync(`dist/og/blog-${slug}.png`));
    const main = b.split('<main')[1].split('</main>')[0].replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
    assert.ok(main.split(/\s+/).filter((x) => /[a-zà-ü0-9]/i.test(x)).length >= 1000, `${slug}: minstens 1000 woorden`);
    const bron = read('src/assets/img/blog/BRONNEN.md'); assert.ok(bron.includes(`## ${slug}-`), `${slug} in BRONNEN.md`);
    assert.match(bron.split(`## ${slug}-`)[1].split('\n## ')[0], /Licentie: CC0 1\.0/, `${slug}: CC0`);
  }
  assert.match(read('dist/blog/thuisbatterij-dynamisch-contract/index.html'), /href="\/vergelijken\/"/);
  assert.ok(!existsSync('dist/img/blog/BRONNEN.md'), 'fotobronnen niet in dist');
  assert.ok(existsSync('dist/site.webmanifest') && existsSync('dist/icon-512.png'), 'manifest');
  assert.match(read('dist/site.webmanifest'), /ThuisaccuMatch/);
  assert.match(h, /<link rel="manifest" href="\/site\.webmanifest">/);
  assert.equal(Object.keys(PARTNERLINKS).length, 0);
  // Cookiemelding en GA4 alleen na toestemming.
  const consent = read('dist/js/consent.js');
  assert.match(consent, /Cookies voor statistieken\?/);
  assert.match(h, /data-ga="G-S8PV3K139J"/);
  assert.ok(!/<script[^>]*googletagmanager/.test(h), 'GA niet in de HTML: laadt pas na toestemming via consent.js');
  assert.match(read('dist/js/lib/consent.js'), /googletagmanager\.com\/gtag\/js/);
});

test('build (test-site): noindex overal, Disallow, BASE-paden, geen CNAME, preview-balk', () => {
  buildPreview();
  for (const f of htmlFiles()) {
    const s = read(f);
    assert.match(s, /<meta name="robots" content="noindex">/, f);
    assert.match(s, /url\(\/thuisaccumatch-site\/fonts\/inter-400\.woff2\)/, `${f}: fontpad zonder BASE`);
    assert.match(s, /Testversie van ThuisaccuMatch.nl, nog niet live/);
  }
  const s = read('dist/index.html');
  assert.match(s, /href="\/thuisaccumatch-site\/thuisaccu-keuzehulp\/"/);
  assert.match(s, /<link rel="canonical" href="https:\/\/thuisaccumatch.nl\/">/);
  assert.equal(read('dist/robots.txt'), 'User-agent: *\nDisallow: /\n');
  assert.ok(!existsSync('dist/CNAME'));
  // Ook met GO_LIVE=1 en een BASE nooit een CNAME (veiligheid).
  execSync('node build.mjs', { env: { ...process.env, BASE: '/thuisaccumatch-site', GO_LIVE: '1', LEADS_PREVIEW: '' } });
  assert.ok(!existsSync('dist/CNAME'));
  // Workflow staat live: BASE leeg, GO_LIVE 1, deploy bij push op main.
  const wf = read('.github/workflows/pages.yml');
  assert.match(wf, /BASE: ''/); assert.match(wf, /GO_LIVE: '1'/); assert.match(wf, /push:\n\s+branches: \[main\]/);
});

test('blog: post van 20-10-2026 staat pas vanaf die datum in loadPosts', () => {
  const slugs = (d) => loadPosts('content/blog', d).map((p) => p.slug);
  assert.ok(!slugs('2026-10-19').includes('thuisbatterij-met-noodstroom'), 'niet op 19-10');
  assert.ok(slugs('2026-10-20').includes('thuisbatterij-met-noodstroom'), 'wel op 20-10');
});
