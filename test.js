describe("Utilits test", function() {

  it("проверим countValuesInArray с простым массивом", function() {
    var histogram1SimpleData = [4, 1, 1, 1];
    assert.deepEqual(Utilits.countValuesInArray(histogram1SimpleData), {1: 3, 4: 1});
  });

  it("проверим countValuesInArray с хитрым массивом", function() {
    var histogram1DataWithHoles = [4, 1, ,2, 3, 1, 13, 13, 1231, undefined, 2, 2, 3, 3, 4, 5];
    assert.deepEqual(Utilits.countValuesInArray(histogram1DataWithHoles), {1: 2, 2: 3, 3: 3, 4: 2, 5: 1, 13: 2, 1231: 1});
  });

  it("проверим transposeArray", function() {
    var array = [[4, 1, 2, 2, 1], [3, 1, 14, 15, 2], [1231, 2, 2, 3, 1]];
    assert.equal(JSON.stringify(Utilits.transposeArray(array)), JSON.stringify([[4, 3, 1231], [1, 1, 2], [2, 14, 2], [2, 15, 3], [1, 2, 1]]));
  });

  it("проверим transformUndefinedToZero", function() {
    var array = [[undefined, 2, 3], [4, undefined, 10], [5, 5, 11], [3, 2, undefined]];
    assert.equal(JSON.stringify(Utilits.transformUndefinedToZero(array)), JSON.stringify([[0, 2, 3], [4, 0, 10], [5, 5, 11], [3, 2, 0]]));
  });

});

describe("GraphConstructor", function() {

  it("проверим наличие GraphConstructor", function() {
    assert.equal(typeof GraphConstructor, "object");
  });

  it("проверим GraphConstructor.defineGraphType() на определение графика histogram1", function() {
    var histogram1Data = [4, 1, 1, 2, 3, 1, 13, 13, 1231, 2, 2, 3, 3, 4, 5];
    assert.equal(GraphConstructor.defineGraphType(histogram1Data), 'histogram1');
  });

  it("проверим GraphConstructor.defineGraphType() на определение графика histogram2", function() {
    var histogram2Data = ["a", "a", "a", "c", "d", "d", "d", "a"];
    assert.equal(GraphConstructor.defineGraphType(histogram2Data), 'histogram2');
  });

  it("проверим GraphConstructor.defineGraphType() на определение графика scatter plot", function() {
    var scatterPlotData = [
      {x: 10, y: 10, r: 37},
      {x: 20, y: 11.2, r: 2},
      {x: 22, y: 31, r: 17},
      {x: 40, y: 5.7, r: 11},
      {x: 32, y: 11, r: 28}
    ];
    assert.equal(GraphConstructor.defineGraphType(scatterPlotData), 'scatterPlot');
  });

  it("проверим GraphConstructor.defineGraphType() на определение графика line chart", function() {
    var lineChartData = {
      1: [1, 12, 3],
      4: [12, 31, 4],
      5: [3, 24, 4],
      6: [12, 17, 6],
      12: [8, 2, 9],
      13: [21, 34, 6],
      21: [6, 7, 8]
    };
    assert.equal(GraphConstructor.defineGraphType(lineChartData), 'lineChart');
  });

  it("проверим GraphConstructor.defineGraphType() на определение графика stacked bar chart", function() {
    var stackedBarChartData = [
      ["jan", 1, 4, 5, 6],
      ["jan", 2, 3, 5, 6],
      ["jan", 3, 10, 11],
      ["mar", 4, 9, 7, 10],
      ["may", 3, 10, 8, 1],
      ["sep", 11, 1, 9, 0]
    ];
    assert.equal(GraphConstructor.defineGraphType(stackedBarChartData), 'stackedBarChart');
  });

});