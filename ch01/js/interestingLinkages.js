"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
	// ***** dimensions of Peaucellier linkage *****
  var a =  80;             // short links
  var b = 100;             // medium links
  var c = 250;             // long links

  var peaucellier = new Peaucellier(a,b,c);  // create Peaucellier linkage
	peaucellier.showPlots = false;
	peaucellier.isGrashof = false;
  peaucellier.buttonCanvas("01", 100, 200);
  peaucellier.drawGround();
  peaucellier.draw(0);                // calculate the Peaucellier geometry and draw

	// ***** dimensions of Chebyshev paradoxical mechanism - forwards *****
  a =  55.7*1.5;        // crank
  b = 100.0*1.5;        // coupler of first fourbar
  c = 100.0*1.5;        // rocker of first fourbar
  var d = 132.4*1.5;    // ground of first fourbar
  var e = 100.0*1.5;    // extension of coupler
  var f =  58.344*1.5;  // link attached to coupler
  var g =  12.3*1.5;    // flywheel link (grounded)
  var h = 138.7*1.5;    // vertical distance to third ground pivot

  var chebyshevf = new Chebyshev(a,b,c,d,e,f,g,h,1);  // create Chebyshev linkage
	chebyshevf.showPlots = false;
  chebyshevf.buttonCanvas("02", 120, 300);
  chebyshevf.drawGround();
  chebyshevf.draw(0);                // calculate the Chebyshev geometry and draw

	// ***** dimensions of Chebyshev paradoxical mechanism - reverse *****
  a =  55.7*1.5;    // crank
  b = 100.0*1.5;    // coupler of first fourbar
  c = 100.0*1.5;    // rocker of first fourbar
  d = 132.4*1.5;    // ground of first fourbar
  e = 100.0*1.5;    // extension of coupler
  f =  58.344*1.5;    // link attached to coupler
  g =  12.3*1.5;    // flywheel link (grounded)
  h = 138.7*1.5;    // vertical distance to third ground pivot

  var chebyshevr = new Chebyshev(a,b,c,d,e,f,g,h,-1);  // create Chebyshev linkage
  chebyshevr.showPlots = false;
	chebyshevr.buttonCanvas("03", 120, 300);
  chebyshevr.drawGround();
  chebyshevr.draw(0);                // calculate the Chebyshev geometry and draw
	
	// Start other page scripts
	navbar();
	Select_Animation();
}






