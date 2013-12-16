var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    sites = require('./src/models/sites'),
    lists = require('./src/models/lists');

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use('/media', express.static(__dirname + '/media'));

/* Site API */

app.get('/api/sites', function (req, res) {
    sites.findAll().then(function (data) {
        res.send({sites: data});
    });
});

app.get('/api/sites/:id', function (req, res) {
    
    sites.findOne(req.params.id).then(function (data) {
        res.send({site: data});
    });
});


app.post('/api/sites', function (req, res) {    
    sites.create(req.body).then(function (data) {
        res.send({site: data});
    }); 
});

app.put('/api/sites/:id', function (req, res) {
    
    sites.update(req.params.id, req.body.site).then(function (data) {
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
    lists.findAll().then(function (data) {
        res.send({lists: data});
    });
});

app.get('/api/lists/:id', function (req, res) {
    
    lists.findOne(req.params.id).then(function (list) {
        var sites = list.sites;

        list.sites = [];

        sites.forEach(function (site) {
            list.sites.push(site.id);
        });

        res.send({list: list, sites: sites});
    });
});

app.post('/api/lists', function (req, res) {    
    lists.create(req.body).then(function (data) {
        res.send({list: data});
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

server.listen(8080);
