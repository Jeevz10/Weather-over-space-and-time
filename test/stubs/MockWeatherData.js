const mockHourlyData = {
    lat: '123',
    lon: '456',
    timezone: '+8',
    timezone_offset: 'yeah',
    hourly: [
        {
            dt: '0',
            temp: '40'
        },
        {
            dt: '1',
            temp: '40'
        },
        {
            dt: '2',
            temp: '50'
        },
        {
            dt: '3',
            temp: '45',
        },
        {
            dt: '4',
            temp: '46',
        },
        {
            dt: '5',
            temp: '47',
        }
    ]
};

const mockCurrentData = {
    lat: '123',
    lon: '456',
    current: {
        dt: '0',
        temp: '42',
    }
};

module.exports = {
    mockCurrentData,
    mockHourlyData
}