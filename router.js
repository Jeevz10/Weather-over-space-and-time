const KoaRouter = require('@koa/router');
const AppRouter = new KoaRouter();
const { checkQueryParams, checkInvalidValues } = require('./middleware');

// TODO Add error handling for incorrect params 
// https://stackoverflow.com/questions/43256916/koa-router-how-to-get-query-string-params
// AppRouter.get('/route-weather', (ctx, next) => {
//     const params = ctx.query;
//     ctx.body = params;
//     console.log(params);
// })

AppRouter.get('/route-weather', checkQueryParams, checkInvalidValues, async (ctx) => {
    const params = ctx.query;
    console.log(params);
    ctx.body = params;

})

AppRouter.get('/', (ctx, next) => {
    console.log('hello world');
})

module.exports = AppRouter;
