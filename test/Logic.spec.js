const proxyQuire = require('proxyquire');
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');

const mockWeather = require('./stubs/MockWeather');
const { mockRoute } = require('./stubs/MockRoute');
const service = require('../service');

Chai.use(ChaiAsPromised);
Chai.should();

const stub = {
    // './weather': {
    //     'makeOpenWeatherAPICall': mockWeather,
    //     '@global': true
    // },
    './route': {
    'makeGoogleMapsAPICall': mockRoute,
    '@global': true
    }
}

const mockService = proxyQuire('../service', stub);

describe.only('test the logic', () => {
    it('yeah yeah', async (done) => {
        const mService = new mockService('b', 'c', 'bicycling', '123');
        console.log(mService);
        const res = await mService.getWeatherOverSpaceAndTime();
        res.should.be.a('object');
        done();
    })
})

