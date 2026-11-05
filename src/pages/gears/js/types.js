"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
  // ***** numbers of teeth on gears *****
  var Ns1 = 40;   // number of teeth on sun1
  var Ns2 = 60;   // number of teeth on sun2
  var Np1 = 40;   // number of teeth on planet1
  var Np2 = 20;   // number of teeth on planet2

  var planS2P2_A = new PlanS2P2(Ns1, Ns2, Np1, Np2, false, 1);  // create Grashof type 1 linkage
  planS2P2_A.showPlots = false;
  planS2P2_A.calcLengths = false;
	planS2P2_A.buttonCanvas("01", 210, 210);
  planS2P2_A.drawGround();
  planS2P2_A.draw(0);

  // ***** numbers of teeth on gears *****
  var Ns1 = 40;   // number of teeth on sun1
  var Ns2 = 60;   // number of teeth on sun2
  var Np1 = 40;   // number of teeth on planet1
  var Np2 = 20;   // number of teeth on planet2

  var planS2P2_B = new PlanS2P2(Ns1, Ns2, Np1, Np2, false, 2);  // create Grashof type 1 linkage
  planS2P2_B.showPlots = false;
  planS2P2_B.calcLengths = false;
	planS2P2_B.buttonCanvas("02", 210, 210);
  planS2P2_B.drawGround();
  planS2P2_B.draw(0);
}






