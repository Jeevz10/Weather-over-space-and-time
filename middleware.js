const _ = require('lodash');

const REQUIRED_KEYS = ['start', 'end', 'mode', 'increment'];

const REQUIRED_MODE = ['driving', 'walking', 'bicycling', 'transit'];
// TODO Give proper error handling with error codes and stuff 


// checkMode = (mode) => {
//     if (REQUIRED_MODE.includes(mode)) {
//         return true;
//     } else {
//         throw new Error('Mode has to be one of these: ')
//     }
// };

module.exports = {
    checkQueryParams(ctx, next) {
        const givenKeys = Object.keys(ctx.query);
        const absentKeys = _.difference(REQUIRED_KEYS, givenKeys);

        if (absentKeys.length == 0) {
            next();
        } else {
            const absentKeysString = absentKeys.toString().replace(/,/g, ", "); 
            throw new Error(`Missing keys in ${absentKeysString}`);
        }
    },

    checkInvalidValues(ctx, next) {
       const givenParams = ctx.query;
       const {mode, increment} = ctx.query;
       const keysWithAbsentValues = Object.keys(givenParams).filter((key)=> {
            if (givenParams[key] === "" || givenParams[key]===undefined || givenParams[key]===null) {
                return key;
            }
       });
       
       if (keysWithAbsentValues.length == 0) {
           next();
       } else {
        const invalidKeysString = keysWithAbsentValues.toString().replace(/,/g, ", "); 
        throw new Error(`Missing values in ${invalidKeysString}`);
       }
    },
}
