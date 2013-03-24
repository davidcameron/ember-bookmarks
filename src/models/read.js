var mongo = require('mongoskin'),
    Q = require("q"),
    db = mongo.db('localhost/unminder', {safe: false}),
    readDeferred = Q.defer();

db.collection('site').ensureIndex([['url', 1]], true);
db.bind('site');

function read (filter) {
    console.log('in read');
    if (typeof filter !== 'object') {
        db.site.find().toArray(function (err, items) {
            console.log("items: ", items)
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
