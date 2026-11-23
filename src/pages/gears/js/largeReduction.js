"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
  var mount = document.getElementById("mechanisms-mount");

  // 1. Define template metadata for all 6 mechanisms
  var sectionConfigs = [
    {
      id: "01",
      title: "Planetary Gearset",
      tabTitle: "2 Suns & 2 Planets",
      description: "A very large reduction with two suns and two planets. The input is the arm and the output is the blue sun, which you can see rotating if you let the animation run long enough.",
      ariaDiagram: "Animation of large readuction two suns and two planets planetary gearset",
      showPlots: false,
      isActive: true,
    },
    {
      id: "02",
      title: "Planetary Gearset",
      tabTitle: "2 Rings & 2 Planets",
      description: "A very large reduction with two rings and two planets. The input is the arm and the output is the blue ring gear.",
      ariaDiagram: "Animation of large reduction two rings and two planets planetary gearset",
      showPlots: false,
    },
  ];

  // 2. Render HTML templates into DOM
  mount.innerHTML = renderMechanismSet(sectionConfigs);

  // 3. Instantiate and initialize each mechanism
	// ***** numbers of teeth on gears *****
  var Ns1 = 28;  // number of teeth on first sun
  var Ns2 = 32*13/15;  // number of teeth on second sun
  var Np1 = 24;  // number of teeth on planet1
  var Np2 = 28*13/15;  // number of teeth on planet2

  var planRed1 = new PlanS2P2(Ns1, Ns2, Np1, Np2, false);
	planRed1.showPlots = false;
	planRed1.deltaT = 0.05;
  planRed1.buttonCanvas("01", 250, 200, 1.5);
  planRed1.drawGround();
  planRed1.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns1 = 70*1.2;    // number of teeth on sun
  var Ns2 = 60*1.2;   // number of teeth on ring
  var Nr1 = 80*1.2;   // number of teeth on planet1
  var Nr2 = 70*1.2;   // number of teeth on planet2

  var planRed2 = new PlanR2P2(Nr1, Nr2, Ns1, Ns2);
  planRed2.showPlots = false;
	planRed2.deltaT = 0.05;
	planRed2.buttonCanvas("02", 250, 200);
  planRed2.drawGround();
  planRed2.draw(0);

  // Start other page scripts
	Select_Animation([planRed1, planRed2]);
}






