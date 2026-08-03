"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
	// ***** these are the dimensions of each link *****
  var S = 70;  // short link
  var L = 160; // long link

  // ***** dimensions of fourbar linkage for special Grashof type 15 *****
  var d = S;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = L;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras15 = new Fourbar(a, b, c, d, p, beta, 15, false);  // create special Grashof type 15 linkage
  spgras15.buttonCanvas("01", 120, 210);
	spgras15.setLims([[-165,235],[-150,150],[-75,75],[0,720]]);
  spgras15.drawGround();
  spgras15.draw(0);

	// ***** dimensions of fourbar linkage for special Grashof type 16 *****
  var d = L;    // ground
  var a = S;    // crank
  var b = S;    // coupler
  var c = L;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras16 = new Fourbar(a, b, c, d, p, beta, 16, false);  // create special Grashof type 16 linkage
  spgras16.buttonCanvas("02", 150, 210);
	spgras16.setLims([[-130,130],[-100,250],[-200,150],[0,360]]);
  spgras16.drawGround();
  spgras16.draw(0);

	// ***** dimensions of fourbar linkage for special Grashof type 17 *****
  var d = L;    // ground
  var a = L;    // crank
  var b = S;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras17 = new Fourbar(a, b, c, d, p, beta, 17, false);  // create special Grashof type 17 linkage
  spgras17.buttonCanvas("03", 100, 210);
	spgras17.setLims([[-130,235],[-150,150],[-200,150],[0,360]]);
  spgras17.drawGround();
  spgras17.draw(0);

	// ***** dimensions of fourbar linkage for special Grashof type 18 *****
  var d = S;    // ground
  var a = L;    // crank
  var b = L;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras18 = new Fourbar(a, b, c, d, p, beta, 18, false);  // create special Grashof type 18 linkage
  spgras18.buttonCanvas("04", 210, 210);
	spgras18.setLims([[-165,165],[-165,165],[-200,150],[0,360]]);
  spgras18.drawGround();
  spgras18.draw(0);

  // ***** dimensions of fourbar linkage for special Grashof type 19 *****
  var d = L;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras191 = new Fourbar(a, b, c, d, p, beta, 19, false);  // create special Grashof type 19 linkage
  spgras191.buttonCanvas("05", 130, 210);
	spgras191.setLims([[-75,125],[-180,125],[-200,150],[0,360]]);
  spgras191.drawGround();
  spgras191.draw(0);

  // ***** dimensions of fourbar linkage for special Grashof type 19 *****
  var d = L;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras192 = new Fourbar(a, b, c, d, p, beta, 19, true);  // create special Grashof type 19 linkage
  spgras192.buttonCanvas("06", 130, 210);
	spgras192.setLims([[-75,235],[-75,75],[-75,75],[0,360]]);
  spgras192.drawGround();
  spgras192.draw(0);
	
	// Start other page scripts
	navbar();
	Select_Animation();
}






