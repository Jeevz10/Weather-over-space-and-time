const proxyQuire = require('proxyquire');
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');

const { mockWeather } = require('./stubs/MockWeather');
const { mockSlightlyMoreThanJustOneIntervalRoute,
mockLessThanOneIntervalRoute } = require('./stubs/MockRoute');
const { mockCurrentData, mockHourlyData } = require('./stubs/MockWeatherData');

Chai.use(ChaiAsPromised);
Chai.should();
const { expect } = Chai;

describe.only('test the logic', () => {

    it('should return only 1 current data for duration of journey is less than 1 interval', async () => {
        const stub = {
            './weather': {
                'makeOpenWeatherAPICall': mockWeather,
                '@global': true
            },
            './route': {
                'makeGoogleMapsAPICall': mockLessThanOneIntervalRoute,
                '@global': true
            }
        }
        const mockService = proxyQuire('../service', stub);
        const mService = new mockService('b', 'c', 'bicycling', '15');
        const res = await mService.getWeatherOverSpaceAndTime();

        const expectedResponse = { result: [mockCurrentData, mockCurrentData] };
        expect(res).to.eql(expectedResponse);
    })

    it('should return only 2 current data for duration of journey is slightly more than 1 interval', async () => {
        const stub = {
            './weather': {
                'makeOpenWeatherAPICall': mockWeather,
                '@global': true
            },
            './route': {
                'makeGoogleMapsAPICall': mockSlightlyMoreThanJustOneIntervalRoute,
                '@global': true
            }
        }
        const mockService = proxyQuire('../service', stub);
        const mService = new mockService('b', 'c', 'bicycling', '15');
        const res = await mService.getWeatherOverSpaceAndTime();

        const expectedResponse = { result: [mockCurrentData, mockCurrentData] };
        expect(res).to.eql(expectedResponse);
    })
})

