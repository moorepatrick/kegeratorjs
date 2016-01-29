require('jquery');
require('angular');
require('angular-route');
require('angular-resource');
require('highcharts-ng');

angular.module('Kegerator', ['ngRoute', 'ngResource', 'highcharts-ng']);

// (function() {
//   var app = angular.module('Kegerator', ['ngRoute', 'ngResource']);
//
//   app.controller('SiteController', ['$http', function($http) {
//     var vm = this;
//     //vm.beers = beers;
//
//     $http.get('http://192.168.33.11:5000/api/v1/beers/').success(function(data){
//       vm.beers = data.data;
//       //console.log(data);
//     });
//   }]);
//
//   app.controller("PanelController", function(){
//     this.tab = 1;
//
//
//     this.selectTab = function(setTab){
//       this.tab = setTab;
//     };
//     this.isSelected = function(checkTab){
//       return this.tab === checkTab;
//     };
//   });
//
//   app.directive('beerInfo', function(){
//     return {
//       restrict: "E",
//       templateUrl: "./assets/templates/beer-info.html"
//     };
//   });
//
//   var beers = [
//   {
//     abv: 9.5,
//     brewedBy: "Nic Wiles",
//     costPerPint: 1.4,
//     description: "This is a chilli infused Belgian Quad",
//     ibu: 15.0,
//     id: 1,
//     name: "Spicy Quad",
//     rating: 4.0,
//     srm: 30.0,
//     style: "Belgian Quad"
//   },
//   {
//     abv: 4.5,
//     brewedBy: "Will Shaler",
//     costPerPint: 1.4,
//     description: "This is a ginger infused apple cider",
//     ibu: 15.0,
//     id: 2,
//     name: "Ginger Cider",
//     rating: 4.0,
//     srm: 30.0,
//     style: "Apple Cider"
//   }];
//
// })();

/*var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = window.$ = window.jQuery = $;
var Marionette = require('backbone.marionette');
var Pages = require('./Pages');
require('bootstrap');

var app = new Marionette.Application();
window.app = app;

app.addRegions({
    nav: '#nav',
    content: '#content'
});

// set up nav
var Nav = require('./NavView');
var nav = new Nav();
app.addInitializer(function() {
    app.getRegion('nav').show(nav);
});

// main pages
var showView = function(viewWrapperFunc) {
    return function() {
        var viewPort = app.getRegion('content');
        viewWrapperFunc(viewPort);
    }
};

var pages = {
    realtime: showView(Pages.realtime),
    kegs: showView(Pages.kegs),
    history: showView(Pages.history)
};
pages['*catchall'] = pages.kegs;

var Router = Marionette.AppRouter.extend({
    routes: pages
});

// start the router
app.addInitializer(function(opts) {
    this.router = new Router();
    this.router.on('route', function() {
        nav.render();
    });
    Backbone.history.start({
        // pushState: true
    });
});

app.start();
*/
