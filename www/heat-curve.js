import {
    LitElement,
    html,
    css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class HeatCurveCard extends LitElement {
    static get properties() {
        return {
            hass: { type: Object },
            config: { type: Object },
            labelPosition: { type: String },
            labelOffset: { type: Number },
            verticalOffset: { type: Number }
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
            .card-content {
                padding: 16px;
            }
            canvas {
                width: 100%;
                height: auto;
                border: 1px solid #ccc;
            }
        `;
    }

    setConfig(config) {
        if (!config.entities) {
            throw new Error("Please define entities");
        }
        if (!config.entities.voetpunt || !config.entities.eindpunt || 
            !config.entities.outdoor_temp || !config.entities.flow_temp) {
            throw new Error("Please define all required entities: voetpunt, eindpunt, outdoor_temp, flow_temp");
        }
    
        // Set default colors if not provided
        this.colors = {
            heat_curve: config.colors?.heat_curve || '#ff0000',
            actual_temp: config.colors?.actual_temp || '#00ff00',
            flow_temp: config.colors?.flow_temp || '#800080',
            extension: config.colors?.extension || '#0000ff',
            grid: config.colors?.grid || '#e0e0e0',
            axes: config.colors?.axes || '#000000'
        };
    
        // Voeg default waardes toe voor label instellingen
        this.labelPosition = config.labelPosition || 'right';
        this.labelOffset = config.labelOffset || 10;
        this.verticalOffset = config.verticalOffset || 4;
    
        // Voeg default waardes toe voor font instellingen
        this.fontType = config.fontType || 'Arial';
        this.fontSize = config.fontSize || 12;
    
        this.config = config;
    }
       
    drawTemperatureLabel(x, y, temperature) {
        const scale = this.getScaledValues();
        
        this.ctx.font = `${this.fontSize}px ${this.fontType}`;
        this.ctx.fillStyle = this.colors.actual_temp;
        this.ctx.textAlign = 'left';
        
        let labelX = x;
        let labelY = y + this.verticalOffset;
        
        switch(this.labelPosition) {
            case 'right':
                labelX += this.labelOffset;
                break;
            case 'left':
                labelX -= this.labelOffset;
                this.ctx.textAlign = 'right';
                break;
            case 'top':
                labelY -= this.labelOffset;
                this.ctx.textAlign = 'center';
                break;
            case 'bottom':
                labelY += this.labelOffset + this.fontSize;
                this.ctx.textAlign = 'center';
                break;
        }
        
        this.ctx.fillText(`${temperature.toFixed(1)}°C`, labelX, labelY);
        this.ctx.textAlign = 'left';
        this.updateHomeAssistantSensor(temperature);
    }
    updateHomeAssistantSensor(actualTemp) {
        this.hass.callApi('POST', 'states/sensor.actual_temperature', {
            state: actualTemp.toFixed(1),
            attributes: {
                unit_of_measurement: '°C',
                friendly_name: 'Actual Temperature',
            },
        })
        .then((data) => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
    }
    

    render() {
        if (!this.hass || !this.config) {
            return html``;
        }

        return html`
            <ha-card header="Heat Curve">
                <div class="card-content">
                    <canvas 
                        id="heatCurve"
                        width="800"
                        height="600"
                        @resize=${this._handleResize}
                    ></canvas>
                </div>
            </ha-card>
        `;
    }

    firstUpdated() {
        this.canvas = this.shadowRoot.getElementById('heatCurve');
        this.ctx = this.canvas.getContext('2d');
        this._drawCurve();
    }

    updated(changedProps) {
        if (changedProps.has('hass')) {
            this._drawCurve();
        }
    }

    _handleResize() {
        this._drawCurve();
    }

    getScaledValues() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        return {
            padding: Math.floor(width / 18) + this.fontSize,
            fontSize: Math.max(12, Math.floor(width / 40)),
            lineWidth: Math.max(1, width / 400),
            pointRadius: Math.max(3, width / 160),
            dashLength: Math.max(2, width / 200)
        };
    }

    drawGrid() {
        const scale = this.getScaledValues();
        const padding = scale.padding;
        const width = this.canvas.width - padding * 2;
        const height = this.canvas.height - padding * 2;

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = scale.lineWidth * 0.5;

        const xValues = [25,20,15,10,5,0,-5,-10,-15,-20];
        xValues.forEach((value, index) => {
            const x = padding + (width - (index * width/9));
            this.ctx.moveTo(x, padding);
            this.ctx.lineTo(x, height + padding);
        });

        const yValues = [25,30,35,40,45,50,55,60,65,70,75,80,85,90,95];
        yValues.forEach((value, index) => {
            const y = height + padding - (height * index/(yValues.length-1));
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(width + padding, y);
        });

        this.ctx.stroke();
    }

    drawAxes() {
        const scale = this.getScaledValues();
        const padding = scale.padding;
        const width = this.canvas.width - padding * 2;
        const height = this.canvas.height - padding * 2;
    
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.colors.axes;
        this.ctx.lineWidth = scale.lineWidth;
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, height + padding);
        this.ctx.lineTo(width + padding, height + padding);
        this.ctx.stroke();
    
        // X-axis title
        this.ctx.font = `bold ${this.fontSize}px ${this.fontType}`;
        this.ctx.fillStyle = this.colors.axes;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Outdoor Temperature °C', this.canvas.width / 2, height + padding + (this.fontSize * 2));
    
        // Y-axis title
        this.ctx.save();
        const yAxisTitleOffset = this.fontSize * 1.7; // Pas deze waarde aan voor meer ruimte
        this.ctx.translate(padding - yAxisTitleOffset, this.canvas.height / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Flow Temperature °C', 0, 0);
        this.ctx.restore();
    
        // X-axis labels
        this.ctx.font = `${this.fontSize * 0.8}px ${this.fontType}`;
        const xValues = [-20, -15, -10, -5, 0, 5, 10, 15, 20, 25];
        xValues.forEach((value, index) => {
            const x = padding + (width - (index * width / 9));
            this.ctx.fillText(`${value > 0 ? '+' + value : value}`, x - 5, height + padding + this.fontSize);
        });
    
        // Y-axis labels
        const yValues = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
        yValues.forEach((value, index) => {
            const y = height + padding - (height * index / (yValues.length - 1));
            this.ctx.fillText(value, padding - (this.fontSize * 0.8), y + 5);
        });
    }
    
    
    
      

    drawLine(minTemp, maxTemp, actualTemp, actualFlowTemp) {
        const scale = this.getScaledValues();
        const padding = scale.padding;
        const width = this.canvas.width - padding * 2;
        const height = this.canvas.height - padding * 2;
        
        const xValues = [-20,-15,-10,-5,0,5,10,15,20,25];
        const voetpuntX = padding + (width - (xValues.indexOf(20) * width/9));
        const eindpuntX = padding + (width - (xValues.indexOf(-10) * width/9));            

        const voetpuntY = padding + height - ((minTemp - 25) * height / 70);
        const eindpuntY = padding + height - ((maxTemp - 25) * height / 70);

        // Main heat curve
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.colors.heat_curve;
        this.ctx.lineWidth = scale.lineWidth * 2;
        this.ctx.moveTo(voetpuntX, voetpuntY);
        this.ctx.lineTo(eindpuntX, eindpuntY);
        this.ctx.stroke();

        // Endpoints
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colors.heat_curve;
        this.ctx.arc(voetpuntX, voetpuntY, scale.pointRadius, 0, Math.PI * 2);
        this.ctx.arc(eindpuntX, eindpuntY, scale.pointRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Actual temperature line
        const actualX = padding + width - ((actualTemp + 20) * width/45);
        const slope = (eindpuntY - voetpuntY) / (eindpuntX - voetpuntX);
        const actualY = voetpuntY + slope * (actualX - voetpuntX);

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.colors.actual_temp;
        this.ctx.setLineDash([scale.dashLength, scale.dashLength]);
        this.ctx.moveTo(actualX, height + padding);
        this.ctx.lineTo(actualX, actualY);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.fillStyle = this.colors.actual_temp;
        this.ctx.arc(actualX, actualY, scale.pointRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Na het tekenen van het groene intersectiepunt:
        const intersectTemp = 25 + (70 * (height + padding - actualY) / height);
        this.drawTemperatureLabel(actualX, actualY, intersectTemp);
    
        // Actual flow temperature line
        const actualFlowY = padding + height - ((actualFlowTemp - 25) * height / 70);
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.colors.flow_temp;
        this.ctx.setLineDash([scale.dashLength, scale.dashLength]);
        this.ctx.moveTo(padding, actualFlowY);
        this.ctx.lineTo(width + padding, actualFlowY);
        this.ctx.stroke();

        const inverseSlope = (voetpuntX - eindpuntX) / (voetpuntY - eindpuntY);
        const intersectX = voetpuntX + (actualFlowY - voetpuntY) * inverseSlope;

        this.ctx.beginPath();
        this.ctx.fillStyle = this.colors.flow_temp;
        this.ctx.arc(intersectX, actualFlowY, scale.pointRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Extension lines
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.colors.extension;
        this.ctx.setLineDash([scale.dashLength * 2.5, scale.dashLength * 2.5]);
        this.ctx.lineWidth = scale.lineWidth;
        this.ctx.moveTo(voetpuntX, voetpuntY);
        this.ctx.lineTo(padding, voetpuntY);
        this.ctx.moveTo(eindpuntX, eindpuntY);
        this.ctx.lineTo(width + padding, eindpuntY);
        this.ctx.stroke();

        this.ctx.setLineDash([]);
    }

    _drawCurve() {
        if (!this.ctx || !this.hass || !this.config) return;

        const voetpunt = parseFloat(this.hass.states[this.config.entities.voetpunt].state);
        const eindpunt = parseFloat(this.hass.states[this.config.entities.eindpunt].state);
        const outdoorTemp = parseFloat(this.hass.states[this.config.entities.outdoor_temp].state);
        const flowTemp = parseFloat(this.hass.states[this.config.entities.flow_temp].state);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawAxes();
        this.drawLine(voetpunt, eindpunt, outdoorTemp, flowTemp);
    }

    getCardSize() {
        return 3;
    }
}


customElements.define("heat-curve-card", HeatCurveCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "heat-curve-card",
    name: "Heat Curve Card",
    description: "A card that displays a heating curve with actual temperature values"
});


