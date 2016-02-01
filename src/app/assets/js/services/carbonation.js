angular.module('Kegerator').factory('Carbonation', function($http, $resource){
  var resource = $resource('/api/v1/beers/:id');
  return resource;
});
