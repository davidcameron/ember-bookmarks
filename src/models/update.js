var mongo = require('mongoskin'),
    Q = require("q"),
    db = mongo.db('localhost/unminder', {safe: false});

db.collection('site').ensureIndex([['url', 1]], true);
db.bind('site');

function update (query, data) {
    console.log('in update');
    updateDeferred = Q.defer();

    db.site.update(query, {$set: data}, function (err) {
        console.log("update callback");
        if (err) {
            console.log(err);
            update.Deferred.reject(err);
            return;
        }
        updateDeferred.resolve(query);
    });

    return updateDeferred.promise;
}

exports.update = update;
