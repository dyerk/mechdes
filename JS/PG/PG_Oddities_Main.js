window.onload = init;

// playing indicates whether an animation is currently playing, firstTime tells whether it is the first time a
// button has been clicked.

var playing1 = false, playing2 = false, playing3 = false, playing4 = false, playing5 = false;
var playing6 = false, playing7 = false, playing8 = false, playing9 = false, playing10 = false, playing11 = false;

var firstTime1 = true, firstTime2 = true, firstTime3 = true, firstTime4 = true, firstTime5 = true;
var firstTime6 = true, firstTime7 = true, firstTime8 = true, firstTime9 = true, firstTime10 = true, firstTime11 = true;

/**********************************************************************************************************************/
/* function init()
/* initializes javascript on html page
/**********************************************************************************************************************/
function init() {
// initialize buttons on canvas
  var button1 = document.getElementById("play1");
  var button2 = document.getElementById("play2");
  var button3 = document.getElementById("play3");
  var button4 = document.getElementById("play4");
  var button5 = document.getElementById("play5");
  var button6 = document.getElementById("play6");
  var button7 = document.getElementById("play7");
  var button8 = document.getElementById("play8");
  var button9 = document.getElementById("play9");
  var button10 = document.getElementById("play10");
  var button11 = document.getElementById("play11");

// create shorthand variables for context and canvas
  var canvas1 = document.getElementById('canvas1');
  var canvas2 = document.getElementById('canvas2');
  var canvas3 = document.getElementById('canvas3');
  var canvas4 = document.getElementById('canvas4');
  var canvas5 = document.getElementById('canvas5');
  var canvas6 = document.getElementById('canvas6');
  var canvas7 = document.getElementById('canvas7');
  var canvas8 = document.getElementById('canvas8');
  var canvas9 = document.getElementById('canvas9');
  var canvas10 = document.getElementById('canvas10');
  var canvas11 = document.getElementById('canvas11');

  var context1 = canvas1.getContext('2d');
  var context2 = canvas2.getContext('2d');
  var context3 = canvas3.getContext('2d');
  var context4 = canvas4.getContext('2d');
  var context5 = canvas5.getContext('2d');
  var context6 = canvas6.getContext('2d');
  var context7 = canvas7.getContext('2d');
  var context8 = canvas8.getContext('2d');
  var context9 = canvas9.getContext('2d');
  var context10 = canvas10.getContext('2d');
  var context11 = canvas11.getContext('2d');
  
// Enable play buttons
  button1.disabled = false;
  button2.disabled = false;
  button3.disabled = false;
  button4.disabled = false;
  button5.disabled = false;
  button6.disabled = false;
  button7.disabled = false;
  button8.disabled = false;
  button9.disabled = false;
  button10.disabled = false;
  button11.disabled = false;

// Create shapes for each animation
  shapes_SR2P1 = init_SR2P1( canvas1, context1);
  shapes_SR2P2 = init_SR2P2( canvas2, context2);
  shapes_SR3P1 = init_SR3P1( canvas3, context3);
  shapes_SR3P2 = init_SR3P2( canvas4, context4);
  shapes_SR4P  =  init_SR4P( canvas5, context5);
  shapes_2R2P  =  init_2R2P( canvas6, context6);
  shapes_2R3P  =  init_2R3P( canvas7, context7);
  shapes_2R4P  =  init_2R4P( canvas8, context8);
  shapes_2S3P  =  init_2S3P( canvas9, context9);
  shapes_2S4P  =  init_2S4P(canvas10,context10);
  shapes_2R2S  =  init_2R2S(canvas11,context11); 
  
// Draw static shapes on canvas
  draw_SR2P1( canvas1, context1,shapes_SR2P1,0);
  draw_SR2P2( canvas2, context2,shapes_SR2P2,0);
  draw_SR3P1( canvas3, context3,shapes_SR3P1,0);
  draw_SR3P2( canvas4, context4,shapes_SR3P2,0);
  draw_SR4P(  canvas5, context5, shapes_SR4P,0);
  draw_2R2P(  canvas6, context6, shapes_2R2P,0);
  draw_2R3P(  canvas7, context7, shapes_2R3P,0);
  draw_2R4P(  canvas8, context8, shapes_2R4P,0);
  draw_2S3P(  canvas9, context9, shapes_2S3P,0);
  draw_2S4P( canvas10,context10, shapes_2S4P,0);
  draw_2R2S( canvas11,context11, shapes_2R2S,0);  
  
// Button handling functions
  button1.onclick  = handle_SR2P1( canvas1, context1,shapes_SR2P1);
  button2.onclick  = handle_SR2P2( canvas2, context2,shapes_SR2P2);
  button3.onclick  = handle_SR3P1( canvas3, context3,shapes_SR3P1);
  button4.onclick  = handle_SR3P2( canvas4, context4,shapes_SR3P2);
  button5.onclick  =  handle_SR4P( canvas5, context5,shapes_SR4P);
  button6.onclick  =  handle_2R2P( canvas3, context6,shapes_2R2P);
  button7.onclick  =  handle_2R3P( canvas3, context7,shapes_2R3P);
  button8.onclick  =  handle_2R4P( canvas3, context8,shapes_2R4P);
  button9.onclick  =  handle_2S3P( canvas3, context9,shapes_2S3P);
  button10.onclick =  handle_2S4P(canvas10,context10,shapes_2S4P);
  button11.onclick =  handle_2R2S(canvas11,context11,shapes_2R2S);
}

