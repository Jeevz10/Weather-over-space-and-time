const axios = require('axios');

// https://developers.google.com/maps/documentation/distance-matrix/overview#Introduction
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const URL = 'https://maps.googleapis.com/maps/api/distancematrix/json';


// https://stackoverflow.com/questions/32994634/this-api-project-is-not-authorized-to-use-this-api-please-ensure-that-this-api
async function makeGoogleMapsAPICall(origins, destinations, mode) {

    const response = await axios.get(URL, {
        params: {
            origins,
            destinations,
            mode,
            key: GOOGLE_MAPS_API_KEY,
        }
    })
    .then(response => response.data)

    return response;
}

module.exports = {
    makeGoogleMapsAPICall
}

