# Heat Curve Card / Weersafhankelijke temperatuurkaart / Stooklijnkaart


Een aangepaste kaart voor Home Assistant die een verwarmingscurve weergeeft met de actuele temperatuurwaarden.

## Installatie

Volg de onderstaande stappen om de Heat Curve Card aan je Home Assistant toe te voegen.

### Vereisten

- **Home Assistant** geïnstalleerd en werkend.
- **Lovelace UI** ingeschakeld.
- **Toegang tot de `www` map** in je Home Assistant configuratie.

## Vereiste Entiteiten

Voor het correct functioneren van de **Heat Curve Card** zijn de volgende entiteiten nodig. Zorg ervoor dat je deze entiteiten hebt ingesteld in je Home Assistant configuratie:

- **Voetpunt (`voetpunt`)**:
  - **Beschrijving**: Dit is een helper-entiteit die de starttemperatuur van de verwarmingscurve vertegenwoordigt. Je kunt een input_number helper maken in Home Assistant om deze waarde in te stellen.
  - **Voorbeeldconfiguratie**:
    ```yaml
    input_number:
      voetpunt:
        name: Voetpunt
        initial: 20
        min: 0
        max: 100
        step: 1
    ```

- **Eindpunt (`eindpunt`)**:
  - **Beschrijving**: Dit is een helper-entiteit die de eindtemperatuur van de verwarmingscurve vertegenwoordigt. Ook hiervoor kun je een input_number helper gebruiken.
  - **Voorbeeldconfiguratie**:
    ```yaml
    input_number:
      eindpunt:
        name: Eindpunt
        initial: 70
        min: 0
        max: 100
        step: 1
    ```

- **Buitentemperatuur (`outdoor_temp`)**:
  - **Beschrijving**: Dit is een sensor die de actuele buitentemperatuur meet. Deze sensor is vereist om de verwarmingscurve correct te kunnen weergeven.
  - **Voorbeeld**: Dit kan een sensor zijn die gegevens ontvangt van een weerstation of een andere bron die buitentemperatuur levert, zoals een geïntegreerde weerdienst in Home Assistant.

- **Aanvoertemperatuur (`flow_temp`)**:
  - **Beschrijving**: Dit is een sensor die de aanvoertemperatuur van een warmtepomp of ketel meet. Deze sensor is vereist voor het weergeven van de actuele aanvoertemperatuur op de kaart.
  - **Voorbeeld**: Dit kan een sensor zijn die gegevens ontvangt van een warmtepomp of ketel via een integratie of een fysieke sensor die de aanvoertemperatuur meet.

### Configuratie Voorbeeld

Zorg ervoor dat je de juiste entiteiten instelt in je Lovelace configuratie:

```yaml
type: 'custom:heat-curve-card'
entities:
  voetpunt: input_number.voetpunt
  eindpunt: input_number.eindpunt
  outdoor_temp: sensor.buitentemperatuur
  flow_temp: sensor.aanvoertemperatuur
```

Met deze configuratie kun je de **Heat Curve Card** effectief gebruiken om de verwarmingscurve en temperatuurgegevens in je Home Assistant dashboard weer te geven.


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

Om de `actual_temp` waarde als sensor te kunnen gebruiken, moeten we hassio herstarten.

### Stap 5: Home Assistant herstarten

Herstart Home Assistant om alle wijzigingen door te voeren.

## Gebruik van de Actual Temperature Sensor

Na installatie zal de kaart de `sensor.actual_temperature` bijwerken met de actuele temperatuurwaarde. Je kunt deze sensor nu gebruiken in je automatiseringen of als setpunt voor je verwarming.

### Controleer de sensor

1. **Ga naar Ontwikkelaarstools**:

Navigeer naar **Ontwikkelaarstools** > **STATES** in Home Assistant.

2. **Zoek de sensor**:

Zoek naar `sensor.actual_temperature` om te controleren of deze bestaat en of de waarde wordt bijgewerkt.

## Ondersteuning

Als je vragen hebt of tegen problemen aanloopt, open dan een issue in de repository of neem contact op met de ontwikkelaar.

## Licentie

Dit project is gelicentieerd onder de MIT-licentie. Zie het `LICENSE` bestand voor meer informatie.

