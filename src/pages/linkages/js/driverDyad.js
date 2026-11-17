"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
  var mount = document.getElementById("mechanisms-mount");

  // 1. Define template metadata for all 6 mechanisms
  var sectionConfigs = [
    {
      id: "01",
      title: "Driving Grashof Linkages",
      description: "If the linkage is Grashof, we can use a motor to drive the shortest link in a continuous motion.",
      ariaDiagram: "Animation of Grashof fourbar mechanism",
      showPlots: false,
      isActive: true,
    },
    {
      id: "02",
      title: "Driving Non-Grashof Linkages",
      description: "The shortest link is the crank, and only the crank makes a complete revolution.If a linkage is non-Grashof, we can use a driver dyad to drive it. Note that the fourbar linkage that contains the driver dyad is the same as in the animation at left.",
      ariaDiagram: "Animation of non-grashof mechanism being driven by a driver dyad",
      showPlots: false,
    },
  ];

  // 2. Render HTML templates into DOM
  mount.innerHTML = renderMechanismSet(sectionConfigs);

  // 3. Instantiate and initialize each mechanism
	// ***** dimensions of Grashof fourbar linkage  *****
  var d = 160;  // ground
  var a = 60;   // crank
  var b = 170;  // coupler
  var c = 120;  // rocker
  var e = 0;
  var f = 0;
  var g = 0;
  var h = 0;

  var grashof = new DriverDyad(a, b, c, d, e, f, g, h, true, false);
	grashof.showPlots = false;
  grashof.buttonCanvas("01", 80, 250);
  grashof.drawGround();
  grashof.draw(0);

	// ***** dimensions of driver dyad linkage *****
  d = 160;   // ground
  a = 60;    // crank
  b = 170;   // coupler
  c = 120;   // rocker
  e = 160;   // length of 3 pin link
  f = 80;    // length of coupler for second fourbar
  g = 150;   // length of rocker for second fourbar
  h = 50;    // length of ground for second fourbar

  var driverdyad = new DriverDyad(a, b, c, d, e, f, g, h, true, true);
	driverdyad.showPlots = false;
  driverdyad.buttonCanvas("02", 80, 250);
  driverdyad.drawGround();
  driverdyad.draw(0);
	
	// Start other page scripts
	Select_Animation([grashof, driverdyad]);
}






