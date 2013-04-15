var mongo = require('mongoskin'),
    Q = require("q"),
    db = mongo.db('localhost/unminder', {safe: false}),
    scraper = require('./fetch');

db.collection('site').ensureIndex([['url', 1]], true);
db.bind('site');

// TODO fix this mess
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

function find (filter) {
    var deferred = Q.defer();

    db.site.find(filter).toArray(function (err, items) {
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

function create (data) {
    var deferred = Q.defer();
    data = data.site;
    var url = data.url;
    if (url.substring(0, 7) !== 'http://') {
        url = 'http://' + url;
    }

    db.site.insert({url: url, category: data.category}, function (err, docs) {
        console.log(docs);
        if (err) {
            console.log('insert error', err);
            deferred.reject(err);
        } else {

            scraper.getSite(url).then(function (data) {
                console.log("getSite resolved");
                console.log("data: ", data);
                db.site.update({_id: docs[0]._id}, {$set: {title: data.title, copy: data.copy, image: data.image}}, function (err) {
                    console.log("update callback");
                    if (err) {
                        console.log(err);
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
    var deferred = Q.defer();
    db.site.remove({_id: db.site.id(id)}, function (err, docs) {
        if (err) {
            console.log('destroy error: ', err);
            deferred.reject(err);
        } else {
            console.log('destroy docs: ', docs);
            deferred.resolve();
        }
    });
    return deferred.promise;
}

exports.findAll = findAll;
exports.create = create;
exports.destroy = destroy;
