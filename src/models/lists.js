var mongo = require('mongoskin'),
    BSON = mongo.BSONPure,
    Q = require("q"),
    db = mongo.db('localhost/unminder', {safe: false});

db.collection('list');
db.bind('list');

db.collection('site');
db.bind('site');

function findAll () {

    var deferred = Q.defer();
    db.list.find().toArray(function (err, items) {
        items.map(function (el) {
            el.id = el._id;
            return el;
        });

        joinSites(items).then(deferred.resolve);
    });

    return deferred.promise;
}

function joinSites(items) {
    var deferred = Q.defer();
    var sitesDeferredArray = [];

    for(x in items) {
        sitesDeferredArray[x] = Q.defer();
        var list_id = items[x]._id;
        console.log(' ');
        console.log(list_id);
        console.log(items[x].id);
        console.log(' ');
        // Pulls sites if you leave out the query hash
        console.log(list_id);
        db.site.find({list_id: items[x]._id}).toArray(function (err, sites) {
            var siteArray = [];

            for (y in sites) {
                siteArray.push(sites[y].list_id);
            }
            console.log(siteArray);

            sitesDeferredArray[x].resolve(siteArray);
            
        });
    }

    Q.allResolved(sitesDeferredArray).then(function (promises) {
        promises.forEach(function (promise) {
            if (promise.isFulfilled()) {
                items[x].sites = promise.valueOf();
            }
        });

        deferred.resolve(items);
    });

    return deferred.promise;

}

function findOne (id) {
    var deferred = Q.defer();
    

    db.list.find({_id: id}).toArray(function (err, items) {
        item = items[0];
        item.id = item._id;
        deferred.resolve(item);
    });

    return deferred.promise;
}

function create (data) {
    var deferred = Q.defer();

    data = data.list;

    db.list.insert(data, function (err, docs) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(docs);
        }
    });

    return deferred.promise;
}

function destroy (id) {
    var deferred = Q.defer();
    db.site.remove({_id: id}, function (err, docs) {
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
