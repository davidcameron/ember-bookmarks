'use strict';

var Unminder = Ember.Application.create();

/* Ember Classes */

Unminder.Router.map(function () {
    this.route('sites');
});

/* Routes */

Unminder.IndexRoute = Ember.Route.extend({
    setupController: function (controller) {
        controller.set('title', "Unminder Index Route!");
    }
});

Unminder.SitesRoute = Ember.Route.extend({
    model: function () {
        return Unminder.Site.find();
    }
});

/* Models */

Unminder.Store = DS.Store.extend({
    revision: 12
});

DS.RESTAdapter.reopen({
    namespace: 'api'
});


Unminder.Site = DS.Model.extend({
    title: DS.attr('string'),
    image: DS.attr('string'),
    url: DS.attr('string'),
    backgroundStyle: function () {
        if (!this.get('image')) {
            return '';
        }

        var backgroundImage = this.get('image'),
            styleString = 'background-image: url(' + backgroundImage + ')';
        return styleString;
    }.property('image')
});

/* Controllers */

Unminder.ApplicationController = Ember.Controller.extend({
    isAdding: false,
    startAddingSite: function () {
        this.set('isAdding', true);
    },
    createSite: function () {
        var url = this.get('newSite'),
            category = this.get('newSiteCategory');

        if (url.substring(0, 7) !== 'http://') {
            url = 'http://' + url;
        }

        console.log('url: ', url);

        Unminder.Site.createRecord({url: url});
        this.get('store').commit();
    }
});

Unminder.SitesController = Ember.ArrayController.extend({
    delete: function (site) {
        this.get('store').deleteRecord(site);
        this.get('store').commit();
    }
});

/* Views */

Unminder.SiteThumbnail = Ember.View.extend({
	classNames: ['span4'],
	tagName: 'li'
});

Unminder.AddSiteButton = Ember.Button.extend(Ember.TargetActionSupport, {
	classNames: ['btn btn-primary']
});

Unminder.SpinnerView = Ember.View.extend({templateName: 'spinner'});

/* Test Content */
var categories = [
    {slug: 'mvc', niceName: 'JavaScript MVC Frameworks'},
    {slug: 'performance', niceName: 'Frontend Performance Articles'},
    {slug: 'comics', niceName: 'Web Comics'}
];