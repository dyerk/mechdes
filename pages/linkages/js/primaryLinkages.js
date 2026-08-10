"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
	// ***** dimensions of threebar linkage *****
  var d = 160;               // ground
  var a =  60;               // crank
  var p = 250;               // length of slider
  var g = 160;               // length of slot

  var threebar = new Threebar(a,p,g,d);  // create threebar
  threebar.buttonCanvas("01", 120, 200);
	//threebar.setLims([[-65,315],[-95,65],[-155,145]]); //[[dL,dH],[vL,vH],[aL,aH],[xL,xH]]
  threebar.limits = {
    B: { dis: [-65, 65], vel: [-60, 60], acc: [-70, 70] },
    P: { dis: [-65, 315],  vel: [-95, 65], acc: [-160, 160] },
  };
  threebar.initPlots();
  threebar.drawGround();
  threebar.draw(0);
  
  // ***** dimensions of fourbar linkage *****
  var d = 160;               // ground
  var a =  80;               // crank
  var b = 170;               // coupler
  var c = 120;               // rocker
  var p  = 70;               // coupler offset
  var beta = 40*Math.PI/180; // coupler offset angle

  var fourbar = new Fourbar(a,b,c,d,p,beta,2,true);  // create fourbar
  fourbar.buttonCanvas("02", 120, 230);
	//fourbar.setLims([[-85,235],[-85,165],[-325,185]]); //[[dL,dH],[vL,vH],[aL,aH]]
  fourbar.limits = {
    B: { dis: [-65, 65], vel: [-85, 85], acc: [-80, 80] },
    P: { dis: [-65, 200],  vel: [-95, 65], acc: [-160, 100] },
    C: { dis: [0, 250], vel: [-85,165], acc: [-325,185]}
  };
  fourbar.initPlots();
  fourbar.drawGround();
  fourbar.draw(0);

  // ***** dimensions of slider-crank linkage *****
  var a = 60;                // crank
  var b = 130;               // connecting rod
  var c = 60;                // vertical distance to slot

  var sliderCrank = new SliderCrank(a,b,c);  // create slider-crank
  sliderCrank.buttonCanvas("03", 140, 210);
	//sliderCrank.setLims([[-65,185],[-65,105],[-105,150]]); //[[dL,dH],[vL,vH],[aL,aH]]
  sliderCrank.limits = {
    B: { dis: [-65, 65], vel: [-85, 85], acc: [-80, 80] },
    C: { dis: [0, 200], vel: [-85,125], acc: [-200,200]}
  };
  sliderCrank.initPlots();
  sliderCrank.drawGround();
  sliderCrank.draw(0);

  // ***** dimensions of inverted slider-crank
  a = 60;                     // crank
  c = 70;                     // rocker
  d = 160;                    // distance between ground pins
  p = 220;                    // length of slider
  var gamma = 70*Math.PI/180; // angle between slider and rocker
  var hLink = 60;             // width of slider

  var invSlide = new InvSlide(a,p,c,d,gamma,true); // create inverted slider-crank
  invSlide.buttonCanvas("04", 120, 250);
	//invSlide.setLims([[-65,265],[-90,90],[-195,110]]); //[[dL,dH],[vL,vH],[aL,aH]]
  invSlide.limits = {
    B: { dis: [-65, 65], vel: [-85, 85], acc: [-80, 80] },
    P: { dis: [-65, 75],  vel: [-100, 100], acc: [-200, 200] },
  };
  invSlide.initPlots();
  invSlide.drawGround();
  invSlide.draw(0);

  // ***** dimensions of fivebar linkage
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

  var fivebar = new Fivebar(a,b,c,u,v,p,q,gamma3,gamma4,D1,D2); // create fivebar linkage
  fivebar.showPlots = false;
	fivebar.buttonCanvas("05", 190, 275);
  fivebar.drawGround();
  fivebar.draw(0);
  
  // ***** dimensions of cam with rocker follower *****
  var nDwell = 3;            // number of dwells on cam
  var rb =  50;              // base radius of cam
  var h = [10, 20, 40];        // dwell heights on cam
  var betad = [100, 40, 30];   // dwell angles on cam (degrees)
  var betar = [ 60, 50, 80];   // rise/fall angles on cam
  var R = 20;                // radius of roller follower
  var L = 150;                // length of bar on follower
  var d = 200;                // distance between ground pins

  var camrock = new CamRock(nDwell, rb, h, betad, betar, R, L, d);  // create cam with flat-faced follower
  camrock.showPlots = false;
	camrock.showTrace = false;
	camrock.buttonCanvas("06", 160, 200);
  camrock.drawGround();
  camrock.draw(0);
	
	// Start other page scripts
	Select_Animation();
}






