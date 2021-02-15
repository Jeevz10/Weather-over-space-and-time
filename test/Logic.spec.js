const proxyQuire = require('proxyquire');
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');

const { mockWeather } = require('./stubs/MockWeather');
const { mockSlightlyMoreThanJustOneIntervalRoute,
mockLessThanOneIntervalRoute,
mockThreeStepsOverOneIntervalRoute,
mockThreeStepsLessThanAnHourRoute,
mockThreeStepsSlightlyMoreThanAnHourRoute } = require('./stubs/MockRoute');
const { mockCurrentData, mockHourlyData } = require('./stubs/MockWeatherData');

Chai.use(ChaiAsPromised);
Chai.should();
const { expect } = Chai;

describe.only('test the logic', () => {

    describe('for routes less than an hour', () => {
        it('should return only 2 current data for duration of journey is less than 1 interval', async () => {
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
    
        it('should return only 2 current data for a route that has 3 steps spanning slightly more than 1 interval', async () => {
            const stub = {
                './weather': {
                    'makeOpenWeatherAPICall': mockWeather,
                    '@global': true
                },
                './route': {
                    'makeGoogleMapsAPICall': mockThreeStepsOverOneIntervalRoute,
                    '@global': true
                }
            }
            const mockService = proxyQuire('../service', stub);
            const mService = new mockService('b', 'c', 'bicycling', '15');
            const res = await mService.getWeatherOverSpaceAndTime();
    
            const expectedResponse = { result: [mockCurrentData, mockCurrentData] };
            expect(res).to.eql(expectedResponse);
        })
    
        it('should return only 4 current data for a route that has 3 steps less than an hour', async () => {
            const stub = {
                './weather': {
                    'makeOpenWeatherAPICall': mockWeather,
                    '@global': true
                },
                './route': {
                    'makeGoogleMapsAPICall': mockThreeStepsLessThanAnHourRoute,
                    '@global': true
                }
            }
            const mockService = proxyQuire('../service', stub);
            const mService = new mockService('b', 'c', 'bicycling', '15');
            const res = await mService.getWeatherOverSpaceAndTime();
            
            console.log('res' + JSON.stringify(res));
            const expectedResponse = { result: [mockCurrentData, mockCurrentData, mockCurrentData, mockCurrentData] };
            expect(res).to.eql(expectedResponse);
        })

        it('should return only 4 current and 1 hour data for a route that has 3 steps slightly more than an hour', async () => {
            const stub = {
                './weather': {
                    'makeOpenWeatherAPICall': mockWeather,
                    '@global': true
                },
                './route': {
                    'makeGoogleMapsAPICall': mockThreeStepsSlightlyMoreThanAnHourRoute,
                    '@global': true
                }
            }
            const mockService = proxyQuire('../service', stub);
            const mService = new mockService('b', 'c', 'bicycling', '15');
            const res = await mService.getWeatherOverSpaceAndTime();
            
            const { lat, lon, timezone, timezone_offset, hourly } = mockHourlyData;
            let hourlyData = [];
            hourlyData.push(hourly[1])
            const curatedHourlyData = { lat, lon, timezone, timezone_offset, hourlyData };
            
            const expectedResponse = { result: [mockCurrentData, mockCurrentData, mockCurrentData, curatedHourlyData] };
            expect(res).to.eql(expectedResponse);
        })
    })

})

