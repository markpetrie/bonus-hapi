// const http = require('http');
// require('dotenv').config();
// const app = require('./lib/app');
// const connect = require('./lib/connect');
// connect(process.env.MONGODB_URI);
// // const server = new Hapi.Server();
// // server.connection({ port: 3000 });
// // server.app.key = 'spongebob';
// const server = http.createServer(app);
// const port = process.env.PORT || 3001;

// server.listen(3000, () => {
//     console.log('server is running on', server.address().port); //eslint-disable-line
// });


// const server = new Hapi.Server();
// server.connection({ port: 3000 });
// server.app.key = 'spongebob';

// // require('./lib/connect');

// server.start((err) => {

//     if (err) {
//         throw err;
//     }
//     console.log(`Server running at: ${server.info.uri}`);
// });