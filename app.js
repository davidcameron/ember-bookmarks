var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    sites = require('./src/models/sites'),
    lists = require('./src/models/lists'),
    theSocket = {};

io.set('log level', 2);

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use('/media', express.static(__dirname + '/media'));

/* Site API */

app.get('/api/sites', function (req, res) {
    sites.findAll().then(function (data) {
        console.log(data);
        res.send({sites: data});
    });
});

app.get('/api/sites/:id', function (req, res) {
    console.log('get site by id!');
    
    sites.findOne(req.params.id).then(function (data) {
        res.send({site: data});
    });
});


app.post('/api/sites', function (req, res) {    
    sites.create(req.body).then(function (data) {
        res.send({site: data});
    });
    
});

app.delete('/api/sites/:id', function (req, res) {
    sites.destroy(req.params.id).then(function () {
        res.send();
    });
});

/* List API */

app.get('/api/lists', function (req, res) {
    console.log('get lists');
    lists.findAll().then(function (data) {
        res.send({lists: data});
    });
});

app.get('/api/lists/:id', function (req, res) {
    console.log('get list by id!');
    
    lists.findOne(req.params.id).then(function (data) {
        res.send({list: data});
    });
});

app.post('/api/lists', function (req, res) {    
    lists.create(req.body).then(function (data) {
        res.send({lists: data});
    });
});

app.put('/api/lists', function (req, res) {    
    res.send('Got the put!');
});

app.delete('/api/lists/:id', function (req, res) {
    lists.destroy(req.params.id).then(function () {
        res.send();
    });
});


// Create doesn't work until Socket.io is connected
io.sockets.on('connection', function (socket) {
    socket.emit('connected');
    theSocket = socket;
});
//app.listen(8080);
server.listen(8080);