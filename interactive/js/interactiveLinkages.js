"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
	// Start other page scripts
	navbar();
	Select_Animation();
	
	// ***** dimensions of threebar linkage *****
  var d = 160;               // ground
  var a =  60;               // crank
  var p = 250;               // length of slider
  var g = 160;               // length of slot

  var threebar = new Threebar(a,p,g,d);  // create threebar
	threebar.buttonCanvas("01", 120, 280);
  threebar.drawGround();
  threebar.draw(0);
  
  // // ***** dimensions of fourbar linkage *****
  var d = 160;               // ground
  var a =  80;               // crank
  var b = 170;               // coupler
  var c = 120;               // rocker
  var p  = 70;               // coupler offset
  var beta = 40*Math.PI/180; // coupler offset angle

  var fourbar = new Fourbar(a,b,c,d,p,beta,2,true);  // create fourbar
	fourbar.buttonCanvas("02", 120, 280);
  fourbar.drawGround();
  fourbar.draw(0);
	fourbar.classify(a,b,c,d);

  // ***** dimensions of slider-crank linkage *****
  var a = 60;                // crank
  var b = 130;               // connecting rod
  var c = 60;                // vertical distance to slot

  var sliderCrank = new SliderCrank(a,b,c);  // create slider-crank
  sliderCrank.buttonCanvas("03", 120, 280);
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
  invSlide.buttonCanvas("04", 120, 280);
  invSlide.drawGround();
  invSlide.draw(0);
}