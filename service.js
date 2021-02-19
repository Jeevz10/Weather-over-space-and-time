const { makeGoogleMapsAPICall }  = require('./route');
const WeatherAccumulator = require('./weather-accumulator');

// why export doesnt work: https://stackoverflow.com/questions/38296667/getting-unexpected-token-export
module.exports = class Service {

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
        return { result };
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
     * The goal of this function is to iterate through all the steps and account for the weather data along the route
     */
    async gatherWeatherData(WeatherAccumulatorInstance, steps) {
        const numberOfSteps = steps.length;
        
        for (let i = 0; i < numberOfSteps; i++) {
            if (i == numberOfSteps - 1) {
                await WeatherAccumulatorInstance.determineWeather(steps[i], true);
            } else {
                await WeatherAccumulatorInstance.determineWeather(steps[i], false);
            }
        }
        return WeatherAccumulatorInstance.getFinalData();
    }
}