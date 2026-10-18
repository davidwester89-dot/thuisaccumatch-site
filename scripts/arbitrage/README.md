# Slim laden met een thuisbatterij, 2026 (bovengrens)

Bron van de bedragen in /blog/thuisbatterij-dynamisch-contract/ en /blog/thuisbatterij-rendabel-2027/.

1. `python3 scripts/arbitrage/haal-prijzen.py` haalt de day-ahead-uurprijzen (EPEX, zonder btw en energiebelasting) voor
   1 januari t/m 18 oktober 2026 op bij de openbare API van EnergyZero en schrijft `prijzen-2026.json`.
2. `python3 scripts/arbitrage/bereken.py` rekent per dag de beste laad- en ontlaaduren uit (methode bovenin het script) en
   schrijft `resultaten.json`.

`prijzen-2026.json` staat in de repo, zodat stap 2 zonder internet hetzelfde oplevert. De test `test/arbitrage.test.js`
draait stap 2 en controleert dat de bedragen in de blogposts overeenkomen.
