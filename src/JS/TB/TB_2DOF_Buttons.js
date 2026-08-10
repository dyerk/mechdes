/**********************************************************************************************************************/
/* function handle_treb - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_treb() {
  return function () {
    var t = 0;
    
    function drawFrame () {
      t += S.deltaT;
      draw_treb(t);
      if ((-S.sling.psi - Math.PI + S.arm.theta) >= S.arm.beta) {
        clearInterval(handle);
        launchButton.disabled = true;
        resetButton.disabled = false;
        results_treb();
      }
    }
    var handle = setInterval(drawFrame, S.deltaT);
  }
}
/**********************************************************************************************************************/
/* function handle_reset - returns trebuchet to original position
/**********************************************************************************************************************/
function handle_reset() {
  return function () {
    reset_treb();
  }
}
/**********************************************************************************************************************/
/* function reset_treb - returns trebuchet to original position
/**********************************************************************************************************************/
function reset_treb() {
  S.arm.thetadot = 0;
  S.sling.psi = 0;
  S.sling.psidot = 0;
  draw_treb(0);
  clear_scale(grid_can,grid_ctx);
  plot_grid(grid_can,grid_ctx);
  launchButton.disabled = false;
  resetButton.disabled = true;
}
/**********************************************************************************************************************/
/* function display_form - writes the updated values to the html form.
/**********************************************************************************************************************/
function display_form() {
  update_treb();
  document.getElementById("L1").value = Math.round(S.arm.L1*100)/100;
  document.getElementById("L2").value = Math.round(S.arm.L2*100)/100;
  document.getElementById("L3").value = Math.round(S.sling.L3*100)/100;
  document.getElementById("w").value  = Math.round(S.arm.w*1000)/1000;
  document.getElementById("t").value  = Math.round(S.arm.t*1000)/1000;
  document.getElementById("H").value  = Math.round(S.base.H*1000)/1000;
  document.getElementById("m1").value = Math.round(S.cwt.mass*100)/100;
  document.getElementById("m2").value = Math.round(S.proj.mass*100)/100;
  document.getElementById("rho").value = Math.round(S.arm.rho*100)/100;
}
