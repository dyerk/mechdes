"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
	// Start other page scripts
	navbar();
	Select_Animation();
	
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
}






