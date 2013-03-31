var mongo = require('mongoskin'),
    Q = require("q"),
    db = mongo.db('localhost/unminder', {safe: false});

db.collection('site').ensureIndex([['url', 1]], true);
db.bind('site');

function destroy (filter) {
    console.log('in destroy', filter);
    destroyDeferred = Q.defer();
    db.site.remove({url: filter}, function (err) {
        console.log('removed');
        if (err) {
            destroyDeferred.reject(err);
        } else {
            destroyDeferred.resolve();
        }
    });

    return destroyDeferred.promise;
}

exports.destroy = destroy;
