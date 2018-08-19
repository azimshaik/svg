$(document).ready(function() {
  var canvas = new fabric.Canvas("canvas");
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  var dimensions = ["dim1", "dim2", "dim3"];
  var thetaIncrement = (2 * Math.PI) / dimensions.length;
  var theta = 0;
  console.log(dimensions.length);

  for (var i = 0; i < dimensions.length; i++) {
    var x = 50 * Math.cos(theta);
  }
  function drawCircle(left, top, sw, r) {
    var circle = new fabric.Circle({
      center: left,
      left: top,
      strokeWidth: sw,
      radius: r,
      fill: "white",
      stroke: "black"
    });
    return circle;
  }
  canvas.add(drawCircle(canvasWidth / 2.5, canvasHeight / 2.5, 2, 10));

  function drawLine() {
    var line = new fabric.Line([250, 250, 5, 5], {
      stroke: "black",
      strokeWidth: 1
    });
    return line;
  }
  //canvas.add(drawLine());

  $("#selectsecond").click(function() {
    canvas.setActiveObject(canvas.item(1));
  });
  canvas.renderAll();
});
