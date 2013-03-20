var jsdom = require('jsdom'),
	Q = require('q'),
	webshot = require('webshot');

var domDeferred = Q.defer();

function fetchText (url) {

	domDeferred.promise.then(function (data) {
	    console.log(data);
	});

	jsdom.env({
		html: url,
		scripts: ['http://code.jquery.com/jquery.js'],
		done: parseSkill
	});

	webshot(url, 'screnshot.png', function (err) {
		console.log('Saved? ', err);
	});

}

function parseSkill(errors, window) {
	var $ = window.$,
		data = '';
		copy = $('body').clone();

	copy.find('script').remove();
	copy.find(':hidden').remove();

	data = copy.text();
    domDeferred.resolve(data);
}

exports.fetchText = fetchText;