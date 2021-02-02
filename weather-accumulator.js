const { makeOpenWeatherAPICall } = require('./weather');

// https://stackoverflow.com/questions/1535631/static-variables-in-javascript

class WeatherAccumulator {
    static durationAccumulator = 0;
    static weatherData = [];
    
    constructor(startLat, startLng, endLat, endLng, increment, totalDuration) {
        this.startLat = startLat;
        this.startLng = startLng;
        this.endLat = endLat;
        this.endLng = endLng;
        this.increment = increment;
        this.totalDuration = totalDuration;
    }

    async getInitialWeather() {
        console.log(this.startLat, this.startLng);
        const initialWeather = await makeOpenWeatherAPICall(this.startLat, this.startLng);
        WeatherAccumulator.weatherData.push(initialWeather); // to access static variables. use Class Name instead of this 
    }

}


module.exports = {
    WeatherAccumulator
}