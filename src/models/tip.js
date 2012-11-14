var jsdom = require('jsdom');
var mongoose = require('mongoose');
var Q = require("q");
var domDeferred = Q.defer();
var dbDeferred = Q.defer();

Q.all([domDeferred.promise, dbDeferred.promise]).spread(function (data) {
	var skillSchema = new mongoose.Schema({
		niceName: String,
		skillPointCost: Number,
		rechargeTime: Number,
		slug: String,
		profession: String,
		slot: String,
		skillType: String
	});

	var Skill = db.model('Skill', skillSchema);

	Skill.find({slug: data.slug}, function (err, found) {
		if(found.length > 0) {
			console.log("found ", found);
			return found;
		}

		var skill = new Skill(data);
		skill.save(function () {
			console.log("has saved");
			Skill.find(function (err, skills) {
				console.log("entered ", skills);
			});
		});

		return skill;
	});
});

jsdom.env({
	html: 'http://wiki.guildwars2.com/wiki/Ice_Drake_Venom',
	scripts: ['http://code.jquery.com/jquery.js'],
	done: function (errors, window) {
		var $ = window.$;
		var data = {};

		var $skillbox = $('div.infobox').first();
		var $stats = $skillbox.find('div.statistics p span');
		var $infolist = $skillbox.find('div.wrapper dl dt');

		data.icon = 'http://wiki.guildwars2.com' + $skillbox.find('.skill-infobox-icon img').attr('src');

		$stats.each(function (i, el) {
			console.log("stats each");
			var $el = $(el);

			// Look at the icon next to the value to know what it's for
			var type = $el.find('a').first().attr('title');
			console.log(type);
			var value = $el.text();
			switch (type) {
				case 'Recharge time':
					data.rechargeTime = value;
					break;
				case 'Activation time':
					data.activationTime = value;
					break;
				case 'Skill point':
					data.skillPointCost = value;
			}
		});

		$infolist.each(function (e, el) {
			console.log("dd each");
			$el = $(el);

			// Look at the dd text, and find the related dt value
			var type = $el.find('a').first().attr('title');
			var value = $el.next('dd').find('a').attr('title');
			console.log(type, value);
			switch (type) {
				case 'Profession':
					console.log('in profession');
					data.profession = value;
					break;
				case 'Skill bar':
					var slotName = value.split(" ")[0];
					data.slot = slotName;
					break;
				case 'Skill type':
					data.skillType = value;
			}

		});

		data.niceName = $skillbox.find('p.heading').first().text();
		var pathname = window.location.pathname;
		data.slug = pathname.substr(6); // everything after /wiki/

		domDeferred.resolve(data);
	}
});

var db = mongoose.createConnection('localhost', 'gw2tips');

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
	dbDeferred.resolve(this);
});