// Server
var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	fs = require('fs'),
	util = require('util'),
	http = require('http'),
	scraper = require('./models/tip');

server.listen(8080);

io.sockets.on('connection', function (socket) {

	socket.emit('update', {"foo": "bar"});

	socket.on('create', function (data) {
		console.log(data.url);
		scraper.getSite(data.url);
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
	}

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