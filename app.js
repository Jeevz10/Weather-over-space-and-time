const Koa = require('koa');

const PORTNUMBER = 3000;

class WeatherOverSpaceAndTime{

    constructor(Router) {
        this.Router = Router;
    }

    startServer() {
        const server = new Koa();
        // server.use(this.Router);
        server.listen(PORTNUMBER);
    }

}

module.exports = WeatherOverSpaceAndTime;