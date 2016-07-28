var ip;

// Create the HTTP server and listen port 8080
var server = require('http').createServer().listen(8080);

// The 'connection' event handler
server.on('connection', function(socket) {
    ip = socket.remoteAddress;

    socket.on('close', function() {
        console.log('connection closed');
    })
});

// The 'request' event handler
server.on('request', function(request, response) {
    var parsedURL = require('url').parse(request.url, true);
    var date = new Date();
    var message = parsedURL.query.message;
    console.log(ip, '-', date, '-', message);
    response.end(message);
});