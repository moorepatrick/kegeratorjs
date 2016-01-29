
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
        console.log(thisChart);
        Highcharts.thisChart = thisChart;
      }
  };
});
