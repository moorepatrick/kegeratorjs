angular.module('Kegerator').controller('HistoryIndexController', function(Event, Thermostat, $scope) {

  $scope.thermostat = {
    avgDegC: 1.1,
    compressorOn: false,
    deadBandDegC: 2.0,
    degC: 7,
    onAddsHeat: false,
    setPointDegC: 4.0
  };

  $scope.getThermostat = function() {
    Thermostat.query().$promise.then(function(data) {
      $scope.thermostat = data.data;
      console.log($scope.thermostat);
    });
  };

  $scope.pourHistory = (function() {
    var options = {
      chart: {
        type: 'line',
        events: {
          load: function() {
            console.log("Pour History This");
            console.log(this);
            var chart = this;
            // chart.series[0].data = [
            //   [1438226380168.7993, 0.31796296296296295],
            // ];

            Event.query().$promise.then(function(data) {
              var allEvents = data.data;

              var pourEvents = allEvents.filter(function(item) {
                return item.type === "pouredBeer";
              });

              pourEvents.forEach(function(event) {
                var x = event.time * 1000;
                chart.series[0].data.push([x, parseFloat(event.data.volumeL)]);
              });

              chart.series[0].setData(chart.series[0].data);
            });
          }
        }
      },
      title: {
        text: 'Pour History'
      },
      yAxis: {
        title: {
          text: 'Volume (L)'
        }
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
      },
      legend: {
        enabled: false
      },
      series: [{
        name: "Pours",
        data: []
      }]
    };

    return options;
  })();

  $scope.temperatureHistory = (function() {
    var options = {
      chart: {
        type: 'line',
        events: {
          load: function() {
            console.log("Pour History This");
            console.log(this);
            var chart = this;

            Event.query().$promise.then(function(data) {
              var allEvents = data.data;

              var temperatureEvents = allEvents.filter(function(item) {
                return item.type === "thermostatSense";
              });

              Thermostat.query().$promise.then(function(data) {
                $scope.thermostat = data.data;

                temperatureEvents.forEach(function(event) {
                  var x = event.time * 1000,
                    setPointDegC = parseFloat($scope.thermostat.setPointDegC),
                    deadBandDegC = parseFloat($scope.thermostat.deadBandDegC);

                  chart.series[0].data.push([x, parseFloat(event.data.degC)]);
                  chart.series[1].data.push([x, setPointDegC]);
                  chart.series[2].data.push([x, parseFloat(event.data.avgDegC)]);
                  chart.series[3].data.push([x, setPointDegC + deadBandDegC]);
                  chart.series[4].data.push([x, setPointDegC - deadBandDegC]);
                });

                chart.series.forEach(function(item, index) {
                  item.setData(chart.series[index].data,false);
                });
                chart.redraw();
              });
            });
          }
        }
      },
      title: {
        text: 'Temperature History'
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
      }]
    };

    return options;
  })();
});
