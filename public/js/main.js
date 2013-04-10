'use strict';
/* Server Communication */
var socket = io.connect('/');

var Unminder = Ember.Application.create();

socket.on('sites:all', function (data) {
	var siteCollection = Unminder.Site.allSites;
	siteCollection.clear();

	$.each(data, function (i, site) {
        siteCollection.addObject(Unminder.SiteInstance.create(site));
    });
});

socket.on('sites:one', function (data) {
    Unminder.Site.insert(Unminder.SiteInstance.create(data[0]));
});

/* Ember Classes */

Unminder.Router.map(function () {
    this.route('sites');
    this.resource('category', {path: '/category/:category_slug'});
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

Unminder.CategoryRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        controller.set('content', model);
        controller.set('name', 'tj');
    },
    model: function () {
        console.log('getting model');
        Unminder.Site.all();
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

Unminder.SiteInstance = Ember.Object.extend({
    backgroundStyle: function () {
        if (!this.get('image')) {
            return '';
        }

        var backgroundImage = this.get('image'),
            styleString = 'background-image: url(' + backgroundImage + ')';
        return styleString;
    }.property('image')
});

Unminder.Category = Ember.Object.extend();

Unminder.CategoryList = Ember.Object.extend();

Unminder.CategoryList.reopenClass({
    allCategories: [],
    all: function () {
        return this.allCategories;
    },
    insert: function (obj) {
        var category = this.allCategories.findProperty('slug', obj.get('slug'));
        if (!category) {
            this.allCategories.unshiftObject(obj);
        }
    }
});

/* Controllers */

Unminder.ApplicationController = Ember.Controller.extend({
    isAdding: false,
    categories: Unminder.CategoryList.all(),
    startAddingSite: function () {
        this.set('isAdding', true);
    },
    createSite: function () {
        var url = this.get('newSite'),
            category = this.get('newSiteCategory'),
            toAdd;

        if (url.substring(0, 7) !== 'http://') {
            url = 'http://' + url;
        }

        this.set('newSite', '');
        toAdd = {url: url, category: category};
        socket.emit('create:sites', toAdd);

        Unminder.Site.insert(Unminder.SiteInstance.create(toAdd));
    }
});

Unminder.SitesController = Ember.ArrayController.extend({
    delete: function (site) {
        Unminder.Site.allSites.removeObject(site);
        socket.emit('destroy:site', {url: site.url});
    },
    // Figure out how to get this working with routing!
    inCategory: function () {
        return this.filterProperty('category', 'comics')
    }.property('@each')
});

Unminder.CategoryController = Ember.ArrayController.extend({
    filteredSites: function () {
        return this.get('content');
    },
    foo: 'dis bar'
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

$.each(categories, function (i, val) {
    Unminder.CategoryList.insert(Unminder.Category.create(val));
});