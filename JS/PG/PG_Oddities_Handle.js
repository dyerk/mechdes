/**********************************************************************************************************************/
/* function handle_SR2P1 - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_SR2P1(canvas,context,S) {
  return function () {

    playing1 = !playing1;
    if (!playing1) {
      document.getElementById("play1").value = "Play";
    } else {
      document.getElementById("play1").value = "Pause";
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
}}}}

/**********************************************************************************************************************/
/* function handle_SR2P2 - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_SR2P2(canvas,context,S) {
  return function () {

    playing2 = !playing2;
    if (!playing2) {
      document.getElementById("play2").value = "Play";
    } else {
      document.getElementById("play2").value = "Pause";
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
}}}}
/**********************************************************************************************************************/
/* function handle_SR3P1 - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_SR3P1(canvas,context,S) {
  return function () {

    playing3 = !playing3;
    if (!playing3) {
      document.getElementById("play3").value = "Play";
    } else {
      document.getElementById("play3").value = "Pause";
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
}}}}
/**********************************************************************************************************************/
/* function handle_SR3P2 - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_SR3P2(canvas,context,S) {
  return function () {

    playing4 = !playing4;
    if (!playing4) {
      document.getElementById("play4").value = "Play";
    } else {
      document.getElementById("play4").value = "Pause";
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
}}}}
/**********************************************************************************************************************/
/* function handle_SR4P - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_SR4P(canvas,context,S) {
  return function () {

    playing5 = !playing5;
    if (!playing5) {
      document.getElementById("play5").value = "Play";
    } else {
      document.getElementById("play5").value = "Pause";
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
}}}}
/**********************************************************************************************************************/
/* function handle_2R2P - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2R2P(canvas,context,S) {
  return function () {

    playing6 = !playing6;
    if (!playing6) {
      document.getElementById("play6").value = "Play";
    } else {
      document.getElementById("play6").value = "Pause";
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
}}}}
/**********************************************************************************************************************/
/* function handle_2R3P - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2R3P(canvas,context,S) {
  return function () {

    playing7 = !playing7;
    if (!playing7) {
      document.getElementById("play7").value = "Play";
    } else {
      document.getElementById("play7").value = "Pause";
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
}}}}
/**********************************************************************************************************************/
/* function handle_2R4P - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2R4P(canvas,context,S) {
  return function () {

    playing8 = !playing8;
    if (!playing8) {
      document.getElementById("play8").value = "Play";
    } else {
      document.getElementById("play8").value = "Pause";
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
}}}}
/**********************************************************************************************************************/
/* function handle_2S3P - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2S3P(canvas,context,S) {
  return function () {

    playing9 = !playing9;
    if (!playing9) {
      document.getElementById("play9").value = "Play";
    } else {
      document.getElementById("play9").value = "Pause";
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
}}}}
/**********************************************************************************************************************/
/* function handle_2S4P - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2S4P(canvas,context,S) {
  return function () {

    playing10 = !playing10;
    if (!playing10) {
      document.getElementById("play10").value = "Play";
    } else {
      document.getElementById("play10").value = "Pause";
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
}}}}
/**********************************************************************************************************************/
/* function handle_2R2S - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2R2S(canvas,context,S) {
  return function () {

    playing11 = !playing11;
    if (!playing11) {
      document.getElementById("play11").value = "Play";
    } else {
      document.getElementById("play11").value = "Pause";
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
}}}}