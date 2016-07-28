const MESSAGE = 'hello world';

// The params of the client's request
var params = {
    hostname: 'localhost',
    port: '8080',
    method: 'GET',
    path: '/echo?message=' + encodeURI(MESSAGE)
};

// Create client's request
var request = require('http').request(params, function(response) {
    response.on('data', function(data) {
        var message = data.toString();
        console.log('transmitted and received messages are ' + ((message == MESSAGE) ? 'match' : 'not match'));
    });
});
request.end();
