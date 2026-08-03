"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
		// ***** numbers of teeth on gears *****
  var Ns1 = 24;   // number of teeth on sun1
  var Ns2 = 32;   // number of teeth on sun2
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2

  var planS2P2 = new PlanS2P2(Ns1, Ns2, Np1, Np2, false);  // create Grashof type 1 linkage
  planS2P2.showPlots = false;
	planS2P2.buttonCanvas("07", 210, 210);
  planS2P2.drawGround();
  planS2P2.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns1 = 16;   // number of teeth on sun1
  var Ns2 = 48;   // number of teeth on sun2
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2
  var Np3 = 32;   // number of teeth on planet3

  var planS2P3 = new PlanS2P3(Ns1, Ns2, Np1, Np2, Np3);  // create Grashof type 1 linkage
  planS2P3.showPlots = false;
	planS2P3.buttonCanvas("08", 210, 210);
  planS2P3.drawGround();
  planS2P3.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns1 = 16;   // number of teeth on sun1
  var Ns2 = 48;   // number of teeth on sun2
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2
  var Np3 = 16;   // number of teeth on planet3
  var Np4 = 24;   // number of teeth on planet4

  var planS2P4 = new PlanS2P4(Ns1, Ns2, Np1, Np2, Np3, Np4);  // create Grashof type 1 linkage
  planS2P4.showPlots = false;
	planS2P4.buttonCanvas("09", 210, 210);
  planS2P4.drawGround();
  planS2P4.draw(0);
	

	// Start other page scripts
	navbar();
	Select_Animation();
}






