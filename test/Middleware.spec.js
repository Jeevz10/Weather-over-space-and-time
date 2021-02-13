const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');
const ChaiHttp = require('chai-http');
const Sinon = require('sinon');
const App = require('../app');
const Router = require('../router');
const { errorHandling } = require('../error-handling');


Chai.use(ChaiAsPromised);
Chai.use(ChaiHttp);
const { expect } = Chai;