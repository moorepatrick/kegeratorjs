
angular.module("Kegerator").directive('kgHighcharts', function(){

  return {
    replace: true,
    restrict: "E",
    template: "<div></div>",
    controller: "kgHighchartsController",
    scope: {
      options: '='
    },
    link: function(scope, element){
        thisChart = Highcharts.chart(element[0], scope.options);
        Highcharts.thisChart = thisChart;

        scope.$on('$destroy', function(){
          console.log("kgHighcharts Destroyed");
        });
      }
  };
});
