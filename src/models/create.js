var mongo = require('mongoskin'),
    Q = require("q"),
    scraper = require('./fetch'),
    db = mongo.db('localhost/unminder', {safe: false});

db.collection('site').ensureIndex([['url', 1]], true);
db.bind('site');

function create (data) {
    console.log('in create');
    createDeferred = Q.defer();
    data = data.site;
    var url = data.url;
    if (url.substring(0, 7) !== 'http://') {
        url = 'http://' + url;
    }

    db.site.insert({url: url, category: data.category}, function (err) {
        console.log('in insert');
        if (err) {
            console.log('insert error', err);
            createDeferred.reject(err);
            return console.log('Insert Error: ', err);
        }

        scraper.getSite(url).then(function (data) {
            console.log("getSite resolved");
            console.log("data: ", data);
            db.site.update({url: url}, {$set: {title: data.title, copy: data.copy, image: data.image}}, function (err) {
                console.log("update callback");
                if (err) {
                    console.log(err);
                    create.Deferred.reject(err);
                    return;
                }
                createDeferred.resolve(url);
            });
            
        });
    });

    return createDeferred.promise;
}

exports.create = create;
