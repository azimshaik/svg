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
  var x = 1;
  var i = 1;
  var j = 1;
  var maxlevels = 2;
  $(".add_more").click(function(e) {
    if (x <= maxrows) {
      var dimension_name = "dimension" + i;
      var level_name1 = "level" + i + "_" + 1;
      var level_name2 = "level" + i + "_" + 2;
      var level_name3 = "level" + i + "_" + 3;
      var html =
        '<div>Dimension <input type="text" value="sales" name="' +
        dimension_name +
        '"> Level 1 <input type="text" value="Northeast" name="' +
        level_name1 +
        '"> Level 2 <input type="text" value="NorthWest" name="' +
        level_name2 +
        '"> Level 3 <input type="text" value="WestCoast" name="' +
        level_name3 +
        '"> <input id="del" type="button" value="X"><br></div>';
      $("#container").append(html);
      x++;
      //console.log("added");
      i++;
    }
  });
  $("#container").on("click", "#del", function(e) {
    $(this)
      .parent("div")
      .remove();
    x--;
    $("#svgContainer").text("");
    //location.reload();
    console.log("removed");
  });

  $("form").submit(function(e) {
    event.preventDefault();
    $("#svgContainer").text("");
    var dim = [];
    var lev = [];
    var obj = {};
    var input = $(this).serializeArray();
    var inputLength = input.length;
    for (var i = 0; i < inputLength; i++) {
      var val = input[i].name.startsWith("dim");
      if (val) {
        dim.push(input[i].value);
      } else {
        lev.push(input[i].value);
      }
    }
    console.log(dim);
    console.log(lev);
    drawSpider(dim, lev);
  });

  function drawCircle(originX, originY) {
    var cx = originX;
    var cy = originY;
    console.log(cx);
    var circle =
      '<circle cx="' +
      cx +
      '" cy="' +
      cy +
      '" r="60" style="stroke:#000000; fill:white" />';
    var existing = $("#svgContainer").html();
    $("#svgContainer").html(existing + circle);
    //$("#svgContainer").html(existing+line);
    //spiderContainer.append(line);
  }
  function drawSpider(dim, lev) {
    var spiderContainer = $("#spiderContainer");
    var width = spiderContainer.width();
    var height = spiderContainer.height();
    var originX = width;
    var originY = height;
    drawCircle(originX, originY);
    var thetaIncrement = (2 * Math.PI * (180 / Math.PI)) / dim.length;
    console.log(thetaIncrement);
    var theta = 0;
    for (var i = 0; i < dim.length; i++) {
      var radius = 60;
      var cosTheta = Math.cos(theta * (Math.PI / 180));
      var sinTheta = Math.sin(theta * (Math.PI / 180));
      var x1 = originX + radius * cosTheta;
      var y1 = originY + radius * sinTheta;
      var limblength = 200;
      var x2 = limblength * Math.cos(theta * (Math.PI / 180));
      var y2 = limblength * Math.sin(theta * (Math.PI / 180));
      drawLine(x1, y1, x1 + x2, y1 + y2);
      console.log(x1);
      theta += thetaIncrement;
    }
  }

  Math.degrees = function(radians) {
    return (radians * 180) / Math.PI;
  };

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
