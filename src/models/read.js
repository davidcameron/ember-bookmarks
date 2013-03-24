var mongo = require('mongoskin'),
    Q = require("q"),
    db = mongo.db('localhost/unminder', {safe: false});

db.collection('site').ensureIndex([['url', 1]], true);
db.bind('site');

function read (filter) {
    console.log('in read:', filter);
    readDeferred = Q.defer();
    if (typeof filter !== 'string') {
        db.site.find().toArray(function (err, items) {
            items.map(function (el) {
                el.image = './media/screenshots/' + el.image + '.png';
                return el;
            });
            readDeferred.resolve(items);
        });
    } else {
        console.log('filter: ', filter);
        db.site.find({url: filter}).toArray(function (err, items) {
            console.log('found by urlL', items.length);
            items.map(function (el) {
                el.image = './media/screenshots/' + el.image + '.png';
                return el;
            });
            readDeferred.resolve(items);
        });
    }

    return readDeferred.promise;
}

exports.read = read;
