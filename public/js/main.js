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
    this.resource('sites', {path: '/sites'});
});

/* Routes */

Unminder.ApplicationRoute = Ember.Route.extend({
    model: function () {
        return Unminder.List.find();
    }
});

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
    list: DS.belongsTo('Unminder.List'),
    backgroundStyle: function () {
        if (!this.get('image')) {
            return '';
        }

        var backgroundImage = this.get('image'),
            styleString = 'background-image: url(' + backgroundImage + ')';
        return styleString;
    }.property('image')
});

Unminder.List = DS.Model.extend({
    title: DS.attr('string'),
    sites: DS.hasMany('Unminder.Site')
});

/* Controllers */

Unminder.ApplicationController = Ember.ArrayController.extend({
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

        this.set('newSite', '');
    },
    createList: function () {
        var listName = this.get('newList');
        var id = new ObjectId().toString();
        Unminder.List.createRecord({title: listName, id: id});
        this.get('store').commit();

        this.set('newList', '');
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
	classNames: ['col-span-4'],
	tagName: 'div'
});

Unminder.AddSiteButton = Ember.Button.extend(Ember.TargetActionSupport, {
	classNames: ['btn btn-primary']
});

Unminder.SpinnerView = Ember.View.extend({templateName: 'spinner'});