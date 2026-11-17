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
      tabTitle: "Planetary - 40 Tooth Sun Fixed",
      description: "The 40 tooth sun gear is fixed and the train is driven by the 24 tooth sun. The arm moves backwards 1 revolution for every four revolutions of the sun.",
      ariaDiagram: "Animation of fixed sun, two sun and two planets planetary gearset",
      showPlots: false,
      isActive: true,
    },
    {
     id: "02",
      title: "Planetary Gearset",
      tabTitle: "Planetary - 24 Tooth Sun Fixed",
      description: "The 24 tooth sun is fixed and the train is driven by the 40 tooth sun. The arm moves forwards 1 1/4 revolutions for every revolution of the sun.",
      ariaDiagram: "Animation of fixed sun, two sun and two planets planetary gearset",
      showPlots: false,
      isActive: true,
    },
  ];

  // 2. Render HTML templates into DOM
  mount.innerHTML = renderMechanismSet(sectionConfigs);

  // 3. Instantiate and initialize each mechanism
	// ***** numbers of teeth on gears *****
  var Ns1 = 24;   // number of teeth on sun1
  var Ns2 = 40;   // number of teeth on sun2
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 8;    // number of teeth on planet2

	var lego1 = new PlanS2P2(Ns1, Ns2, Np1, Np2, false);  // create Grashof type 1 linkage
  lego1.showPlots = false;
	lego1.buttonCanvas("01", 210, 210);
  lego1.drawGround();
  lego1.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns1 = 40;   // number of teeth on sun1
  var Ns2 = 24;   // number of teeth on sun2
  var Np1 = 8;    // number of teeth on planet1
  var Np2 = 24;   // number of teeth on planet2

	
	var lego2 = new PlanS2P2(Ns1, Ns2, Np1, Np2, false);  // create Grashof type 1 linkage
  lego2.showPlots = false;
	lego2.buttonCanvas("02", 210, 210);
  lego2.drawGround();
  lego2.draw(0);

  // Start other page scripts
	Select_Animation([lego1, lego2]);
}






