# Bovengrens van wat een thuisbatterij met slim laden had kunnen opleveren, 1 januari t/m 18 oktober 2026.
# Invoer: prijzen-2026.json (haal-prijzen.py). Uitvoer: resultaten.json en een tabel op het scherm.
#
# Methode (per Nederlandse kalenderdag, batterij begint en eindigt leeg):
# - De batterij laadt alleen van het net, per uur een vast blok (capaciteit / aantal uren dat volledig laden duurt bij het vermogen).
# - Laden kost (beursprijs + energiebelasting 2026 € 0,09161) × 1,21 btw.
# - Ontladen levert 90% van de geladen kWh (rendement heen en terug). Waarde per kWh:
#     'zelf'    = je eigen verbruik op dat uur: (beursprijs + energiebelasting) × 1,21
#     'handel'  = terugleveren tegen de kale beursprijs (na 2027 geen energiebelasting terug, geen saldering)
# - Dynamisch programmeren over de uren van de dag kiest de beste volgorde (meerdere laadrondes mogen).
# Aannames die de uitkomst hoger maken dan in de praktijk: perfecte kennis van de prijzen, geen opslag van de leverancier,
# en bij 'zelf' dat je op elk ontlaaduur het volle vermogen zelf verbruikt.
import json, datetime, zoneinfo, collections, math, os, statistics
HIER = os.path.dirname(__file__)
EB, BTW, REND = 0.09161, 1.21, 0.9
TZ = zoneinfo.ZoneInfo('Europe/Amsterdam')
EERSTE, LAATSTE = datetime.date(2026, 1, 1), datetime.date(2026, 10, 18)
BATTERIJEN = [('2,7 kWh, 0,8 kW', 2.7, 0.8), ('5 kWh, 2,5 kW', 5, 2.5), ('10 kWh, 5 kW', 10, 5)]

prijzen = json.load(open(os.path.join(HIER, 'prijzen-2026.json')))
dagen = collections.defaultdict(list)
for t, p in sorted(prijzen.items()):
    d = datetime.datetime.fromisoformat(t.replace('Z', '+00:00')).astimezone(TZ)
    if EERSTE <= d.date() <= LAATSTE: dagen[d.date()].append(p)
dagen = {d: v for d, v in dagen.items() if len(v) >= 23}  # volledige dagen (23 uur bij de overgang naar zomertijd)

def dagwaarde(pr, cap, vermogen, modus):
    k = math.ceil(cap / vermogen - 1e-9); blok = cap / k; MIN = -1e18
    best = [0] + [MIN] * k  # best[s] = hoogste saldo met s blokken in de batterij
    for x in pr:
        nb = best[:]
        for s in range(k + 1):
            if best[s] == MIN: continue
            if s < k: nb[s + 1] = max(nb[s + 1], best[s] - blok * BTW * (x + EB))
            if s > 0: nb[s - 1] = max(nb[s - 1], best[s] + blok * REND * (BTW * (x + EB) if modus == 'zelf' else x))
        best = nb
    return max(0, best[0])

res = {'periode': f'{EERSTE} t/m {LAATSTE}', 'dagen': len(dagen),
       'gemiddelde_prijs': round(statistics.mean(p for v in dagen.values() for p in v), 4),
       'negatieve_uren': sum(p < 0 for v in dagen.values() for p in v),
       'dagspreiding_gemiddeld': round(statistics.mean(max(v) - min(v) for v in dagen.values()), 3),
       'dagspreiding_mediaan': round(statistics.median(max(v) - min(v) for v in dagen.values()), 3), 'batterijen': {}}
for naam, cap, verm in BATTERIJEN:
    for modus in ('zelf', 'handel'):
        m = collections.defaultdict(float)
        for d, pr in dagen.items(): m[d.month] += dagwaarde(pr, cap, verm, modus)
        res['batterijen'][f'{naam} | {modus}'] = {'totaal': round(sum(m.values())), 'per_maand': {k: round(v, 1) for k, v in sorted(m.items())}}
json.dump(res, open(os.path.join(HIER, 'resultaten.json'), 'w'), indent=1, ensure_ascii=False)
print(json.dumps({k: v for k, v in res.items() if k != 'batterijen'}, ensure_ascii=False))
for k, v in res['batterijen'].items(): print(f"{k:28} € {v['totaal']:4}  {v['per_maand']}")
