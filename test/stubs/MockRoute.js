const { mockSlightlyMoreThanJustOneIntervalData,
mockLessThanOneIntervalData } = require('./MockRouteData');


function mockSlightlyMoreThanJustOneIntervalRoute() {
    return mockSlightlyMoreThanJustOneIntervalData;
}

function mockLessThanOneIntervalRoute() {
    return mockLessThanOneIntervalData;
}

module.exports = {
    mockSlightlyMoreThanJustOneIntervalRoute,
    mockLessThanOneIntervalRoute
}