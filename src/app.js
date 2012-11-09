// Server
var app = require('express')()
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var fs = require('fs');
var util = require('util');

var http = require('http');

server.listen(8080);

io.sockets.on('connection', function (socket) {

	socket.emit('tips:read', {"foo": "bar"});
	
});

var opts = {
	host: 'wiki.guildwars2.com',
	port: 80,
	path: '/wiki/Devourer_Venom',
	method: 'GET'
};
console.log('about to instantiate request');
var req = http.request(opts, function (res) {
	console.log("begin request");
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		console.log('chunk:');
		console.log(chunk);
	});
});

console.log(req);

req.on('error', function (e) {
	console.log(e.message);
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

req.end();