# Heat Curve Card

The Heat Curve Card is a custom card for Home Assistant that displays a heating curve with actual temperature values. It is built using the LitElement library and provides a visual representation of temperature data.

## Features

- Displays a heating curve with configurable colors and labels.
- Shows actual temperature and flow temperature lines.
- Updates the actual temperature as a sensor in Home Assistant.
- Responsive design for different screen sizes.

## Installation

1. **Download the Card:**
   - Download the `heat-curve-cardbat.js` file and place it in your Home Assistant `www` directory.

2. **Add to Lovelace:**
   - In your Home Assistant dashboard, go to `Configuration` > `Lovelace Dashboards` > `Resources`.
   - Add a new resource with the URL pointing to `/local/heat-curve-cardbat.js` and set the type to `JavaScript Module`.

3. **Configure the Card:**
   - Add the card to your Lovelace UI using the following configuration:

     ```yaml
     type: 'custom:heat-curve-card'
     entities:
       voetpunt: sensor.voetpunt
       eindpunt: sensor.eindpunt
       outdoor_temp: sensor.outdoor_temperature
       flow_temp: sensor.flow_temperature
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


# To allow the card to update the sensor value in Home Assistant, you need a long-lived access token. Follow these steps:

 1. **Generate a Long-Lived Access Token:**
    - Go to your Home Assistant profile.
    - Scroll down to "Long-Lived Access Tokens" and create a new token.
    - Copy the token and keep it secure.

 2. **Update the JavaScript Code:**
    - In your `heat-curve-cardbat.js`, ensure the `updateHomeAssistantSensor` function uses the correct URL and token:

      ```javascript
      updateHomeAssistantSensor(actualTemp) {
          fetch('http://YOUR_HOME_ASSISTANT_URL:8123/api/states/sensor.actual_temperature', {
              method: 'POST',
              headers: {
                  'Authorization': 'Bearer YOUR_LONG_LIVED_ACCESS_TOKEN',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  state: actualTemp.toFixed(1),
                  attributes: {
                      unit_of_measurement: '°C',
                      friendly_name: 'Actual Temperature'
                  }
              })
          })
          .then(response => response.json())
          .then(data => console.log('Success:', data))
          .catch((error) => console.error('Error:', error));
      }
      ```
    - Replace `YOUR_HOME_ASSISTANT_URL` with your Home Assistant instance URL and `YOUR_LONG_LIVED_ACCESS_TOKEN` with the token you generated.


## Updating the Actual Temperature Sensor

To ensure the card updates the actual temperature as a sensor in Home Assistant, follow these steps:

1. **Create the Sensor**: Add the following configuration to your `configuration.yaml`:

   <<<
   yaml
   sensor:
     - platform: template
       sensors:
         actual_temperature:
           friendly_name: "Actual Temperature"
           unit_of_measurement: '°C'
           value_template: "{{ states('sensor.actual_temperature') }}"
   <<<

2. **Configure API Access**: Generate a long-lived access token in Home Assistant and update the JavaScript code in `heat-curve-cardbat.js` to use this token for API calls.


## Usage

Once installed and configured, the Heat Curve Card will display a graph with the specified temperature data. The actual temperature will be updated as a sensor in Home Assistant, allowing you to use it in automations and other configurations.

## Troubleshooting

- If the card does not display correctly, ensure that the JavaScript module is correctly added as a resource in Home Assistant.
- If the sensor shows "unknown", verify that the API call is correctly configured and that the access token is valid.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
