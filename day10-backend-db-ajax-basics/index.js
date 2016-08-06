const PORT = 3000;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var mySQL = require('mysql');

var connection = mySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todolist'
});

function actionWithBase(data, callback) {

}

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/create/', function(req, res) {
    console.log('create');
    connection.query('INSERT INTO tasks (user_id, task_text, task_complete) VALUES (?, ?, ?)', [req.body.user_id, req.body.task_text, req.body.task_complete], function(err, result) {
        if (err) {
            throw err;
        }
        res.send(JSON.stringify({data: result.insertId}));
    });
});

app.post('/update/', function(req, res) {
    console.log('update');
    connection.query('UPDATE tasks SET task_text = ?, task_complete = ? WHERE task_id = ?', [req.body.task_text, req.body.task_complete, req.body.task_id], function(err) {
        if (err) {
            throw err;
        }
        res.send(JSON.stringify({}));
    });
});

app.post('/read/', function(req, res) {
    console.log('read');
    connection.query('SELECT * FROM tasks WHERE user_id = ?' + ((req.body.filter != 'all') ? ' AND task_complete = ?' : ''), [req.body.user_id, (req.body.filter == 'complete')], function(err, result) {
        if (err) {
            throw err;
        }
        res.send(JSON.stringify({data: result}));
    });
});

app.post('/delete/', function(req, res) {
    console.log('delete');
    connection.query('DELETE FROM tasks WHERE task_id = ?', [req.body.task_id], function(err) {
        if (err) {
            throw err;
        }
        res.send(JSON.stringify({}));
    });
});

app.post('/read/user/', function(req, res) {
    console.log('read user');
    connection.query('SELECT * FROM users WHERE user_name = ? AND user_password = ?', [req.body.user_name, req.body.user_password], function(err, result) {
        if (err) {
            throw err;
        }
        res.send(JSON.stringify({data: result}));
    });
});

http.listen(PORT, function(){
    console.log('listening on *:' + PORT);
});
