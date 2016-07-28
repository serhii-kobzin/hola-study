const MESSAGE = 'hello world';

var socket = require('dgram').createSocket('udp4');

socket.send(MESSAGE, 0, MESSAGE.length, 8082, 'localhost', function(error, bytes) {
    if (error) {
        console.log('error' + error);
    }
});

socket.on('message', function(message) {
    var message = message.toString();
    console.log('transmitted and received messages are ' + ((message == MESSAGE) ? 'match' : 'not match'));
    socket.close();
});