var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	fs = require('fs'),
	util = require('util'),
	create = require('./models/create'),
	read = require('./models/read'),
	destroy = require('./models/destroy'),
	api = require('./api');

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

app.get('*', function (req, res) {
	var filePath = './public';
	var contentType = '';

	var params = req.url.split('/');
	switch (params[1]) {

		case '':
			filePath += '/index.html';
			contentType = "text/html";
			break;

		case 'css':
			filePath += req.url;
			contentType = "text/css";
			break;

		case 'js':
			filePath += req.url;
			contentType = "application/javascript";
			break;

		case 'favicon.ico':
			filePath += req.url;
			contentType = "image/x-icon";
			break;
		case 'media':
			filePath = '.' + req.url;
			contentType = "image/png";
			break;
		case 'api':
			filePath = false;
			break;
	}
	if (filePath) {
		fs.readFile(filePath, function (error, content) {
	        if (error) {
	            res.writeHead(501);
	            res.end('Big ol\' error!');
	        } else {
	            res.writeHead(200, { 'Content-Type': contentType });
	            res.end(content, 'utf-8');
	        }
	    });
	} else {

		api.read(params.slice(2)).then(function(json) {
			res.writeHead(200, {'Content-Type': 'application/json'});
	        res.end(json, 'utf-8');
		});
	}

});