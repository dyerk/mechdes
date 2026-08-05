"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
	// ***** these are the dimensions of each link *****
  var S = 80;  // short link
  var L = 170; // long link
  var P = 130; // one of the remaining links
  var Q = 100; // the other remaining link

	// ***** dimensions of fourbar linkage for non-Grashof type 5 *****
  var d = L;    // ground
  var a = S;    // crank
  var b = P;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle

  var nongras5 = new Fourbar(a, b, c, d, p, beta, 5, true);  // create non-Grashof type 5 linkage
	nongras5.isGrashof = false;
  nongras5.buttonCanvas("01", 120, 210);
	nongras5.setLims([[-85,190],[-150,150],[-200,150],[-180,180]]);
  nongras5.drawGround();
  nongras5.draw((nongras5.crankMax + nongras5.crankMin)/2);

	// ***** dimensions of fourbar linkage for non-Grashof type 6 *****
  var d = L;    // ground
  var a = Q;    // crank
  var b = P;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var nongras6 = new Fourbar(a, b, c, d, p, beta, 6, false);  // create non-Grashof type 6 linkage
  nongras6.isGrashof = false;
	nongras6.buttonCanvas("02", 120, 210);
  nongras6.setLims([[-85,225],[-200,150],[-250,355],[-360,0]]);
	nongras6.drawGround();
  nongras6.draw((nongras6.crankMax + nongras6.crankMin)/2);

	// ***** dimensions of fourbar linkage for non-Grashof type 7 *****
  var d = S;    // ground
  var a = L;    // crank
  var b = P;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var nongras7 = new Fourbar(a, b, c, d, p, beta, 7, false);  // create non-Grashof type 7 linkage
  nongras7.isGrashof = false;
	nongras7.buttonCanvas("03", 150, 210);
	nongras7.setLims([[-175,185],[-175,300],[-400,450],[-180,180]]); 
  nongras7.drawGround();
  nongras7.draw((nongras7.crankMax + nongras7.crankMin)/2);

	// ***** dimensions of fourbar linkage for non-Grashof type	 8 *****
  var d = P;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var nongras8 = new Fourbar(a, b, c, d, p, beta, 8, true);  // create non-Grashof type 8 linkage
  nongras8.isGrashof = false;
	nongras8.buttonCanvas("04", 150, 210);
  nongras8.setLims([[-85,235],[-150,150],[-150,150],[-360,0]]);
	nongras8.drawGround();
  nongras8.draw((nongras8.crankMax + nongras8.crankMin)/2);

  // ***** dimensions of fourbar linkage for non-Grashof type 9 *****
  var d = P;    // ground
  var a = Q;    // crank
  var b = L;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var nongras9 = new Fourbar(a, b, c, d, p, beta, 9, false);  // create non-Grashof type 9 linkage
	nongras9.isGrashof = false;
  nongras9.buttonCanvas("05", 150, 210);
  nongras9.setLims([[-105,215],[-300,300],[-300,300],[-180,180]]);
	nongras9.drawGround();
  nongras9.draw((nongras9.crankMax + nongras9.crankMin)/2);

	// ***** dimensions of fourbar linkage for non-Grashof type 10 *****
  var d = S;    // ground
  var a = P;    // crank
  var b = Q;    // coupler
  var c = L;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var nongras10 = new Fourbar(a, b, c, d, p, beta, 10, true);  // create non-Grashof type 10 linkage
  nongras10.isGrashof = false;
	nongras10.buttonCanvas("06", 180, 210);
  nongras10.setLims([[-175,195],[-150,150],[-150,150],[-360,0]]);
	nongras10.drawGround();
  nongras10.draw((nongras10.crankMax + nongras10.crankMin)/2);
	
	// Start other page scripts
	Select_Animation();
}






