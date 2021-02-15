const { mockSlightlyMoreThanJustOneIntervalData,
mockLessThanOneIntervalData,
mockThreeStepsOverOneIntervalData,
mockThreeStepsLessThanAnHourData,
mockThreeStepsSlightlyMoreThanAnHourData } = require('./MockRouteData');


function mockSlightlyMoreThanJustOneIntervalRoute() {
    return mockSlightlyMoreThanJustOneIntervalData;
}

function mockLessThanOneIntervalRoute() {
    return mockLessThanOneIntervalData;
}

function mockThreeStepsOverOneIntervalRoute() {
    return mockThreeStepsOverOneIntervalData;
}

function mockThreeStepsLessThanAnHourRoute() {
    return mockThreeStepsLessThanAnHourData;
}

function mockThreeStepsSlightlyMoreThanAnHourRoute() {
    return mockThreeStepsSlightlyMoreThanAnHourData;
}


module.exports = {
    mockSlightlyMoreThanJustOneIntervalRoute,
    mockLessThanOneIntervalRoute,
    mockThreeStepsOverOneIntervalRoute,
    mockThreeStepsLessThanAnHourRoute,
    mockThreeStepsSlightlyMoreThanAnHourRoute
}