angular.module("Kegerator").controller('kgHighchartsController', function($scope) {
  Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });
});
