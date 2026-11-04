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

  var planSRP_s = new PlanSRP_select(Ns, Np, false, 'sun', 'arm');
	planSRP_s.showPlots = false;
  planSRP_s.buttonCanvas("01", 250, 200);
  planSRP_s.drawGround();
  planSRP_s.draw(0);


	// ***** numbers of teeth on gears *****
  var Ns = 32;    // number of teeth on sun
  var Nr = 64;   // number of teeth on ring
  var Np = 16;   // number of teeth on planet1

  var planSRP_s = new PlanSRP_select(Ns, Np, false, 'ring', 'arm');
	planSRP_s.showPlots = false;
  planSRP_s.buttonCanvas("02", 250, 200);
  planSRP_s.drawGround();
  planSRP_s.draw(0);


	// ***** numbers of teeth on gears *****
  var Ns = 32;    // number of teeth on sun
  var Nr = 64;   // number of teeth on ring
  var Np = 16;   // number of teeth on planet1

  var planSRP_s = new PlanSRP_select(Ns, Np, false, 'arm', 'sun');
	planSRP_s.showPlots = false;
  planSRP_s.buttonCanvas("03", 250, 200);
  planSRP_s.drawGround();
  planSRP_s.draw(0);


	// ***** numbers of teeth on gears *****
  var Ns = 32;    // number of teeth on sun
  var Nr = 64;   // number of teeth on ring
  var Np = 16;   // number of teeth on planet1

  var planSRP_s = new PlanSRP_select(Ns, Np, false, 'ring', 'sun');
	planSRP_s.showPlots = false;
  planSRP_s.buttonCanvas("04", 250, 200);
  planSRP_s.drawGround();
  planSRP_s.draw(0);


	// ***** numbers of teeth on gears *****
  var Ns = 32;    // number of teeth on sun
  var Nr = 64;   // number of teeth on ring
  var Np = 16;   // number of teeth on planet1

  var planSRP_s = new PlanSRP_select(Ns, Np, false, 'sun', 'ring');
	planSRP_s.showPlots = false;
  planSRP_s.buttonCanvas("05", 250, 200);
  planSRP_s.drawGround();
  planSRP_s.draw(0);


	// ***** numbers of teeth on gears *****
  var Ns = 32;    // number of teeth on sun
  var Nr = 64;   // number of teeth on ring
  var Np = 16;   // number of teeth on planet1

  var planSRP_s = new PlanSRP_select(Ns, Np, false, 'arm', 'ring');
	planSRP_s.showPlots = false;
  planSRP_s.buttonCanvas("06", 250, 200);
  planSRP_s.drawGround();
  planSRP_s.draw(0);


  // ***** Interactive Planetary **********
  var Ns = 60; 
  var Np = 30;
  
  var planInteractive = new PlanInteractive(Ns, Np);
  planInteractive.showPlots = false;
  planInteractive.buttonCanvas("07", 250, 200);
  planInteractive.drawGround();
  planInteractive.draw(0);
}






