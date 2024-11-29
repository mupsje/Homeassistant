# Heat Curve Card for Homeassistant



The Heat Curve Card is a custom card for Home Assistant that displays a heating curve with actual temperature values. It is built using the LitElement library and provides a visual representation of temperature data.

## Features

- Displays a heating curve with configurable colors and labels.
- Shows actual temperature and flow temperature lines.
- Updates the actual temperature as a sensor in Home Assistant.
- Responsive design for different screen sizes.

### Requirements

- **Home Assistant** installed and running.
- **Lovelace UI** enabled.
- **Access to the `www` directory** in your Home Assistant configuration.

## Required Entities

For the **Heat Curve Card** to function correctly, the following entities are required. Ensure that you have set up these entities in your Home Assistant configuration:

- **Foot Point (`voetpunt`)**:
  - **Description**: This is a helper entity representing the starting temperature of the heating curve. You can create an input_number helper in Home Assistant to set this value.
  - **Example Configuration**:
    ```yaml
    input_number:
      voetpunt:
        name: Foot Point
        initial: 20
        min: 0
        max: 100
        step: 1
    ```

- **End Point (`eindpunt`)**:
  - **Description**: This is a helper entity representing the ending temperature of the heating curve. You can also use an input_number helper for this.
  - **Example Configuration**:
    ```yaml
    input_number:
      eindpunt:
        name: End Point
        initial: 70
        min: 0
        max: 100
        step: 1
    ```

- **Outdoor Temperature (`outdoor_temp`)**:
  - **Description**: This is a sensor that measures the current outdoor temperature. This sensor is required to correctly display the heating curve.
  - **Example**: This can be a sensor receiving data from a weather station or another source providing outdoor temperature, such as an integrated weather service in Home Assistant.

- **Flow Temperature (`flow_temp`)**:
  - **Description**: This is a sensor that measures the flow temperature of a heat pump or boiler. This sensor is required to display the actual flow temperature on the card.
  - **Example**: This can be a sensor receiving data from a heat pump or boiler via an integration or a physical sensor measuring the flow temperature.

### Configuration Example

Ensure that you set the correct entities in your Lovelace configuration:

```yaml
type: 'custom:heat-curve-card'
entities:
  voetpunt: input_number.voetpunt
  eindpunt: input_number.eindpunt
  outdoor_temp: sensor.outdoor_temperature
  flow_temp: sensor.flow_temperature
```

With this configuration, you can effectively use the **Heat Curve Card** to display the heating curve and temperature data on your Home Assistant dashboard.

## Installation

1. **Download the Card:**
   - Download the `heat-curve.js` file and place it in your Home Assistant `www` directory.

2. **Add to Lovelace:**
   - In your Home Assistant dashboard, go to `Configuration` > `Lovelace Dashboards` > `Resources`.
   - Add a new resource with the URL pointing to `/local/heat-curve.js` and set the type to `JavaScript Module`.

3. **Configure the Card:**
   - Add the card to your Lovelace UI using the following configuration:

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

## Configuration Options

- `entities`: Define the entities for the card.
  - `voetpunt`: Entity for the starting point temperature.
  - `eindpunt`: Entity for the ending point temperature.
  - `outdoor_temp`: Entity for the outdoor temperature.
  - `flow_temp`: Entity for the flow temperature.

- `colors`: Customize the colors of the graph lines.
  - `heat_curve`: Color for the heat curve line.
  - `actual_temp`: Color for the actual temperature line.
  - `flow_temp`: Color for the flow temperature line.
  - `extension`: Color for the extension lines.
  - `grid`: Color for the grid lines.
  - `axes`: Color for the axes.

- `labelPosition`: Position of the temperature labels (`right`, `left`, `top`, `bottom`).
- `labelOffset`: Offset for the temperature labels.
- `verticalOffset`: Vertical offset for the temperature labels.
- `fontType`: Font type for the labels.
- `fontSize`: Font size for the labels.


### Step 4: Sensor

Once installed and configured, the Heat Curve Card will display a graph with the specified temperature data. The actual temperature will be updated as a sensor in Home Assistant, allowing you to use it in automations and other configurations.
To use the `actual_temp` value as a sensor, you need to restart Home Assistant.

### Step 5: Restart Home Assistant

Restart Home Assistant to apply all changes.

## Using the Actual Temperature Sensor

After installation, the card will update the `sensor.actual_temperature` with the actual temperature value. You can now use this sensor in your automations or as a setpoint for your heating.

### Check the Sensor

1. **Go to Developer Tools**:

Navigate to **Developer Tools** > **STATES** in Home Assistant.

2. **Find the Sensor**:

Look for `sensor.actual_temperature` to check if it exists and if the value is being updated.


## Troubleshooting

- If the card does not display correctly, ensure that the JavaScript module is correctly added as a resource in Home Assistant.
- If the sensor shows "unknown", verify that the API call is correctly configured and that the access token is valid.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
