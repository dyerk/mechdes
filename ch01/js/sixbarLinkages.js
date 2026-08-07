"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
	// ***** dimensions of Stephenson sixbar type 1 linkage *****
  var a =  70;                  // crank (left triangle link)
  var b = 100;                  // coupler
  var c =  90;                  // rocker (right triangle link)
  var d = 110;                  // ground
  var p = 150;                  // left triangle offset
  var q = 150;                  // right triangle offset
  var u = 120;                  // length of upper left bar
  var v = 160;                  // length of upper right bar
  var gamma2 =  20*Math.PI/180; // left coupler offset angle
  var gamma4 = -20*Math.PI/180; // right coupler offset angle

  var sixbarS1 = new SixbarS1(a,b,c,d,p,q,u,v,gamma2,gamma4);  // create sixbar
	sixbarS1.showPlots = false;
  sixbarS1.calcLengths = false;
  sixbarS1.buttonCanvas("01", 200, 250);
  sixbarS1.drawGround();
  sixbarS1.draw(0);             // calculate the sixbar geometry and draw
  
  // ***** dimensions of Stephenson sixbar type 2 linkage *****
  var a =  45;                  // crank (left triangle link)
  var b =  75;                  // coupler
  var c = 105                  // rocker (right triangle link)
  var d = 165;                  // ground
  var p = 195;                  // left triangle offset
  var q = 225;                  // right triangle offset
  var u = 120;                  // length of upper left bar
  var v = 180;                  // length of upper right bar
  var gamma3 =  30*Math.PI/180; // left coupler offset angle
  var gamma4 = -30*Math.PI/180; // right coupler offset angle

  var sixbarS2 = new SixbarS2(a,b,c,d,p,q,u,v,gamma3,gamma4);  // create sixbar
  sixbarS2.showPlots = false;
  sixbarS2.calcLengths = false;
	sixbarS2.buttonCanvas("02", 100, 280);
  sixbarS2.drawGround();
  sixbarS2.draw(0);   

	// ***** dimensions of Stephenson sixbar type 3 linkage *****
  a =  90;                  // crank
  b = 105;                  // upper triangle (coupler)
  c = 120;                  // rocker
  d = 135;                  // ground (lower triangle)
  p = 225;                  // upper triangle offset
  q = 195;                  // lower triangle offset
  u = 180;                  // length of upper right bar
  v = 180;                  // length of lower right bar
  var gamma1 = -20*Math.PI/180; // ground triangle offset angle
  var gamma3 =  20*Math.PI/180; // upper triangle offset angle

  var sixbarS3 = new SixbarS3(a,b,c,d,p,q,u,v,gamma1,gamma3);  // create sixbar
  sixbarS3.showPlots = false;
  sixbarS3.calcLengths = false;
	sixbarS3.buttonCanvas("03", 140, 280);
  sixbarS3.drawGround();
  sixbarS3.draw(0);                // calculate the sixbar geometry and draw

	// ***** dimensions of Watt sixbar type 1 linkage *****
  a =  84;                  // crank
  b = 120;                  // coupler (upper triangle)
  c = 108;                  // rocker (lower triangle)
  d = 132;                  // ground
  p = 180;                  // left triangle offset
  q = 180;                  // right triangle offset
  u = 120;                  // length of upper right bar
  v = 120;                  // length of lower right bar
  var gamma3 =  30*Math.PI/180;  // upper triangle offset angle
  var gamma4 =  -50*Math.PI/180; // lower triangle offset angle

  var sixbarW1 = new SixbarW1(a,b,c,d,p,q,u,v,gamma3,gamma4);  // create sixbar
  sixbarW1.showPlots = false;
  sixbarW1.calcLengths = false;
	sixbarW1.buttonCanvas("04", 120, 300);
  sixbarW1.drawGround();
  sixbarW1.draw(0);    
  
	// ***** dimensions of Watt sixbar type 2 linkage *****
  a =  70;                  // crank
  b = 100;                  // coupler
  c =  90;                  // rocker (upper triangle)
  d = 110;                  // ground (lower triangle)
  p = 150;                  // left triangle offset
  q = 150;                  // right triangle offset
  u = 120;                  // length of upper right bar
  v = 160;                  // length of lower right bar
  var gamma1 = -20*Math.PI/180; // lower triangle offset angle
  var gamma4 = -30*Math.PI/180; // upper triangle offset angle

  var sixbarW2 = new SixbarW2(a,b,c,d,p,q,u,v,gamma1,gamma4);  // create sixbar
  sixbarW2.showPlots = false;
  sixbarW2.calcLengths = false;
	sixbarW2.buttonCanvas("05", 120, 250);
  sixbarW2.drawGround();
  sixbarW2.draw(0);                // calculate the sixbar geometry and draw 
	
	// Start other page scripts
	Select_Animation();
}






