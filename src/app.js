// Server
var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	fs = require('fs'),
	util = require('util'),
	http = require('http'),
	create = require('./models/create'),
	read = require('./models/read'),
	destroy = require('./models/destroy');

io.set('log level', 1);

server.listen(8080);

io.sockets.on('connection', function (socket) {
	read.read().then(function (items) {
		socket.emit('sites:all', items);
	});

	socket.on('create:sites', function (data) {
		console.log(data.url);
		create.create(data.url)
			.then(read.read)
			.then(function (item) {
				console.log('about to push down new site');
				socket.emit('sites:one', item);
			});
	});

	socket.on('destroy:site', function (data) {
		destroy.destroy(data.url);
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
	}
	console.log('filePath: ', filePath);
	fs.readFile(filePath, function (error, content) {
        if (error) {
            res.writeHead(501);
            res.end('Big ol\' error!');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });

});