'use strict';

var socket = io.connect();

socket.on('connected', function () {
    console.log('emitted connected');
});

socket.on('posting', function () {
    console.log('emitted posting');
});

socket.on('create:site', function (data) {
    console.log('create:site', data);
    var id = data[0]._id;
    console.log('id:', id);
    Unminder.Site.find(id).reload();
    console.log(Unminder.Site.find(id));
});

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

        // Override the normal ID Ember Data makes to work w/ Mongo
        var id = new ObjectId().toString();
        Unminder.Site.createRecord({url: url, id: id});
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