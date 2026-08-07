// Animate Planetary Gearset
window.onload = init;

// playing indicates whether an animation is currently playing, firstTime tells whether it is the first time a
// button has been clicked.

var playing1 = false, playing2 = false, playing3 = false, playing4 = false, playing5 = false;
var playing6 = false, playing7 = false;

var firstTime1 = true, firstTime2 = true, firstTime3 = true, firstTime4 = true, firstTime5 = true;
var firstTime6 = true, firstTime7 = true;

/**********************************************************************************************************************/
/* function init()
/* initializes javascript on html page
/**********************************************************************************************************************/
function init() {
// Initialize buttons on canvas
  var playButton1 = document.getElementById("play1");
  var playButton2 = document.getElementById("play2");
  var playButton3 = document.getElementById("play3");
  var playButton4 = document.getElementById("play4");
  var playButton5 = document.getElementById("play5");
  var playButton6 = document.getElementById("play6");
  var playButton7 = document.getElementById("play7");

// Create shorthand variables for canvas and context
  var canvas1 = document.getElementById('canvas1');
  var canvas2 = document.getElementById('canvas2');
  var canvas3 = document.getElementById('canvas3');
  var canvas4 = document.getElementById('canvas4');
  var canvas5 = document.getElementById('canvas5');
  var canvas6 = document.getElementById('canvas6');
  var canvas7 = document.getElementById('canvas7');

  var context1 = canvas1.getContext('2d');
  var context2 = canvas2.getContext('2d');
  var context3 = canvas3.getContext('2d');
  var context4 = canvas4.getContext('2d');
  var context5 = canvas5.getContext('2d');
  var context6 = canvas6.getContext('2d');
  var context7 = canvas7.getContext('2d');
  
// initialize slider for final animation
  context7.font = "1em Source Sans Pro";
  context7.textAlign = "center";
  init_Slider(canvas7,context7);
  canvas7.x0 = 425;
  canvas7.y0 = 160;
  for (var i = 0; i < canvas7.slider.length; i++) {
    canvas7.slider[i].draw(context7);
  }
  canvas7.context = context7;

// Enable play buttons
  playButton1.disabled = false;
  playButton2.disabled = false;
  playButton3.disabled = false;
  playButton4.disabled = false;
  playButton5.disabled = false;
  playButton6.disabled = false;
  playButton7.disabled = false;

// Create shapes for each animation
  shapes_CFSI = init_CFSI( canvas1, context1);
  shapes_CFRI = init_CFRI( canvas2, context2);
  shapes_SFCI = init_SFCI( canvas3, context3);
  shapes_SFRI = init_SFRI( canvas4, context4);
  shapes_RFSI = init_RFSI( canvas5, context5);
  shapes_RFCI = init_RFCI( canvas6, context6);
  shapes_two_input = init_two_input(canvas7,context7);

// Draw static shapes on canvas
  draw_CFSI( canvas1, context1,shapes_CFSI,0);
  draw_CFRI( canvas2, context2,shapes_CFRI,0);
  draw_SFCI( canvas3, context3,shapes_SFCI,0);
  draw_SFRI( canvas4, context4,shapes_SFRI,0);
  draw_RFSI( canvas5, context5,shapes_RFSI,0);
  draw_RFCI( canvas6, context6,shapes_RFCI,0);
  draw_two_input(canvas7,context7,shapes_two_input,0);

// Button handling functions
  playButton1.onclick = handle_CFSI(canvas1,context1,shapes_CFSI);
  playButton2.onclick = handle_CFRI(canvas2,context2,shapes_CFRI);
  playButton3.onclick = handle_SFCI(canvas3,context3,shapes_SFCI);
  playButton4.onclick = handle_SFRI(canvas4,context4,shapes_SFRI);
  playButton5.onclick = handle_RFSI(canvas5,context5,shapes_RFSI);
  playButton6.onclick = handle_RFCI(canvas6,context6,shapes_RFCI);
  playButton7.onclick = handle_two_input(canvas7,context7,shapes_two_input);
}
/**********************************************************************************************************************/
/* function init_Slider
/* draws the sliders on the canvas
/**********************************************************************************************************************/
function init_Slider(canvas,context) {
 
  canvas.slider = new Array(2);  // create new slider(s)
  canvas.slider[0] = new slider(canvas,context,10,100,true,true,"Sun");
  canvas.slider[1] = new slider(canvas,context,10,100,true,true,"Ring");
  canvas.slider[2] = new slider(canvas,context,10,100,false,true,"Carrier");
  
  for (var i = 0; i < canvas.slider.length; i++) {
    canvas.slider[i].x = 60 + 70*i;
    canvas.slider[i].y = 110;
    canvas.slider[i].knob.x = canvas.slider[i].x;
    canvas.slider[i].knob.y = canvas.slider[i].y;
    canvas.slider[i].min = -20;
    canvas.slider[i].max =  20;
    canvas.slider[i].value = 5;
    canvas.slider[i].pushButton.x = canvas.slider[i].x;
    canvas.slider[i].pushButton.y = 270;
  }
  context.fillStyle = "#F0F0F0";
  context.fillRect(10, 10, 240, 230);
  context.fillRect(10, 250, 240, 60);
  context.fillStyle = "#000000";
  context.fillText("Drag the sliders to change speed",130,220);
  context.fillText("Click a button to choose output",130,300);
  
  canvas.mouse = captureMouse(canvas);  
  canvas.addEventListener("mousedown", mousedown, false);
  canvas.addEventListener("click", pushButtonClick, false);
}
