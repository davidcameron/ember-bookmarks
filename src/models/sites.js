var mongo = require('mongoskin'),
    BSON = mongo.BSONPure,
    Q = require("q"),
    db = mongo.db('localhost/unminder', {safe: false}),
    scraper = require('./fetch');

db.collection('site').ensureIndex([['url', 1]], true);
db.bind('site');

function findAll () {
    var deferred = Q.defer();
    db.site.find().toArray(function (err, items) {
        items.map(function (el) {
            el.id = el._id;
            delete el.copy;
            el.image = './media/screenshots/' + el.image + '.png';
            return el;
        });
        deferred.resolve(items);
    });

    return deferred.promise;
}

function findOne (id) {
    var deferred = Q.defer();

    //id = '516e52bb28d4867da7000000';
    
    console.log('findOne BSON id:', new BSON.ObjectID(id));
    db.site.find({_id: id}).toArray(function (err, items) {
        item = items[0];
        item.id = item._id;
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


    db.site.insert({url: url, list_id: data.list_id, _id: data.id}, function (err, docs) {
        if (err) {
            deferred.reject(err);
        } else {
            scraper.getSite(url).then(function (data) {
                db.site.update({_id: docs[0]._id}, {$set: {title: data.title, copy: data.copy, image: data.image}}, function (err) {
                    if (err) {
                        create.Deferred.reject(err);
                    } else {
                        deferred.resolve(docs);
                    }
                });
            });
        }
    });

    return deferred.promise;
}

function destroy (id) {
    console.log('destroy API id:', id);
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
