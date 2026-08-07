/**********************************************************************************************************************/
/* function handle_treb - launches the trebuchet
/**********************************************************************************************************************/
function handle_launch() {
  var i = 0;                  // this is the time step variable
  function drawFrame () {
    i += 1;                   // increment by one unit in time
    solve_treb(i);            // draw the trebuchet in its current position
         
    if (iLaunched == true) {  // has the projectile been launched?
      clearInterval(handle);  // stop animation
        
      document.getElementById("launch").disabled = true;         // but can press Reset   
      document.getElementById("reset").disabled = false;         // but can press Reset 
      document.getElementById("defaults").disabled = false;         // but can press Reset   
      document.getElementById("play").disabled = true;         // but can press Reset  
      document.getElementById("stop").disabled = true;         // can't press Launch now
      document.getElementById("units").disabled = false;         // but can press Reset        
      treb.launch();      // calculate the results of the trebuchet launch
      plot_projectile();  // plot trajectory of projectile on other canvas
    }

  }
  var handle = setInterval(drawFrame, treb.deltaT);
}
/**********************************************************************************************************************/
/* function handle_reset - returns trebuchet to original position
/**********************************************************************************************************************/
function handle_reset() {
  iConstraint = 0;              // reset constraint condition to default
  iLaunched = false;            // reset to pre-launch condition
  clear_canvas();               // clear canvases on screen
  treb.update();                // update trebuchet dimensions, and draw fixed parts
  treb.mass();                  // update mass properties of trebuchet
  treb.draw();                  // draw the moving parts of the treb in initial configuration
  
  document.getElementById("launch").disabled = false;         // but can press Reset   
  document.getElementById("reset").disabled = true;         // but can press Reset 
  document.getElementById("defaults").disabled = false;         // but can press Reset   
  document.getElementById("play").disabled = false;         // but can press Reset  
  document.getElementById("stop").disabled = true;         // can't press Launch now
  document.getElementById("units").disabled = false;         // but can press Reset
}
/**********************************************************************************************************************/
/* function handle_defaults - returns trebuchet to default dimensions
/**********************************************************************************************************************/
function handle_defaults() {
  clear_canvas();               // clear canvases on screen
  init();                       // re-initialize to defaults
}
/**********************************************************************************************************************/
/* function handle_play - makes the trebuchet animation play without launching
/**********************************************************************************************************************/
function handle_play() {
  iPlay = true;
  document.getElementById("launch").disabled = true;         // but can press Reset   
  document.getElementById("reset").disabled = true;         // but can press Reset 
  document.getElementById("defaults").disabled = true;         // but can press Reset   
  document.getElementById("play").disabled = true;         // but can press Reset  
  document.getElementById("stop").disabled = false;         // can't press Launch now
  document.getElementById("units").disabled = true;         // but can press Reset 
  var i = 0;                  // this is the time step variable
  function drawFrame () {
    i += 1;                   // increment by one unit in time
    solve_treb(i);            // draw the trebuchet in its current position
    if (iPlay == false) {  // has the stop button been pressed?
      clearInterval(handle);  // stop animation
    }
  }
  var handle = setInterval(drawFrame, treb.deltaT);
}
/**********************************************************************************************************************/
/* function handle_stop - stops the trebuchet animation
/**********************************************************************************************************************/
function handle_stop() {
  iPlay = false;
  document.getElementById("launch").disabled = true;         // but can press Reset   
  document.getElementById("reset").disabled = false;         // but can press Reset 
  document.getElementById("defaults").disabled = false;         // but can press Reset   
  document.getElementById("play").disabled = false;         // but can press Reset  
  document.getElementById("stop").disabled = true;         // can't press Launch now
  document.getElementById("units").disabled = false;         // but can press Reset
}
/**********************************************************************************************************************/
/* function handle_units - launches the unit converter window
/**********************************************************************************************************************/
function handle_units() {
  var unitWindow = window.open("TB_Unit_Converter.html","","toolbars=no,scrollbars=no,menubar=yes,titlebar=no,\
                                status=no,height=450,width=600,top=50,left=50");
}



/**********************************************************************************************************************/
/* function clear_canvas - clears all canvases on screen
/**********************************************************************************************************************/
function clear_canvas() {
  treb_ctx1.clearRect(0,0,treb_can1.width,treb_can1.height);  // clear trebuchet canvas for drawing
  treb_ctx2.clearRect(0,0,treb_can2.width,treb_can2.height);  // clear trebuchet canvas for drawing
  treb_ctx3.clearRect(0,0,treb_can3.width,treb_can3.height);  // clear trebuchet canvas for drawing
  treb_ctx4.clearRect(0,0,treb_can4.width,treb_can4.height);  // clear trebuchet canvas for drawing
  
  grid_ctx.clearRect(0,0,grid_can.width,grid_can.height);  // clear grid and scale on projectile window
  proj_ctx.clearRect(0,0,proj_can.width,proj_can.height);  // clear projectile window
  plot_grid(grid_can,grid_ctx,80,20,100,70);               // redraw grid on projectile window
}