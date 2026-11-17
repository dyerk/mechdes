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
      tabTitle: "Traditional Planetary<br>(3 Lobe Balance)",
      description: "The traditional sun-ring-planet gearset with three balancing lobes.",
      ariaDiagram: "Animation of three lobed traditional planetary gearset",
      showPlots: false,
      isActive: true,
    },
    {
      id: "02",
      title: "Planetary Gearset",
      tabTitle: "2 Suns & 2 Planets<br>(3 Lobe Balance)",
      description: "The two-suns, two-planets gearset with three balancing lobes.",
      ariaDiagram: "Animation of three lobed two-suns, two-planets planetary gearset",
      showPlots: false,
    },
  ];

  // 2. Render HTML templates into DOM
  mount.innerHTML = renderMechanismSet(sectionConfigs);

  // 3. Instantiate and initialize each mechanism
	// ***** numbers of teeth on gears *****
  var Ns = 32;   // number of teeth on sun
  var Np = 16;   // number of teeth on planet

  var planSrp = new PlanSRP(Ns, Np, true);  // create Grashof type 1 linkage
  planSrp.showPlots = false;
	planSrp.buttonCanvas("01", 210, 210);
  planSrp.drawGround();
  planSrp.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns1 = 24;   // number of teeth on sun1
  var Ns2 = 32;   // number of teeth on sun2
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2

  var planS2P2 = new PlanS2P2(Ns1, Ns2, Np1, Np2, true);  // create Grashof type 1 linkage
  planS2P2.showPlots = false;
	planS2P2.buttonCanvas("02", 210, 210);
  planS2P2.drawGround();
  planS2P2.draw(0);

  // Start other page scripts
	Select_Animation([planSrp, planS2P2]);
}






