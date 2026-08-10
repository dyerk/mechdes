/**********************************************************************************************************************/
/* function plot_grid - generates a grid in a plot window
/**********************************************************************************************************************/
function plot_grid(canvas,context,xOffset,yOffset,wOffset,hOffset) {
  var w = canvas.width - wOffset;
  var h = canvas.height - hOffset;
  var xCoord = 0;
  var yCoord = 0;
  var x0 = xOffset;
  var y0 = yOffset;

  context.fillStyle = "#FFFFFF";
  context.fillRect(x0,y0,w,h);
  context.lineWidth = 1;
  context.strokeStyle = "#DDDDDD";
  
  for (var i = 0; i < 9; i++) {
    xCoord = (i + 1) * w / 10 + x0;
    yCoord = (i + 1) * h / 10 + y0;
    context.beginPath();
    context.moveTo(xCoord,y0);
    context.lineTo(xCoord,y0+h);
    context.moveTo(x0,yCoord);
    context.lineTo(w+x0,yCoord);
    context.closePath();
    context.stroke();
  }
} 
/**********************************************************************************************************************/
/* function plot_scale - puts the scale on the plot window
/**********************************************************************************************************************/
function plot_scale(canvas,context,xMin,xMax,yMin,yMax,xOffset,yOffset,wOffset,hOffset) {
  var w = canvas.width - wOffset;
  var h = canvas.height - hOffset;
  var xCoord = 0;
  var yCoord = 0;
  var x0 = xOffset;
  var y0 = yOffset;
  
// scale the canvas so that max height and range fit in boundaries
  var canvasRatio = canvas.width/canvas.height;
  var yMinScale = 0;  
  if (canvas.height/(yMax - yMin) < canvas.width/(xMax - xMin)) {
    if (xMin == 0) {
      var xMinScale = 0;
      var xMaxScale = yMax * canvasRatio;
    } else {
      var xMinScale = -yMax * canvasRatio;
      var xMaxScale = 0;
    }
    var yMaxScale = yMax;
  } else {
    var xMinScale = xMin;
    var xMaxScale = xMax;
    if (xMin == 0) {
      var yMaxScale =  xMax / canvasRatio;
    } else {
      var yMaxScale = -xMin / canvasRatio;
    }    
  }
  
  context.font = "0.8em Source Sans Pro";
  context.fillStyle = "#FFFFFF";
  context.textAlign = "center";
  for (var i = 0; i < 11; i++) {
    xCoord = i * w / 10 + x0;
    yCoord = h - i * h / 10 + 5 + y0;
    var xNum = Math.round(((xMaxScale-xMinScale)*i/10 + xMinScale)*100)/100;
    var yNum = Math.round(((yMaxScale-yMinScale)*i/10 + yMinScale)*100)/100;
    context.fillText(xNum,xCoord,340);
    context.fillText(yNum,50,yCoord);
  }
}