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
    alert('Please upload an image and click "Set Image" first.')
    // TODO: Split this into 'please upload an image' and 'please set image' alerts
    return
  } else {
    console.log('status is SET');
    var mouseX = e.pageX - this.offsetLeft;
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
var file = document.querySelector('input[type=file]').files[0];
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
  console.log('redrawing');
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
// file drop
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
})

// Image scaling
// move *all* these event handlers to within a if (file) ?
$('#image-scale').on('change', function() {
  if (file) {
    imageScale = $(this).val();
    redraw();
  } else {
    alert('Please upload and set an image first.')
  }
})

// Downloading the image
// TODO: move this global c elsewhere
var c = document.getElementById('canvas');
var dl = document.getElementById('download-image');

function downloadCanvas() {
    var dt = c.toDataURL('image/png');
    this.href = dt;
    this.download = 'drawing.png';
};

dl.addEventListener('click', downloadCanvas, false);

// todo: image fitting, resizing, dragging and dropping, refactoring, annnnnd other things maybe
