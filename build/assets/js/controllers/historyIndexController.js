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
        data: []
      }]
    };

    Event.query().$promise.then(function(data) {
      var events = data.data;

      var series = ['Pours'].map(function(seriesName) {
        return {
          data: []
        };
      });

      var pourEvents = events.filter(function(item) {
        return item.type == "pouredBeer";
      });

      pourEvents.forEach(function(event) {
        var x = event.time * 1000;
        series[0].data.push([x, parseFloat(event.data.volumeL)]);
        //series[0].data.push(parseFloat(event.data.volumeL));
      });

      options.series = series;
      console.log(JSON.stringify(series));
      //return options;
      Highcharts.charts[0].series[0].setData(options.series[0].data);
    });
    //console.log(options.series);
    return options;
  })();

  $scope.temperatureHistory = (function() {
    var options = {
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
        {name: 'Sensed',data: []},
        {name: 'Commanded',data: []},
        {name: 'Average',data: []},
        {name: 'UpperLimit',data: []},
        {name: 'LowerLimit',data: []}
      ]
    };

    Event.query().$promise.then(function(data) {
      var events = data.data;

      var series = ['Sensed', 'Commanded', 'Average', 'UpperLimit', 'LowerLimit'].map(function(seriesName) {
        return {
          name: seriesName,
          data: []
        };
      });
      console.log(series);

      var temperatureEvents = events.filter(function(item) {
        return item.type == "thermostatSense";
      });

      Thermostat.query().$promise.then(function(data) {
        $scope.thermostat = data.data;
        console.log($scope.thermostat);

        temperatureEvents.forEach(function(event) {
          var x = event.time * 1000,
            setPointDegC = parseFloat($scope.thermostat.setPointDegC),
            deadBandDegC = parseFloat($scope.thermostat.deadBandDegC);

          series[0].data.push([x, parseFloat(event.data.degC)]);
          series[1].data.push([x, setPointDegC]);
          series[2].data.push([x, parseFloat(event.data.avgDegC)]);
          series[3].data.push([x, setPointDegC + deadBandDegC]);
          series[4].data.push([x, setPointDegC - deadBandDegC]);
        });

        options.series = series;
        //console.log(JSON.stringify(series));
        //return options;
        Highcharts.charts[1].series.forEach(function(item, index){
          //item.name = options.series[index].name;
          item.setData(options.series[index].data);
        });
      });
    });
    //console.log(options.series);
    return options;
  })();
});
