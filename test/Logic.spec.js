const proxyQuire = require('proxyquire');
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');

const { mockWeather } = require('./stubs/MockWeather');
const { mockSlightlyMoreThanJustOneIntervalRoute,
mockLessThanOneIntervalRoute,
mockThreeStepsOverOneIntervalRoute,
mockThreeStepsLessThanAnHourRoute,
mockThreeStepsSlightlyMoreThanAnHourRoute,
mockOneStepThatIsMoreThanAnHourRoute,
mockThreeStepsMoreThanAnHourRoute,
mockTwoBigStepsOneSmallStepsOverAnHourRoute } = require('./stubs/MockRoute');
const { mockCurrentData, mockHourlyData } = require('./stubs/MockWeatherData');

Chai.use(ChaiAsPromised);
Chai.should();
const { expect } = Chai;

function handleHour(index) {
    const { lat, lon, timezone, timezone_offset, hourly } = mockHourlyData;
    let hourlyData = [];
    hourlyData.push(hourly[index])
    const curatedHourlyData = { lat, lon, timezone, timezone_offset, hourlyData };
    return curatedHourlyData;
}

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
            
            const curatedHourlyData = handleHour(1);
            const expectedResponse = { result: [mockCurrentData, mockCurrentData, mockCurrentData, curatedHourlyData] };
            expect(res).to.eql(expectedResponse);
        })
    })

    describe('for routes more than an hour', () => {
        it('should 1 current and 1 hour data for a single route than takes an hour long', async () => {
            const stub = {
                './weather': {
                    'makeOpenWeatherAPICall': mockWeather,
                    '@global': true
                },
                './route': {
                    'makeGoogleMapsAPICall': mockOneStepThatIsMoreThanAnHourRoute,
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

            const expectedResponse = { result: [mockCurrentData, curatedHourlyData] };
            expect(res).to.eql(expectedResponse);
        })

        it('should 2 current and 2 hour data for two steps that takes an hour long', async () => {
            const stub = {
                './weather': {
                    'makeOpenWeatherAPICall': mockWeather,
                    '@global': true
                },
                './route': {
                    'makeGoogleMapsAPICall': mockThreeStepsMoreThanAnHourRoute,
                    '@global': true
                }
            }
            const mockService = proxyQuire('../service', stub);
            const mService = new mockService('b', 'c', 'bicycling', '15');
            const res = await mService.getWeatherOverSpaceAndTime();
            
            const { lat, lon, timezone, timezone_offset, hourly } = mockHourlyData;
            let hourlyData = [];
            hourlyData.push(hourly[1]);
            const curatedHourlyData = { lat, lon, timezone, timezone_offset, hourlyData };

            // console.log('res' + JSON.stringify(res));
            const expectedResponse = { result: [mockCurrentData, mockCurrentData, curatedHourlyData, curatedHourlyData] };
            expect(res).to.eql(expectedResponse);
        })

        // it('should 1 current and 3 hour data for two steps that takes an hour long', async () => {
        //     const stub = {
        //         './weather': {
        //             'makeOpenWeatherAPICall': mockWeather,
        //             '@global': true
        //         },
        //         './route': {
        //             'makeGoogleMapsAPICall': mockTwoBigStepsOneSmallStepsOverAnHourRoute,
        //             '@global': true
        //         }
        //     }
        //     const mockService = proxyQuire('../service', stub);
        //     const mService = new mockService('b', 'c', 'bicycling', '15');
        //     const res = await mService.getWeatherOverSpaceAndTime();
            
        //     const { lat, lon, timezone, timezone_offset, hourly } = mockHourlyData;
        //     let firstHourData = [];
        //     firstHourData.push(hourly[1]);
        //     const curatedOneHourlyData = { lat, lon, timezone, timezone_offset, hourlyData: firstHourData };

        //     let thirdHourData = [];
        //     thirdHourData.push(hourly[3]);
        //     const curatedThirdHourlyData = { lat, lon, timezone, timezone_offset, hourlyData: thirdHourData };

        //     console.log('res' + JSON.stringify(res));
        //     const expectedResponse = { result: [mockCurrentData, curatedOneHourlyData, curatedOneHourlyData, curatedThirdHourlyData ] };
        //     expect(res).to.eql(expectedResponse);
        // })
    })

})
