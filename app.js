const Koa = require('koa');

// const PORTNUMBER = 3000;

class WeatherOverSpaceAndTime{

    constructor(router, errorHandling, portNumber) {
        this.Router = router;
        this.ErrorHandling = errorHandling;
        this.PortNumber = portNumber;
    }

    startServer() {
        const server = new Koa();
        server.use(this.ErrorHandling);
        server.use(this.Router.routes());
        server.listen(this.PortNumber);
    }

}

module.exports = WeatherOverSpaceAndTime;