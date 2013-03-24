var socket = io.connect('/');

socket.on('read:sites', function (data) {
	console.log('read:', data);
	$.each(data, function (i, site) {
        Unminder.Site.allSites.addObject(Unminder.Site.create(site));
    });
});
/*
 socket.on('read:sites', function (data) {
    $.each(data, function (i, site) {
        Unminder.Site.allSites.addObject(Unminder.Site.create(site));
    });
})
*/

$('body').on('.js-unmind-input button', 'click', function () {
	console.log('clicked');
	var url = $(this).closest('.js-unmind-input').find('input').val();
	socket.emit('create:sites', {url: url});
	console.log('url:', url);
});

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
        controller.set('title', "Index Controller works!");
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

/*
Unminder.Site.allSites.addObject(Unminder.Site.create(
    {
        title: "Ember.js",
        url: "http://www.google.com",
        image: "http://return-true.com/wp-content/uploads/2012/05/getting-started-with-ember.png"
    }
));
*/