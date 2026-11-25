"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
  var mount = document.getElementById("mechanisms-mount");

  // 1. Define template metadata for mechanisms
  var sectionConfigs = [
    {
      id: "01",
      title: "Slider Crank (Aligned)",
      description: "Most slider-cranks have the cylinder horizontally aligned with the ground pin.",
      ariaDiagram: "Animation of aligned slider-crank mechanism",
      showPlots: true,
      pins: ["B", "C"],
      pinLabels: {
        C: "C - Slider Pin"  //override default
      },
      isActive: true,
      tabId: "pill-slider-crank-aligned-tab",
    },
    {
      id: "02",
      title: "Slider Crank (Offset)",
      description: "This slider-crank has a vertical offset.",
      ariaDiagram: "Animation of slider-crank mechanism with slider offest vertically from crank",
      showPlots: true,
      pins: ["B", "C"],
      pinLabels: {
        C: "C - Slider Pin",  //override default
      },
      tabId: "pill-slider-crank-offset-tab",
    },
    {
      id: "03",
      title: "Fourbar (Open)",
      description: "This fourbar linkage is in the open configuration.",
      ariaDiagram: "Animation of an open configuration fourbar mechanism.",
      showPlots: true,
      pins: ["B", "P", "C"],
      tabId: "pill-fourbar-open-tab",
    },
    {
      id: "04",
      title: "Fourbar (Crossed)",
      description: "This fourbar linkage is in the crossed configuration.",
      ariaDiagram: "Animation of a crossed configuration fourbar mechanism.",
      showPlots: true,
      pins: ["B", "P", "C"],
      tabId: "pill-fourbar-crossed-tab",
    },
    {
      id: "05",
      title: "Inverted Slider (Open)",
      description: "This inverted slider is in the open configuration.",
      ariaDiagram: "Animation of a open configuration inverted slider mechanism.",
      showPlots: true,
      pins: ["B", "P"],
      tabId: "pill-inverted-slider-crank-open-tab",
    },
    {
      id: "06",
      title: "Inverted Slider (Crossed)",
      description: "This inverted slider is in the crossed configuration.",
      ariaDiagram: "Animation of a crossed configuration inverted slider mechanism.",
      showPlots: true,
      pins: ["B", "P"],
      tabId: "pill-inverted-slider-crank-crossed-tab",
    },
    {
      id: "07",
      title: "Geared Fivebar (Same Gears)",
      description: "This geared fivebar has two gears with equal numbers of teeth.",
      ariaDiagram: "Animation of geared fivebar mechanism with equal number of teeth.",
      showPlots: false,
      tabId: "pill-geared-fivebar-same-tab",
    },
    {
      id: "08",
      title: "Geared Fivebar (Different Gears)",
      tabTitle: "Geared Fivebar (Diff Gears)",
      description: "The second gear has twice the number of teeth as the first gear. Note the cusps in the motion of the blue trace.",
      ariaDiagram: "Animation of geared fivebar mechanism with inequal number of teeth.",
      showPlots: false,
      tabId: "pill-geared-fivebar-different-tab",
    }
  ];

  // 2. Render HTML templates into DOM
  mount.innerHTML = renderMechanismSet(sectionConfigs);
  var zoom = 1.2;

  // 3. Instantiate and initialize each mechanism
  var a = 60;                // crank
  var b = 130;               // connecting rod
  var c = 0;                // vertical distance to slot

  var sliderCrankA = new SliderCrank(a,b,c);  // create slider-crank
  sliderCrankA.buttonCanvas("01", 140, 210, zoom, true, 0, true);
	sliderCrankA.precomputePlots();
	
	// ***** dimensions of slider-crank linkage *****
  var a = 60;                // crank
  var b = 130;               // connecting rod
  var c = 60;                // vertical distance to slot

  var sliderCrankO = new SliderCrank(a,b,c);  // create slider-crank
  sliderCrankO.buttonCanvas("02", 140, 210, zoom, true, 0, true);
  sliderCrankO.precomputePlots();
	
  // ***** these are the dimensions of each link *****
  var S = 50;  // short link
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

  var fourbarO = new Fourbar(a,b,c,d,p,beta,12,true);  // create fourbar
  fourbarO.buttonCanvas("03", 150, 200, zoom, true, 3, true);
  fourbarO.precomputePlots();
	
	// ***** dimensions of fourbar linkage for special Grashof type 12 crossed *****
  var d = P;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  
	
	var fourbarC = new Fourbar(a,b,c,d,p,beta,12,false);  // create fourbar
  fourbarC.buttonCanvas("04", 150, 200, zoom, true, 3, true);
  fourbarC.precomputePlots();
	
	// ***** dimensions of inverted slider-crank
  var a = 40;                     // crank
  var c = 100;                     // rocker
  var d = 160;                    // distance between ground pins
  var p = 200;                    // length of slider
  var gamma = 80*Math.PI/180;     // angle between slider and rocker

  var invSlideO = new InvSlide(a,p,c,d,gamma,true); // create inverted slider-crank
  invSlideO.buttonCanvas("05", 120, 250, zoom, true, 1, true);
  invSlideO.precomputePlots();
	
	// ***** dimensions of inverted slider-crank
  var a = 40;                     // crank
  var c = 100;                     // rocker
  var d = 160;                    // distance between ground pins
  var p = 200;                    // length of slider
  var gamma = 80*Math.PI/180;     // angle between slider and rocker
	
	var invSlideC = new InvSlide(a,p,c,d,gamma,false); // create inverted slider-crank
  invSlideC.buttonCanvas("06", 120, 200, zoom, true, 1, true);
  invSlideC.precomputePlots();

  // ***** dimensions of fivebar linkage
  var a = 60;                   // crank
  var b = 125;                  // first coupler
  var c = 125;                  // second coupler
  var v = 60;                   // rocker
  var u = 90;                   // distance between ground pins
  var p = 100;                  // distance to point p on coupler 1
  var q = 100;                  // distance to point q on coupler 2
  var gamma3 =  20*Math.PI/180; // internal angle of coupler 1
  var gamma4 = -20*Math.PI/180; // internal angle of coupler 2
  var D1 = 90;                  // diameter of gear 1
  var D2 = 90;                  // diameter of gear 2

  var fivebarS = new Fivebar(a,b,c,u,v,p,q,gamma3,gamma4,D1,D2); // create fivebar linkage
  fivebarS.buttonCanvas("07", 200, 230, true, 3, false);
  fivebarS.drawGround();
  fivebarS.draw(0);
  
	// ***** dimensions of fivebar linkage
  var a = 60;                   // crank
  var b = 125;                  // first coupler
  var c = 125;                  // second coupler
  var v = 60;                   // rocker
  var u = 90;                   // distance between ground pins
  var p = 100;                  // distance to point p on coupler 1
  var q = 100;                  // distance to point q on coupler 2
  var gamma3 =  20*Math.PI/180; // internal angle of coupler 1
  var gamma4 = -20*Math.PI/180; // internal angle of coupler 2
  var D1 = 120;                 // diameter of gear 1
  var D2 = 60;                 // diameter of gear 2
  
	var fivebarD = new Fivebar(a,b,c,u,v,p,q,gamma3,gamma4,D1,D2); // create fivebar linkage
  fivebarD.buttonCanvas("08", 200, 230, true, 3, false);
  fivebarD.drawGround();
  fivebarD.draw(0);
	
  // 4. Initialize tab switcher and pass mechanism instances for plot resizing
  Select_Animation([sliderCrankA, sliderCrankO, fourbarO, fourbarC, invSlideO, invSlideC, fivebarS, fivebarD]);
}






