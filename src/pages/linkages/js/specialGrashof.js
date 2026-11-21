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
      title: "Class 11",
      description: "The shortest link is ground, and each link makes a full revolution. This is the Special Case version of the Class 1 Grashof linkage.",
      ariaDiagram: "Animation of Grashof class 11 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
      isActive: true,
    },
    {
      id: "02",
      title: "Class 12",
      description: "The shortest link is the crank, and only the crank makes a full revolution. This is the Special Case version of the Class 2 Grashof linkage.",
      ariaDiagram: "Animation of Grashof class 12 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"]
    },
    {
      id: "03",
      title: "Class 13",
      description: "The shortest link is the coupler, and only the coupler makes a full revolution. This is the Special Case version of the Class 3 Grashof linkage.",
      ariaDiagram: "Animation of Grashof class 13 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
    },
    {
      id: "04",
      title: "Class 14",
      description: "The shortest link is the rocker, and only the rocker makes a full revolution. This is the Special Case version of the Class 4 Grashof linkage.",
      ariaDiagram: "Animation of Grashof class 14 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"]
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

	// ***** dimensions of fourbar linkage for special Grashof type 11 *****
  var d = S;    // ground
  var a = P;    // crank
  var b = L;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras11 = new Fourbar(a, b, c, d, p, beta, 11, false);  // create special Grashof type 11 linkage
  spgras11.buttonCanvas("01", 210, 210, zoom);
	spgras11.precomputePlots();

	// ***** dimensions of fourbar linkage for special Grashof type 12 *****
  var d = P;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras12 = new Fourbar(a, b, c, d, p, beta, 12, true);  // create special Grashof type 12 linkage
  spgras12.buttonCanvas("02", 130, 210, zoom);
	spgras12.precomputePlots();

	// ***** dimensions of fourbar linkage for special Grashof type 13 *****
  var d = P;    // ground
  var a = L;    // crank
  var b = S;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras13 = new Fourbar(a, b, c, d, p, beta, 13, true);  // create special Grashof type 13 linkage
  spgras13.buttonCanvas("03", 120, 250, zoom);
	spgras13.precomputePlots();

	// ***** dimensions of fourbar linkage for special Grashof type 14 *****
  var d = P;    // ground
  var a = Q;    // crank
  var b = L;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras14 = new Fourbar(a, b, c, d, p, beta, 14, false);  // create special Grashof type 14 linkage
  spgras14.buttonCanvas("04", 200, 210, zoom);
	spgras14.precomputePlots();
	
	// Start other page scripts
	Select_Animation([spgras11, spgras12, spgras13, spgras14]);
}






