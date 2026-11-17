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
      tabTitle: "2 Rings & 2 Planets",
      description: "Two rings and two planets.",
      ariaDiagram: "Animation of two rings and two planets planetary gearset",
      showPlots: false,
      isActive: true,
    },
    {
      id: "02",
      title: "Planetary Gearset",
      tabTitle: "2 Rings & 3 Planets",
      description: "Two rings and three planets.",
      ariaDiagram: "Animation of two rings and three planets planetary gearset",
      showPlots: false,
    },
    {
      id: "03",
      title: "Planetary Gearset",
      tabTitle: "2 Rings & 4 Planets",
      description: "Two rings and four planets.",
      ariaDiagram: "Animation of two rings and four planets planetary gearset",
      showPlots: false,
    },
  ];

  // 2. Render HTML templates into DOM
  mount.innerHTML = renderMechanismSet(sectionConfigs);

  // 3. Instantiate and initialize each mechanism
	// ***** numbers of teeth on gears *****
  var Nr1 = 72;   // number of teeth on sun1
  var Nr2 = 112;  // number of teeth on sun2
  var Np1 = 16;   // number of teeth on planet1
  var Np2 = 56;   // number of teeth on planet2

  var planR2P2 = new PlanR2P2(Nr1, Nr2, Np1, Np2);
  planR2P2.showPlots = false;
	planR2P2.buttonCanvas("01", 210, 200);
  planR2P2.drawGround();
  planR2P2.draw(0);

	// ***** numbers of teeth on gears *****
  var Nr1 = 72;   // number of teeth on sun1
  var Nr2 = 112;  // number of teeth on sun2
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2
  var Np3 = 24;   // number of teeth on planet3

  var planR2P3 = new PlanR2P3(Nr1, Nr2, Np1, Np2, Np3);
  planR2P3.showPlots = false;
	planR2P3.buttonCanvas("02", 210, 200);
  planR2P3.drawGround();
  planR2P3.draw(0);

	// ***** numbers of teeth on gears *****
  var Nr1 = 48;   // number of teeth on sun1
  var Nr2 = 112;  // number of teeth on sun2
  var Np1 = 16;   // number of teeth on planet1
  var Np2 = 24;   // number of teeth on planet2
  var Np3 = 24;   // number of teeth on planet3
  var Np4 = 32;   // number of teeth on planet4

  var planR2P4 = new PlanR2P4(Nr1, Nr2, Np1, Np2, Np3, Np4);
  planR2P4.showPlots = false;
	planR2P4.buttonCanvas("03", 210, 200);
  planR2P4.drawGround();
  planR2P4.draw(0);
	
	// Start other page scripts
	Select_Animation([planR2P2, planR2P3, planR2P4]);
}






