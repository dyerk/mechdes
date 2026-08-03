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
  planSRP.buttonCanvas("01", 210, 210);
  planSRP.drawGround();
  planSRP.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns = 32;    // number of teeth on sun
  var Nr = 72;   // number of teeth on ring
  var Np1 = 16;   // number of teeth on planet1
  var Np2 = 24;   // number of teeth on planet2

  var planSRP2_1 = new PlanSRP2_1(Ns, Nr, Np1, Np2);
  planSRP2_1.showPlots = false;
	planSRP2_1.buttonCanvas("02", 210, 210);
  planSRP2_1.drawGround();
  planSRP2_1.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns = 16;    // number of teeth on sun
  var Nr = 112;   // number of teeth on ring
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 24;   // number of teeth on planet2

  var planSRP2_2 = new PlanSRP2_2(Ns, Nr, Np1, Np2);
  planSRP2_2.showPlots = false;
	planSRP2_2.buttonCanvas("03", 210, 210);
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
	planSRP3_1.buttonCanvas("04", 210, 210);
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
	planSRP4.buttonCanvas("06", 210, 210);
  planSRP4.drawGround();
  planSRP4.draw(0);
	
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
	
	// ***** numbers of teeth on gears *****
  var Nr1 = 72;   // number of teeth on sun1
  var Nr2 = 112;  // number of teeth on sun2
  var Np1 = 16;   // number of teeth on planet1
  var Np2 = 56;   // number of teeth on planet2

  var planR2P2 = new PlanR2P2(Nr1, Nr2, Np1, Np2);
  planR2P2.showPlots = false;
	planR2P2.buttonCanvas("10", 210, 210);
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
	planR2P3.buttonCanvas("11", 210, 210);
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
	planR2P4.buttonCanvas("12", 210, 210);
  planR2P4.drawGround();
  planR2P4.draw(0);
	
	// Start other page scripts
	navbar();
	Select_Animation();
}






