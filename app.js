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

// default color of brush
context.strokeStyle = "yellow";

// this will make the canvas element responsive
canvasWidth = containerWidth;
canvasHeight = containerHeight;

var image = new Image();
image.src = "https://cdn0.vox-cdn.com/thumbor/l-aJK1tYUa6XazJiOStAgLOInEk=/0x0:2222x1667/1200x900/filters:format(webp)/cdn0.vox-cdn.com/uploads/chorus_image/image/46868926/DrielyS-5168.0.0.0.0.jpg";

// -------------------------------
//
// set up basic drawing functions
//
// -------------------------------

$('#canvas').mousedown(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
  paint = true;
  curColor = document.getElementsByClassName("active-color")[0].dataset.color;
  curSize = document.getElementsByClassName("active-size")[0].dataset.size;
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
var clickColor = new Array();
var clickSize = new Array();
var curSize = "medium";
var curColor = "purple";
var paint;
var colorTools = document.getElementsByClassName("controls__colors-color");
var clearButton = document.getElementById("canvas-clear");

function addClick(x, y, dragging)
{
  // update current color
  //var activeColor = document.getElementsByClassName("active-color")[0].dataset.color;
  //curColor = activeColor;

  //var activeSize = document.getElementsByClassName("active-size")[0].dataset.size;
  //curSize = activeSize;

  clickColor.push(curColor);
  clickSize.push(curSize);
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
  context.clearRect(0, 0, canvasWidth, canvasHeight); // Clears the canvas
  context.lineJoin = "round";
      
  for(var i=0; i < clickX.length; i++) { 
    context.strokeStyle = clickColor[i];
    context.lineWidth = clickSize[i];   
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

function resizeImage(){

}

// -------------------------------
//
// call tools functions
//
// -------------------------------
clearButton.onclick = clearCanvas;

$('.controls__colors-color').on('click', function() {
  $('.controls__colors-color').removeClass('active-color');
  $(this).addClass('active-color');
});

$('.controls__brushes-size').on('click', function() {
  $('.controls__brushes-size').removeClass('active-size');
  $(this).addClass('active-size');
});

$('#upload').on('change', function() {
  console.log($(this).attr('src'));
})

// image uploading
function previewFile() {
  var preview = document.querySelector('img');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.onloadend = function () {
    var image = new Image();
    image.src = reader.result;
    console.log(image.src);
    context.drawImage(image,0,0);
  }

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }
}

document.getElementById('upload').addEventListener('change', previewFile, false);
