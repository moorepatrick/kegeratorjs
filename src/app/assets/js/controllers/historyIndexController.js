angular.module('Kegerator').controller('HistoryIndexController', function(Event, $scope) {

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
      series: []
    };

    var thing = Event.query().$promise.then(function(data) {
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
    });
    console.log(options.series);
    return options;
  })();

  $scope.pourHistory1 = {
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
    series: [
    {
      data: [
        [1438226380168.7993, 0.31796296296296295],
        [1438234069871.8508, 0.3505555555555555],
        [1438234517125.495, 0.40629629629629627],
        [1438242139805.7197, 0.42148148148148146],
        [1438242151957.5166, 0.6301851851851851],
        [1438242202376.9653, 0.6559259259259259],
        [1438270585947.3792, 0.7488888888888888],
        [1438270587800.6643, 0.7609259259259259],
        [1438271182033.1433, 0.7742592592592593],
        [1438271984189.6306, 0.9338888888888889],
        [1438273181467.637, 0.9531481481481482],
        [1438273967755.6836, 0.985],
        [1438273982485.0728, 1.346111111111111],
        [1438273986283.0554, 1.3587037037037035],
        [1438273988600.537, 1.3685185185185182],
        [1438275661341.197, 1.6188888888888888]
      ]
    }]
  };
});
