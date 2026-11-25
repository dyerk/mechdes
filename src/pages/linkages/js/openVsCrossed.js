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
      title: "Class 12 (Open)",
      description: "Open Configuration",
      ariaDiagram: "Animation of Grashof class 12 open configuration fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
      isActive: true,
    },
    {
      id: "02",
      title: "Class 12 (Crossed)",
      description: "Crossed Configuration",
      ariaDiagram: "Animation of Grashof class 12 crossed configuration fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
    },
  ];

  // 2. Render HTML templates into DOM
  mount.innerHTML = renderMechanismSet(sectionConfigs);
  var zoom = 1.2;
  
  // 3. Instantiate and initialize each mechanism
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
  gras_open.buttonCanvas("01", 150, 200, zoom);
	gras_open.precomputePlots();

// ***** dimensions of fourbar linkage for special Grashof type 12 crossed *****
  var d = P;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var gras_crossed = new Fourbar(a, b, c, d, p, beta, 12, false);  // create special Grashof type 12 linkage
  gras_crossed.buttonCanvas("02", 150, 200, zoom);
	gras_crossed.precomputePlots();
	
	// Start other page scripts
	Select_Animation([gras_open, gras_crossed]);
}






