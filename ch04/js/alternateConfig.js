"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
	// ***** dimensions of slider-crank linkage *****
  var a = 60;                // crank
  var b = 130;               // connecting rod
  var c = 0;                // vertical distance to slot

  var sliderCrankA = new SliderCrank(a,b,c);  // create slider-crank
  sliderCrankA.buttonCanvas("01", 140, 210, true, 0, true);
	sliderCrankA.setLims([[-65,195],[-65,105],[-105,150]]); //[[dL,dH],[vL,vH],[aL,aH]]
  sliderCrankA.drawGround();
  sliderCrankA.draw(0);
	
	// ***** dimensions of slider-crank linkage *****
  var a = 60;                // crank
  var b = 130;               // connecting rod
  var c = 60;                // vertical distance to slot

  var sliderCrankO = new SliderCrank(a,b,c);  // create slider-crank
  sliderCrankO.buttonCanvas("02", 140, 210, true, 0, true);
	sliderCrankO.setLims([[-65,195],[-65,105],[-105,150]]); //[[dL,dH],[vL,vH],[aL,aH]]
  sliderCrankO.drawGround();
  sliderCrankO.draw(0);
	
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
  fourbarO.buttonCanvas("03", 150, 200, true, 3, true);
	fourbarO.setLims([[-85,235],[-85,165],[-325,185]]); //[[dL,dH],[vL,vH],[aL,aH]]
  fourbarO.drawGround();
  fourbarO.draw(0);
	
	// ***** dimensions of fourbar linkage for special Grashof type 12 crossed *****
  var d = P;    // ground
  var a = S;    // crank
  var b = L;    // coupler
  var c = Q;    // rocker
  var p = b;    // coupler offset
  var beta = 0; // coupler angle  
	
	var fourbarC = new Fourbar(a,b,c,d,p,beta,12,false);  // create fourbar
  fourbarC.buttonCanvas("04", 150, 200, true, 3, true);
	fourbarC.setLims([[-150,235],[-85,165],[-325,185]]); //[[dL,dH],[vL,vH],[aL,aH]]
  fourbarC.drawGround();
  fourbarC.draw(0);
	
	// ***** dimensions of inverted slider-crank
  var a = 40;                     // crank
  var c = 100;                     // rocker
  var d = 160;                    // distance between ground pins
  var p = 200;                    // length of slider
  var gamma = 80*Math.PI/180;     // angle between slider and rocker

  var invSlideO = new InvSlide(a,p,c,d,gamma,true); // create inverted slider-crank
  invSlideO.buttonCanvas("05", 120, 250, true, 1, true);
	invSlideO.setLims([[-65,265],[-90,90],[-195,110]]); //[[dL,dH],[vL,vH],[aL,aH]]
  invSlideO.drawGround();
  invSlideO.draw(0);
	
	// ***** dimensions of inverted slider-crank
  var a = 40;                     // crank
  var c = 100;                     // rocker
  var d = 160;                    // distance between ground pins
  var p = 200;                    // length of slider
  var gamma = 80*Math.PI/180;     // angle between slider and rocker
	
	var invSlideC = new InvSlide(a,p,c,d,gamma,false); // create inverted slider-crank
  invSlideC.buttonCanvas("06", 120, 200, true, 1, true);
	invSlideC.setLims([[-170,200],[-90,90],[-195,110]]); //[[dL,dH],[vL,vH],[aL,aH]]
  invSlideC.drawGround();
  invSlideC.draw(0);

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
	
	// Start other page scripts
	navbar();
	Select_Animation();
}






