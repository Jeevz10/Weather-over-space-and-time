const mockLessThanOneIntervalData = {
    routes: [
        {
            legs: [
                {
                    duration: {
                        value: 720
                    },
                    steps: [
                        {
                            duration: {
                                value: 720
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
                        value: 1200
                    },
                    steps: [
                        {
                            duration: {
                                value: 1200
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

const mockThreeStepsOverOneIntervalData = {
    routes: [
        {
            legs: [
                {
                    duration: {
                        value: 960
                    },
                    steps: [
                        {
                            duration: {
                                value: 480
                            },
                            end_location: {
                                lat: 12,
                                lon: 34,
                            },
                            start_location: {
                                lat: 11,
                                lon: 33,
                            }
                        },
                        {
                            duration: {
                                value: 180
                            },
                            end_location: {
                                lat: 12,
                                lon: 34,
                            },
                            start_location: {
                                lat: 11,
                                lon: 33,
                            }
                        },
                        {
                            duration: {
                                value: 300
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

const mockThreeStepsLessThanAnHourData = {
    routes: [
        {
            legs: [
                {
                    duration: {
                        value: 2820
                    },
                    steps: [
                        {
                            duration: {
                                value: 600
                            },
                            end_location: {
                                lat: 12,
                                lon: 34,
                            },
                            start_location: {
                                lat: 11,
                                lon: 33,
                            }
                        },
                        {
                            duration: {
                                value: 1500
                            },
                            end_location: {
                                lat: 12,
                                lon: 34,
                            },
                            start_location: {
                                lat: 11,
                                lon: 33,
                            }
                        },
                        {
                            duration: {
                                value: 720
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

const mockThreeStepsSlightlyMoreThanAnHourData = {
    routes: [
        {
            legs: [
                {
                    duration: {
                        value: 3900
                    },
                    steps: [
                        {
                            duration: {
                                value: 600
                            },
                            end_location: {
                                lat: 12,
                                lon: 34,
                            },
                            start_location: {
                                lat: 11,
                                lon: 33,
                            }
                        },
                        {
                            duration: {
                                value: 1500
                            },
                            end_location: {
                                lat: 12,
                                lon: 34,
                            },
                            start_location: {
                                lat: 11,
                                lon: 33,
                            }
                        },
                        {
                            duration: {
                                value: 1800
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
    mockThreeStepsOverOneIntervalData,
    mockThreeStepsLessThanAnHourData,
    mockThreeStepsSlightlyMoreThanAnHourData
}