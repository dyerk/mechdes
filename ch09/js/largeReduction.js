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
  var Ns1 = 28;  // number of teeth on first sun
  var Ns2 = 32*13/15;  // number of teeth on second sun
  var Np1 = 24;  // number of teeth on planet1
  var Np2 = 28*13/15;  // number of teeth on planet2

  var planRed1 = new PlanS2P2(Ns1, Ns2, Np1, Np2, false);
	planRed1.showPlots = false;
	planRed1.deltaT = 0.05;
  planRed1.buttonCanvas("01", 210, 210);
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
	planRed2.buttonCanvas("02", 210, 210);
  planRed2.drawGround();
  planRed2.draw(0);
}






