const MESSAGE = 'hello world';

// Create the TCP client socket
var socket = new require('net').Socket();

// The params of the client's request
var params = {
    hostname: 'localhost',
    port: '8081',
    method: 'GET'
};

socket.connect(params, function() {
    socket.end(MESSAGE);
});

socket.on('data', function(data) {
    var message = data.toString();
    console.log('transmitted and received messages are ' + ((message == MESSAGE) ? 'match' : 'not match'));
});
