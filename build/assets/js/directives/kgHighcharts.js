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
      scope.$watch('pourHistory', function(val){
        Highcharts.chart(element[0], scope.options);
        Highcharts.chart().redraw();
      });
    }
  };
});
