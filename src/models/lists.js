var mongo = require('mongoskin'),
    BSON = mongo.BSONPure,
    Q = require("q"),
    db = mongo.db('localhost/unminder', {safe: false});

db.collection('list');
db.bind('list');

function findAll () {

    var deferred = Q.defer();
    db.list.find().toArray(function (err, items) {
        items.map(function (el) {
            el.id = el._id;
            return el;
        });
        console.log(items);
        deferred.resolve(items);
    });

    return deferred.promise;
}

function findOne (id) {
    var deferred = Q.defer();
    

    db.site.find({_id: id}).toArray(function (err, items) {
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
