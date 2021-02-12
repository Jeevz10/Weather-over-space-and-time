const Koa = require('koa');

const PORTNUMBER = 3000;

class WeatherOverSpaceAndTime{

    constructor(Router, ErrorHandling) {
        this.Router = Router;
        this.ErrorHandling = ErrorHandling;
    }

    startServer() {
        const server = new Koa();
        server.use(this.ErrorHandling);
        server.use(this.Router.routes());
        server.listen(PORTNUMBER);
    }

}

module.exports = WeatherOverSpaceAndTime;