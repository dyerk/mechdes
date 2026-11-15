// js/primaryLinkages.js
"use strict";
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
      title: "Threebar Linkage",
      tabTitle: "Threebar",
      description: "This linkage consists of a crank, coupler and ground.",
      ariaDiagram: "Animation of threebar mechanism in motion",
      showPlots: true,
      pins: ["B", "P"],
      isActive: true,
    },
    {
      id: "02",
      title: "Fourbar Linkage",
      tabTitle: "Fourbar",
      description: "This very common linkage consists of a crank, coupler, rocker and ground.",
      ariaDiagram: "Animation of fourbar mechanism in motion",
      showPlots: true,
      pins: ["B", "P", "C"]
    },
    {
      id: "03",
      title: "Slider-Crank",
      description: "This linkage consists of a crank, connecting rod, slider and ground.",
      ariaDiagram: "Animation of slider-crank mechanism in motion",
      showPlots: true,
      pins: ["B", "C"]
    },
    {
      id: "04",
      title: "Inverted Slider-Crank",
      description: "This linkage consists of a crank, slider, rocker and ground.",
      ariaDiagram: "Animation of inverted slider-crank mechanism in motion",
      showPlots: true,
      pins: ["B", "P"]
    },
    {
      id: "05",
      title: "Geared Fivebar",
      description: "This linkage consists of two gears, two couplers and ground.",
      ariaDiagram: "Animation of geared fivebar mechanism in motion",
      showPlots: false
    },
    {
      id: "06",
      title: "Cam-Follower",
      description: "The cam-follower changes rotary motion of the cam to translational motion of a follower. The cam-follower pictured is known as a rocker configuration.",
      ariaDiagram: "Animation of cam-follower in motion",
      showPlots: false
    }
  ];

  // 2. Render HTML templates into DOM
mount.innerHTML = renderMechanismSet(sectionConfigs);

  // 3. Instantiate and initialize each mechanism
  // 01: Threebar
  var d = 160;               // ground
  var a =  60;               // crank
  var p = 250;               // length of slider
  var g = 160;               // length of slot
  var threebar = new Threebar(a, p, g, d);
  threebar.buttonCanvas("01", 120, 200);
  threebar.precomputePlots();

  // 02: Fourbar
  var d = 160;               // ground
  var a =  80;               // crank
  var b = 170;               // coupler
  var c = 120;               // rocker
  var p  = 70;               // coupler offset
  var beta = 40*Math.PI/180; // coupler offset angle

  var fourbar = new Fourbar(a,b,c,d,p,beta,2,true);
  fourbar.buttonCanvas("02", 120, 230);
  fourbar.precomputePlots();

  // 03: Slider-Crank
  var a = 60;                // crank
  var b = 130;               // connecting rod
  var c = 60;                // vertical distance to slot

  var sliderCrank = new SliderCrank(a,b,c);
  sliderCrank.buttonCanvas("03", 140, 210);
  sliderCrank.precomputePlots();

  // 04: Inverted Slider-Crank
  a = 60;                     // crank
  c = 70;                     // rocker
  d = 160;                    // distance between ground pins
  p = 220;                    // length of slider
  var gamma = 70*Math.PI/180; // angle between slider and rocker
  var hLink = 60;             // width of slider

  var invSlide = new InvSlide(a,p,c,d,gamma,true);
  invSlide.buttonCanvas("04", 120, 250);
  invSlide.precomputePlots();

  // 05: Geared Fivebar
   a = 90;                      // crank
  b = 150;                     // first coupler
  c = 150;                     // second coupler
  var v = 90;                  // rocker
  var u = 120;                 // distance between ground pins
  p = 180;                     // distance to point p on coupler 1
  var q = 180;                 // distance to point q on coupler 2
  var gamma3 =  30*Math.PI/180;// internal angle of coupler 1
  var gamma4 = -30*Math.PI/180;// internal angle of coupler 2
  var D1 = 100;                // diameter of gear 1
  var D2 = 140;                // diameter of gear 2

  var fivebar = new Fivebar(a,b,c,u,v,p,q,gamma3,gamma4,D1,D2);
  fivebar.showPlots = false;
  fivebar.buttonCanvas("05", 190, 275);
  fivebar.drawGround();
  fivebar.draw(0);

  // 06: Cam-Follower
  var nDwell = 3;            // number of dwells on cam
  var rb =  50;              // base radius of cam
  var h = [10, 20, 40];        // dwell heights on cam
  var betad = [100, 40, 30];   // dwell angles on cam (degrees)
  var betar = [ 60, 50, 80];   // rise/fall angles on cam
  var R = 20;                // radius of roller follower
  var L = 150;                // length of bar on follower
  var d = 200;                // distance between ground pins

  var camrock = new CamRock(nDwell, rb, h, betad, betar, R, L, d);
  camrock.showPlots = false;
  camrock.showTrace = false;
  camrock.buttonCanvas("06", 160, 200);
  camrock.drawGround();
  camrock.draw(0);

  // 4. Initialize tab switcher and pass mechanism instances for plot resizing
  Select_Animation([threebar, fourbar, sliderCrank, invSlide, fivebar, camrock]);
}