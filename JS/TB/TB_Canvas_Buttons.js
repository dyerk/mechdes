// This script creates the canvases on the document (trebuchet and projectile) as well as the buttons
document.write('\
  <div id="canvasDiv" style="position: relative; width: 900px; height: 300px;">\
  <canvas style="position: absolute; top: 20px; left:0 px; background-color: rgba(255 255 255 1.0); z-index: 1;"\
          class="noBorder" id="treb_canvas1" width="400" height="300"></canvas>\
  <canvas style="position: absolute; top: 20px; left: 0 px; background: none; z-index: 2;"\
          class="noBorder" id="treb_canvas2" width="400" height="300"></canvas>\
  <canvas style="position: absolute; top: 20px; left: 0 px; background: none; z-index: 3;"\
          class="noBorder" id="treb_canvas3" width="400" height="300"></canvas>\
  <canvas style="position: absolute; top: 20px; left: 0 px; background: none; z-index: 4;"\
          class="noBorder" id="treb_canvas4" width="400" height="300"></canvas>\
  <canvas style="position: absolute; top: 20px; right: 20px; z-index: 20; background: none;"\
          class="noBorder" id="proj_canvas" width="400" height="300"></canvas>\
  <canvas style="position: absolute; top: 0px; right: 0px; bottom: 150px; z-index: 1; background: none;"\
          class="noBorder" id="grid_canvas" width="500" height="370"></canvas>\
  <p style="clear:both"></p>\
  </div>\
  <br><br><br>\
  <input class="button" type="button" id="launch" value="Launch">\
  <input class="button" type="button" id="reset" value="Reset">\
  <input class="button" type="button" id="defaults" value="Defaults">\
  <input class="button" type="button" id="play" value="Play">\
  <input class="button" type="button" id="stop" value="Stop">\
  <input class="button" type="button" id="units" value="Unit Converter">\
  <br><br>\
  <h2>Instructions</h2>\
  <p>Enter your values for the lengths and masses in the spaces below.  When you have finished, click "launch" to see \
  the trebuchet in action.  The figure on the right side shows the trajectory and range of the projectile. Hit "reset" \
  when you are ready to change parameters and try again.  Hit "defaults" to return to the original trebuchet.</p>\
');

// Button handling functions
document.getElementById("launch").onclick = handle_launch;
document.getElementById("reset").onclick  = handle_reset;
document.getElementById("defaults").onclick  = handle_defaults;
document.getElementById("play").onclick  = handle_play;
document.getElementById("stop").onclick  = handle_stop;   
document.getElementById("units").onclick  = handle_units;
 
document.getElementById("launch").disabled = false;    // Launch button is enabled
document.getElementById("reset").disabled  = true;     // Reset button is disabled
document.getElementById("defaults").disabled  = false; // Defaults button is enabled
document.getElementById("play").disabled  = false;     // Play button is enabled
document.getElementById("stop").disabled  = true;      // Stop button is disabled
document.getElementById("units").disabled  = false;    // Unit conversion button is enabled 

// Create shorthand variables for canvas and context - these are global variables
window.treb_can1 = document.getElementById('treb_canvas1');  // static background (with ground)
window.treb_can2 = document.getElementById('treb_canvas2');  // middle ground (static)
window.treb_can3 = document.getElementById('treb_canvas3');  // static middle ground (with base)
window.treb_can4 = document.getElementById('treb_canvas4');  // foreground
window.grid_can = document.getElementById('grid_canvas');  
window.proj_can = document.getElementById('proj_canvas');
window.treb_ctx1 = treb_can1.getContext('2d');
window.treb_ctx2 = treb_can2.getContext('2d');
window.treb_ctx3 = treb_can3.getContext('2d');
window.treb_ctx4 = treb_can4.getContext('2d');
window.grid_ctx = grid_can.getContext('2d');
window.proj_ctx = proj_can.getContext('2d');

// text fonts for animations
proj_ctx.font = "1em Source Sans Pro";
proj_ctx.textAlign = "right";