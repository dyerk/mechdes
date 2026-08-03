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

	// ***** dimensions of fourbar linkage for special Grashof type 11 *****
  var d = S;    // ground
  var a = P;    // crank
  var b = L;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras11 = new Fourbar(a, b, c, d, p, beta, 11, false);  // create special Grashof type 11 linkage
  spgras11.buttonCanvas("01", 180, 210);
	spgras11.setLims([[-125,185],[-510,395],[-500,500],[0,360]]);
  spgras11.drawGround();
  spgras11.draw(0);


	// ***** dimensions of fourbar linkage for special Grashof type 12 *****
  var d = P;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras12 = new Fourbar(a, b, c, d, p, beta, 12, true);  // create special Grashof type 12 linkage
  spgras12.buttonCanvas("02", 130, 210);
	spgras12.setLims([[-75,235],[-400,255],[-300,365],[0,360]]);
  spgras12.drawGround();
  spgras12.draw(0);

	// ***** dimensions of fourbar linkage for special Grashof type 13 *****
  var d = P;    // ground
  var a = L;    // crank
  var b = S;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras13 = new Fourbar(a, b, c, d, p, beta, 13, true);  // create special Grashof type 13 linkage
  spgras13.buttonCanvas("03", 120, 210);
	spgras13.setLims([[0,235],[-500,500],[-300,300],[0,360]]);
  spgras13.drawGround();
  spgras13.draw(0);

	// ***** dimensions of fourbar linkage for special Grashof type 14 *****
  var d = P;    // ground
  var a = Q;    // crank
  var b = L;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras14 = new Fourbar(a, b, c, d, p, beta, 14, false);  // create special Grashof type 14 linkage
  spgras14.buttonCanvas("04", 170, 210);
	spgras14.setLims([[-115,195],[-300,300],[-300,300],[0,360]]);
  spgras14.drawGround();
  spgras14.draw(0);
	
	// Start other page scripts
	navbar();
	Select_Animation();
}






