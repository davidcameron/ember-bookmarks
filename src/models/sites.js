var fastLegsBase = require('FastLegS'),
    fastLegs = new fastLegsBase('pg'),
    Q = require("q"),
    scraper = require('./fetch');

var connectionParams = {
    user: 'postgres',
    password: 'darwin123',
    database: 'unminder',
    host: 'localhost',
    port: '5432'
};

fastLegs.connect(connectionParams);

var Site = fastLegs.Base.extend({
    tableName : 'sites',
    primaryKey : 'id'
});

function findAll () {
    var deferred = Q.defer();
    Site.find({}, function (err, results) {
        console.log(results);
        if (results) {
            results.map(function (el) {
                delete el.copy;
                el.image = './media/screenshots/' + el.image + '.png';
                return el;
            });
            deferred.resolve(results);
        } else {
            deferred.resolve({});
        }
        
    });

    return deferred.promise;
}

function findOne (id) {
    var deferred = Q.defer();
    
    Site.find({id: id}, function (err, results) {
        item = results.rows[0];
        delete item.copy;
        item.image = './media/screenshots/' + item.image + '.png';
        deferred.resolve(item);
    });

    return deferred.promise;
}

function create (data) {
    var deferred = Q.defer();

    data = data.site;
    var url = data.url;

    if (url.substring(0, 7) !== 'http://') {
        url = 'http://' + url;
    }

    Site.create({
        url: url,
        list_id: data.list_id,
    }, function (err, results) {
        if (err) {
            deferred.reject(err);
        } else {
            var site = results.rows[0];

            scraper.getSite(url)
            .then(function (data) {
                Site.update({id: site.id}, {title: data.title, copy: data.copy, image: data.image},
                    function (err, result) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            Site.find({id: site.id}, function (err, results) {
                                results[0].image = './media/screenshots/' + results[0].image + '.png';
                                deferred.resolve(results[0]);
                            });
                        }
                    }
                );
            });
        }
    });

    return deferred.promise;
}

function destroy (id) {
    var deferred = Q.defer();

    Site.destroy({id: id}, function (err, results) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(results);
        }
    });

    return deferred.promise;
}

exports.findAll = findAll;
exports.findOne = findOne;
exports.create = create;
exports.destroy = destroy;
