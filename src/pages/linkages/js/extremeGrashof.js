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
      title: "Class 15",
      description: "There are two pairs of identical links, each of which is adjacent to each other. The short links are the ground and the crank, and all links make a complete revolution. Note that the coupler and rocker make a single revolution for two revolutions of the crank.",
      ariaDiagram: "Animation of Grashof class 15 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
      isActive: true,
      tabId: "pill-class-15-tab",
    },
    {
      id: "02",
      title: "Class 16",
      description: "There are two pairs of identical links, each of which is adjacent to each other. The short links are the crank and coupler, and the crank and coupler both make a full revolution.",
      ariaDiagram: "Animation of Grashof class 16 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
      tabId: "pill-class-16-tab",
    },
    {
      id: "03",
      title: "Class 17",
      description: "There are two pairs of identical links, each of which is adjacent to each other. The short links are the coupler and rocker, and the coupler and rocker both make a full revolution.",
      ariaDiagram: "Animation of Grashof class 17 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
      tabId: "pill-class-17-tab",
    },
    {
      id: "04",
      title: "Class 18",
      description: "There are two pairs of identical links, each of which is adjacent to each other. The short links are the rocker and ground, and all links make a complete revolution. Note that the crank and coupler make a single revolution for two revolutions of the rocker.",
      ariaDiagram: "Animation of Grashof class 18 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
      tabId: "pill-class-18-tab",
    },
        {
      id: "05",
      title: "Class 19 (Crossed)",
      description: "There are two pairs of identical links, each of which is opposite each other. This is the crossed version of the parallelogram linkage.",
      ariaDiagram: "Animation of Grashof class 19 crossed configuration fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
      tabId: "pill-class-19-crossed-tab",
    },
        {
      id: "06",
      title: "Class 19 (Open)",
      description: "There are two pairs of identical links, each of which is opposite each other. This is the open version of the parallelogram linkage.",
      ariaDiagram: "Animation of Grashof class 19 open configuration fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
      tabId: "pill-class-19-open-tab",
    },
  ];

  // 2. Render HTML templates into DOM
  mount.innerHTML = renderMechanismSet(sectionConfigs);
  var zoom = 1.2;

  // 3. Instantiate and initialize each mechanism
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
  spgras15.buttonCanvas("01", 150, 210, 1.15);
	spgras15.precomputePlots();

	// ***** dimensions of fourbar linkage for special Grashof type 16 *****
  var d = L;    // ground
  var a = S;    // crank
  var b = S;    // coupler
  var c = L;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras16 = new Fourbar(a, b, c, d, p, beta, 16, false);  // create special Grashof type 16 linkage
  spgras16.buttonCanvas("02", 170, 210, zoom);
	spgras16.precomputePlots();

	// ***** dimensions of fourbar linkage for special Grashof type 17 *****
  var d = L;    // ground
  var a = L;    // crank
  var b = S;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras17 = new Fourbar(a, b, c, d, p, beta, 17, false);  // create special Grashof type 17 linkage
  spgras17.buttonCanvas("03", 100, 210, zoom);
	spgras17.precomputePlots();

	// ***** dimensions of fourbar linkage for special Grashof type 18 *****
  var d = S;    // ground
  var a = L;    // crank
  var b = L;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras18 = new Fourbar(a, b, c, d, p, beta, 18, false);  // create special Grashof type 18 linkage
  spgras18.buttonCanvas("04", 210, 210, 1.15);
	spgras18.precomputePlots();

  // ***** dimensions of fourbar linkage for special Grashof type 19 *****
  var d = L;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras191 = new Fourbar(a, b, c, d, p, beta, 19, false);  // create special Grashof type 19 linkage
  spgras191.buttonCanvas("05", 150, 210, zoom);
	spgras191.precomputePlots();

  // ***** dimensions of fourbar linkage for special Grashof type 19 *****
  var d = L;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = S;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var spgras192 = new Fourbar(a, b, c, d, p, beta, 19, true);  // create special Grashof type 19 linkage
  spgras192.buttonCanvas("06", 150, 210, zoom);
	spgras192.precomputePlots();
	
	// Start other page scripts
	Select_Animation([spgras15, spgras16, spgras17, spgras18, spgras191, spgras192]);
}






