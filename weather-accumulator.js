const { makeOpenWeatherAPICall } = require('./weather');

// https://stackoverflow.com/questions/1535631/static-variables-in-javascript

class WeatherAccumulator {
    static durationAccumulator = 0;
    static incrementAccumulator = 0;
    static currentHour = 0;
    static weatherData = [];
    static SECONDS_IN_AN_HOUR = 60 * 60; 
    static previousEndPointRecorded = false;
    static startPointRecorded = false;
    
    constructor(totalDuration, increment) {
        this.increment = increment;
        this.incrementInSeconds = this.increment * 60;
        WeatherAccumulator.incrementAccumulator += this.incrementInSeconds;
        this.totalDuration = totalDuration;
    }

    /**
     * 
     * @param {step} step
     * 
     * This is divided into two sections: before 1 hour and after 1 hour 
     * 
     *  
     */
    async determineWeather(step, isLast) {
        const { startLat, startLng, endLat, endLng, secondsPerStep } = this.extractData(step);
        WeatherAccumulator.durationAccumulator += secondsPerStep;

        console.log('seconds per step: ' + secondsPerStep);
        console.log('duration accumulator: ' + WeatherAccumulator.durationAccumulator);
        console.log('increment accumulator: ' + WeatherAccumulator.incrementAccumulator);
        console.log('Was previous end point recorded? ' + WeatherAccumulator.previousEndPointRecorded);
        console.log('Current Hour: ' + WeatherAccumulator.currentHour);
        console.log('is this the last?: ' + isLast + '\n');

        // handle cases before the hour 
        if (WeatherAccumulator.incrementAccumulator < WeatherAccumulator.SECONDS_IN_AN_HOUR) {
            // handle starting point
            if (!WeatherAccumulator.startPointRecorded) {
                const startWeather = await this.getCurrentWeather(startLat, startLng);
                WeatherAccumulator.weatherData.push(startWeather);
                console.log('start point pushed\n');
                WeatherAccumulator.startPointRecorded = true;
            } 

            // exclusively handle the cases when duration is lesser than an hour  
            
            if (WeatherAccumulator.durationAccumulator < WeatherAccumulator.SECONDS_IN_AN_HOUR) {
                if (isLast) {
                    const endWeather = await this.getCurrentWeather(endLat, endLng);
                    WeatherAccumulator.weatherData.push(endWeather);
                    console.log('end point is smaller than an hour: end point pushed\n');
                } else if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.incrementAccumulator) {
                    // handle cases when duration taken is larger than the increment aka it jumped increments 
                    if (this.incrementCounter() > 1) {
                        await this.handleLongerInstancesBeforeOneHour(startLat, startLng, endLat, endLng, secondsPerStep);
                    } else {
                        // handle cases when duration is longer than increment but has not jumped increments
                        await this.handleBeforeOneHour(startLat, startLng, endLat, endLng, secondsPerStep);
                    }
                    WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / this.incrementInSeconds) * this.incrementInSeconds;
                } else {
                    WeatherAccumulator.previousEndPointRecorded = false;
                }
            } else {
                // handles cases when duration exceeded an hour and there is a need to look at hourly data 

                // handles scenario when it is the last step 
                if (isLast) {
                    this.increaseHour();
                    this.extractAndPushData(endLat, endLng);
                } else {
                    await this.handleInstancesThatBreaksTheHour(startLat, startLng, endLat, endLng, secondsPerStep);
                }
                // if duration of particular step is longer than an hour, increase the accumulator by the amount of hours. Firstly, reset increment accumulator to 3600
                WeatherAccumulator.incrementAccumulator = WeatherAccumulator.SECONDS_IN_AN_HOUR;
                WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / WeatherAccumulator.SECONDS_IN_AN_HOUR) * WeatherAccumulator.SECONDS_IN_AN_HOUR; // second hour 
            }
        } else {

            if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.incrementAccumulator) {
                if (isLast) {
                    this.increaseHour();
                    await this.extractAndPushData(endLat, endLng);
                } else if (this.hourCounter() > 1) {
                    await this.handleLongerInstancesAfterOneHour(startLat, startLng, endLat, endLng);
                } else {
                    // handle cases when duration is longer than increment but has not jumped increments
                    await this.handleAfterOneHour(startLat, startLng, endLat, endLng, secondsPerStep);
                } 
                WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / WeatherAccumulator.SECONDS_IN_AN_HOUR) * WeatherAccumulator.SECONDS_IN_AN_HOUR; // second hour 
            } else {
                if (isLast) {
                    await this.extractAndPushData(endLat, endLng);
                }
                WeatherAccumulator.previousEndPointRecorded = false;
            }

        }
    }

    async extractAndPushData(lat, lng) {
        const weather = await this.getHourlyWeather(lat, lng);
        const finalData = this.handleHourlyData(weather);
        WeatherAccumulator.weatherData.push(finalData);
    }

    increaseHour() {
        const endHourIncrement = this.hourCounter();
        WeatherAccumulator.currentHour += endHourIncrement;
    } 

    hourCounter() {
        const hourCounter = Math.ceil((WeatherAccumulator.durationAccumulator - WeatherAccumulator.incrementAccumulator) / WeatherAccumulator.SECONDS_IN_AN_HOUR);
        console.log('hour counter: ' + WeatherAccumulator.durationAccumulator + ' ' + WeatherAccumulator.incrementAccumulator + ' ' + hourCounter + '\n');
        return hourCounter;
    }

    incrementCounter() {
        const incrementCounter = Math.ceil((WeatherAccumulator.durationAccumulator - WeatherAccumulator.incrementAccumulator) / this.incrementInSeconds);
        console.log('increment counter: ' + WeatherAccumulator.durationAccumulator + ' ' + WeatherAccumulator.incrementAccumulator + ' ' + incrementCounter + '\n');
        return incrementCounter;
    }

    async handleLongerInstancesAfterOneHour(startLat, startLng, endLat, endLng) {
        const endHourIncrement = this.hourCounter();
        WeatherAccumulator.currentHour += endHourIncrement;

        if (!WeatherAccumulator.previousEndPointRecorded) {
            this.extractAndPushData(startLat, startLng);
            console.log('instances where it jumps 2 or more hours: start point recorded');
        }

        this.extractAndPushData(endLat, endLng);
        WeatherAccumulator.previousEndPointRecorded = true;
        console.log('instances where it jumps 2 or more hours: end point recorded // prevEndPoint = true \n');

    }

    async handleAfterOneHour(startLat, startLng, endLat, endLng, secondsPerStep) {
        const isStartCloser = this.IsStartPointCloserThanEndPoint(secondsPerStep);
        let weather;

        const endHourIncrement = this.hourCounter();
        WeatherAccumulator.currentHour += endHourIncrement;

        if (isStartCloser && !WeatherAccumulator.previousEndPointRecorded) {
            const startWeather = await this.getHourlyWeather(startLat, startLng);
            weather = this.handleHourlyData(startWeather);
            WeatherAccumulator.previousEndPointRecorded = false;
            console.log('instances where it jumps to the next hour: start point recorded\n');
        } else {
            const endWeather = await this.getHourlyWeather(endLat, endLng);
            weather = this.handleHourlyData(endWeather);
            WeatherAccumulator.previousEndPointRecorded = true;
            console.log('instances where it jumps 1 hour: end point recorded // prevEndPoint = true \n');
        }

        WeatherAccumulator.weatherData.push(weather);
    }

    async handleInstancesThatBreaksTheHour(startLat, startLng, endLat, endLng, secondsPerStep) {

        if (!WeatherAccumulator.previousEndPointRecorded) {
            const startWeather = await this.getCurrentWeather(startLat, startLng);
            WeatherAccumulator.weatherData.push(startWeather);
            console.log('instances where it breaks the hour: start point recorded');
        }

        this.increaseHour();
        this.extractAndPushData(endLat, endLng);
        WeatherAccumulator.previousEndPointRecorded = true;
        console.log('instances where it breaks the hour: end point recorded and prevEndPoint = true \n');
    }

    async handleLongerInstancesBeforeOneHour(startLat, startLng, endLat, endLng) {

        if (!WeatherAccumulator.previousEndPointRecorded) {
            const startWeather = await this.getCurrentWeather(startLat, startLng);
            WeatherAccumulator.weatherData.push(startWeather);
            console.log('instances where it jumps 2 or more hours: start point recorded\n');
        }

        const endWeather = await this.getCurrentWeather(endLat, endLng);
        WeatherAccumulator.previousEndPointRecorded = true;
        WeatherAccumulator.weatherData.push(endWeather);
        console.log('instances where it jumps 2 or more hours: end point recorded // prevEndPoint = true \n');

    }
    async handleBeforeOneHour(startLat, startLng, endLat, endLng, secondsPerStep) {
        
        const isStartCloser = this.IsStartPointCloserThanEndPoint(secondsPerStep);
        let weather;

        if (isStartCloser && !WeatherAccumulator.previousEndPointRecorded) {
            weather = await this.getCurrentWeather(startLat, startLng);
            WeatherAccumulator.previousEndPointRecorded = false;
            console.log('instances where it normally jumps an interval: start point recorded and prevEndPoint = false');

        } else {
            weather = await this.getCurrentWeather(endLat, endLng);
            WeatherAccumulator.previousEndPointRecorded = true;
            console.log('instances where it normally jumps an interval: end point recorded and prevEndPoint = true');

        }
        WeatherAccumulator.weatherData.push(weather);
        console.log('normal instance pushed\n');
    }

    IsStartPointCloserThanEndPoint(secondsPerStep) {
        const differenceBetweenEndPointAndInterval = WeatherAccumulator.durationAccumulator - WeatherAccumulator.incrementAccumulator;
        const differenceBetweenStartPointAndInterval = secondsPerStep - differenceBetweenEndPointAndInterval;

        console.log('Variables: ' + WeatherAccumulator.durationAccumulator + ' ' + WeatherAccumulator.incrementAccumulator);
        console.log('difference between start and interval: ' + differenceBetweenStartPointAndInterval);
        console.log('difference between interval and end: ' + differenceBetweenEndPointAndInterval + '\n');

        if (differenceBetweenStartPointAndInterval >= differenceBetweenEndPointAndInterval) {
            return false;
        } else {
            return true;
        }
    }

    extractData(step) {
        const startLat = step.start_location.lat;
        const startLng = step.start_location.lng;
        const endLat = step.end_location.lat;
        const endLng = step.end_location.lng;
        const secondsPerStep = step.duration.value;

        return { startLat, startLng, endLat, endLng, secondsPerStep };
    }

    getFinalData() {
        return WeatherAccumulator.weatherData;
    }

    async getCurrentWeather(lat, lng) {
       const EXCLUDE_EVERYTHING_BUT_CURRENTLY = 'minutely,hourly,daily,alerts';
       const currentWeather = await makeOpenWeatherAPICall(lat, lng, EXCLUDE_EVERYTHING_BUT_CURRENTLY);
        return currentWeather;
    }

    async getHourlyWeather(lat, lng) {
        const EXCLUDE_EVERYTHING_BUT_HOURLY = 'minutely,current,daily,alerts';
        const hourlyWeather = await makeOpenWeatherAPICall(lat, lng, EXCLUDE_EVERYTHING_BUT_HOURLY);
        return hourlyWeather;
    }

    handleHourlyData(weatherData) {
        const { lat, lon, timezone, timezone_offset, hourly } = weatherData;
        let hourlyData = [];
        hourlyData.push(hourly[WeatherAccumulator.currentHour])
        // if (endHourIncrement === 0) {
        //     hourlyData.push(hourly[WeatherAccumulator.currentHour]);
            
        // } else {
        //     for (let i = WeatherAccumulator.currentHour; i <= WeatherAccumulator.currentHour + endHourIncrement; i++) {
        //         hourlyData.push(hourly[i]);
        //     }
        // }
        return { lat, lon, timezone, timezone_offset, hourlyData };
    }    
}


module.exports = {
    WeatherAccumulator
}