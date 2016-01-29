angular.module('Kegerator').factory('Event', function($http, $resource){
  var resource = $resource('/api/v1/events/', {id: "@id"}, {
    query: {
      method: "GET",
      isArray: false
    }
  });
  return resource;
});
