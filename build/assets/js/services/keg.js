angular.module('Kegerator').factory('Keg', function($http, $resource){
  var resource = $resource('/api/v1/kegs/:id', {id: "@id"}, {
    query: {
      method: "GET",
      isArray: false
    }
  });
  return resource;

  // return {
  //   all: function(){
  //     console.log("All Call");
  //     return $http({method: "GET", url: '/api/v1/kegs/'});
  //   }
  // };
});
