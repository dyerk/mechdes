"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
	// ***** these are the dimensions of each link *****
  var S = 80;   // short link
  var L = 170;  // long link
  var P = 160;  // one of the remaining links
  var Q = 120;  // the other remaining link

	// ***** dimensions of fourbar linkage for Grashof type 1 *****
  var d = S;    // ground
  var a = P;    // crank
  var b = L;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle

  var grashof1 = new Fourbar(a, b, c, d, p, beta, 1, false);  // create Grashof type 1 linkage
  grashof1.buttonCanvas("01", 200, 190);
	grashof1.setLims([[-165,205],[-165,280],[-495,655]]); //[[dL,dH],[vL,vH],[aL,aH]]
  grashof1.drawGround();
  grashof1.draw(0);

	// ***** dimensions of fourbar linkage for Grashof type 2 *****
  var d = P;   // ground
  var a = S;   // crank
  var b = L;   // coupler
  var c = Q;   // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var grashof2 = new Fourbar(a, b, c, d, p, beta, 2, true);  // create Grashof type 2 linkage
  grashof2.buttonCanvas("02", 150, 220);
  grashof2.setLims([[-85,235],[-85,165],[-325,185]]); //[[dL,dH],[vL,vH],[aL,aH]]
	grashof2.drawGround();
  grashof2.draw(0);

	// ***** dimensions of fourbar linkage for Grashof type 3 *****
  var d = P;   // ground
  var a = L;   // crank
  var b = S;   // coupler
  var c = Q;   // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var grashof3 = new Fourbar(a, b, c, d, p, beta, 3, true);  // create Grashof type 3 linkage
  grashof3.buttonCanvas("03", 120, 230);
  grashof3.setLims([[0,235],[-250,250],[-500,500]]); //[[dL,dH],[vL,vH],[aL,aH]]
	grashof3.drawGround();
  grashof3.draw(0);

	// ***** dimensions of fourbar linkage for Grashof type 4 *****
  var d = P;   // ground
  var a = Q;   // crank
  var b = L;   // coupler
  var c = S;   // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle
  
  var grashof4 = new Fourbar(a, b, c, d, p, beta, 4, false);  // create Grashof type 4 linkage
  grashof4.buttonCanvas("04", 130, 220);
  grashof4.setLims([[-85,245],[-200,200],[-300,300]]); //[[dL,dH],[vL,vH],[aL,aH]]
	grashof4.drawGround();
  grashof4.draw(0); 
	
	// Start other page scripts
	navbar();
	Select_Animation();
}






