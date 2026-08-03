"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
	// ***** these are the dimensions of each link *****
  var S = 70;  // short link
  var L = 160; // long link
  var P = 120; // one of the remaining links
  var Q = 110; // the other remaining link

// ***** dimensions of fourbar linkage for special Grashof type 12 open *****
  var d = P;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var gras_open = new Fourbar(a, b, c, d, p, beta, 12, true);  // create special Grashof type 12 linkage
  gras_open.buttonCanvas("01", 150, 200);
	gras_open.setLims([[-75,125],[-180,125],[-200,150],[0,360]]);
  gras_open.drawGround();
  gras_open.draw(0);

// ***** dimensions of fourbar linkage for special Grashof type 12 crossed *****
  var d = P;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var gras_crossed = new Fourbar(a, b, c, d, p, beta, 12, false);  // create special Grashof type 12 linkage
  gras_crossed.buttonCanvas("02", 150, 200);
	gras_crossed.setLims([[-75,235],[-75,75],[-75,75],[0,360]]);
  gras_crossed.drawGround();
  gras_crossed.draw(0);
	
	// Start other page scripts
	navbar();
	Select_Animation();
}






