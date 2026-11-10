"""Offline exports van de bestaande 291-dagenanalyse. Geen nieuwe marktdata ophalen."""
import contextlib, csv, datetime, hashlib, io, json, os, runpy, zipfile
from pathlib import Path
HIER = Path(__file__).resolve().parent
with contextlib.redirect_stdout(io.StringIO()):
    m = runpy.run_path(str(HIER / 'bereken.py'))
OUT = Path(os.environ.get('ONDERZOEK_OUT', HIER.parents[1] / 'src/root/onderzoek/data'))
OUT.mkdir(parents=True, exist_ok=True)
prijzen = m['prijzen']; dagen = m['dagen']; TZ = m['TZ']
with (OUT / 'uurprijzen-2026.csv').open('w', newline='') as f:
    w = csv.writer(f, lineterminator='\n')
    w.writerow(['tijd_utc', 'tijd_europe_amsterdam', 'datum_europe_amsterdam', 'beursprijs_eur_kwh_excl_btw_en_energiebelasting'])
    for t, prijs in sorted(prijzen.items()):
        lokaal = datetime.datetime.fromisoformat(t.replace('Z', '+00:00')).astimezone(TZ)
        if lokaal.date() in dagen:
            w.writerow([t, lokaal.isoformat(), lokaal.date().isoformat(), prijs])
with (OUT / 'scenarios-per-dag-2026.csv').open('w', newline='') as f:
    w = csv.writer(f, lineterminator='\n')
    w.writerow(['datum_europe_amsterdam', 'uren', 'scenario', 'capaciteit_kwh', 'vermogen_kw', 'waardering', 'voordeel_eur_tov_geen_accu'])
    for dag, pr in sorted(dagen.items()):
        w.writerow([dag.isoformat(), len(pr), 'geen accu', 0, 0, 'referentie', '0.000000000'])
        for naam, cap, vermogen in m['BATTERIJEN']:
            for modus in ('zelf', 'handel'):
                w.writerow([dag.isoformat(), len(pr), naam, cap, vermogen, modus, format(m['dagwaarde'](pr, cap, vermogen, modus), '.9f')])
# Het oorspronkelijke rekenscript, invoer en resultaten samen; vaste zipmetadata voor reproduceerbaarheid.
with zipfile.ZipFile(OUT / 'rekenpakket-2026.zip', 'w', compression=zipfile.ZIP_DEFLATED) as z:
    for naam in ['README.md', 'haal-prijzen.py', 'bereken.py', 'prijzen-2026.json', 'resultaten.json']:
        info = zipfile.ZipInfo(naam, (2026, 11, 10, 0, 0, 0)); info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o644 << 16
        z.writestr(info, (HIER / naam).read_bytes())
meta = {'periode': m['res']['periode'], 'dagen': m['res']['dagen'], 'bron_snapshot_sha256': hashlib.sha256((HIER / 'prijzen-2026.json').read_bytes()).hexdigest(),
        'bestanden': {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(OUT.iterdir()) if p.name != 'manifest.json'}}
(OUT / 'manifest.json').write_text(json.dumps(meta, indent=2) + '\n')
print(json.dumps(meta, indent=2))
