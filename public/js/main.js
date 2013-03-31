/* Server Communication */
var socket = io.connect('/');

socket.on('sites:all', function (data) {
	var siteCollection = Unminder.Site.allSites;
	siteCollection.clear();

	$.each(data, function (i, site) {
        siteCollection.addObject(Unminder.Site.create(site));
    });
});

socket.on('sites:one', function (data) {
    Unminder.Site.insert(Ember.Object.create(data[0]));
});

/* Ember Classes */

var Unminder = Ember.Application.create();

Unminder.ApplicationController = Ember.Controller.extend({
    firstName: "David",
    lastName: "Cameron"
});

Unminder.Router.map(function () {
    this.route('sites');
    this.route('site', {path: '/sites/:site_id'});
});

/* Routes */

Unminder.IndexRoute = Ember.Route.extend({
    setupController: function (controller) {
        controller.set('title', "Unminder Index Route!");
    }
});

Unminder.SitesRoute = Ember.Route.extend({
    model: function () {
        return Unminder.Site.all();
    }
});

/* Models */

Unminder.Site = Ember.Object.extend();

Unminder.Site.reopenClass({
    allSites: [],
    all: function () {
        return this.allSites;
    },
    insert: function (obj) {
        var record = this.allSites.findProperty('url', obj.get('url'));
        if (record) {
            record.set('image', obj.image);
            record.set('title', obj.title);
        } else {
            this.allSites.unshiftObject(obj);
        }
    }
});

/* Controllers */

Unminder.SitesController = Ember.ArrayController.extend({
    delete: function (site) {
        Unminder.Site.allSites.removeObject(site);
        socket.emit('destroy:site', {url: site.url});
    }
});

/* Views */

Unminder.SiteThumbnail = Ember.View.extend({
	classNames: ['span4'],
	tagName: 'li'
});

Unminder.AddSiteForm = Ember.View.extend({
	classNames: ['input-append'],
	controller: null,
	textField: null,
	save: function () {
		var url = this.get('textField.value');
		socket.emit('create:sites', {url: url});
        this.set('textField.value', '');

        Unminder.Site.insert(Ember.Object.create({url: url}));
	}
});

Unminder.AddSiteTextField = Ember.TextField.extend({});

Unminder.AddSiteButton = Ember.Button.extend(Ember.TargetActionSupport, {
	classNames: ['btn btn-primary']
});

Unminder.SpinnerView = Ember.View.extend({
    templateName: 'spinner'
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