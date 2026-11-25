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
      title: "Class 1",
      description: "The shortest link is ground. The crank, coupler and rocker all make complete revolutions. Note that the coupler makes a complete revolution even though no point on it traces out a circle.",
      ariaDiagram: "Animation of Grashof class 1 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
      isActive: true,
      tabId: "pill-class-1-tab"
    },
    {
      id: "02",
      title: "Class 2",
      description: "The shortest link is the crank, and only the crank makes a complete revolution.",
      ariaDiagram: "Animation of Grashof class 2 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
      tabId: "pill-class-2-tab"
    },
    {
      id: "03",
      title: "Class 3",
      description: "The shortest link is the coupler. Only the coupler makes a full revolution, and we must drive the coupler to actuate the linkage to its full extent of motion.",
      ariaDiagram: "Animation of Grashof class 3 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
      tabId: "pill-class-3-tab",
    },
    {
      id: "04",
      title: "Class 4",
      description: "The shortest link is the rocker, and only the rocker makes a complete revolution. In this it is analagous to the Class 2 linkage.",
      ariaDiagram: "Animation of Grashof class 4 fourbar mechanism",
      showPlots: true,
      pins: ["B", "C"],
      tabId: "pill-class-4-tab",
    },
  ];

  // 2. Render HTML templates into DOM
  mount.innerHTML = renderMechanismSet(sectionConfigs);

  // 3. Instantiate and initialize each mechanism
  // ***** these are the dimensions of each link *****
  var S = 80;   // short link
  var L = 170;  // long link
  var P = 160;  // one of the remaining links
  var Q = 120;  // the other remaining link

	// ***** dimensions of fourbar linkage for Grashof type 1 *****
  var d = S;    // ground
  var a = P;    // crank
  var b = L;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle

  var grashof1 = new Fourbar(a, b, c, d, p, beta, 1, false);  // create Grashof type 1 linkage
  grashof1.buttonCanvas("01", 200, 190, 1.05);
	grashof1.precomputePlots();

	// ***** dimensions of fourbar linkage for Grashof type 2 *****
  var d = P;   // ground
  var a = S;   // crank
  var b = L;   // coupler
  var c = Q;   // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var grashof2 = new Fourbar(a, b, c, d, p, beta, 2, true);  // create Grashof type 2 linkage
  grashof2.buttonCanvas("02", 150, 220, 1.2);
  grashof2.precomputePlots();

	// ***** dimensions of fourbar linkage for Grashof type 3 *****
  var d = P;   // ground
  var a = L;   // crank
  var b = S;   // coupler
  var c = Q;   // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  

  var grashof3 = new Fourbar(a, b, c, d, p, beta, 3, true);  // create Grashof type 3 linkage
  grashof3.buttonCanvas("03", 120, 230, 1.2);
  grashof3.precomputePlots();

	// ***** dimensions of fourbar linkage for Grashof type 4 *****
  var d = P;   // ground
  var a = Q;   // crank
  var b = L;   // coupler
  var c = S;   // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle
  
  var grashof4 = new Fourbar(a, b, c, d, p, beta, 4, false);  // create Grashof type 4 linkage
  grashof4.buttonCanvas("04", 130, 220, 1.2);
  grashof4.precomputePlots();
	
	// Start other page scripts
	Select_Animation([grashof1, grashof2, grashof3, grashof4]);
}






