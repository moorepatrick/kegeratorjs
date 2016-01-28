angular.module("Kegerator").directive('kgPageNav', function(){
  return {
    replace: true,
    restrict: "E",
    templateUrl: "/assets/templates/directives/kgPageNav.html",
    controller: function($scope, $location){
      $scope.isPage = function(name){
        return new RegExp("/" + name + "($|/)").test($location.path());
      };
    }
  };
});
