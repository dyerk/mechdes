/**********************************************************************************************************************/
/* function handle_CFSI - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_CFSI(canvas,context,S) {
  return function () {

    playing1 = !playing1;
    togglePlayButtonUI("play1", playing1, "Carrier Fixed Sun Input animation");
    
    if (firstTime1) {
        firstTime1 = false;
        var i = 0;
        function drawFrame () {
          if (playing1 == false) { 
            return;
          } else {
            i += 2;
            draw_CFSI(canvas,context,S,i)
          }
        }
        var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_CFRI - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_CFRI(canvas,context,S) {
  return function () {

    playing2 = !playing2;
    togglePlayButtonUI("play2", playing2, "Carrier Fixed Sun Input animation");

    if (firstTime2) {
      firstTime2 = false;
      var i = 0;
      function drawFrame () {
        if (playing2 == false) { 
          return;
        } else {
          i += 2;
          draw_CFRI(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_SFCI - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_SFCI(canvas,context,S) {
  return function () {

    playing3 = !playing3;
    togglePlayButtonUI("play3", playing3, "Carrier Fixed Sun Input animation");

    if (firstTime3) {
      firstTime3 = false;
      var i = 0;
      function drawFrame () {
        if (playing3 == false) { 
          return;
        } else {
          i += 2;
          draw_SFCI(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_SFRI - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_SFRI(canvas,context,S) {
  return function () {

    playing4 = !playing4;
    togglePlayButtonUI("play4", playing4, "Carrier Fixed Sun Input animation");

    if (firstTime4) {
      firstTime4 = false;
      var i = 0;
      function drawFrame () {
        if (playing4 == false) { 
          return;
        } else {
          i += 2;
          draw_SFRI(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_RFSI - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_RFSI(canvas,context,S) {
  return function () {

    playing5 = !playing5;
    togglePlayButtonUI("play2", playing2, "Carrier Fixed Sun Input animation");

    if (firstTime5) {
      firstTime5 = false;
      var i = 0;
      function drawFrame () {
        if (playing5 == false) { 
          return;
        } else {
          i += 2;
          draw_RFSI(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_RFCI - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_RFCI(canvas,context,S) {
  return function () {

    playing6 = !playing6;
    togglePlayButtonUI("play6", playing6, "Carrier Fixed Sun Input animation");

    if (firstTime6) {
      firstTime6 = false;
      var i = 0;
      function drawFrame () {
        if (playing6 == false) { 
          return;
        } else {
          i += 2;
          draw_RFCI(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_two_input - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_two_input(canvas,context,S) {
  return function () {

    playing7 = !playing7;
    togglePlayButtonUI("play7", playing7, "Carrier Fixed Sun Input animation");

    if (firstTime7) {
      firstTime7 = false;
      var i = 0;
      function drawFrame () {
        if (!playing7) {
          return;
        } else {
          i += 2;
          draw_two_input(canvas,context,S,i);
        }
      }
      var handle = window.setInterval(drawFrame, 500/60);
}}}
