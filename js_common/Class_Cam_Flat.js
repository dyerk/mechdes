CamFlat.prototype = new Linkage();

// *********************************************************************************************************************
// Function CamFlat creates a cam/follower linkage with cam, flat follower, ground pin and ground slider
// *********************************************************************************************************************
function CamFlat(nDwell, rb, h, betad, betar, L, W) {
  this.cam = new Cam(nDwell, rb, h, betad, betar, this.geom, this.color[3], this.color[15]);
  this.follow = new FollowFlat(L, W, this.geom, this.color[3], this.color[6]);
  this.pivot = new Pivot(0, 0, this.geom);
  var w2 = this.geom.barWidth/2;
  this.groundSlider = new Ground_Slider(rb+L, -w2, L, this.geom);
}

// *********************************************************************************************************************
// CamFlat.draw - plots the cam and follower
// *********************************************************************************************************************
CamFlat.prototype.draw = function(angle) {
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
// CamFlat.solve - calculates the follower position
// *********************************************************************************************************************
CamFlat.prototype.solve = function() {

// estimate point of contact between cam and follower
  var theta = this.cam.theta;  // angle that cam has been rotated
  var cxMax = -1000;
  var maxIndex = 0;
  for (i = 0; i < 361; i++) {
	var crx = Math.cos(theta)*this.cam.cx[i] - Math.sin(theta)*this.cam.cy[i];
	if (crx > cxMax) {
	  maxIndex = i;
	  cxMax = crx;
	}
  }

// ***** use Newton-Raphson to find where cam normal is horizontal *****
  var q = this.cam.alpha[maxIndex];  // max x coordinate is starting point for N-R
  for (j = 0; j < 100; j++) {
    phi = this.phi(q);
    if (Math.abs(phi) < 1e-10) { // have we found a solution?
	  var cxr = this.cam.splineint(this.cam.alpha,this.cam.cx,this.cam.cx2,361,q);
	  var cyr = this.cam.splineint(this.cam.alpha,this.cam.cy,this.cam.cy2,361,q);
      this.follow.x = Math.cos(theta)*cxr - Math.sin(theta)*cyr;
      break
    }
    var phi1 = this.phi(q-0.0001);  // calculate Jacobian 
    var phi2 = this.phi(q+0.0001);  // numerically
    var jac = (phi2 - phi1)/0.0002;
    var dq = -phi/jac;
    q = q + dq;
  }
}


// *********************************************************************************************************************
// CamFlat.phi - calculates the constraint function for flat-faced follower
// *********************************************************************************************************************
CamFlat.prototype.phi = function(q) {

  q = q % (2*Math.PI); // keep q under 2*pi
  var theta = this.cam.theta;
  var uBx = this.cam.splineint(this.cam.alpha,this.cam.ux,this.cam.ux2,361,q); // surface normal
  var uBy = this.cam.splineint(this.cam.alpha,this.cam.uy,this.cam.uy2,361,q); // surface normal
  var phi = Math.sin(theta)*uBx + Math.cos(theta)*uBy;
  return phi;
}

/**********************************************************************************************************************/
/* CamFlat.drawGround - draw the pivot and ground slider
/**********************************************************************************************************************/
CamFlat.prototype.drawGround = function() {
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.pivot.draw(this.ctx[2]);
  this.groundSlider.draw(this.ctx[2]);
  this.ctx[2].restore();
}

