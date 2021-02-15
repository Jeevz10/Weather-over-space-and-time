
const mockRouteData = {
    routes: [
        {
            legs: [
                {
                    duration: {
                        value: 123
                    },
                    steps: [
                        {
                            duration: {
                                value: 12
                            },
                            end_location: {
                                lat: 12,
                                lon: 34,
                            },
                            start_location: {
                                lat: 11,
                                lon: 33,
                            }
                        }
                    ]
                }
            ]
        }
    ]
}

function mockRoute() {
    return mockRouteData;
}

module.exports = {
    mockRoute
}