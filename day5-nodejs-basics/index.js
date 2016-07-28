var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var onlineUsers = {};

app.get('/skobzin/day5-nodejs-basics/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3002, function(){
    console.log('listening on *:3002');
});

io.on('connection', function(socket){
    var name = '';

    socket.on('name message', function(msg) {
        name = msg;
        console.log('a user ' + name + ' connected');
        socket.broadcast.emit('chat message', 'a user ' + name + ' connected');
        updateOnline('add', socket, name);
    });

    socket.on('disconnect', function(){
        console.log('a user ' + name + ' disconnected');
        socket.broadcast.emit('chat message', 'a user ' + name + ' disconnected');
        updateOnline('remove', socket);
    });

    socket.on('chat message', function(msg){
        socket.broadcast.emit('chat message', name + ': ' + msg);
    });

    socket.on('private message', function(msg) {
        io.sockets.sockets[msg['id']].emit('chat message', 'private message from ' + name + ': ' + msg['text']);
    });
});

function updateOnline(action, socket, name) {
    var id = socket.id;
    switch (action) {
        case 'add':
            onlineUsers[id] = name;
            break;
        case 'remove':
            delete onlineUsers[id];
            break;
    }
    io.emit('update online', JSON.stringify(onlineUsers));
}
