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

## Documentation 

## Implementation 

This is not a straight forward implementation due to the limitations of the 3rd party APIs mentioned earlier. As I was tackling this problem, I realised there are numerous edge cases that has to be accounted for. The longer I went on, the more I realized that this can only be tackled through a visual implementation. So, what did I do? I layout the below scenario (a trip from Brooklyn to Boston although I personally have yet to make that journey #GoCeltics) 

![Scenario](https://user-images.githubusercontent.com/35773953/107642962-81a43b80-6cb0-11eb-83e2-d8dd360f2e4a.png)

To fully understand this, let me share a caveat that you might have missed earlier - the API is broken down into 2 parts - before an hour and after an hour. The reasons for which are explained above. Lets dive in! 

### Before an Hour 

General Rule - Only the starting and end locations of a step will be considered if an interval lies in between. A quick example is (3), (4), (5), (9) and (10).   

(1) - A static flag will be present in the class to catch the start of the route. This means that the weather of the starting location will be gathered and extracted. The end of this step will not be taken into consideration because it does not fulfill the general rule. 

(9), (10) - Compare (1) with (9) and you'll realise that weather data of both the starting and end locations will be gathered and extracted. This is because of the general rule. 

(2) - Neither the start and end locations are considered. 

(3) - As this step fulfills the general rule, we have to see which point is closer to the interval. In this case, the end point is closer. Thus, only the weather data of the end point is gathered and extracted. 

(4) - By simply looking at (4) itself, you'll realise that this step evades multiple intervals. Hence, both the starting and end points must be taken into consideration. However, it is not as simple as that. What if the route so far has been (9) followed by (4)? The end point of (9) has already been added. Do we gather and extract the weather data of the starting point of (4) even if it is at the same location as the end point of (9)? No we do not! To tackle this, there is a static flag in the class to notify the immediate step that the previous end point has already been added and there is no need to repeat the process. 

(5) - This is nearly the same as (3) just that it crosses the hour mark. So, whichever point we see that is closer to the hour mark interval, we would have to take the hourly data of that location. Gathering current data makes it pointless. 

### After an Hour 


#### Babababazingaaaa

If you have reached till the end (which is right about now), then pat yourself on the back and go make yourself a drink! 
![](https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif)
