"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
	// ***** numbers of teeth on gears *****
  var Ns = 32;    // number of teeth on sun
  var Nr = 64;   // number of teeth on ring
  var Np = 16;   // number of teeth on planet1

  var planSRP = new PlanSRP(Ns, Np, false);
	planSRP.showPlots = false;
  planSRP.buttonCanvas("01", 210, 200);
  planSRP.drawGround();
  planSRP.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns = 32;    // number of teeth on sun
  var Nr = 72;   // number of teeth on ring
  var Np1 = 16;   // number of teeth on planet1
  var Np2 = 24;   // number of teeth on planet2

  var planSRP2_1 = new PlanSRP2_1(Ns, Nr, Np1, Np2);
  planSRP2_1.showPlots = false;
	planSRP2_1.buttonCanvas("02", 210, 200);
  planSRP2_1.drawGround();
  planSRP2_1.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns = 16;    // number of teeth on sun
  var Nr = 112;   // number of teeth on ring
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 24;   // number of teeth on planet2

  var planSRP2_2 = new PlanSRP2_2(Ns, Nr, Np1, Np2);
  planSRP2_2.showPlots = false;
	planSRP2_2.buttonCanvas("03", 210, 200);
  planSRP2_2.drawGround();
  planSRP2_2.draw(0);
	
	// ***** numbers of teeth on gears *****
  var Ns = 24;    // number of teeth on sun
  var Nr = 112;   // number of teeth on ring
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2
  var Np3 = 24;   // number of teeth on planet3

  var planSRP3_1 = new PlanSRP3_1(Ns, Nr, Np1, Np2, Np3);
  planSRP3_1.showPlots = false;
	planSRP3_1.buttonCanvas("04", 210, 200);
  planSRP3_1.drawGround();
  planSRP3_1.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns = 24;    // number of teeth on sun
  var Nr = 112;   // number of teeth on ring
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2
  var Np3 = 24;   // number of teeth on planet3

  var planSRP3_2 = new PlanSRP3_2(Ns, Nr, Np1, Np2, Np3);
  planSRP3_2.showPlots = false;
	planSRP3_2.buttonCanvas("05", 210, 210);
  planSRP3_2.drawGround();
  planSRP3_2.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns = 32;    // number of teeth on sun
  var Nr = 112;   // number of teeth on ring
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2
  var Np3 = 16;   // number of teeth on planet3
  var Np4 = 24;   // number of teeth on planet4

  var planSRP4 = new PlanSRP4(Ns, Nr, Np1, Np2, Np3, Np4);
  planSRP4.showPlots = false;
	planSRP4.buttonCanvas("06", 210, 200);
  planSRP4.drawGround();
  planSRP4.draw(0);
	
	// Start other page scripts
	navbar();
	Select_Animation();
}






