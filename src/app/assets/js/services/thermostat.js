angular.module('Kegerator').factory('Thermostat', function($http, $resource){
  var resource = $resource('/api/v1/thermostat/', {id: "@id"}, {
    query: {
      method: "GET",
      isArray: false
    }
  });
  return resource;
});
