const PORT = 3123;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var mySQL = require('mysql');

var connection = mySQL.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'skobzin_todolist'
});

app.use('/skobzin/day10-backend-db-ajax-basics/js', express.static(__dirname + '/js'));
app.use('/skobzin/day10-backend-db-ajax-basics/css', express.static(__dirname + '/css'));
app.use(bodyParser.json());

app.get('/skobzin/day10-backend-db-ajax-basics/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/skobzin/day10-backend-db-ajax-basics/create/user/', function(req, res) {
    console.log('create user');
    connection.query('SELECT * FROM users WHERE user_name = ?', [req.body.user_name, req.body.user_password], function(err, result) {
        if (result.length) {
            res.send(JSON.stringify({
                status: 'error',
                data: 'User with such name already exist'
            }));
            return;
        }
        connection.query('INSERT INTO users (user_name, user_password, filter) VALUES (?, ?, ?)', [req.body.user_name, req.body.user_password, req.body.filter], function (err, result) {
            res.send(JSON.stringify({
                status: 'ok',
                data: result.insertId
            }));
        });
    });
});

app.post('/skobzin/day10-backend-db-ajax-basics/update/user/', function(req, res) {
    console.log('update user');
    connection.query('UPDATE users SET filter = ? WHERE user_id = ?', [req.body.filter, req.body.user_id], function(err, result) {
        res.send(JSON.stringify({
            status: 'ok'
        }));
    });
});

app.post('/skobzin/day10-backend-db-ajax-basics/read/user/', function(req, res) {
    console.log('read user');
    console.log(req.body.user_name+' '+req.body.user_password);
    console.log(connection);
    connection.query('SELECT * FROM users WHERE user_name = ? AND user_password = ?', [req.body.user_name, req.body.user_password], function(err, result) {
        console.log(result);
        if (!result.length) {
            res.send(JSON.stringify({
                status: 'error',
                data: 'Wrong user name and password!'
            }));
            return;
        }
        res.send(JSON.stringify({
            status: 'ok',
            data: result[0]
        }));
    });
});

app.post('/skobzin/day10-backend-db-ajax-basics/create/task/', function(req, res) {
    console.log('create task');
    connection.query('INSERT INTO tasks (user_id, task_text, task_complete) VALUES (?, ?, ?)', [req.body.user_id, req.body.task_text, req.body.task_complete], function(err, result) {
        res.send(JSON.stringify({
            status: 'ok',
            data: result.insertId}));
    });
});

app.post('/skobzin/day10-backend-db-ajax-basics/update/task/', function(req, res) {
    console.log('update task');
    connection.query('UPDATE tasks SET task_text = ?, task_complete = ? WHERE task_id = ?', [req.body.task_text, req.body.task_complete, req.body.task_id], function(err) {
        res.send(JSON.stringify({
            result: 'ok'
        }));
    });
});

app.post('/skobzin/day10-backend-db-ajax-basics/read/tasks/', function(req, res) {
    console.log('read tasks');
    connection.query('SELECT * FROM tasks WHERE user_id = ?' + ((req.body.filter != 'all') ? ' AND task_complete = ?' : ''), [req.body.user_id, (req.body.filter == 'complete')], function(err, result) {
        res.send(JSON.stringify({data: result}));
    });
});

app.post('/skobzin/day10-backend-db-ajax-basics/delete/task/', function(req, res) {
    console.log('delete task');
    connection.query('DELETE FROM tasks WHERE task_id = ?', [req.body.task_id], function(err) {
        res.send(JSON.stringify({}));
    });
});

http.listen(PORT, function(){
    console.log('listening on *:' + PORT);
});
