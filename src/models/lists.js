var fastLegsBase = require('FastLegS'),
    fastLegs = new fastLegsBase('pg'),
    Q = require("q");

var connectionParams = {
    user: 'postgres',
    password: 'darwin123',
    database: 'unminder',
    host: 'localhost',
    port: '5432'
};

fastLegs.connect(connectionParams);

var List = fastLegs.Base.extend({
    tableName : 'lists',
    primaryKey : 'id'
});

var Site = fastLegs.Base.extend({
    tableName : 'sites',
    primaryKey : 'id'
});

function findAll () {
    var deferred = Q.defer();
    List.find({}, function (err, results) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(results);
        }
    });

    return deferred.promise;
}

function findOne (id) {
    var deferred = Q.defer();
    
    List.find({id: id}, function (err, results) {
        item = results.rows[0];
        deferred.resolve(item);
    });

    return deferred.promise;
}

function create (data) {
    var deferred = Q.defer();

    data = data.list;

    List.create({
        title: data.title
    }, function (err, results) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function destroy (id) {
    var deferred = Q.defer();

    List.destroy({id: id}, function (err, results) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

exports.findAll = findAll;
exports.findOne = findOne;
exports.create = create;
exports.destroy = destroy;
