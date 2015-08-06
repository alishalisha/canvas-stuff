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
//var containerHeight = document.getElementById("canvas-right").offsetHeight;

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
    console.log('sorry you cannot edit rn. if you are happy with your image, click "set image" up there to start drawing on it.');
    return
  } else {
    console.log('status is SET');
    var mouseX = (e.pageX - this.offsetLeft) - leftPanelWidth;
    var mouseY = e.pageY - this.offsetTop;
    paint = true;
    curColor = document.getElementsByClassName("active-color")[0].dataset.color;
    curSize = document.getElementsByClassName("active-size")[0].dataset.size;
    addClick(mouseX, mouseY);
    redraw();
  }
});

/* the drag and resize function may be in conflict with
the 'mousedown' and dragging function we have for drawing.
therefore....
we need to have two separate things happening:
1) user is ONLY SHOWN the "drop an image here" or "upload an image"
prompt
2) then they can drag and resize/scale the image to how they want.
3) then they can set the status of the image to "done" if they're happy with it.
4) only if the status of the image is "done" can the other canvas mousedown function up there be
called. then the drawing controls will be shown.
5) if the status of the image is switched back to "editing" then the canvas mousedown function for drawing
will be disabled again and the drawing tools will be hidden again (or faded out?). :|
*/

$('#canvas').mousemove(function(e){
  var mouseX = (e.pageX - this.offsetLeft) - leftPanelWidth;
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

var image = new Image();
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
var file = document.querySelector('input[type=file]').files[0];
var imageStatus = image.dataset.status
imageStatus = 'editing';
console.log(imageStatus);

if (imageStatus == 'editing') {
  // don't allow drawing and hide drawing tools
  //$('.controls__colors').hide();
  //$('.controls__brushes').hide();
} else {
  // your image is set, allow drawing on top of it
}

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
  context.drawImage(image,0,0, canvasWidth, canvasHeight);
      
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

  // re show the prompt and set image
  $('#canvas-prompt').show();
  $('.controls__set-image').show();
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

// image uploading
function uploadFile() {
  var reader  = new FileReader();
  file = document.querySelector('input[type=file]').files[0];

  reader.onloadend = function () {
    image.src = reader.result;
    $('#canvas-prompt').hide();
    redraw();
  }

  if (file) {
    reader.readAsDataURL(file);
  } else {
    return
  }
}

document.getElementById('upload').addEventListener('change', uploadFile, false);

$('.controls__set-image').on('click', function() {
  $(this).hide();
  imageStatus = 'set';
})

// todo: image fitting, resizing, dragging and dropping, refactoring, annnnnd other things maybe
