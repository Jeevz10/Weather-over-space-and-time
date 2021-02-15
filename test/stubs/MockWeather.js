const { mockCurrentData, mockHourlyData } = require('./MockWeatherData');

function mockWeather(lat, lon, exclude) {
    if (exclude === 'minutely,current,daily,alerts') {
        return mockHourlyData;
    } else {
        return mockCurrentData;
    }
}



module.exports = {
    mockWeather
}