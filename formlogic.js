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

$(document).ready(function (e) {
  var maxrows = 6;
  var rows = 1;
  var i = 1;
  var j = 1;
  var maxlevels = 2;
  $(".add_more").click(function (e) {
    if (rows <= maxrows) {
      var dimension_name = "dimension" + i;
      var level_name1 = "level" + i + "_" + 1;
      var level_name2 = "level" + i + "_" + 2;
      var level_name3 = "level" + i + "_" + 3;
      var html =
        '<div class="form-group row"><div class="col-xs-2"><input type="text" class="form-control" value="sales" name="row[dimension]"></div>' +
        '<div class="col-xs-2"><input type="text" class="form-control" value="Northeast" name="row[level1]" id="' + level_name1 + '"></div>' +
        '<div class="col-xs-2"><input type="text" class="form-control" value="NorthWest" name="row[level2]" id="' + level_name2 + '"></div>' +
        '<div class="col-xs-2"> <input type="text" class="form-control" value="WestCoast" name="row[level3]" id="' + level_name3 + '"></div>' +
        '<div id="del" class="col-xs-2"> <input type="button" value="X"><br></div> </div></div>';
      $("#inputContainer").append(html);
      rows++;
      i++;
    }
  });

  $("#inputContainer").on("click", "#del", function (e) {
    $(this)
      .parent("div")
      .remove();
    rows--;
    $("#svgContainer").text("");
    console.log("removed");
  });

  $("form").submit(function (e) {
    event.preventDefault();
    $("#svgContainer").text("");
    var dim = [];
    var lev = [];
    var input = $(this).serializeArray();
    var inputJSON = $(this).serializeJSON();
    console.log(inputJSON);
    // var inputLength = input.length;
    // for (var i = 0; i < inputLength; i++) {
    //   var val = input[i].name.startsWith("dim");
    //   if (val) {
    //     dim.push(input[i].value);
    //   } else {
    //     lev.push(input[i].value);
    //   }
    // }
    drawSpider(inputJSON);
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

  function drawSpider(inputJSON) {
    let obj = inputJSON;
    console.log(obj);
    let numOfRows = Object.keys(obj.row).length;
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