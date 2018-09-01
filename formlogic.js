function Row(dimension, levels) {
  this.dimension = dimension;
  this.levels = levels;
}

class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

$(document).ready(function(e) {
  var maxrows = 6;
  var rows = 1;
  let columns = 4;
  let dataSet = [];

  function prepareDimensionName(i) {
    return "dimension" + i + "_" + 1;
  }

  function preapareLevelName(row, column) {
    return "level" + row + "_" + column;
  }

  function prepareDataSet(i, j) {
    let dataInserted = {};
    dataInserted["dimention"] = $("#" + prepareDimensionName(i)).val();
    dataInserted["level_1"] = $("#" + preapareLevelName(i, j++)).val();
    dataInserted["level_2"] = $("#" + preapareLevelName(i, j++)).val();
    dataInserted["level_3"] = $("#" + preapareLevelName(i, j++)).val();
    dataSet.push(dataInserted);
  }

  $(".add_more").click(function(e) {
    if (rows <= maxrows) {
      columns = 1;
      var html =
        '<div class="form-group row"><div class="col-xs-2"><input type="text" class="form-control" value="sales" name="' +
        prepareDimensionName(rows) +
        '"id="' +
        prepareDimensionName(rows) +
        '"></div> <div class="col-xs-2"><input type="text" class="form-control" value="Northeast" name="' +
        preapareLevelName(rows, columns) +
        '"id="' +
        preapareLevelName(rows, columns++) +
        '"></div> <div class="col-xs-2"><input type="text" class="form-control" value="NorthWest" name="' +
        preapareLevelName(rows, columns) +
        '"id="' +
        preapareLevelName(rows, columns++) +
        '"></div> <div class="col-xs-2"> <input type="text" class="form-control" value="WestCoast" name="' +
        preapareLevelName(rows, columns) +
        '"id="' +
        preapareLevelName(rows, columns++) +
        '"></div> <div id="del" class="col-xs-2"> <input type="button" value="X"><br></div> </div></div>';

      $("#inputContainer").append(html);
      rows++;
    }
  });

  $("#inputContainer").on("click", "#del", function(e) {
    $(this)
      .parent("div")
      .remove();
    rows--;
    $("#svgContainer").text("");
    console.log("removed");
  });

  $("form").submit(function(e) {
    event.preventDefault();
    $("#svgContainer").text("");
    var dim = [];
    var lev = [];
    var input = $(this).serializeArray();
    dataSet = [];
    for (let i = 0; i < rows; i++) {
      prepareDataSet(i, 1);
    }
    //console.log(dataSet);
    var inputLength = input.length;
    for (var i = 0; i < rows; i++) {
      //var val = input[i].name.startsWith("dim");
      dim.push(dataSet[i].dimension);
      for (let j = 0; j < columns; j++) {
        let columnName = preapareLevelName(i, j);
        lev.push(dataSet[i][columnName]);
      }
      // if (val) {
      //   dim.push(dataSet[i].dimension);
      // } else {
      //   for(let j=0;j<columns;j++){
      //     let columnName=preapareLevelName(i,j);
      //     lev.push(dataSet[i][columnName]);
      //   }
      // }
    }
    drawSpider(dataSet);
  });

  function drawCircle(originX, originY, r) {
    var cx = originX;
    var cy = originY;
    var circle =
      '<circle cx="' +
      cx +
      '" cy="' +
      cy +
      '" r="' +
      r +
      '" style="stroke:#000000; fill:white" />';
    var existing = $("#svgContainer").html();
    $("#svgContainer").html(existing + circle);
  }

  function drawSpider(dataSet) {
    //let obj = inputJSON;
    //console.log(dataSet);
    let numOfRows = dataSet.length;
    var spiderContainer = $("#spiderContainer");
    var width = spiderContainer.width();
    var height = spiderContainer.height();
    var originX = width / 2;
    var originY = height / 2;
    drawCircle(originX, originY, 60);
    writeText(originX, originY);
    var thetaIncrement = (2 * Math.PI * (180 / Math.PI)) / numOfRows;
    var theta = 0;
    for (var i = 0; i < numOfRows; i++) {
      var numlevels = Object.keys(dataSet[i]).length;
      var l = 0;
      console.log(l);
      console.log(dataSet[i].l);
      var radius = 60;
      var cosTheta = Math.cos(theta * (Math.PI / 180));
      var sinTheta = Math.sin(theta * (Math.PI / 180));
      var x1 = originX + radius * cosTheta;
      var y1 = originY + radius * sinTheta;
      var limblength = 300;
      var x2 = x1 + limblength * Math.cos(theta * (Math.PI / 180));
      var y2 = y1 + limblength * Math.sin(theta * (Math.PI / 180));
      drawLine(x1, y1, x2, y2);
      var pointsBetween = getPointsBetween(x1, y1, x2, y2, 3);
      for (var j = 0; j < 3; j++) {
        var spotRadius = 10;
        var x =
          (pointsBetween[j].x -
            spotRadius +
            (pointsBetween[j].x + spotRadius)) /
          2;
        var y =
          (pointsBetween[j].y +
            spotRadius +
            (pointsBetween[j].y - spotRadius)) /
          2;
        drawCircle(x, y, spotRadius);
        writeText(x + 15, y - 10);
      }
      l++;
      theta += thetaIncrement;
    }
  }

  function writeText(x, y) {
    // x = x + 15;
    // y = y - 10;
    var txt = '<text  x="' + x + '" y="' + y + '" style="">Test</text>';
    var existing = $("#svgContainer").html();
    $("#svgContainer").html(existing + txt);
  }

  var spotCount;

  function getPointsBetween(x1, y1, x2, y2, spotCount) {
    var pointsBetween = [];
    x2 = Math.ceil(x2);
    if (x1 != x2) {
      //Calculating slope
      var m = (y2 - y1) / (x2 - x1);
      var b = y1 - m * x1;
      var deltaX = (x2 - x1) / spotCount;
      for (var k = 1; k <= spotCount; k++) {
        var point = new Coordinate();
        point.x = x1 + deltaX * k;
        point.y = m * point.x + b;
        pointsBetween.push(point);
      }
    } else {
      var deltaY = (y2 - y1) / spotCount;
      for (var k = 1; k <= spotCount; k++) {
        var point = new Coordinate();
        point.x = x1;
        point.y = y1 + deltaY * k;
        pointsBetween.push(point);
      }
    }
    return pointsBetween;
  }

  function drawLine(x1, y1, x2, y2) {
    var line =
      '<line  x1="' +
      x1 +
      '" y1="' +
      y1 +
      '" x2="' +
      x2 +
      '" y2="' +
      y2 +
      '" style="stroke: black; stroke-width:2;"/>';
    var existing = $("#svgContainer").html();
    $("#svgContainer").html(existing + line);
  }
});
