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
}






