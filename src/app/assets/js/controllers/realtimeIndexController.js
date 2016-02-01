angular.module('Kegerator').controller('RealtimeIndexController', function(Thermostat, Carbonation, $scope, $interval) {
  var tempRefresh, kegRefresh, tankRefresh;
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
  $scope.$on('$destroy', function() {
    console.log("destroy realtime interval");
    $scope.cleanUp();
  });

  $scope.cleanUp = function() {
    if (angular.isDefined(tempRefresh)) {
      $interval.cancel(tempRefresh);
      tempRefresh = undefined;
      console.log("Cleanup tempRefresh");
    }
    if (angular.isDefined(kegRefresh)) {
      $interval.cancel(kegRefresh);
      kegRefresh = undefined;
      console.log("Cleanup kegRefresh");
    }
    if (angular.isDefined(tankRefresh)) {
      $interval.cancel(tankRefresh);
      tankRefresh = undefined;
      console.log("Cleanup tankRefresh");
    }
  };

  $scope.kegPressure = {
    chart: {
      type: 'gauge',
      events: {
        redraw: function() {
          console.log("Redraw");
        },
        load: function() {
          var chart = this;

          var kegRefresh = $interval(function() {

            var point = chart.series[0].points[0],
              newVal,
              inc = Math.round((Math.random() - 0.5) * 20);

            newVal = point.y + inc;
            if (newVal < 0 || newVal > 130) {
              newVal = point.y - inc;
            }
            point.update(newVal);
          }, 3000);
        }
      },
      alignTicks: false,
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
    },
    title: {
      text: 'Keg Pressure'
    },
    pane: {
      startAngle: -150,
      endAngle: 150
    },
    yAxis: [{ // kPa
      min: 0,
      max: 413,
      tickPosition: 'outside',
      lineColor: '#933',
      lineWidth: 2,
      minorTickPosition: 'outside',
      tickColor: '#933',
      minorTickColor: '#933',
      tickLength: 5,
      minorTickLength: 5,
      labels: {
        distance: 12,
        rotation: 'auto'
      },
      offset: -20,
      endOnTick: false
    }, { // psi
      min: 0,
      max: 60,
      lineColor: '#339',
      tickColor: '#339',
      minorTickColor: '#339',
      offset: -25,
      lineWidth: 2,
      labels: {
        distance: -20,
        rotation: 0
      },
      tickLength: 5,
      minorTickLength: 5,
      endOnTick: false,
      plotBands: [{
        from: 0,
        to: 8,
        color: '#DF5353', // red
        outerRadius: 42,
        innerRadius: 0
      }, {
        from: 8,
        to: 12,
        color: '#55BF3B', // green
        outerRadius: 42,
        innerRadius: 0
      }, {
        from: 30,
        to: 60,
        color: '#DF5353', // red
        outerRadius: 42,
        innerRadius: 0
      }]
    }],
    series: [{
      name: 'Pressure',
      data: [70.0000], // in kPa
      dataLabels: {
        formatter: function() {
          var kPa = (this.y).toFixed(2),
            psi = (kPa * 0.1450377439).toFixed(2);
          return '<span style="color:#339">' + psi + ' psi</span><br/>' +
            '<span style="color:#933">' + kPa + ' kPa</span>';
        },
        backgroundColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, '#DDD'],
            [1, '#FFF']
          ]
        },
        y: 64
      },
      tooltip: {
        valueSuffix: ' bar'
      }
    }]
  };

  $scope.tankPressure = {
    chart: {
      type: 'gauge',
      events: {
        load: function() {
          var chart = this;
          setInterval(function() {
            var point = chart.series[0].points[0],
              newVal,
              inc = Math.round((Math.random() - 0.5) * 20);

            newVal = point.y + inc;
            if (newVal < 0 || newVal > 130) {
              newVal = point.y - inc;
            }

            point.update(newVal);

          }, 3000);

        }
      },
      alignTicks: false,
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false
    },
    title: {
      text: 'Tank Pressure'
    },
    pane: {
      startAngle: -150,
      endAngle: 150
    },
    yAxis: [{
      min: 0,
      max: 124,
      tickPosition: 'outside',
      lineColor: '#933',
      lineWidth: 2,
      minorTickPosition: 'outside',
      tickColor: '#933',
      minorTickColor: '#933',
      tickLength: 5,
      minorTickLength: 5,
      labels: {
        distance: 12,
        rotation: 'auto'
      },
      offset: -20,
      endOnTick: false
    }, {
      min: 0,
      max: 2000,
      lineColor: '#339',
      tickColor: '#339',
      minorTickColor: '#339',
      offset: -25,
      lineWidth: 2,
      labels: {
        distance: -20,
        rotation: 0
      },
      tickLength: 5,
      minorTickLength: 5,
      endOnTick: false,
      plotBands: [{
        from: 0,
        to: 290,
        color: '#DF5353', // red
        outerRadius: 42,
        innerRadius: 0
      }, {
        from: 580,
        to: 1232,
        color: '#55BF3B', // green
        outerRadius: 42,
        innerRadius: 0
      }, {
        from: 1450,
        to: 2000,
        color: '#DF5353', // red
        outerRadius: 42,
        innerRadius: 0
      }]
    }],
    series: [{
      name: 'Pressure',
      data: [60.00000],
      dataLabels: {
        formatter: function() {
          var bar = Math.round(this.y),
            psi = Math.round(bar * 14.50377439);
          return '<span style="color:#339">' + psi + ' psi</span><br/>' +
            '<span style="color:#933">' + bar + ' bar</span>';
        },
        backgroundColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, '#DDD'],
            [1, '#FFF']
          ]
        },
        y: 64
      },
      tooltip: {
        valueSuffix: ' bar'
      }
    }]
  };

  $scope.realtimeTemp = {
    chart: {
      type: 'line',
      events: {
        load: function() {
          var series = this.series;
          tempRefresh = $interval(function() {
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
