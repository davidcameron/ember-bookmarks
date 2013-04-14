var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
//	io = require('socket.io').listen(server),
	fs = require('fs'),
	util = require('util'),
	create = require('./src/models/create'),
	read = require('./src/models/read'),
	destroy = require('./src/models/destroy'),
	api = require('.//src/api');

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use('/media', express.static(__dirname + '/media'));

app.get('/api/sites', function (req, res) {
	api.read(['sites']).then(function (json) {
		res.send(json);	
	});
});

app.post('/api/sites', function (req, res) {
	console.log('POST: /api/sites', req.body);
	create.create(req.body).then(function (data) {
		res.send(data);
	});
});

app.listen(8080);

/*
io.set('log level', 1);

server.listen(8080);

io.sockets.on('connection', function (socket) {
	read.read().then(function (items) {
		socket.emit('sites:all', items);
	});

	socket.on('create:sites', function (data) {
		create.create(data)
			.then(read.read)
			.then(function (item) {
				socket.emit('sites:one', item);
			});
	});

	socket.on('destroy:site', function (data) {
		destroy.destroy(data.url);
	});

	socket.on('update:site', function (data) {
		update.update(data.query, data.data);
	});
});
*/