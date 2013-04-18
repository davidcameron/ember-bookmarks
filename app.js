var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
	sites = require('./src/models/sites');

//io.set('log level', 2);

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use('/media', express.static(__dirname + '/media'));

app.get('/api/sites', function (req, res) {
	sites.findAll().then(function (data) {
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
		
		theSocket.emit('posting');
		
		theSocket.emit('create:site', data);
		
		
	});
	res.send({site: req.body});
});

// Create doesn't work until Socket.io is connected
io.sockets.on('connection', function (socket) {
	socket.emit('connected');
	theSocket = socket;
});

app.delete('/api/sites/:id', function (req, res) {
	sites.destroy(req.params.id).then(function () {
		res.send();
	});
});

//app.listen(8080);
server.listen(8080);