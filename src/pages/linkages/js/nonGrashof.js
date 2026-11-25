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
      title: "Class 5",
      description: "The longest link is ground and the crank is shorter than the rocker. No link makes a complete revolution, and the linkage is driven by the crank.",
      ariaDiagram: "Animation of Grashof class 5 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
      isActive: true,
    },
    {
      id: "02",
      title: "Class 6",
      description: "The longest link is ground and the crank is longer than the rocker. No link makes a complete revolution, and the linkage is driven by the rocker.",
      ariaDiagram: "Animation of Grashof class 6 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
    },
    {
      id: "03",
      title: "Class 7",
      description: "The longest link is the crank. No link makes a complete revolution, and the linkage is driven by the rocker.",
      ariaDiagram: "Animation of Grashof class 7 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
    },
    {
      id: "04",
      title: "Class 8",
      description: "The longest link is the coupler and the crank is shorter than the rocker. No link makes a complete revolution and the linkage is driven by the crank.",
      ariaDiagram: "Animation of Grashof class 8 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
    },
    {
      id: "05",
      title: "Class 9",
      description: "The longest link is the coupler and the crank is shorter than the rocker. No link makes a complete revolution and the linkage is driven by the rocker. The limiting angles are the same as for Class 7.",
      ariaDiagram: "Animation of Grashof class 9 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
    },
    {
      id: "06",
      title: "Class 10",
      description: "The longest link is the rocker. No link makes a complete revolution, and the linkage is driven by the crank. The limiting angles are the same as for Class 8.",
      ariaDiagram: "Animation of Grashof class 10 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
    },
  ];

  // 2. Render HTML templates into DOM
  mount.innerHTML = renderMechanismSet(sectionConfigs);
  var zoom = 1.2;

  // 3. Instantiate and initialize each mechanism
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
  nongras5.buttonCanvas("01", 120, 210, zoom);
	nongras5.precomputePlots();

	// ***** dimensions of fourbar linkage for non-Grashof type 6 *****
  var d = L;    // ground
  var a = Q;    // crank
  var b = P;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var nongras6 = new Fourbar(a, b, c, d, p, beta, 6, false);  // create non-Grashof type 6 linkage
  nongras6.isGrashof = false;
	nongras6.buttonCanvas("02", 120, 210, zoom);
  nongras6.precomputePlots();

	// ***** dimensions of fourbar linkage for non-Grashof type 7 *****
  var d = S;    // ground
  var a = L;    // crank
  var b = P;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var nongras7 = new Fourbar(a, b, c, d, p, beta, 7, false);  // create non-Grashof type 7 linkage
  nongras7.isGrashof = false;
	nongras7.buttonCanvas("03", 150, 210, 1.1);
	nongras7.precomputePlots();

	// ***** dimensions of fourbar linkage for non-Grashof type	 8 *****
  var d = P;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var nongras8 = new Fourbar(a, b, c, d, p, beta, 8, true);  // create non-Grashof type 8 linkage
  nongras8.isGrashof = false;
	nongras8.buttonCanvas("04", 150, 210, zoom);
  nongras8.precomputePlots();

  // ***** dimensions of fourbar linkage for non-Grashof type 9 *****
  var d = P;    // ground
  var a = Q;    // crank
  var b = L;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var nongras9 = new Fourbar(a, b, c, d, p, beta, 9, false);  // create non-Grashof type 9 linkage
	nongras9.isGrashof = false;
  nongras9.buttonCanvas("05", 150, 210, zoom);
  nongras9.precomputePlots();

	// ***** dimensions of fourbar linkage for non-Grashof type 10 *****
  var d = S;    // ground
  var a = P;    // crank
  var b = Q;    // coupler
  var c = L;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var nongras10 = new Fourbar(a, b, c, d, p, beta, 10, true);  // create non-Grashof type 10 linkage
  nongras10.isGrashof = false;
	nongras10.buttonCanvas("06", 180, 210, 1.1);
  nongras10.precomputePlots();
	
	// Start other page scripts
	Select_Animation([nongras5, nongras6, nongras7, nongras8, nongras9, nongras10]);
}






