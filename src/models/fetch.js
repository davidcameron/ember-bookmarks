var jsdom = require('jsdom'),
	Q = require('q'),
	webshot = require('webshot'),
	md5 = require('MD5'),
	mediaDir = 'media/screenshots/'
	textDeferred = {},
	shotDeferred = {},
	allDeferred = {};


function getSite (url) {
	textDeferred = Q.defer(),
	shotDeferred = Q.defer(),
	allDeferred = Q.defer();

	console.log('in getsite');
	jsdom.env({
		html: url,
		scripts: ['http://code.jquery.com/jquery.js'],
		done: fetchText
	});

	webshot(url, mediaDir + md5(url) + '.png', {'ignoreSslErrors': true}, function (err) {
		console.log('webshot callback');
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
		// Pass the data from textDeferred
		allDeferred.resolve(data);
	});
	return allDeferred.promise;
}

function fetchText(errors, window) {
	console.log('fetchText callback');
	console.log(errors);
	var $ = window.$,
		data = {};
		copy = $('body').clone(),
		title = $('title').text();

	console.log('title: ', title);

	copy.find('script').remove();
	copy.find(':hidden').remove();

	data.copy = copy.text();
	data.title = title;
	console.log('textDeferred resolution: ', data);
    textDeferred.resolve(data);
}

exports.getSite = getSite;