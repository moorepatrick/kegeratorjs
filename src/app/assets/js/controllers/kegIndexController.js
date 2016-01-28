angular.module('Kegerator').controller('KegsIndexController', function(Keg, Beer, $scope){
  Beer.query().$promise.then(function(data){
    $scope.beers = data.data;
    console.log($scope.beers);
  });
  Keg.query().$promise.then(function(data){
    $scope.kegs = data.data;
    console.log($scope.kegs);
    $scope.kegs.forEach(function(keg){
      var beer = $scope.beers.filter(function(obj){
        return obj.id === keg.beerId;
      });
      keg.beer = JSON.parse(JSON.stringify(beer[0]));
    });
  });


});
