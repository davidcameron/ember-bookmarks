var jsdom = require('jsdom');
var mongoose = require('mongoose');

jsdom.env({
	html: 'http://wiki.guildwars2.com/wiki/Devourer_Venom',
	scripts: ['http://code.jquery.com/jquery.js'],
	done: function (errors, window) {
		var $ = window.$;
		var data = {};

		var $infobox = $("div.infobox").first();
		var $stats = $infobox.find('div.statistics span');


		data.rechargeTime = $($stats[0]).text();
		data.skillPointCost = $($stats[1]).text();

		data.niceName = $infobox.find('p.heading').first().text();
		var pathname = window.location.pathname;
		data.slug = pathname.substr(6); // everything after /wiki/

		var db = mongoose.createConnection('localhost', 'gw2tips');

		db.on('error', console.error.bind(console, 'connection error:'));

		db.once('open', function () {
			var skillSchema = new mongoose.Schema({
				niceName: String,
				skillPointCost: Number,
				rechargeTime: Number,
				slug: String
			});

			var Skill = db.model('Skill', skillSchema);
			var skill = new Skill(data);

			skill.save(function () {
				Skill.find(function (err, skills) {
					console.log(skills);
				});
			});
		});
	}
});