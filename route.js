const axios = require('axios');

// https://developers.google.com/maps/documentation/distance-matrix/overview#Introduction
// Correction: Wanted to use Legs feature of directions API 
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const URL = 'https://maps.googleapis.com/maps/api/directions/json';


// In order to use the API, you need to enable the key: https://stackoverflow.com/questions/32994634/this-api-project-is-not-authorized-to-use-this-api-please-ensure-that-this-api
async function makeGoogleMapsAPICall(origin, destination, travelMode) {

    const response = await axios.get(URL, {
        params: {
            origin,
            destination,
            travelMode,
            key: GOOGLE_MAPS_API_KEY,
        }
    })
    .then(response => response.data)

    return response;
}

module.exports = {
    makeGoogleMapsAPICall
}

