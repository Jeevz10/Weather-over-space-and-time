const axios = require('axios');

const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;
const URL = 'https://api.openweathermap.org/data/2.5/onecall';


async function makeOpenWeatherAPICall(lat, lon, exclude, appid) {

    await axios.get(URL, {
        params: {
            lat,
            lon,
            exclude,
            appid: OPEN_WEATHER_API_KEY,
        }
    })
    .then((response) => {
        console.log(response);
    })
}

module.exports = {
    makeOpenWeatherAPICall
}