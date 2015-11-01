Object.prototype.draw = Object.prototype.draw || function() {
  var graphData = this;
  GraphConstructor.drawGraph(graphData);
};

var Utilits = (function() {

  return {
    countValuesInArray: function(graphData) {
      var countValues = {};
      for (var i = 0, length = graphData.length; i < length; i++) {
        var point = graphData[i];
        if (point)
          countValues[point]
            ? countValues[point] += 1
            : countValues[point] = 1;
      };
      return countValues;
    },

    transposeArray: function(array) {
      return array[0].map(function(col, i) {
        return array.map(function(row) {
          return row[i];
        });
      });
    },

    transformUndefinedToZero: function(array) {
      for (var i = 0; i < array.length; i++) {
        var arrayRow = array[i];
        for (var j = 0; j < arrayRow.length; j++) {
          if (arrayRow[j] === undefined)
            array[i][j] = 0;
        };
      };
      return array;
    },

    prepareHistogramData: function (graphData) {
      var preparedGraphData = Utilits.countValuesInArray(graphData);
      var labels = [], series = [];
      for (var k in preparedGraphData) {
        if (!preparedGraphData.hasOwnProperty(k))
          continue;
        labels.push(k);
        series.push(preparedGraphData[k]);
      };
      return {
        labels: labels,
        series: series
      };
    },

    prepareLineChartData: function(graphData) {
      var labels = [], series = [];
      for (var k in graphData) {
        if (!graphData.hasOwnProperty(k))
          continue;
        labels.push(parseFloat(k));
        series.push(graphData[k]);
      };
      return {
        labels: labels,
        series: Utilits.transposeArray(series)
      };
    },

    prepareStackedBarChartData: function(graphData) {
      var labels = [], series = [];
      for (var i = 0; i < graphData.length; i++) {
        labels.push(graphData[i].shift());
        series.push(graphData[i]);
      };
      return {
        labels: labels,
        series: Utilits.transformUndefinedToZero(Utilits.transposeArray(series))
      };
    }
  }

})();

var GraphConstructor = (function() {

  var graphCounter = 1;

  return {

    graphCounter: function() {
      return graphCounter++;
    },

    defineGraphType: function(graphData) {
      var typeOfGraph = null;
      if (graphData && graphData instanceof Array && graphData.length) {

        for (var i = 0, graphDataLength = graphData.length; i < graphDataLength; i++) {

          var graphDataItemToFloat = parseFloat(graphData[i]);
          var graphDataItem = graphData[i];

          //histogram 1
          if (graphDataItemToFloat || graphDataItemToFloat === 0) {
            graphData[i] = graphDataItemToFloat;
            typeOfGraph = 'histogram1';

          //histogram 2
          } else if (typeof graphDataItem === 'string') {
            typeOfGraph = 'histogram2';

          //scatter plot
          } else if (typeof graphDataItem === 'object'
            && graphDataItem.x && typeof graphDataItem.x === 'number'
            && graphDataItem.y && typeof graphDataItem.y === 'number'
            && graphDataItem.r && typeof graphDataItem.r === 'number') {
            typeOfGraph = 'scatterPlot';

          //stacked bar chart
          } else if (graphDataItem instanceof Array
            && graphDataItem.length
            && typeof graphDataItem[0] === 'string') {
            typeOfGraph = 'stackedBarChart';

          } else {
            throw new Error('Some elements in [' + graphData + '] is missed or wrong format, check your data.');
          }

        };

      //line chart
      } else if (graphData && graphData === Object(graphData)) {
        typeOfGraph = 'lineChart';

      } else {
        throw new Error('Check your data.');
      };
      return typeOfGraph;
    },

    drawDivContainerForGraph: function(divId) {
      //ct-octave
      document.body.innerHTML += '<div id ="' + divId + '" class="ct-chart"></div>';
    },

    createChart: function (type, id, data, options, callback) {
      GraphConstructor.drawDivContainerForGraph(id);
      //HACK
      setTimeout(function() {
        var graph = type === 'bar'
          ? new Chartist.Bar('#' + id, data, options || null)
          : new Chartist.Line('#' + id, data, options || null);
        //var graph = new Chartist.Bar('#' + id, data, options || null);
        if (callback)
          graph.on('paint', callback);
      }, 0);
    },

    drawHistogram: function(graphData) {
      var divId = 'histogram' + GraphConstructor.graphCounter();
      var preparedGraphData = Utilits.prepareHistogramData(graphData);
      var data = {
        labels: preparedGraphData.labels,
        series: [preparedGraphData.series]
      };
      GraphConstructor.createChart('bar', divId, data);
    },

    drawScatterPlot: function(graphData) {
      var divId = 'scatterPlot' + GraphConstructor.graphCounter();
      var data = {
        series: [graphData]
      };
      var options = {
        showLine: false,
        axisX: {
          type: Chartist.AutoScaleAxis,
          onlyInteger: true
        }
      };
      GraphConstructor.createChart('line', divId, data, options, function(data) {
        if (data.type === 'point') {
          data.group.append(new Chartist.Svg('circle', {
            cx: data.x,
            cy: data.y,
            r: data.series[data.index].r
          }, 'ct-slice-pie'));
        }
      });
    },

    drawLineChart: function (graphData) {
      var divId = 'lineChart' + GraphConstructor.graphCounter();
      var preparedLineChartData = Utilits.prepareLineChartData(graphData);
      var data = {
        labels: preparedLineChartData.labels,
        series: preparedLineChartData.series
      };
      var options = {
        fullWidth: true,
        chartPadding: {
          right: 40
        }
      };
      GraphConstructor.createChart('line', divId, data, options);
    },

    drawStackedBarChart: function(graphData) {
      var divId = 'stackedBarChart' + GraphConstructor.graphCounter();
      var preparedStackedBarChartData = Utilits.prepareStackedBarChartData(graphData);
      var data = {
        labels: preparedStackedBarChartData.labels,
        series: preparedStackedBarChartData.series
      };
      var options = {
        stackBars: true
      };
      GraphConstructor.createChart('bar', divId, data, options, function(data) {
        if (data.type === 'bar') {
          data.element.attr({
            style: 'stroke-width: 30px'
          });
        }
      });
    },

    drawGraph: function(graphData) {
      switch (GraphConstructor.defineGraphType(graphData)) {
        case 'histogram1':
        case 'histogram2':
          GraphConstructor.drawHistogram(graphData);
          break;
        case 'scatterPlot':
          GraphConstructor.drawScatterPlot(graphData);
          break;
        case 'lineChart':
          GraphConstructor.drawLineChart(graphData);
          break;
        case 'stackedBarChart':
          GraphConstructor.drawStackedBarChart(graphData);
          break;
        default:
          break;
      };
    }

  }

})();