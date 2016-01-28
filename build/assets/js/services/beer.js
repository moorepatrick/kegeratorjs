angular.module('Kegerator').factory('Beer', function($http, $resource){
  var resource = $resource('/api/v1/beers/:id', {id: "@id"}, {
    query: {
      method: "GET",
      isArray: false
    }
  });
  return resource;
});
