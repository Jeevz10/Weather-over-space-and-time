const { makeOpenWeatherAPICall } = require('./weather');

// https://stackoverflow.com/questions/1535631/static-variables-in-javascript

class WeatherAccumulator {
    static durationAccumulator = 0;
    static incrementAccumulator = 0;
    static currentHour = 0;
    static weatherData = [];
    static SECONDS_IN_AN_HOUR = 60 * 60; 

    
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
     * Initial idea was to allow for minutely, 15-min, 30-min, 45-min and hourly forecast data. However, due to the limitations of the 
     * weather data, the minutely data required to calculate 15, 30 and 45 min intervals of weather forecast is insufficient. Hence, the
     * weather data of a given place will be given unless an hour has passed for which it will be acted upon accordingly  
     */

    // async determineWeather(step) {

    //     const secondsPerStep = step.duration.value;

    //     WeatherAccumulator.durationAccumulator += secondsPerStep;
    //     WeatherAccumulator.currentHour = WeatherAccumulator.incrementAccumulator / WeatherAccumulator.SECONDS_IN_AN_HOUR;
    //     console.log('seconds per step: ' + secondsPerStep);
    //     console.log('duration accumulator: ' + WeatherAccumulator.durationAccumulator);
    //     console.log('increment accumulator: ' + WeatherAccumulator.incrementAccumulator);
    //     console.log(' ');

    //     // Initial value of incrementAccumulator is increment x 60 
    //     // if total time thus far in journey has eclipsed the increment counter -> time to make readings for this particular location 
    //     if (WeatherAccumulator.incrementAccumulator < WeatherAccumulator.SECONDS_IN_AN_HOUR) {
    //         if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.incrementAccumulator) {
    //             const startLat = step.start_location.lat;
    //             const startLng = step.start_location.lng;
    
    //             const startWeather = await this.getCurrentWeather(startLat, startLng);
    //             console.log('if start');
    //             WeatherAccumulator.weatherData.push(startWeather);
                
    //             // in case duration for particular step is longer than the increment specified
    //             if (secondsPerStep > this.incrementInSeconds) {
    //                 const endLat = step.end_location.lat;
    //                 const endLng = step.end_location.lng;
    
    //                 const endWeather = await this.getHourlyWeather(endLat, endLng);
    //                 WeatherAccumulator.weatherData.push(endWeather);
    //                 console.log('if end');
    //             }
    //         }
    //     } else {
    //         if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.incrementAccumulator) {
    //             const noOfHoursAfter = this.incrementInSeconds/WeatherAccumulator.SECONDS_IN_AN_HOUR;
    //             const startLat = step.start_location.lat;
    //             const startLng = step.start_location.lng;
    
    //             const startWeather = await makeOpenWeatherAPICall(startLat, startLng, WeatherAccumulator.EXCLUDE_EVERYTHING_BUT_CURRENTLY);
    //             WeatherAccumulator.weatherData.push(startWeather);
    //             console.log('else start');

    //             // in case duration for particular step is longer than the increment specified
    //             if (secondsPerStep > this.incrementInSeconds) {
    //                 const endLat = step.end_location.lat;
    //                 const endLng = step.end_location.lng;
    
    //                 const endWeather = await makeOpenWeatherAPICall(endLat, endLng, WeatherAccumulator.EXCLUDE_EVERYTHING_BUT_CURRENTLY);
    //                 WeatherAccumulator.weatherData.push(endWeather);
    //                 console.log('else end');

    //             }
    
    //         }
    //     }
    //     WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / this.incrementInSeconds) * this.incrementInSeconds;
    // }

