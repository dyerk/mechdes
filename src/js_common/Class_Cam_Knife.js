CamKnife.prototype = new Linkage();

// *********************************************************************************************************************
// Function CamKnife creates a cam/follower linkage with cam, knife-edged follower, pivot and ground slider
// *********************************************************************************************************************
function CamKnife(nDwell, rb, h, betad, betar, L, W) {
  this.cam = new Cam(nDwell, rb, h, betad, betar, this.geom, this.color[3], this.color[15]);
  this.follow = new FollowKnife(L, this.geom, this.color[3], this.color[5]);
  this.pivot = new Pivot(0, 0, this.geom);
  var w2 = this.geom.barWidth/2;
  this.groundSlider = new Ground_Slider(rb+L, -w2, L, this.geom);
}

// *********************************************************************************************************************
// CamKnife.draw - plots the cam and follower
// *********************************************************************************************************************
CamKnife.prototype.draw = function(angle) {
  this.cam.theta = -angle;
  this.solve();

// draw the cam and follower
  this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.cam.draw(this.ctx[1]);
  this.follow.draw(this.ctx[1]);
  this.ctx[1].restore();
}

// *********************************************************************************************************************
// CamKnife.solve - calculates the follower position
// *********************************************************************************************************************
CamKnife.prototype.solve = function() {

// estimate point of contact between cam and follower
  var theta = this.cam.theta;  // angle that cam has been rotated
  var minDiff = 1000;
  for (i = 0; i < 361; i++) {
	var crx = Math.cos(theta)*this.cam.cx[i] - Math.sin(theta)*this.cam.cy[i];
	var cry = Math.sin(theta)*this.cam.cx[i] + Math.cos(theta)*this.cam.cy[i];
    if ((Math.abs(cry) < minDiff) && (crx > 0)) {
	  minDiff = Math.abs(cry);
	  this.follow.x = crx;
	}
  }
}

/**********************************************************************************************************************/
/* CamKnife.drawGround - draw the pivot and ground slider
/**********************************************************************************************************************/
CamKnife.prototype.drawGround = function() {
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.pivot.draw(this.ctx[2]);
  this.groundSlider.draw(this.ctx[2]);
  this.ctx[2].restore();
}





