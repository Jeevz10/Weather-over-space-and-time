const { makeOpenWeatherAPICall } = require('./weather');

// https://stackoverflow.com/questions/1535631/static-variables-in-javascript

class WeatherAccumulator {
    static durationAccumulator = 0;
    static incrementAccumulator = 0;
    static weatherData = [];
    static EXCLUDE_EVERYTHING_BUT_CURRENTLY = 'minutely,hourly,daily,alerts';
    static EXCLUDE_EVERYTHING_BUT_HOURLY = 'minutely,current,daily,alerts';
    
    constructor(startLat, startLng, endLat, endLng, totalDuration, increment) {
        this.startLat = startLat;
        this.startLng = startLng;
        this.endLat = endLat;
        this.endLng = endLng;
        this.increment = increment;
        this.incrementInSeconds = this.increment * 60;
        WeatherAccumulator.incrementAccumulator += this.incrementInSeconds;
        this.totalDuration = totalDuration;
    }

    async getInitialWeather() {
        const initialWeather = await makeOpenWeatherAPICall(this.startLat, this.startLng, WeatherAccumulator.EXCLUDE_EVERYTHING_BUT_CURRENTLY);
        WeatherAccumulator.weatherData.push(initialWeather); // to access static variables. use Class Name instead of this 
    }


    /**
     * 
     * @param {step} step
     * 
     * Initial idea was to allow for minutely, 15-min, 30-min, 45-min and hourly forecast data. However, due to the limitations of the 
     * weather data, the minutely data required to calculate 15, 30 and 45 min intervals of weather forecast is insufficient. Hence, the
     * weather data of a given place will be given unless an hour has passed for which it will be acted upon accordingly  
     */

    async determineWeather(step) {

        const SECONDS_IN_AN_HOUR = 60 * 60; 

        const secondsPerStep = step.duration.value;
        console.log('seconds per step: ' + secondsPerStep);
        console.log('duration accumulator: ' + WeatherAccumulator.durationAccumulator);
        console.log('increment accumulator: ' + WeatherAccumulator.incrementAccumulator);
        console.log(' ');
        WeatherAccumulator.durationAccumulator += secondsPerStep;

        // Initial value of incrementAccumulator is increment x 60 
        // if total time thus far in journey has eclipsed the increment counter -> time to make readings for this particular location 
        if (WeatherAccumulator.incrementAccumulator < SECONDS_IN_AN_HOUR) {
            if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.incrementAccumulator) {
                const startLat = step.start_location.lat;
                const startLng = step.start_location.lng;
    
                const startWeather = await makeOpenWeatherAPICall(startLat, startLng, WeatherAccumulator.EXCLUDE_EVERYTHING_BUT_CURRENTLY);
                WeatherAccumulator.weatherData.push(startWeather);
                
                // in case duration for particular step is longer than the increment specified
                if (secondsPerStep > this.incrementInSeconds) {
                    const endLat = step.end_location.lat;
                    const endLng = step.end_location.lng;
    
                    const endWeather = await makeOpenWeatherAPICall(endLat, endLng, WeatherAccumulator.EXCLUDE_EVERYTHING_BUT_HOURLY);
                    WeatherAccumulator.weatherData.push(endWeather);
                }
    
                WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / this.incrementInSeconds) * this.incrementInSeconds;
            }
        } else {
            if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.incrementAccumulator) {
                console.log('hereee');
                const noOfHoursAfter = this.incrementInSeconds/SECONDS_IN_AN_HOUR;
                const startLat = step.start_location.lat;
                const startLng = step.start_location.lng;
    
                const startWeather = await makeOpenWeatherAPICall(startLat, startLng, WeatherAccumulator.EXCLUDE_EVERYTHING_BUT_CURRENTLY);
                WeatherAccumulator.weatherData.push(startWeather);
                
                // in case duration for particular step is longer than the increment specified
                if (secondsPerStep > this.incrementInSeconds) {
                    const endLat = step.end_location.lat;
                    const endLng = step.end_location.lng;
    
                    const endWeather = await makeOpenWeatherAPICall(endLat, endLng, WeatherAccumulator.EXCLUDE_EVERYTHING_BUT_CURRENTLY);
                    WeatherAccumulator.weatherData.push(endWeather);
                }
    
                WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / this.incrementInSeconds) * this.incrementInSeconds;
            }

        }
    }

    getFinalData() {
        return WeatherAccumulator.weatherData;
    }

}


module.exports = {
    WeatherAccumulator
}