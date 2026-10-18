# Haalt de day-ahead-stroomprijzen (EPEX, per uur, zonder btw en energiebelasting) op bij de openbare API van EnergyZero
# voor 1 januari t/m 18 oktober 2026 (Nederlandse tijd) en schrijft ze naar prijzen-2026.json: {"<UTC-tijd>": prijs in € per kWh}.
# Gebruik: python3 scripts/arbitrage/haal-prijzen.py
import json, urllib.request, datetime, os
OUT = os.path.join(os.path.dirname(__file__), 'prijzen-2026.json')
URL = 'https://api.energyzero.nl/v1/energyprices?fromDate={}&tillDate={}&interval=4&usageType=1&inclBtw=false'
prijzen = {}
start = datetime.date(2026, 1, 1)
while start <= datetime.date(2026, 10, 18):
    eind = min(start + datetime.timedelta(days=30), datetime.date(2026, 10, 18))
    # Nederlandse dag begint om 23:00 of 22:00 UTC; neem ruim en filter later op Nederlandse datum.
    url = URL.format(f'{start - datetime.timedelta(days=1)}T21:00:00.000Z', f'{eind}T23:59:59.999Z')
    req = urllib.request.Request(url, headers={'User-Agent': 'ThuisaccuMatch-redactie'})
    for p in json.load(urllib.request.urlopen(req, timeout=60))['Prices']:
        prijzen[p['readingDate'].replace('.000', '')] = p['price']
    start = eind + datetime.timedelta(days=1)
json.dump(dict(sorted(prijzen.items())), open(OUT, 'w'), indent=0)
print(len(prijzen), 'uurprijzen →', OUT)
