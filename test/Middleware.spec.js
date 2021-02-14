const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');
const ChaiHttp = require('chai-http');
const Sinon = require('sinon');
const { startServer } = require('../initializer');

Chai.use(ChaiAsPromised);
Chai.use(ChaiHttp);
Chai.should();

const testUrl = 'http://localhost:';

describe("Router Tests", () => {
    describe("GET /route-weather", () => {
        const testPortNumber = 8080;
        const fullRequest = '/route-weather?start=Brooklyn&end=Boston&mode=bicycling&increment=5';
        startServer(testPortNumber);
        it('should respond with a 200', (done) => {
            Chai.request(testUrl + testPortNumber)
                .get(fullRequest)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })
})

describe("Middleware tests", () => {
    describe("checkQueryParams", () => {
        const testPortNumber = 8081
        const incompleteRequest = '/route-weather?';
        startServer(testPortNumber);
        it ('should reject with a 406 with all the missing keys', (done) => {
            Chai.request(testUrl + testPortNumber)
            .get(incompleteRequest)
            .end((err, res) => {
                res.should.have.status(406);
                res.text.should.eql('Missing keys in start, end, mode, increment');
                done();
            })
        })
    })

    describe('Check invalid values', () => {
        describe('Empty, null or undefined values', () => {
            const testPortNumber = 8082;
            const incompleteRequest = '/route-weather?start=&end=&mode=&increment=';
            startServer(testPortNumber);
            it ('should reject with a 406 mentioning all the keys with invalid values', (done) => {
                Chai.request(testUrl + testPortNumber)
                .get(incompleteRequest)
                .end((err, res) => {
                    res.should.have.status(406);
                    res.text.should.eql('Missing values in start, end, mode, increment');
                    done();
                })
            })
        })
        describe('Unaccepted modes', () => {
            const testPortNumber = 8083;
            const incompleteRequest = '/route-weather?start=b&end=c&mode=cycle&increment=2';
            startServer(testPortNumber);
            it ('should reject with a 406 mentioning that given mode is not one of the 4 accepted modes', (done) => {
                Chai.request(testUrl + testPortNumber)
                .get(incompleteRequest)
                .end((err, res) => {
                    res.should.have.status(406);
                    res.text.should.eql('Given mode - cycle is not one of the 4 allowed modes: driving, walking, bicycling, transit');
                    done();
                })
            })
        })

        describe('Unaccepted increment', () => {
            const testPortNumber = 8084;
            const incompleteRequest = '/route-weather?start=b&end=c&mode=bicycling&increment=0';
            startServer(testPortNumber);
            it ('should reject with a 406 mentioning that given increment is not within 1-60 range', (done) => {
                Chai.request(testUrl + testPortNumber)
                .get(incompleteRequest)
                .end((err, res) => {
                    res.should.have.status(406);
                    res.text.should.eql('Given increment - 0 is not valid. It has to be an integer in between the values of 1 to 60.');
                    done();
                })
            })
        })

        describe('Invalid start and end', () => {
            const testPortNumber = 8085;
            const incompleteRequest = '/route-weather?start=1&end=2&mode=bicycling&increment=4';
            startServer(testPortNumber);
            it ('should reject with a 406 mentioning that given start and end values has to be of string value', (done) => {
                Chai.request(testUrl + testPortNumber)
                .get(incompleteRequest)
                .end((err, res) => {
                    res.should.have.status(406);
                    res.text.should.eql('Given start and end values has to be of string value describing their respective locations.');
                    done();
                })
            })
        })
    })
})