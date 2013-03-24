var jsdom = require('jsdom'),
	Q = require('q'),
	webshot = require('webshot'),
	md5 = require('MD5'),
	mediaDir = 'media/screenshots/'
	textDeferred = Q.defer(),
	shotDeferred = Q.defer(),
	allDeferred = Q.defer();


function getSite (url) {
	console.log('in getsite');
	jsdom.env({
		html: url,
		scripts: ['http://code.jquery.com/jquery.js'],
		done: fetchText
	});

	webshot(url, mediaDir + md5(url) + '.png', function (err) {
		console.log('webshot callback');
		if (err) {
			console.log('webshot err', err);
			shotDeferred.reject(err);
		} else {
			shotDeferred.resolve(md5(url));
		}
	});

	Q.allResolved([textDeferred.promise, shotDeferred.promise]).then(function (promises) {
		// Pass the data from textDeferred
		allDeferred.resolve(textDeferred.promise.valueOf());
	});
	return allDeferred.promise;
}

function fetchText(errors, window) {
	console.log('fetchText callback');
	var $ = window.$,
		data = {};
		copy = $('body').clone(),
		title = $('title').text();

	console.log('title: ', title);

	copy.find('script').remove();
	copy.find(':hidden').remove();

	data.copy = copy.text();
	data.title = title;
	console.log('textDeferred resolution: ', data.title);
    textDeferred.resolve(data);
}

exports.getSite = getSite;