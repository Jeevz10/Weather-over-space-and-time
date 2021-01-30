require('dotenv').config()
const App = require('./app');
const Router = require('./router');

const serverInstance = new App(Router);

serverInstance.startServer();