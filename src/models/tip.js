var jsdom = require('jsdom');
var Q = require("q");

var domDeferred = Q.defer();
var dbDeferred = Q.defer();
dbDeferred.resolve();

// Constant, Used for jsdom
var BASE_URL = 'http://wiki.guildwars2.com/wiki/';

// eventually becomes the tip slug
var url = 'Ice_Drake_Venom';

// Wait for DB and web crawl to complete, pass DOM data
Q.all([domDeferred.promise, dbDeferred.promise]).spread(function (data) {
    console.log(data);
});

jsdom.env({
	html: 'http://wiki.guildwars2.com/wiki/Ice_Drake_Venom',
	scripts: ['http://code.jquery.com/jquery.js'],
	done: parseSkill
});

function parseSkill(errors, window) {
	var $ = window.$,
        data = '', 
        selectors = [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'p',
            'blockquote',
            'td',
            'dd',
            'dt'
        ];
    $(selectors.join(', ')).each(function (i, el) {
        data += $(el).text();
    });
    domDeferred.resolve(data);
}
