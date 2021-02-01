const KoaRouter = require('@koa/router');
const AppRouter = new KoaRouter();
const { checkQueryParams, checkInvalidValues } = require('./middleware');
const { Service } = require('./service');


// TODO Add error handling for incorrect params 
// https://stackoverflow.com/questions/43256916/koa-router-how-to-get-query-string-params
// AppRouter.get('/route-weather', (ctx, next) => {
//     const params = ctx.query;
//     ctx.body = params;
//     console.log(params);
// })

AppRouter.get('/route-weather', checkQueryParams, checkInvalidValues, async (ctx) => {
    const { start, end, mode, increment } = ctx.query;
    console.log(start, end, mode, increment);
    const serviceInstance = new Service(start, end, mode, increment);
    const result = await serviceInstance.getWeatherOverSpaceAndTime();
    console.log(result);
    ctx.body = result;
})

AppRouter.get('/', (ctx, next) => {
    console.log('hello world');
})

module.exports = AppRouter;
