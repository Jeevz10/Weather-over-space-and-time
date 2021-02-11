# A Magical API 

## Did someone ask to predict the weather over space & time? 

### Wait, hold on....is this really necessary? 

# YES IT IS! It is to prevent situations like below from happening! 
![](https://media.giphy.com/media/l1J9rMqPQ8c2HfxiE/giphy.gif)


## Table of Contents 

- [Introduction](#introduction)
  * [Problem Statement](#problem-statement)
  * [Third-party APIs](#third-party-apis)
- [Documentation](#documentation)
- [Implementation](#implementation)

## Introduction 

### Problem Statement 

### Third-party APIs 

Two third-party APIs are used in this API - A directions and weather API. The directions API is used to calculate the route between the start and end points. The weather API is used to calculate the weather of that particular lat and lon. 

#### Directions - Google API 

<a href="https://developers.google.com/maps/documentation/directions/overview#DirectionsRequests">
 Google Maps Direction API 
</a> 

The API specified above was used. The reason for choosing this API was because of its detailed breakdown of each route (called steps). The lat and lon of each step as well as the duration (in seconds) taken was supplied. These are valuable data used to evaluate the position of the user along their route. 

The limitations of this API is that we are unable to exactly pinpoint the location of the user at each specified interval. While I did consider other options such as deducing from a polyline, I decided to go with an easier approach. This approach simply means that I would calculate the point closest to the interval and gather the weather data for that point. In other words, I was estimating the general weather around that timeframe. 

I had considered other map routing APIs such as Azure and OpenStreetMap. These APIs had a strict plan and made testing difficult especially on a free plan. 


#### Weather - OpenWeatherMap

<a href="https://openweathermap.org/api/one-call-api">
 OpenWeatherMap One Call API 
</a> 

I subscribed to an OpenWeatherMap free account. This account prescribes me to only use One Call API. All other API services requires me to be on a different paid plan which is not entirely needed for the purposes of this exercise. 

This API is able to give current and hourly weather updates for any lat and lon. As mentioned earlier, I needed to be on a different plan to utilize the important features such as 15-min / 30-min and 45-min weather forecasts. 

That being said, I made do with what I had. I decided to use current weather data for any time period within the next hour. For any steps that happens after an hour, I used hourly data. 

## Documentation 

## Implementation 

This is not a straight forward implementation due to the limitations of the 3rd party APIs mentioned earlier. As I was tackling this problem, I realised there are numerous edge cases that has to be accounted for. The longer I went on, the more I realized that this can only be tackled through a visual implementation. So, what did I do? I layout the below scenario (a trip from Brooklyn to Boston although I personally have yet to make that journey #GoCeltics) 

![Scenario](https://user-images.githubusercontent.com/35773953/107653886-144ad780-6cbd-11eb-8707-a01af73d3e03.png)

To fully understand this, let me share a caveat that you might have missed earlier - the API is broken down into 2 parts - before an hour and after an hour. The reasons for which are explained above. Lets dive in! 

### Before an Hour 

General Rule - Only the starting and end locations of a step will be considered if an interval lies in between. A quick example is (3), (4), (5), (9) and (10).   

(1) - A static flag will be present in the class to catch the start of the route. This means that the weather of the starting location will be gathered and extracted. The end of this step will not be taken into consideration because it does not fulfill the general rule. 

(9), (10) - Compare (1) with (9) and you'll realise that weather data of both the starting and end locations will be gathered and extracted. This is because of the general rule. 

(2) - Neither the start and end locations are considered. 

(3) - As this step fulfills the general rule, we have to see which point is closer to the interval. In this case, the end point is closer. Thus, only the weather data of the end point is gathered and extracted. 

(4) - By simply looking at (4) itself, you'll realise that this step evades multiple intervals. Hence, both the starting and end points must be taken into consideration. However, it is not as simple as that. What if the route so far has been (9) followed by (4)? The end point of (9) has already been added. Do we gather and extract the weather data of the starting point of (4) even if it is at the same location as the end point of (9)? No we do not! To tackle this, there is a static flag in the class to notify the immediate step that the previous end point has already been added and there is no need to repeat the process. 

(5) - This is nearly the same as (3) just that it crosses the hour mark. So, whichever point we see that is closer to the hour mark interval, we would have to take the hourly data of that location. Gathering current data makes it pointless. 

One last thing to highlight, there is a difference between (3) and (4). In (3), either the start and end point are chosen. In (4), both the start and end points are chosen because multiple intervals are skipped. Hence, there are implementation differences between these 2 use cases. On top of that, a check has to be made to see if the chosen point has already been added.  

### After an Hour 

Caveat - The interval timing automatically reverts to hourly and not the interval specified in the GET route. 

General Rule - Only the starting and end locations of a step will be considered if an interval lies in between. A quick example is (7) and (11).

(6) - Neither the start and end locations are considered.

(7) - Similar to (4), both the start and end points are considered. 

(11) - This interesting in the event of a step that takes an hour long. Hence, a check is done in the class to see if the duration ever suddenly shoots up beyond the hour. If so, the hourly data of the end point will be added. 

(8) - This is tricky because the end point could happen anytime. It could happen before the hour like in (1), (9), (10) or after the hour like in (11). The point is, it could happen anywhere. This is why the last step provided by google map api will send a `lastStep` flag to denote its arrival. The weather data of the end point will be added. 

#### Babababazingaaaa

If you have reached till the end (which is right about now), then pat yourself on the back and go make yourself a drink! 
![](https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif)