    /**
     * 
     * @param {step} step
     * 
     * For step, we are trying to find out if  
     */
    async determineWeather(step) {

        const secondsPerStep = step.duration.value;

        WeatherAccumulator.durationAccumulator += secondsPerStep;

        console.log('seconds per step: ' + secondsPerStep);
        console.log('duration accumulator: ' + WeatherAccumulator.durationAccumulator);
        console.log('increment accumulator: ' + WeatherAccumulator.incrementAccumulator);
        console.log(' ');

        // Initial value of incrementAccumulator is increment x 60 
        if (WeatherAccumulator.incrementAccumulator < WeatherAccumulator.SECONDS_IN_AN_HOUR) {

            // For this particular step, it is time to gather weather data --> begin with the starting location 
            if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.incrementAccumulator) {
                // 
                const startLat = step.start_location.lat;
                const startLng = step.start_location.lng;
    
                const startWeather = await this.getCurrentWeather(startLat, startLng);
                WeatherAccumulator.weatherData.push(startWeather);
                console.log('if start');
                
                // in case duration for particular step is longer than an hour, we need to get hourly data 
                if (secondsPerStep >= WeatherAccumulator.SECONDS_IN_AN_HOUR) {
                    // const endHourIncrement = this.calculateEndHours();
                    const endLat = step.end_location.lat;
                    const endLng = step.end_location.lng;
                    const endWeather = await this.getHourlyWeather(endLat, endLng);
                    // const endWeatherData = this.handleHourlyData(endWeather, endHourIncrement);

                    WeatherAccumulator.weatherData.push(endWeather);
                    console.log('if more than an hour');
                } else if (secondsPerStep > this.incrementInSeconds) {

                    // in case the duration for particular step is longer than increment time, we need to gather the weather data for the end location 
                    const endLat = step.end_location.lat;
                    const endLng = step.end_location.lng;
    
                    const endWeather = await this.getCurrentWeather(endLat, endLng);
                    WeatherAccumulator.weatherData.push(endWeather);
                    console.log('if end');
                }

                // Need to accordingly adjust incrementAccumulator readings 
                if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.SECONDS_IN_AN_HOUR) {
                    // if duration of particular step is longer than an hour, increase the accumulator by the amount of hours 
                    WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / WeatherAccumulator.SECONDS_IN_AN_HOUR) * WeatherAccumulator.SECONDS_IN_AN_HOUR; // second hour 
                } else {
                    WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / this.incrementInSeconds) * this.incrementInSeconds;
                }
            }
        } else {
            // handle situation when route time has taken more than an hour. In this case, increments no longer hold value. Updates are done hourly. 
            if (WeatherAccumulator.durationAccumulator >= WeatherAccumulator.incrementAccumulator) {
                const startLat = step.start_location.lat;
                const startLng = step.start_location.lng;
    
                const startWeather = await this.getHourlyWeather(startLat, startLng);
                // const startWeatherData = this.handleHourlyData(startWeather);
                WeatherAccumulator.weatherData.push(startWeather);
                console.log('else start');

                // in case duration for particular step is longer than an hour, need to get the weather data for that end point that hour it ends at 
                if (secondsPerStep >= WeatherAccumulator.SECONDS_IN_AN_HOUR) {
                    // const endHourIncrement = this.calculateEndHours();
                    const endLat = step.end_location.lat;
                    const endLng = step.end_location.lng;
                    const endWeather = await this.getHourlyWeather(endLat, endLng);
                    WeatherAccumulator.weatherData.push(endWeather);
                    console.log('end end')
                    // const endWeatherData = this.handleHourlyData(endWeather, endHourIncrement);             
                } 

                WeatherAccumulator.incrementAccumulator += Math.ceil(secondsPerStep / WeatherAccumulator.SECONDS_IN_AN_HOUR) * WeatherAccumulator.SECONDS_IN_AN_HOUR; // second hour 
            }

        }
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

    handleHourlyData(weatherData, endHourIncrement = 0) {
        const { lat, lon, timezone, timezone_offset, hourly } = weatherData;
        let hourlyData = [];
        if (endHourIncrement === 0) {
            hourlyData.push(hourly[WeatherAccumulator.currentHour]);
            
        } else {
            for (let i = WeatherAccumulator.currentHour; i <= WeatherAccumulator.currentHour + endHourIncrement; i++) {
                hourlyData.push(hourly[i]);
            }
        }
        return { lat, lon, timezone, timezone_offset, hourlyData };
    }
}


module.exports = {
    WeatherAccumulator
}