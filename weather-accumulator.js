const { makeOpenWeatherAPICall } = require('./weather');

// https://stackoverflow.com/questions/1535631/static-variables-in-javascript

class WeatherAccumulator {
    static durationAccumulator = 0;
    static incrementAccumulator = 0;
    static weatherData = [];
    
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
        const initialWeather = await makeOpenWeatherAPICall(this.startLat, this.startLng);
        WeatherAccumulator.weatherData.push(initialWeather); // to access static variables. use Class Name instead of this 
    }



    async determineWeather(step) {
        const secondsPerStep = step.duration.value;
        // console.log(secondsPerStep);
        // console.log(WeatherAccumulator.durationAccumulator);
        // console.log(WeatherAccumulator.incrementAccumulator);
        WeatherAccumulator.durationAccumulator += secondsPerStep;

        if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.incrementAccumulator) {
            const startLat = step.start_location.lat;
            const startLng = step.start_location.lng;

            const startWeather = await makeOpenWeatherAPICall(startLat, startLng);
            WeatherAccumulator.weatherData.push(startWeather);

            if (secondsPerStep > this.incrementInSeconds) {
                const endLat = step.end_location.lat;
                const endLng = step.end_location.lng;

                const endWeather = await makeOpenWeatherAPICall(endLat, endLng);
                WeatherAccumulator.weatherData.push(endWeather);
            }

            WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / this.incrementInSeconds) * this.incrementInSeconds;
            // console.log(WeatherAccumulator.weatherData);
        }

        return WeatherAccumulator.weatherData;
    }

    getFinalData() {
        return WeatherAccumulator.weatherData;
    }

}


module.exports = {
    WeatherAccumulator
}