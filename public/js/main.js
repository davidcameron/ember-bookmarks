var socket = io.connect('/');

socket.on('sites:all', function (data) {
	var siteCollection = Unminder.Site.allSites;
	siteCollection.clear();

	$.each(data, function (i, site) {
        siteCollection.addObject(Unminder.Site.create(site));
    });
});

socket.on('sites:one', function (data) {
    Unminder.Site.allSites.addObject(Unminder.Site.create(data[0]));
});

// Ember

var Unminder = Ember.Application.create();

Unminder.ApplicationController = Ember.Controller.extend({
    firstName: "David",
    lastName: "Cameron"
});

Unminder.Router.map(function () {
    this.route('sites');
    this.route('site', {path: '/sites/:site_id'});
});

Unminder.IndexRoute = Ember.Route.extend({
    setupController: function (controller) {
        controller.set('title', "Unminder Index Route!");
    }
});

Unminder.Site = Ember.Object.extend();
Unminder.Site.reopenClass({
    allSites: [],
    all: function () {
        return this.allSites;
    }
});

Unminder.SitesRoute = Ember.Route.extend({
    model: function () {
        console.log('in sites route', Unminder.Site.all());
        return Unminder.Site.all();
    }
});

Unminder.SitesController = Ember.ArrayController.extend({
    delete: function (site) {
        Unminder.Site.allSites.removeObject(site);
        socket.emit('destroy:site', {url: site.url});
    }
});

Unminder.SiteThumbnail = Ember.View.extend({
	classNames: ['span2'],
	tagName: 'li'
});

Unminder.AddSiteForm = Ember.View.extend({
	classNames: ['input-append'],
	controller: null,
	textField: null,
	save: function () {
		var url = this.get('textField.value');
		socket.emit('create:sites', {url: url});
	}
});

Unminder.AddSiteTextField = Ember.TextField.extend({});

Unminder.AddSiteButton = Ember.Button.extend(Ember.TargetActionSupport, {
	classNames: ['btn btn-primary']
});

/*
Unminder.Site.allSites.addObject(Unminder.Site.create(
    {
        title: "Ember.js",
        url: "http://www.google.com",
        image: "http://return-true.com/wp-content/uploads/2012/05/getting-started-with-ember.png"
    }
));
*/

$('.close').tooltip();