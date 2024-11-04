// const http = require('http')
// const app =require('./app')
// const server=http.createServer(app);
// server.listen(80,console.log('server running on localhost 80'));
const http = require('http');
const app = require('./app');

const server = http.createServer(app);

// Listen on port 80 and log a message once the server is ready
server.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
});
