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
                results.map(function (list) {
                    var sites = list.sites;
                    list.sites = [];

                    sites.forEach(function (site) {
                        list.sites.push(site.id);
                    });
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
        {id: id},
        {include: {sites: {}}},
        function (err, result) {
            if (err) {
                deferred.reject(err);
            } else {
                var item = result[0];
                item.sites.forEach(function (site) {
                    site.list = site.list_id;
                });

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
            deferred.resolve(results.rows[0]);
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
