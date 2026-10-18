# og:image (1200x630) per pagina, favicons en manifest-iconen. HTML -> PNG met headless Chrome.
# Alleen blogkaarten krijgen een foto (vrij gelicenseerd, zie src/assets/img/blog/BRONNEN.md). Geen personen.
import subprocess, os, tempfile, json
from PIL import Image
B='#1f5fa8';D='#141d2b';S='#ecf1f7';BG='#f7f9fc';G='#173a63';P='#b9cde6'
LOGO='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="#1f5fa8"/><rect x="7" y="13" width="22" height="15" rx="3" fill="#fff"/><rect x="29" y="17.5" width="3.5" height="6" rx="1.2" fill="#fff"/><path d="m12.5 20.5 3.5 3.5 6.5-7" fill="none" stroke="#1f5fa8" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="8" r="4" fill="#e7a33e"/></svg>'
cards={
 'home':('Past een thuisaccu bij jou?','Keuzehulp · 6 merken · saldering stopt 2027'),
 'match':('Doe de thuisaccu keuzehulp','6 vragen: soort, capaciteit en merken'),
 'rekenhulp':('Terugverdientijd thuisaccu','Besparing per jaar en terugverdientijd'),
 'capaciteit':('Hoeveel kWh heb je nodig?','Niet groter dan je avondverbruik'),
 'saldering':('Wat kost het einde van salderen?','Vóór en na 1 januari 2027'),
 'merken':('Alle thuisaccumerken','Aanbod, checklistscore en voor wie het past'),
 'vergelijken':('Thuisaccu’s vergelijken','6 merken op 10 vaste punten'),
 'merk-homewizard':('HomeWizard','Stekkerbatterij en checklist'),
 'merk-sessy':('Sessy','Aanbod, prijzen en checklist'),
 'merk-zonneplan':('Zonneplan','Aanbod, prijzen en checklist'),
 'merk-huawei':('Huawei','Aanbod en checklist'),
 'merk-solaredge':('SolarEdge','Aanbod en checklist'),
 'merk-byd':('BYD','Aanbod en checklist'),
 'salderingsregeling-stopt-2027':('Saldering stopt in 2027','Wat er verandert en wat het kost'),
 'thuisaccu-kosten':('Wat kost een thuisaccu?','Prijzen per kWh, btw en installatie'),
 'thuisaccu-terugverdientijd':('Verdien je een thuisaccu terug?','Zo reken je het uit'),
 'stekkerbatterij-of-vaste-thuisaccu':('Stekker of vaste thuisaccu?','De verschillen op een rij'),
 'thuisaccu-dynamisch-energiecontract':('Thuisaccu en dynamisch contract','Slim laden, risico’s en btw'),
 'terugleverkosten':('Terugleverkosten','Wat je netto overhoudt na 2027'),
 'btw-thuisaccu':('Btw op een thuisaccu','21% en wanneer je hem terugkrijgt'),
 'thuisaccu-veiligheid':('Thuisaccu veilig plaatsen','Tips van de Brandweer'),
 'blog':('Blog: thuisaccu kiezen','Kosten, saldering en merken, met bronnen'),
 'gidsen':('Gidsen over thuisaccu’s','Saldering, kosten, btw en veiligheid'),
}
# blogkaarten met kopfoto: kaart -> WebP in src/assets/img/blog (nu geen)
photo={}
art=f'<svg viewBox="0 0 300 300" width="300" height="300"><rect x="50" y="70" width="180" height="190" rx="18" fill="#fff" stroke="{D}" stroke-width="6"/><rect x="110" y="48" width="60" height="24" rx="6" fill="{D}"/><rect x="74" y="190" width="132" height="48" rx="8" fill="{G}"/><rect x="74" y="132" width="132" height="48" rx="8" fill="{B}"/><rect x="74" y="94" width="132" height="28" rx="8" fill="{P}"/><circle cx="244" cy="66" r="28" fill="#e7a33e"/><g stroke="#e7a33e" stroke-width="6" stroke-linecap="round"><path d="M244 22v-10M244 120v-10M200 66h-10M298 66h-10"/></g></svg>'
tmp=tempfile.mkdtemp()
def shot(html,out,w,h):
    f=os.path.join(tmp,'p.html');open(f,'w').write(html)
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1',f'--window-size={w},{h}',f'--screenshot={out}','file://'+f],capture_output=True,check=True)
os.makedirs('src/assets/og',exist_ok=True);os.makedirs('src/assets/icons',exist_ok=True)
import sys
only=set(sys.argv[1:])  # optioneel: alleen deze kaarten maken, bv. python3 scripts/images.py blog
for k,(t,sub) in cards.items():
    if only and k not in only: continue
    html=f'''<html><body style="margin:0;width:1200px;height:630px;background:{BG};font-family:'DejaVu Sans',sans-serif;overflow:hidden">
<div style="position:absolute;left:0;top:0;width:1200px;height:18px;background:{B}"></div>
<div style="position:absolute;left:72px;top:70px;display:flex;align-items:center;gap:16px;font-size:40px;font-weight:700;color:{D}"><div style="width:64px;height:64px">{LOGO}</div><span>Thuisaccu<span style="color:{B}">Match</span>.nl</span></div>
<div style="position:absolute;left:72px;top:190px;width:700px;font-size:{64 if len(t)<26 else 50}px;line-height:1.12;font-weight:800;color:{D}">{t}</div>
<div style="position:absolute;left:72px;bottom:80px;width:720px;font-size:30px;color:{G};font-weight:700">{sub}</div>
<div style="position:absolute;right:70px;top:170px;background:{S};border-radius:28px;padding:20px">{art}</div></body></html>'''
    if k in photo:
        img='file://'+os.path.abspath('src/assets/img/blog/'+photo[k])
        html=f'''<html><body style="margin:0;width:1200px;height:630px;background:{BG};font-family:'DejaVu Sans',sans-serif;overflow:hidden">
<div style="position:absolute;right:0;top:0;width:530px;height:630px;background:url('{img}') 28% center/cover"></div>
<div style="position:absolute;left:0;top:0;width:670px;height:630px;background:{BG}"></div>
<div style="position:absolute;left:0;top:0;width:1200px;height:18px;background:{B}"></div>
<div style="position:absolute;left:64px;top:70px;display:flex;align-items:center;gap:16px;font-size:32px;font-weight:700;color:{D}"><div style="width:54px;height:54px">{LOGO}</div><span>Thuisaccu<span style="color:{B}">Match</span>.nl</span></div>
<div style="position:absolute;left:64px;top:180px;font-size:24px;font-weight:700;color:{B};letter-spacing:.06em">BLOG</div>
<div style="position:absolute;left:64px;top:220px;width:540px;font-size:52px;line-height:1.12;font-weight:800;color:{D}">{t}</div>
<div style="position:absolute;left:64px;bottom:76px;width:540px;font-size:28px;color:{G};font-weight:700">{sub}</div></body></html>'''
    shot(html,f'src/assets/og/{k}.png',1200,630)
if not only: open('src/assets/icons/favicon.svg','w').write(LOGO)
for size,name in (() if only else ((32,'favicon-32.png'),(180,'apple-touch-icon.png'),(192,'icon-192.png'),(512,'icon-512.png'))):
    shot(f'<html><body style="margin:0;width:{size}px;height:{size}px">{LOGO.replace("<svg ",f"<svg width=\"{size}\" height=\"{size}\" ")}</body></html>',f'src/assets/icons/{name}',size,size)
print('ok',len(cards))
