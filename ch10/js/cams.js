"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
	// ***** dimensions of cam with knife-edged follower *****

  var nDwell = 3;            // number of dwells on cam
  var rb =  50;              // base radius of cam
  var h = [10, 20, 40];      // dwell heights on cam
  var betad = [100, 40, 30]; // dwell angles on cam (degrees)
  var betar = [ 60, 50, 80]; // rise/fall angles on cam
  var L = 150;               // length of rod on follower

  var camknife = new CamKnife(nDwell, rb, h, betad, betar, L);  // create cam with knife-edged follower
	camknife.showPlots = false;
  camknife.calcLengths =false;
  camknife.buttonCanvas("01", 140, 200);
  camknife.drawGround();
  camknife.draw(0);
  
	// ***** dimensions of cam with flat-faced follower *****
  var nDwell = 3;            // number of dwells on cam
  var rb =  50;              // base radius of cam
  var h = [10, 20, 40];        // dwell heights on cam
  var betad = [100, 40, 30];   // dwell angles on cam (degrees)
  var betar = [ 60, 50, 80];   // rise/fall angles on cam
  var L = 150;               // length of rod on follower
  var W = 80;                // width of face of follower

  var camflat = new CamFlat(nDwell, rb, h, betad, betar, L, W);  // create cam with flat-faced follower
  camflat.showPlots = false;
  camflat.calcLengths = false;
	camflat.buttonCanvas("02", 140, 200);
  camflat.drawGround();
  camflat.draw(0);

	// ***** dimensions of cam with roller follower *****
  var nDwell = 3;            // number of dwells on cam
  var rb =  50;              // base radius of cam
  var h = [10, 20, 40];        // dwell heights on cam
  var betad = [100, 40, 30];   // dwell angles on cam (degrees)
  var betar = [ 60, 50, 80];   // rise/fall angles on cam
  var R = 20;                // radius of roller follower
  var L = 150;                // length of bar on follower
  var b = 30;                // vertical offset of follower

  var camroll = new CamRoll(nDwell, rb, h, betad, betar, R, L, b);  // create cam with flat-faced follower
  camroll.showPlots = false;
  camroll.calcLengths = false;
	camroll.buttonCanvas("03", 140, 200);
  camroll.drawGround();
  camroll.draw(0);
  
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
  camrock.calcLengths = false;
	camrock.buttonCanvas("04", 140, 200);
  camrock.drawGround();
  camrock.draw(0);
	
	// Start other page scripts
	Select_Animation();
}






