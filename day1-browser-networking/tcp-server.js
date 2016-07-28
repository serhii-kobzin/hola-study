// Create the TCP server and listen port 8080
var server = require('net').createServer().listen(8081);

// The 'connection' event handler
server.on('connection', function(socket) {
    var ip = socket.remoteAddress;

    socket.on('data', function(data) {
        var date = new Date();
        var message = data.toString();
        console.log(ip, '-', date, '-', message);
        socket.end(data);
    });

    socket.on('close', function() {
        console.log('connection closed');
    })
});