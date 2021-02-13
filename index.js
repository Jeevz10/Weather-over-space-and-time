require('dotenv').config()
const App = require('./app');
const Router = require('./router');
const { errorHandling } = require('./error-handling');

// const serverInstance = new App(Router, errorHandling);
// serverInstance.startServer();

function startServer() {
    const serverInstance = new App(Router, errorHandling);
    serverInstance.startServer();
}

startServer();

module.exports = {
    startServer
}

