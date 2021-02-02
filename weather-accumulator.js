const { makeOpenWeatherAPICall } = require('./weather');

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


        console.log(this.startLat, this.startLng, this.endLat, this.endLng, this.increment, this.totalDuration);
    }

}


module.exports = {
    WeatherAccumulator
}