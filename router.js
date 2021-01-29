const KoaRouter = require('@koa/router');

const AppRouter = new KoaRouter();

AppRouter.get('/route-weather', (ctx, next) => {
    const params = ctx.query;
    ctx.body = params;
    console.log(params);
})

AppRouter.get('/', (ctx, next) => {
    console.log('hello world');
} )

module.exports = AppRouter;
