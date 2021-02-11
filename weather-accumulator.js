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
        console.log('Was previous end point recorded? ' + WeatherAccumulator.previousEndPointRecorded + '\n');

        // handle cases before the hour 
        if (WeatherAccumulator.incrementAccumulator < WeatherAccumulator.SECONDS_IN_AN_HOUR) {
            // handle starting point
            if (!WeatherAccumulator.startPointRecorded) {
                const startWeather = await this.getCurrentWeather(startLat, startLng);
                WeatherAccumulator.weatherData.push(startWeather);
                console.log('start point pushed\n');
                WeatherAccumulator.startPointRecorded = true;
            } 

            if (isLast) {
                const endWeather = await this.getCurrentWeather(endLat, endLng);
                WeatherAccumulator.weatherData.push(endWeather);
                console.log('end point is smaller than first interval: end point pushed\n')
            }

            // exclusively handle the cases when duration is lesser than an hour  
            
            if (WeatherAccumulator.durationAccumulator < WeatherAccumulator.SECONDS_IN_AN_HOUR) {
                if (isLast) {
                    const endWeather = await this.getCurrentWeather(endLat, endLng);
                    WeatherAccumulator.weatherData.push(endWeather);
                    console.log('end point is smaller than an hour: end point pushed\n');
                }
                if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.incrementAccumulator) {
                    // handle cases when duration taken is larger than the increment aka it jumped increments 
                    if (this.incrementCounter() > 1) {
                        await this.handleLongerInstancesBeforeOneHour(startLat, startLng, endLat, endLng, secondsPerStep);
                    } else {
                        // handle cases when duration is longer than increment but has not jumped increments
                        await this.handleBeforeOneHour(startLat, startLng, endLat, endLng, secondsPerStep);
                    }
                    WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / this.incrementInSeconds) * this.incrementInSeconds;
                }
            } else {
                if (isLast) {
                    const endHourIncrement = this.calculateEndHours();
                    WeatherAccumulator.currentHour += endHourIncrement;
                    const endWeather = await this.getHourlyWeather(endLat, endLng);
                    const endWeatherFinalData = this.handleHourlyData(endWeather);
                    WeatherAccumulator.weatherData.push(endWeatherFinalData);
                }
                await this.handleInstancesThatBreaksTheHour(startLat, startLng, endLat, endLng, secondsPerStep);
                // if duration of particular step is longer than an hour, increase the accumulator by the amount of hours. Firstly, reset increment accumulator to 3600
                WeatherAccumulator.incrementAccumulator = WeatherAccumulator.SECONDS_IN_AN_HOUR;
                WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / WeatherAccumulator.SECONDS_IN_AN_HOUR) * WeatherAccumulator.SECONDS_IN_AN_HOUR; // second hour 
            }
        } else {
            if (isLast) {
                const endWeather = await this.getHourlyWeather(endLat, endLng);
                const endWeatherFinalData = this.handleHourlyData(endWeather);
                WeatherAccumulator.weatherData.push(endWeatherFinalData);
            }
            if (Math.ceil((WeatherAccumulator.durationAccumulator - WeatherAccumulator.incrementAccumulator) / WeatherAccumulator.SECONDS_IN_AN_HOUR) > 1) {
                await this.handleLongerInstancesAfterOneHour(startLat, startLng, endLat, endLng);
            } else if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.incrementAccumulator) {
                // handle cases when duration is longer than increment but has not jumped increments

                await this.handleAfterOneHour(startLat, startLng, endLat, endLng, secondsPerStep);
            }
            WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / WeatherAccumulator.SECONDS_IN_AN_HOUR) * WeatherAccumulator.SECONDS_IN_AN_HOUR; // second hour 
        }
    }

    incrementCounter() {
        const incrementCounter = Math.ceil((WeatherAccumulator.durationAccumulator - WeatherAccumulator.incrementAccumulator) / this.incrementInSeconds);
        console.log('increment counter: ' + WeatherAccumulator.durationAccumulator + ' ' + WeatherAccumulator.incrementAccumulator + ' ' + incrementCounter + '\n');
        return incrementCounter;
    }

    async handleLongerInstancesAfterOneHour(startLat, startLng, endLat, endLng) {
        if (!WeatherAccumulator.previousEndPointRecorded) {
            const endHourIncrement = this.calculateEndHours();
            WeatherAccumulator.currentHour += endHourIncrement;
            const startWeather = await this.getHourlyWeather(startLat, startLng);
            const startWeatherFinalData = this.handleHourlyData(startWeather);
            WeatherAccumulator.weatherData.push(startWeatherFinalData);
            console.log('instances where it jumps 2 or more hours: start point recorded\n');
        }

        const endHourIncrement = this.calculateEndHours();
        WeatherAccumulator.currentHour += endHourIncrement;

        const endWeather = await this.getHourlyWeather(endLat, endLng);
        const endWeatherFinalData = this.handleHourlyData(endWeather);
        WeatherAccumulator.weatherData.push(endWeatherFinalData);
        WeatherAccumulator.previousEndPointRecorded = true;
        console.log('instances where it jumps 2 or more hours: end point recorded // prevEndPoint = true \n');

    }

    async handleAfterOneHour(startLat, startLng, endLat, endLng, secondsPerStep) {
        const isStartCloser = this.IsStartPointCloserThanEndPoint(secondsPerStep);
        let weather;

        if (isStartCloser & !WeatherAccumulator.previousEndPointRecorded) {
            const endHourIncrement = this.calculateEndHours();
            WeatherAccumulator.currentHour += endHourIncrement;
            const startWeather = await this.getHourlyWeather(startLat, startLng);
            weather = this.handleHourlyData(startWeather);
            WeatherAccumulator.previousEndPointRecorded = false;

        } else {
            const endHourIncrement = this.calculateEndHours();
            WeatherAccumulator.currentHour += endHourIncrement;
            const endWeather = await this.getHourlyWeather(endLat, endLng);
            weather = this.handleHourlyData(endWeather);
            WeatherAccumulator.previousEndPointRecorded = true;
        }

        WeatherAccumulator.weatherData.push(weather);
    }

    async handleInstancesThatBreaksTheHour(startLat, startLng, endLat, endLng, secondsPerStep) {

        if (!WeatherAccumulator.previousEndPointRecorded) {
            const startWeather = await this.getCurrentWeather(startLat, startLng);
            WeatherAccumulator.weatherData.push(startWeather);
            console.log('instances where it breaks the hour: start point recorded\n');
        }

        const endHourIncrement = this.calculateEndHours();
        WeatherAccumulator.currentHour += endHourIncrement;

        const endWeather = await this.getHourlyWeather(endLat, endLng);
        const endWeatherFinalData = this.handleHourlyData(endWeather);
        WeatherAccumulator.weatherData.push(endWeatherFinalData);
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

        if (isStartCloser & !WeatherAccumulator.previousEndPointRecorded) {
            weather = await this.getCurrentWeather(startLat, startLng);
            WeatherAccumulator.previousEndPointRecorded = false;
            console.log('instances where it normally jumps an interval: start point recorded and prevEndPoint = false\n');

        } else {
            weather = await this.getCurrentWeather(endLat, endLng);
            WeatherAccumulator.previousEndPointRecorded = true;
            console.log('instances where it normally jumps an interval: end point recorded and prevEndPoint = true\n');

        }
        WeatherAccumulator.weatherData.push(weather);
        console.log('normal instance pushed');
    }

    IsStartPointCloserThanEndPoint(secondsPerStep) {
        const differenceBetweenEndPointAndInterval = WeatherAccumulator.durationAccumulator - WeatherAccumulator.incrementAccumulator;
        const differenceBetweenStartPointAndInterval = secondsPerStep - differenceBetweenEndPointAndInterval;

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

    calculateEndHours() {
        const endHourIncrement = (WeatherAccumulator.durationAccumulator - WeatherAccumulator.incrementAccumulator) / WeatherAccumulator.SECONDS_IN_AN_HOUR;
        return endHourIncrement;  
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

    // /**
    //  * 
    //  * @param {step} step
    //  * 
    //  * For step, we are trying to find out if  
    //  */
    // async determineWeather(step) {

    //     const secondsPerStep = step.duration.value;

    //     WeatherAccumulator.durationAccumulator += secondsPerStep;

    //     console.log('seconds per step: ' + secondsPerStep);
    //     console.log('duration accumulator: ' + WeatherAccumulator.durationAccumulator);
    //     console.log('increment accumulator: ' + WeatherAccumulator.incrementAccumulator);
    //     console.log(' ');

    //     // Initial value of incrementAccumulator is increment x 60 
    //     if (WeatherAccumulator.incrementAccumulator < WeatherAccumulator.SECONDS_IN_AN_HOUR) {

    //         // For this particular step, it is time to gather weather data --> begin with the starting location 
    //         if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.incrementAccumulator) {
    //             // 
    //             const startLat = step.start_location.lat;
    //             const startLng = step.start_location.lng;
    
    //             const startWeather = await this.getCurrentWeather(startLat, startLng);
    //             WeatherAccumulator.weatherData.push(startWeather);
    //             console.log('if start');
                
    //             // in case duration for particular step is longer than an hour, we need to get hourly data 
    //             if (secondsPerStep >= WeatherAccumulator.SECONDS_IN_AN_HOUR) {
    //                 // const endHourIncrement = this.calculateEndHours();
    //                 const endLat = step.end_location.lat;
    //                 const endLng = step.end_location.lng;
    //                 const endWeather = await this.getHourlyWeather(endLat, endLng);
    //                 // const endWeatherData = this.handleHourlyData(endWeather, endHourIncrement);

    //                 WeatherAccumulator.weatherData.push(endWeather);
    //                 console.log('if more than an hour');
    //             } else if (secondsPerStep > this.incrementInSeconds) {

    //                 // in case the duration for particular step is longer than increment time, we need to gather the weather data for the end location 
    //                 const endLat = step.end_location.lat;
    //                 const endLng = step.end_location.lng;
    
    //                 const endWeather = await this.getCurrentWeather(endLat, endLng);
    //                 WeatherAccumulator.weatherData.push(endWeather);
    //                 console.log('if end');
    //             }

    //             // Need to accordingly adjust incrementAccumulator readings 
    //             if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.SECONDS_IN_AN_HOUR) {
    //                 // if duration of particular step is longer than an hour, increase the accumulator by the amount of hours 
    //                 WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / WeatherAccumulator.SECONDS_IN_AN_HOUR) * WeatherAccumulator.SECONDS_IN_AN_HOUR; // second hour 
    //             } else {
    //                 WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / this.incrementInSeconds) * this.incrementInSeconds;
    //             }
    //         }
    //     } else {
    //         // handle situation when route time has taken more than an hour. In this case, increments no longer hold value. Updates are done hourly. 
    //         if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.incrementAccumulator) {
    //             const startLat = step.start_location.lat;
    //             const startLng = step.start_location.lng;
    
    //             const startWeather = await this.getHourlyWeather(startLat, startLng);
    //             // const startWeatherData = this.handleHourlyData(startWeather);
    //             WeatherAccumulator.weatherData.push(startWeather);
    //             console.log('else start');

    //             // in case duration for particular step is longer than an hour, need to get the weather data for that end point that hour it ends at 
    //             if (secondsPerStep >= WeatherAccumulator.SECONDS_IN_AN_HOUR) {
    //                 // const endHourIncrement = this.calculateEndHours();
    //                 const endLat = step.end_location.lat;
    //                 const endLng = step.end_location.lng;
    //                 const endWeather = await this.getHourlyWeather(endLat, endLng);
    //                 WeatherAccumulator.weatherData.push(endWeather);
    //                 console.log('end end')
    //                 // const endWeatherData = this.handleHourlyData(endWeather, endHourIncrement);             
    //             } 

    //             WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / WeatherAccumulator.SECONDS_IN_AN_HOUR) * WeatherAccumulator.SECONDS_IN_AN_HOUR; // second hour 
    //         }

    //     }
    // }

    
}


module.exports = {
    WeatherAccumulator
}