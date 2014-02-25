window.config = {
    screenshotURL: '/media/screenshots/',
    screenShotExtension: '.png'
};

window.Unminder = Ember.Application.create();

/* Ember Setup */

Unminder.ApplicationAdapter = DS.RESTAdapter.extend({
    namespace: 'api'
});

Unminder.Router.map(function () {
    this.resource('sites', {path: '/sites'});
    this.resource('lists', {path: '/lists/:list_id'});
});

/* Routes */

Unminder.ApplicationRoute = Ember.Route.extend({
    setupController: function (controller) {
        controller.set('appTitle', "Unminder!");
        controller.set('model', this.store.find('list'));
        // We need to get all sites at once, because async is broken in hasMany
        this.store.find('site');
    }
});

Unminder.IndexRoute = Ember.Route.extend({});

Unminder.SitesRoute = Ember.Route.extend({
    setupController: function (controller) {
        console.log('sites route');
        controller.set('model', this.store.find('site'));
    }
});

Unminder.ListsRoute = Ember.Route.extend({
    renderTemplate: function () {
        this.render('sites', {
            controller: 'sites'
        });
    },
    setupController: function (controller, model) {
        var sites = model.get('sites');

        this.controllerFor('sites').set('content', model.get('sites'));
    }
});

/* Controllers */ 

Unminder.IndexController = Ember.ArrayController.extend();

Unminder.ApplicationController = Ember.ArrayController.extend({
    actions: {
        createSite: function () {
            var url = this.get('newSite'),
                list = this.get('newSiteList'),
                site;

            if (url.substring(0, 7) !== 'http://') {
                url = 'http://' + url;
            }

            site = this.store.createRecord('site', {
                url: url, list: list
            });

            site.save();

            this.set('newSite', '');
        },
        createList: function () {
            var listName = this.get('newList'),
                list = this.store.createRecord('list', 
                    {title: listName}
                );

            list.save();

            this.set('newList', '');
        },
        deleteList: function (list) {
            this.store.deleteRecord(list);
            list.save();
        }
    }
});

Unminder.SitesController = Ember.ArrayController.extend({
    actions: {
        deleteSite: function (site) {
            this.content.removeObject(site);
            site.deleteRecord();
            site.save();
        }
    }
});

Unminder.ListsController = Ember.ArrayController.extend({
    test: 'fromListController'
});

Unminder.ListController = Ember.ArrayController.extend({
    test: 'fromListController'
});

/* Models */

Unminder.List = DS.Model.extend({
    title: DS.attr('string'),
    sites: DS.hasMany('site')
});

Unminder.Site = DS.Model.extend({
    title: DS.attr('string'),
    image: DS.attr('string'),
    url: DS.attr('string'),
    list: DS.belongsTo('list'),
    backgroundStyle: function () {
        if (!this.get('image')) {
            return '';
        }

        var backgroundImage = this.get('image'),
            url = config.screenshotURL + backgroundImage + config.screenShotExtension,
            styleString = 'background-image: url(' + url + ')';
        return styleString;
    }.property('image')
});

/* Views */

Unminder.SpinnerView = Ember.View.extend({templateName: 'spinner'});
