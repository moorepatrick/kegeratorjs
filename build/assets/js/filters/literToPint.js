angular.module('Kegerator').filter('literToPint', function(){
  return function(liters, places){
    if(places === "undefined"){places = 2;}
    return (liters * 2.113).toFixed(places);
  };
});
