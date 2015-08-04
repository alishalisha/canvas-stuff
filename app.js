context = document.getElementById('canvas').getContext("2d");

var image = new Image();
image.src = "https://cdn0.vox-cdn.com/thumbor/l-aJK1tYUa6XazJiOStAgLOInEk=/0x0:2222x1667/1200x900/filters:format(webp)/cdn0.vox-cdn.com/uploads/chorus_image/image/46868926/DrielyS-5168.0.0.0.0.jpg";

image.onload = function() {
  imageWidth = this.naturalWidth;
  imageHeight = this.naturalHeight;
}

$('#canvas').mousedown(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
    
  paint = true;
  addClick(mouseX, mouseY);
  redraw();
});

$('#canvas').mousemove(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
  
  if(paint){
    addClick(mouseX, mouseY, true);
    redraw();
  }
});

$('#canvas').mouseup(function(e){
  paint = false;
});

$('#canvas').mouseleave(function(e){
  paint = false;
});

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;
var canvasWidth = context.canvas.width;
var canvasHeight = context.canvas.height;
var containerWidth = document.getElementById("canvas-container").offsetWidth;
var containerHeight = document.getElementById("canvas-container").offsetHeight;

// this will make the canvas element responsive
canvasWidth = containerWidth;
canvasHeight = containerHeight;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
  context.clearRect(0, 0, canvasWidth, canvasHeight); // Clears the canvas
  
  var sx = (imageWidth * .25);
  var sy = (imageHeight * .25);
  var sWidth = (sx * 2);
  var sHeight = (sy * 2);
  var aspectRatio = (imageWidth/imageHeight);
  
  // if the image width is greater than the height, the image width should be the destination width
  
  if (imageWidth > imageHeight) {
    var dy = (canvasHeight - (canvasWidth/aspectRatio))/2;
    var dx = 0;
    context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, canvasWidth, (canvasHeight/aspectRatio));
    // take the remainder of 800/aspect ratio, divide it in half, and set the sy to that.
  } else {
    var dx = (canvasWidth - (canvasHeight*aspectRatio))/2;
    var dy = 0;
    context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, (canvasHeight*aspectRatio), canvasHeight);
  }
  
    document.getElementById("left-crop").onclick = function() {
      var sx = 0;
      var sy = 0;
      context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, (canvasHeight*aspectRatio), canvasHeight);
    }
  
  context.strokeStyle = "yellow";
  context.lineJoin = "round";
  context.lineWidth = 5;
      
  for(var i=0; i < clickX.length; i++) {    
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
  }
}
