const mockLessThanOneIntervalData = {
    routes: [
        {
            legs: [
                {
                    duration: {
                        value: 12
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
};

const mockSlightlyMoreThanJustOneIntervalData = {
    routes: [
        {
            legs: [
                {
                    duration: {
                        value: 20
                    },
                    steps: [
                        {
                            duration: {
                                value: 20
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

module.exports = {
    mockSlightlyMoreThanJustOneIntervalData,
    mockLessThanOneIntervalData,
}