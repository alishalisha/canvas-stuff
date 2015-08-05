context = document.getElementById('canvas').getContext("2d");

// -------------------------------
//
// set up basic canvas dimensions
//
// -------------------------------

var canvasWidth = context.canvas.width;
var canvasHeight = context.canvas.height;
var containerWidth = document.getElementById("canvas-container").offsetWidth;
var containerHeight = document.getElementById("canvas-container").offsetHeight;

// this will make the canvas element responsive
canvasWidth = containerWidth;
canvasHeight = containerHeight;

var image = new Image();
image.src = "https://cdn0.vox-cdn.com/thumbor/l-aJK1tYUa6XazJiOStAgLOInEk=/0x0:2222x1667/1200x900/filters:format(webp)/cdn0.vox-cdn.com/uploads/chorus_image/image/46868926/DrielyS-5168.0.0.0.0.jpg";

image.onload = function() {
  imageWidth = this.naturalWidth;
  imageHeight = this.naturalHeight;
}

// -------------------------------
//
// set up basic drawing functions
//
// -------------------------------

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

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
  context.clearRect(0, 0, canvasWidth, canvasHeight); // Clears the canvas
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

// -------------------------------
//
// tools functions
//
// -------------------------------

function clearCanvas(){
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // empty the points arrays
  clickX = [];
  clickY = [];
  clickDrag = [];

  console.log("clearing");
}

// -------------------------------
//
// call tools functions
//
// -------------------------------

var clearButton = document.getElementById("canvas-clear");
clearButton.onclick = function() { clearCanvas(); }
