const _ = require('lodash');

const REQUIRED_KEYS = ['start', 'end', 'mode', 'increment'];

const REQUIRED_MODE = ['driving', 'walking', 'bicycling', 'transit'];
// TODO Give proper error handling with error codes and stuff 

// Reasons why all middleware has to be async functions as well as have await next() https://github.com/koajs/koa/issues/905

module.exports = {
    async checkQueryParams(ctx, next) {
        const givenKeys = Object.keys(ctx.query);
        const absentKeys = _.difference(REQUIRED_KEYS, givenKeys);

        if (absentKeys.length == 0) {
            await next();
        } else {
            const absentKeysString = absentKeys.toString().replace(/,/g, ", "); 
            ctx.throw(406, `Missing keys in ${absentKeysString}`);
        }
    },

    async checkInvalidValues(ctx, next) {
       const givenParams = ctx.query;
       const {start, end, mode, increment} = ctx.query;
       const keysWithAbsentValues = Object.keys(givenParams).filter((key)=> {
            if (givenParams[key] === "" || givenParams[key]===undefined || givenParams[key]===null) {
                return key;
            }
       });
       
       // check if any of the keys have invalid values 
       if (keysWithAbsentValues.length == 0) {
           // check if the given mode is any of the 4 allowed 
           if (REQUIRED_MODE.includes(mode)) {
               // check if the given increment is between 1 and 60 
               if (increment >= 1 && increment <= 60) {
                   // check if the given start and end are of string types 
                   if (isNaN(start) && isNaN(end)) {
                        await next();
                   } else {
                    ctx.throw(406, `Given start and end values has to be of string value describing their respective locations.`);
                   }
               } else {
                   console.log(typeof increment + ' ' + increment);
                   ctx.throw(406, `Given increment - ${increment} is not valid. It has to be an integer in between the values of 1 to 60.`);
               }
           } else {
               const requiredModeString = REQUIRED_MODE.toString().replace(/,/g, ", ");
               ctx.throw(406, `Given mode - ${mode} is not one of the 4 allowed modes: ${requiredModeString}`);
           }
       } else {
            const invalidKeysString = keysWithAbsentValues.toString().replace(/,/g, ", "); 
            ctx.throw(406, `Missing values in ${invalidKeysString}`);
       }
    },
}
