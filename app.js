// -------------------------------
//
//
// Global variables
//
//
// -------------------------------
context = document.getElementById('canvas').getContext("2d");

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

var image = new Image();
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickColor = new Array();
var clickSize = new Array();
var curSize = 5;
var curColor = "#6BDDFF";
var paint;
var imageScale = 1;
var colorTools = document.getElementsByClassName("controls__colors-color");
var clearButton = document.getElementById("canvas-clear");
var embiggen = document.getElementById("embiggen");
var fileDropZone = document.getElementById("canvas-prompt");
var file = null;
var imageStatus = image.dataset.status
imageStatus = null;
var reader  = new FileReader();
var controls = $('#canvas-controls');

// -------------------------------
//
//
// Basic drawing events and functions
//
//
// -------------------------------

$('#canvas').mousedown(function(e){
  if (imageStatus == null ) {
    alert('Please upload an image first.')
  } else if (imageStatus == 'editing') {
    var setImage = $('.controls__set-image a');
    setImage.addClass('bounce');
    setImage.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
      function(e) {
        setImage.removeClass('bounce');
      });
  } else {
    var mouseX = e.pageX - leftPanelWidth - 3;
    var mouseY = e.pageY - this.offsetTop;
    paint = true;
    addClick(mouseX, mouseY);
    redraw();
  }
});

$('#canvas').mousemove(function(e){
  var mouseX = e.pageX - leftPanelWidth - 3;
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
//
// UI Functions
//
//
// -------------------------------

function uploadFile() {
  file = document.querySelector('input[type=file]').files[0];

  reader.onloadend = function () {
    imageStatus = 'editing';
    image.src = reader.result;
    redraw();

    // show set image
    $('.controls__set-image').fadeIn();
  }

  if (file) {
    reader.readAsDataURL(file);
  } else {
    return
  }
}

function FileDragHover(e) {
  e.stopPropagation();
  e.preventDefault();
  e.target.className = (e.type == "dragover" ? "hover" : "");
}

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
          imageStatus = 'editing';
          redraw();

          // show set image
          $('.controls__set-image').fadeIn();
      }
      reader.readAsDataURL(file);
    }
}

function clearCanvas(){
  if (imageStatus != null) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // empty the points arrays and other arrays
    clickX = [];
    clickY = [];
    clickDrag = [];
    clickColor = [];
    clickSize = [];

    // reset the image
    $('#upload').val(null);
    file = null;
    image = new Image();
    imageStatus = null;

    // re-show the prompt and set image button
    $('#canvas-prompt').show();
    $('.controls__set-image').hide();
    $('.controls__scale').show();
  } else {
    alert("Woops, try uploading an image first.");
  }
}

function activateColor() {
  $('.controls__colors-color').removeClass('active-color');
  $(this).addClass('active-color');
}

function changeBrushSize() {
  $('.controls__brushes-size').removeClass('active-size');
  $(this).addClass('active-size');
}

function setImage() {
  //$(this).fadeOut();
  $('.controls__scale').fadeOut();
  $('.controls__set-image').addClass('set');
  imageStatus = 'set';
}

function scaleImage() {
  if (imageStatus == null) {
    alert('Please upload an image first.');
  } else {
    imageScale = $(this).val();
    redraw();
  }
}

function downloadCanvas() {
  var c = document.getElementById('canvas');
  if (imageStatus == 'set') {
    var dt = c.toDataURL('image/png');
    this.href = dt;
    this.download = 'drawing.png';
  } else {
    alert('Upload and draw on an image first.');
  }
};

activateTool = function(tool) {
   var target = $(event.target);
   var activeClass = 'active-'+tool;
   var chosenValue = target[0].dataset[tool];
   if (target.is('a')) {
     target.addClass(activeClass).siblings().removeClass(activeClass);
     updateCurrentTool(chosenValue, tool);
   } else {
     return
   }
}

updateCurrentTool = function(chosenValue, tool) {
  if (tool == 'size') {
    curSize = chosenValue;
  } else if (tool == 'color') {
    curColor = chosenValue;
  } else {
    return
  }
}

// -------------------------------
//
//
// Event listeners
//
//
// -------------------------------

// There are three states:
// 1. imageStatus = 'editing' = Image has been uploaded and ready for resizing.
// 2. imageStatus = 'set' = Image has been set and ready for drawing.
// 3. imageStatus = null = There is no image.

clearButton.onclick = clearCanvas;
// $('.controls__colors-color').on('click', activateColor);
// $('.controls__brushes-size').on('click', changeBrushSize);
$('.controls__set-image a').on('click', setImage);
$('#image-scale').on('change', scaleImage);
$('#download-image').on('click', downloadCanvas);
$('#upload').on('change', uploadFile);
fileDropZone.addEventListener("dragover", FileDragHover, false);
fileDropZone.addEventListener("dragleave", FileDragHover, false);
fileDropZone.addEventListener("drop", FileSelectHandler, false);
controls.click(function(event) {
   activateTool(Object.keys(event.target.dataset));
});


// -------------------------------
//
//
// Init
//
//
// -------------------------------

//$('.controls__set-image').hide();

$('.controls__colors-color').each(function() {
  var color = $(this).attr('data-color');
  $(this).css('background-color', color);
});
