/**********************************************************************************************************************/
/* function handle_SR2P1 - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_SR2P1(canvas,context,S) {
  return function () {

    playing1 = !playing1;
    togglePlayButtonUI("play1", playing1, "Type 1 Sun, Ring, Two Planets animation");

    if (firstTime1) {
      firstTime1 = false;
      var i = 0;
      function drawFrame () {
        if (playing1 == false) { 
          return;
        } else {
          i += 2;
          draw_SR2P1(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}

/**********************************************************************************************************************/
/* function handle_SR2P2 - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_SR2P2(canvas,context,S) {
  return function () {

    playing2 = !playing2;
    togglePlayButtonUI("play2", playing2, "Type 2 Sun, Ring, Two Planets animation");

    if (firstTime2) {
      firstTime2 = false;
      var i = 0;
      function drawFrame () {
        if (playing2 == false) {
          return;
        } else {
          i += 2;
          draw_SR2P2(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_SR3P1 - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_SR3P1(canvas,context,S) {
  return function () {

    playing3 = !playing3;
    togglePlayButtonUI("play3", playing3, "Type 1 Sun, Ring, Three Planets Animation");

    if (firstTime3) {
      firstTime3 = false;
      var i = 0;
      function drawFrame () {
        if (playing3 == false) { 
          return;
        } else {
          i += 2;
          draw_SR3P1(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_SR3P2 - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_SR3P2(canvas,context,S) {
  return function () {

    playing4 = !playing4;
    togglePlayButtonUI("play4", playing4, "Type 2 Sun, Ring, Three Planets Animation");

    if (firstTime4) {
      firstTime4 = false;
      var i = 0;
      function drawFrame () {
        if (playing4 == false) { 
          return;
        } else {
          i += 2;
          draw_SR3P2(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_SR4P - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_SR4P(canvas,context,S) {
  return function () {

    playing5 = !playing5;
    togglePlayButtonUI("play5", playing5, "Sun, Ring, Four Planets Animation");

    if (firstTime5) {
      firstTime5 = false;
      var i = 0;
      function drawFrame () {
        if (playing5 == false) { 
          return;
        } else {
          i += 2;
          draw_SR4P(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_2R2P - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2R2P(canvas,context,S) {
  return function () {

    playing6 = !playing6;
    togglePlayButtonUI("play6", playing6, "Two Rings, Two Planets Animation");

    if (firstTime6) {
      firstTime6 = false;
      var i = 0;
      function drawFrame () {
        if (playing6 == false) { 
          return;
        } else {
          i += 0.5;
          draw_2R2P(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_2R3P - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2R3P(canvas,context,S) {
  return function () {

    playing7 = !playing7;
    togglePlayButtonUI("play7", playing7, "Two Rings, Three Planets Animation");

    if (firstTime7) {
      firstTime7 = false;
      var i = 0;
      function drawFrame () {
        if (playing7 == false) { 
          return;
        } else {
          i += 2;
          draw_2R3P(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_2R4P - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2R4P(canvas,context,S) {
  return function () {

    playing8 = !playing8;
    togglePlayButtonUI("play8", playing8, "Two Rings, Four Planets Animation");

    if (firstTime8) {
      firstTime8 = false;
      var i = 0;
      function drawFrame () {
        if (playing8 == false) { 
          return;
        } else {
          i += 2;
          draw_2R4P(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_2S3P - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2S3P(canvas,context,S) {
  return function () {

    playing9 = !playing9;
    togglePlayButtonUI("play9", playing9, "Two Suns, Three Planets Animation");

    if (firstTime9) {
      firstTime9 = false;
      var i = 0;
      function drawFrame () {
        if (playing9 == false) { 
          return;
        } else {
          i += 2;
          draw_2S3P(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_2S4P - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2S4P(canvas,context,S) {
  return function () {

    playing10 = !playing10;
    togglePlayButtonUI("play10", playing10, "Two Suns, Four Planets Animation");

    if (firstTime10) {
      firstTime10 = false;
      var i = 0;
      function drawFrame () {
        if (playing10 == false) { 
          return;
        } else {
          i += 2;
          draw_2S4P(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_2R2S - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2R2S(canvas,context,S) {
  return function () {

    playing11 = !playing11;
      togglePlayButtonUI("play11", playing11, "Type 1 Sun, Ring, Two Planets animation");

    if (firstTime11) {
      firstTime11 = false;
      var i = 0;
      function drawFrame () {
        if (playing11 == false) { 
          return;
        } else {
          i += 0.5;
          draw_2R2S(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}