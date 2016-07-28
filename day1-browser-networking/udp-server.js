var socket = require('dgram').createSocket('udp4').bind(8082);

socket.on('message', function(message, info) {
    var ip = info.address;
    var date = new Date();
    console.log(ip, '-', date, '-', message.toString());
    socket.send(message, 0, message.length, info.port, ip, function(error, bytes) {
        if (error) {
            console.log('error' + error);
        }
    });
    console.log('connection closed');
});