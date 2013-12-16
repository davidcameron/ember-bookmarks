var jsdom = require('jsdom'),
    Q = require('q'),
    webshot = require('webshot'),
    md5 = require('MD5'),
    mediaDir = 'media/screenshots/'
    textDeferred = {},
    shotDeferred = {},
    allDeferred = {};

function fetchText(errors, window) {
    var $ = window.$,
        data = {};
        copy = $('body').clone(),
        title = $('title').text(),
        img = $('img').length;

    copy.find('script').remove();
    copy.find(':hidden').remove();

    data.copy = copy.text();
    data.title = title;
    textDeferred.resolve(data);
}


function getSite (url) {
    textDeferred = Q.defer();
    shotDeferred = Q.defer();
    allDeferred = Q.defer();

    jsdom.env(url, ['http://code.jquery.com/jquery.js'], fetchText);

    webshot(url, mediaDir + md5(url) + '.png', function (err) {
        if (err) {
            console.log('webshot err', err);
            shotDeferred.reject(err);
        } else {
            shotDeferred.resolve(md5(url));
        }
    });

    Q.allResolved([textDeferred.promise, shotDeferred.promise]).then(function (promises) {
        var data = textDeferred.promise.valueOf();
        data.image = shotDeferred.promise.valueOf();
        allDeferred.resolve(data);
    });
    return allDeferred.promise;
}

exports.getSite = getSite;
