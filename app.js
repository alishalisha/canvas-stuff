context = document.getElementById('canvas').getContext("2d");


// temporary...
$('.controls__colors-color').each(function() {
  var color = $(this).attr('data-color');
  $(this).css('background-color', color);
});

// -------------------------------
//
// set up basic canvas dimensions
//
// -------------------------------

var canvasWidth = context.canvas.width;
var canvasHeight = context.canvas.height;
var containerWidth = document.getElementById("canvas-right").offsetWidth;
var leftPanelWidth = document.getElementById("canvas-left").offsetWidth;
var athenaHeight = document.getElementById("hymnal-athena").offsetHeight;
var toolsHeight = document.getElementById("canvas-controls").offsetHeight;

// the container height will be the hymnal athena height minus the tools height
var containerHeight = athenaHeight - toolsHeight;

// default color of brush
context.strokeStyle = "yellow";

// this will make the canvas element responsive
canvasWidth = containerWidth;
canvasHeight = containerHeight;

// -------------------------------
//
// set up basic drawing functions
//
// -------------------------------

$('#canvas').mousedown(function(e){
  if (imageStatus == 'editing') {
    alert('Please upload an image and click "Set Image" first.')
    return
  } else {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    paint = true;
    curColor = document.getElementsByClassName("active-color")[0].dataset.color;
    curSize = document.getElementsByClassName("active-size")[0].dataset.size;
    addClick(mouseX, mouseY);
    redraw();
  }
});

$('#canvas').mousemove(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
  
  if (paint){
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

var image = new Image();
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickColor = new Array();
var clickSize = new Array();
var curSize = "medium";
var curColor = "purple";
var paint;
var imageScale = 1;
var colorTools = document.getElementsByClassName("controls__colors-color");
var clearButton = document.getElementById("canvas-clear");
var embiggen = document.getElementById("embiggen");
var fileDropZone = document.getElementById("canvas-prompt");
var file = null;
var imageStatus = image.dataset.status
imageStatus = 'editing';

function addClick(x, y, dragging)
{
  clickColor.push(curColor);
  clickSize.push(curSize);
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
  context.clearRect(0, 0, canvasWidth, canvasHeight); // Clears the canvas
  $('#canvas-prompt').hide();
  context.lineJoin = "round";
  context.drawImage(image, 0, 0, image.width/imageScale, image.height/imageScale, 0, 0, image.width * imageScale, image.height * imageScale);
      
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
// Clearing the canvas
//
// -------------------------------

function clearCanvas(){
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // empty the points arrays and other arrays
  clickX = [];
  clickY = [];
  clickDrag = [];
  clickColor = [];
  clickSize = [];

  // reset the image
  file = null;
  image = new Image();

  // set image status as editing
  imageStatus = 'editing';

  // re-show the prompt and set image button
  $('#canvas-prompt').show();
  $('.controls__set-image').show();
}

// -------------------------------
//
//  Image uploading
//
// -------------------------------

function uploadFile() {
  var reader  = new FileReader();
  file = document.querySelector('input[type=file]').files[0];

  reader.onloadend = function () {
    image.src = reader.result;
    redraw();
  }

  if (file) {
    reader.readAsDataURL(file);
  } else {
    return
  }
}

document.getElementById('upload').addEventListener('change', uploadFile, false);

// drag and dropping a file
fileDropZone.addEventListener("dragover", FileDragHover, false);
fileDropZone.addEventListener("dragleave", FileDragHover, false);
fileDropZone.addEventListener("drop", FileSelectHandler, false);

// file drag hover
function FileDragHover(e) {
  e.stopPropagation();
  e.preventDefault();
  e.target.className = (e.type == "dragover" ? "hover" : "");
}

// file selection
function FileSelectHandler(e) {
  // cancel event and hover styling
  FileDragHover(e);
  // fetch FileList object
  var files = e.target.files || e.dataTransfer.files;
  // process all File objects
  for (var i = 0, f; f = files[i]; i++) {
    ParseFile(f);
  }
}

function ParseFile(file) {
  // open file from drag & drop and put into canvas
    if (file.type.indexOf("image") == 0) {
      var reader = new FileReader();
      reader.onload = function(e) {
          image.src = e.target.result
          redraw();
      }
      reader.readAsDataURL(file);
    }
}

$('.controls__set-image').on('click', function() {
  $(this).hide();
  imageStatus = 'set';
});

// -------------------------------
//
//
// Event listeners
//
//
// -------------------------------

// There are three states:
// 1. file = 'loaded'
// 2. file = 'set'
// 3. file = null

// 1. if file is loaded, allow scaling

// 2. if file is set, allow drawing

// 3. if file is null, show alert

// -------------------------------
//
//
// Functions
//
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

function scaleImage() {
  $('#image-scale').on('change', function() {
    imageScale = $(this).val();
    redraw();
  })
}

scaleImage();

var c = document.getElementById('canvas');
var dl = document.getElementById('download-image');

dl.addEventListener('click', downloadCanvas, false);

function downloadCanvas() {
  if (file && imageStatus == 'set') {
    var dt = c.toDataURL('image/png');
    this.href = dt;
    this.download = 'drawing.png';
  } else {
    return
  }
};
