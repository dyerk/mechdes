"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
  // 1. Render standalone canvas grids for each section
  document.getElementById("2suns-2planets-mount").innerHTML = renderCanvasGrid([
    {
      id: "01",
      title: "Small Sun Input - Large Sun Fixed",
      ariaDiagram: "Animation of two suns, two planet planetary gearset driven by the small sun with large sun fixed"
    },
    {
      id: "02",
      title: "Large Sun Input - Small Sun Fixed",
      ariaDiagram: "Animation of two suns, two planet planetary gearset driven by the large sun with small sun fixed"
    }
  ]);
  
  // 2. Initialize the animations
  // ***** numbers of teeth on gears *****
  var Ns1 = 40;   // number of teeth on sun1
  var Ns2 = 60;   // number of teeth on sun2
  var Np1 = 40;   // number of teeth on planet1
  var Np2 = 20;   // number of teeth on planet2

  var S2P2_Configs = [
    { id: "01", input: 1 },
    { id: "02", input: 2 },
  ];

  S2P2_Configs.forEach(function (cfg){
    var planS2P2 = new PlanS2P2(Ns1, Ns2, Np1, Np2, false, cfg.input);
    planS2P2.showPlots = false;
    planS2P2.calcLengths = false;
    planS2P2.buttonCanvas(cfg.id, 210, 210);
    planS2P2.drawGround();
    planS2P2.draw(0);
  });
}






