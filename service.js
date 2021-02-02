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
        this.extractData(leg);
        const WeatherAccumulatorInstance = new WeatherAccumulator(this.startLat, this.startLng, this.endLat, this.endLng, this.duration, this.increment);

        return leg;
    }

    async getLegs() {
        const route = await makeGoogleMapsAPICall(this.start, this.end, this.mode);
        const leg = route.routes[0].legs[0];
        return leg;
    }

    extractData(leg) {
        this.startLat = leg.start_location.lat;
        this.startLng = leg.start_location.lng;

        this.endLat = leg.end_location.lat;
        this.endLng = leg.end_location.lng;

        this.duration = leg.duration.value;
    }
}

module.exports = { 
    Service
}