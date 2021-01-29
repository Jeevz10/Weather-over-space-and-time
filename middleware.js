const _ = require('lodash');

const REQUIRED_KEYS = ['start', 'end', 'mode', 'increment'];

module.exports = {
    async checkQueryParams(ctx, next) {
        const givenKeys = Object.keys(ctx.query);
        const absentKeys = _.difference(REQUIRED_KEYS, givenKeys);
        console.log(givenKeys, absentKeys);
        // TODO Give proper error handling 

        if (absentKeys.length == 0) {
            next();
        } else {
            throw new Error(`Missing keys in ${absentKeys}`);
        }
    }
}