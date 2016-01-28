angular.module('Kegerator').config(function($routeProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/kegs'
    })
    .when('/kegs', {
      templateUrl: 'assets/templates/kegs/index.html',
      controller: 'KegsIndexController'
    })
    .when('/kegs/:id', {
      templateUrl: 'assets/templates/kegs/show.html',
      controller: 'KegsShowController'
    })
    .when('/realtime', {
      templateUrl: 'assets/templates/realtime/index.html',
      controller: 'RealtimeIndexController'
    })
    .when('/history', {
      templateUrl: 'assets/templates/history/index.html',
      controller: 'HistoryIndexController'
    });
});
