const { makeOpenWeatherAPICall } = require('./weather');
const { makeGoogleMapsAPICall } = require('./route');

class Service {

    constructor(start, end, mode, increment) {
        this.start = start;
        this.end = end;
        this.mode = mode;
        this.increment = increment;
    }

    async getWeatherOverSpaceAndTime() {
        const route = this.getRoute();
        return route;
    }

    async getRoute() {
        const route = await makeGoogleMapsAPICall(this.start, this.end, this.mode);
        console.log(JSON.stringify(route));
        return route;
    }
}

module.exports = { 
    Service
}