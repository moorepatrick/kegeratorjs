angular.module('Kegerator').controller('RealtimeIndexController', function(Thermostat, $scope, $interval) {
  var chartRefresh;
  console.log("Highcharts");
  console.log(Highcharts);

  $scope.thermostat = {
    avgDegC: 1.1,
    compressorOn: false,
    deadBandDegC: 2.0,
    degC: 7,
    onAddsHeat: false,
    setPointDegC: 4.0
  };

  // Adapted from Angular docs
  // https://docs.angularjs.org/api/ng/service/$interval
  $scope.$on('$destroy', function(){
    console.log("destroy realtime interval");
    $scope.cleanUp();
  });

  $scope.cleanUp = function(){
    if(angular.isDefined(chartRefresh)){
      $interval.cancel(chartRefresh);
      chartRefresh = undefined;
      console.log("Cleanup chartRefresh");
    }
  };

  $scope.realtimeTemp = {
    chart: {
      type: 'line',
      events: {
        load: function() {
          var series = this.series;
          chartRefresh = $interval(function() {
            Thermostat.query().$promise.then(function(data) {
              $scope.thermostat = data.data;

              var x = (new Date()).getTime(),
                setPointDegC = parseFloat($scope.thermostat.setPointDegC),
                deadBandDegC = parseFloat($scope.thermostat.deadBandDegC);

              series[0].addPoint([x, parseFloat($scope.thermostat.degC)]);
              series[1].addPoint([x, setPointDegC]);
              series[2].addPoint([x, parseFloat($scope.thermostat.avgDegC)]);
              series[3].addPoint([x, setPointDegC + deadBandDegC]);
              series[4].addPoint([x, setPointDegC - deadBandDegC]);
              //console.log(series);
            });
          }, 5000);
        }
      }
    },
    title: {
      text: 'Realtime Temperature'
    },
    yAxis: {
      title: {
        text: 'Temperature (C)'
      }
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
    },
    legend: {
      enabled: false
    },
    series: [
    {
      name: 'Sensed',
      data: []
    },
    {
      name: 'Commanded',
      data: []
    },
    {
      name: 'Average',
      data: []
    },
    {
      name: 'UpperLimit',
      data: []
    },
    {
      name: 'LowerLimit',
      data: []
    }],
  };
});
