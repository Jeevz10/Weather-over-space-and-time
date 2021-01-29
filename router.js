const KoaRouter = require('@koa/router');

const AppRouter = new KoaRouter();

AppRouter.get('/:start/:end/:mode/:increment', (ctx, next) => {
    console.log(ctx.query);
    ctx.body = start;
})

AppRouter.get('/', (ctx, next) => {
    console.log('hello world');
} )

module.exports = AppRouter;
