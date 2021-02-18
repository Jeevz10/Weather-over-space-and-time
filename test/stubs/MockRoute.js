const { mockSlightlyMoreThanJustOneIntervalData,
mockLessThanOneIntervalData,
mockThreeStepsOverOneIntervalData,
mockThreeStepsLessThanAnHourData,
mockThreeStepsSlightlyMoreThanAnHourData,
mockMoreThanAnHourData,
mockThreeStepsMoreThanAnHourData,
mockTwoBigStepsOneSmallStepsOverAnHourData } = require('./MockRouteData');


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

function mockOneStepThatIsMoreThanAnHourRoute() {
    return mockMoreThanAnHourData;
}

function mockThreeStepsMoreThanAnHourRoute() {
    return mockThreeStepsMoreThanAnHourData;
}

function mockTwoBigStepsOneSmallStepsOverAnHourRoute() {
    return mockTwoBigStepsOneSmallStepsOverAnHourData;
}


module.exports = {
    mockSlightlyMoreThanJustOneIntervalRoute,
    mockLessThanOneIntervalRoute,
    mockThreeStepsOverOneIntervalRoute,
    mockThreeStepsLessThanAnHourRoute,
    mockThreeStepsSlightlyMoreThanAnHourRoute,
    mockOneStepThatIsMoreThanAnHourRoute,
    mockThreeStepsMoreThanAnHourRoute,
    mockTwoBigStepsOneSmallStepsOverAnHourRoute
}