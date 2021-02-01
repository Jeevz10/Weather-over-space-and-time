const axios = require('axios');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const URL = 'https://maps.googleapis.com/maps/api/directions/json';

async function makeGoogleMapsAPICall(origin, destination, mode) {

    await axios.get(URL, {
        params: {
            origin,
            destination,
            mode,
            API,
            key: GOOGLE_MAPS_API_KEY,
        }
    })
    .then((response) => {
        console.log(response);
    })
}

module.exports = {
    makeGoogleMapsAPICall
}

