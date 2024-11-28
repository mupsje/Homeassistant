# Heat Curve Card

Een aangepaste kaart voor Home Assistant die een verwarmingscurve weergeeft met de actuele temperatuurwaarden.

## Installatie

Volg de onderstaande stappen om de Heat Curve Card aan je Home Assistant toe te voegen.

### Vereisten

- **Home Assistant** geïnstalleerd en werkend.
- **Lovelace UI** ingeschakeld.
- **Toegang tot de `www` map** in je Home Assistant configuratie.

### Stap 1: Bestanden downloaden

1. **Download het script**:

   Download het `heat-curve.js` bestand uit deze repository.

2. **Plaats het bestand**:

   Kopieer het gedownloade `heat-curve.js` bestand naar de `www` map in je Home Assistant configuratie.

   Het pad zou er ongeveer zo uitzien:


### Stap 2: Resource toevoegen aan Lovelace

1. **Ga naar de Lovelace configuratie**:

Open je Home Assistant en ga naar **Instellingen** > **Dashboards** > **Bronnen** (of gebruik de **RAW configuratie-editor**).

2. **Voeg de resource toe**:

Voeg de volgende resource toe aan je Lovelace configuratie:

```
url: /local/heat-curve.js
type: module
```

### Stap 3: Kaart toevoegen aan je dashboard

1. **Bewerk je dashboard**:

Ga naar het dashboard waar je de kaart wilt toevoegen en klik op **Dashboard bewerken**.

2. **Voeg een nieuwe kaart toe**:

Klik op **Kaart toevoegen** en kies voor **Manueel**.

3. **Voeg de kaartconfiguratie toe**:

Plak de volgende configuratie in het tekstveld:

```
type: "custom:heat-curve-card"
entities:
  voetpunt: sensor.voetpunt
  eindpunt: sensor.eindpunt
  outdoor_temp: sensor.outdoor_temperature
  flow_temp: sensor.flow_temperature
labelPosition: right
labelOffset: 10
verticalOffset: 4
fontType: Arial
fontSize: 12
colors:
  heat_curve: '#ff0000'
  actual_temp: '#00ff00'
  flow_temp: '#800080'
  extension: '#0000ff'
  grid: '#e0e0e0'
  axes: '#000000'
```

**Let op**: Vervang de entiteiten onder `entities` door de juiste sensoren uit jouw Home Assistant configuratie.

### Stap 4: Sensor

Om de `actual_temp` waarde als sensor te kunnen gebruiken, moet je hassio herstarten.


### Stap 5: Home Assistant herstarten

Herstart Home Assistant om alle wijzigingen door te voeren.

## Gebruik van de Actual Temperature Sensor

Na installatie zal de kaart de `sensor.actual_temperature` bijwerken met de actuele temperatuurwaarde. Je kunt deze sensor nu gebruiken in je automatiseringen of als setpunt.

### Controleer de sensor

1. **Ga naar Ontwikkelaarstools**:

Navigeer naar **Ontwikkelaarstools** > **STATES** in Home Assistant.

2. **Zoek de sensor**:

Zoek naar `sensor.actual_temperature` om te controleren of deze bestaat en of de waarde wordt bijgewerkt.

## Ondersteuning

Als je vragen hebt of tegen problemen aanloopt, open dan een issue in de repository of neem contact op met de ontwikkelaar.

## Licentie

Dit project is gelicentieerd onder de MIT-licentie. Zie het `LICENSE` bestand voor meer informatie.

