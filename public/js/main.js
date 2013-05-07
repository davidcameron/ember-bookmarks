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
    var id = data[0].id;
    console.log('id:', id);
    Unminder.Site.find(id).reload();
    console.log(Unminder.Site.find(id));
});

var Unminder = Ember.Application.create();

/* Ember Classes */

Unminder.Router.map(function () {
    this.resource('sites', {path: '/sites'});
    this.resource('lists', {path: '/lists/:list_id'});
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

Unminder.ListsRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        controller.set('content', model.get('sites'));
        controller.set('heading', model.get('title'));
        controller.set('template', 'sites');
    },
    model: function (params) {
        return Unminder.List.find(params.list_id);
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
            list = this.get('newSiteList');
            console.log(list);

        if (url.substring(0, 7) !== 'http://') {
            url = 'http://' + url;
        }

        Unminder.Site.createRecord({url: url, list: list});

        this.get('store').commit();

        this.set('newSite', '');
    },
    createList: function () {
        var listName = this.get('newList');
        Unminder.List.createRecord({title: listName});

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

Unminder.ListsController = Ember.ObjectController.extend({
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