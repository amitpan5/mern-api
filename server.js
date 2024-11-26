
const http = require('http');
const app = require('./app');

const port = process.env.PORT || 0; // Use 0 to let the system assign an available port
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`App is running on http://localhost:${server.address().port}`);
});
