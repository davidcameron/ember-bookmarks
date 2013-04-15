var express = require('express'),
	app = express(),
	sites = require('./src/models/sites');

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use('/media', express.static(__dirname + '/media'));

app.get('/api/sites', function (req, res) {
	sites.findAll().then(function (json) {
		res.send({sites: json});
	});
});

app.post('/api/sites', function (req, res) {
	sites.create(req.body).then(function (data) {
		res.send({sites: data});
	});
});

app.delete('/api/sites/:id', function (req, res) {
	sites.destroy(req.params.id).then(function () {
		res.send();
	});
});

app.listen(8080);
