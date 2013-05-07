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

var Site = fastLegs.Base.extend({
    tableName : 'sites',
    primaryKey : 'id'
});

var List = fastLegs.Base.extend({
    tableName : 'lists',
    primaryKey : 'id',
    many: [{'sites': Site, joinOn: 'list_id'}]
});

function findAll () {
    var deferred = Q.defer();
    List.find(
        {},
        {include: {sites: {only: ['id']}}},
        function (err, results) {
            if (err) {
                deferred.reject(err);
            } else {
                results.map(function (el) {
                    el.site_ids = [];

                    el.sites.forEach(function (site) {
                        el.site_ids.push(site.id);
                    });

                    delete el.sites;
                    return el;
                });

                deferred.resolve(results);
            }
        }
    );

    return deferred.promise;
}

function findOne (id) {
    var deferred = Q.defer();
    
    List.find(
        {},
        {include: {sites: {only: ['id']}}},
        function (err, result) {
            if (err) {
                deferred.reject(err);
            } else {
                var item = result[0];
                item.site_ids = [];

                item.sites.forEach(function (site) {
                    item.site_ids.push(site.id);
                });

                delete item.sites;

                deferred.resolve(item);
            }
        }
    );

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
