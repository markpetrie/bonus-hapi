const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request('http://localhost:3000');
require('../../lib/connect');
const connection = require('mongoose').connection;

const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ port: 3001, host: 'localhost' });

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

describe('customers REST api', () => {
    before(() => connection.dropDatabase()
        .then(done()));
});


let customer1 = {};

const saveCustomer = (name) => {
    return request.post(`/customers/${name}`);
};

it('saves a customer', () => {
    return saveCustomer('John Smith')
        .then(savedCustomer => {
            customer1 = savedCustomer;
            assert.isOk(savedCustomer._id);
            assert.equal(savedCustomer.name, customer1.name);
        });
});

it('GETs customer if they exist', () => {
    return request.get(`/customers/id/?${customer1._id}`)
        .then(response => response.payload)
        .then(customer => assert.deepEqual(customer, customer1));
});

it('returns 404 if customer does not exist', () => {
    const nonId = '59c9bd96b9d45d482659b531';
    return request.get(`/customers/${nonId}`)
        .then(
            () => { throw new Error('successful status code not expected');
            },
            response => {
                assert.equal(response.status, 404);
                assert.isOk(response.error);
            }
        );
});

it('GET all customers', () => {
    return Promise.all([
        saveCustomer('Mary Swanson'),
        saveCustomer('Francine Hickenburger'),
    ])
        .then(() => request.get('/'))
        .then(results => {
            const customers = results;
            assert.deepEqual(customers, ['John Smith', 'Mary Swanson', 'Francine Hickenburger']);
        });
});

it('Updates existing customer', () => {
    return request
        .put(`/customers/id/${customer1._id}`)
        .send({ name: 'Jon Smith' })
        .then(res => {
            const updatedCustomer = res.body;
            assert.equal(updatedCustomer.name, 'Jon Smith');
        });
});

it('Removes customer by id', () => {
    return request.delete(`/customers/id/${customer1._id}`)
        .then(res => assert.deepEqual(res.payload, { removed: true }));
});