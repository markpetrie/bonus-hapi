const Customer = require('./models/customer');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/customers';

const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

// HAPI SERVER
server.start((err) => {
    
    if (err) {
        throw err;
    }
    console.log('Server running');
});

mongoose.connect(dbUri);

// MONGOOSE CONNECTION EVENTS

mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection is open to ' + dbUri);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection open to ' + dbUri);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', function () {
    mongoose.connection.close( function () {
        console.log( 'Mongoose default connection disconnected through app termination' );
        process.exit(0);
    });
});
 
// HAPI SERVER ROUTES

server.route({
    method: 'POST',
    path: '/customers/{name}',
    config: {
        handler: function (request, reply) {
            const customer = new Customer({
                name: request.payload.name
            });
            return customer.save(function(error, customer) {
                if (error) {
                    console.log(error);
                }
                reply(customer);
            });
        }
    }
});

server.route({
    method: 'GET',
    path: '/customers/id/{custId?}',
    handler: function (request, reply) {
        Customer.findById(function(error, customer) {
            if (error) {
                console.error(error);
            }
            reply('found customer id: ' + customer._id).code(200);
        });
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        return Customer.find(function(error, customers) {
            if (error) {
                console.error(error);
            }
            reply(customers).code(200);
        });
    }
});

server.route({
    method: 'PUT',
    path: '/customers/id/{custId?}',
    config: {
        handler: (request, reply) => {
            return Customer.findByIdAndUpdate(request.params.custId, request.payload, { new: true }, function(error, response) {
                if (error) {
                    console.error(error);
                }
                reply('customer updated');
            });
        }
    }
});

server.route({
    method: 'DELETE',
    path: '/customers/id/{custId?}',
    config: {
        handler: (request, reply) => {
            return Customer.findByIdAndRemove(request.params.custId, function(error, response) {
                if (error) {
                    console.error(error);
                }
                reply('customer deleted');
            });
        }
    }
});

