const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');
const ChaiHttp = require('chai-http');
const Sinon = require('sinon');
const WeatherOverSpaceAndTime = require('../app');
const { startServer } = require('../initializer');
const Router = require('../router');
const { errorHandling } = require('../error-handling');


Chai.use(ChaiAsPromised);
Chai.use(ChaiHttp);
const { expect, should } = Chai;
Chai.should();

const testPortNumber = 8080;

describe("Router Tests", () => {
    describe("GET /route-weather", () => {
        const fullRequest = '/route-weather?start=Brooklyn&end=Boston&mode=bicycling&increment=5';
        startServer(testPortNumber);
        // const instance = new WeatherOverSpaceAndTime(Router, errorHandling, 8080);
        it('should respond with a 200', (done) => {
            Chai.request(`http://localhost:` + testPortNumber)
                .get(fullRequest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })
})