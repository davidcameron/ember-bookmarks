var jsdom = require('jsdom'),
	Q = require('q'),
	webshot = require('webshot'),
	textDeferred = Q.defer(),
	shotDeferred = Q.defer();


function getSite (url) {

	textDeferred.promise.then(function (data) {

	    console.log(data);
	});

	if (url.substring(0, 7) !== 'http://') {
		url = 'http://' + url;
	}

	jsdom.env({
		html: url,
		scripts: ['http://code.jquery.com/jquery.js'],
		done: fetchText
	});

	webshot(url, url + '.png', function (err) {
		if (err) {
			shotDeferred.reject(err);
		} else {
			shotDeferred.resolve();
		}
	});

}

function fetchText(errors, window) {
	var $ = window.$,
		data = '';
		copy = $('body').clone();

	copy.find('script').remove();
	copy.find(':hidden').remove();

	data = copy.text();
    textDeferred.resolve(data);

}

exports.getSite = getSite;