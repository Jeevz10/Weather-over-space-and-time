const { makeGoogleMapsAPICall } = require('./route');
const { WeatherAccumulator } = require('./weather-accumulator');

class Service {

    constructor(start, end, mode, increment) {
        this.start = start;
        this.end = end;
        this.mode = mode;
        this.increment = increment;
    }

    async getWeatherOverSpaceAndTime() {
        const leg = await this.getLegs();
        const totalDuration = leg.duration.value;
        const WeatherAccumulatorInstance = new WeatherAccumulator(totalDuration, this.increment);
        const steps = leg.steps;
        const result = await this.gatherWeatherData(WeatherAccumulatorInstance, steps);
        return { leg, result };
    }

    async getLegs() {
        const route = await makeGoogleMapsAPICall(this.start, this.end, this.mode);
        const leg = route.routes[0].legs[0];
        return leg;
    }

    /**
     * 
     * @param {*} WeatherAccumulatorInstance 
     * @param {*} steps 
     * 
     * The goal of this function is split into 2 parts: 
     * (1) weather data in specified increments up till an hour 
     * (2) weather data every other hour 
     */
    async gatherWeatherData(WeatherAccumulatorInstance, steps) {
        const numberOfSteps = steps.length;
        
        for (let i = 0; i < numberOfSteps; i++) {
            if (i == numberOfSteps - 1) {
                await WeatherAccumulatorInstance.determineWeather(steps[i], true);
            }
            await WeatherAccumulatorInstance.determineWeather(steps[i], false);
        }

        return WeatherAccumulatorInstance.getFinalData();
    }
}

module.exports = { 
    Service
}