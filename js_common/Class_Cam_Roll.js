CamRoll.prototype = new Linkage();

// *********************************************************************************************************************
// Function CamRoll creates a cam/follower linkage with cam, roller follower, ground pin and bar
// *********************************************************************************************************************
function CamRoll(nDwell, rb, h, betad, betar, R, L, b) {
  this.cam = new Cam(nDwell, rb, h, betad, betar, this.geom, this.color[3], this.color[15]);
  this.roller = new Roller(R, this.geom, this.color[3], this.color[9]);
  this.slider = new Slider(L, this.geom, this.color[3], this.color[6]);
  this.pivot = new Pivot(0, 0, this.geom);
  
  this.slider.y = -b;  // vertical offset of roller and bar
  this.roller.y = -b;
  var w2 = this.geom.barWidth/2;
  this.groundSlider = new Ground_Slider(rb+L, b-w2, L, this.geom);
}

// *********************************************************************************************************************
// CamFlat.draw - plots the cam and follower
// *********************************************************************************************************************
CamRoll.prototype.draw = function(angle) {
  this.cam.theta = -angle;
  this.solve();

// draw the cam and follower
  this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.cam.draw(this.ctx[1]);
  this.roller.draw(this.ctx[1]);
  this.slider.draw(this.ctx[1]);
  this.ctx[1].restore();
}

// *********************************************************************************************************************
// CamRoll.solve - calculates the follower position
// *********************************************************************************************************************
CamRoll.prototype.solve = function() {

// estimate point of contact between cam and follower
  var theta = this.cam.theta;  // angle that cam has been rotated
  var r = this.roller.R;        // radius of roller
  var minDiff = 1000;
  var minIndex = 0;
  for (i = 0; i < 361; i++) {
	var cpx = this.cam.cx[i] - r * this.cam.ux[i];  // find pitch curve of cam & roller
	var cpy = this.cam.cy[i] - r * this.cam.uy[i];
	var cpxr = Math.cos(theta)*cpx - Math.sin(theta)*cpy;       // rotated x coord of pitch circle
	var cpyr = Math.sin(theta)*cpx + Math.cos(theta)*cpy;       // rotated y coord of pitch circle
	var dy = Math.abs(cpyr + this.slider.y);

	if ((dy < minDiff) && (cpxr > 0)) {
	  minDiff = dy;
	  minIndex = i;
	  this.roller.x = cpxr;
	  this.slider.x = cpxr;
	}
  }

// ***** use Newton-Raphson to find where cam normal is horizontal *****
  var q = this.cam.alpha[minIndex];  // max x coordinate is starting point for N-R
  for (j = 0; j < 100; j++) {
    phi = this.phi(q);
    if (Math.abs(phi) < 1e-10) { // have we found a solution?
	  var X = this.rollerCenter(q);
      this.roller.x = X[0];
	  this.slider.x = X[0];
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
// CamRoll.phi - calculates the constraint function for roller follower
// *********************************************************************************************************************
CamRoll.prototype.phi = function(q) {

  q = q % (2*Math.PI); // keep q under 2*pi
  var xC = this.rollerCenter(q);
  var phi = xC[1] + this.slider.y;

  return phi;
}

// *********************************************************************************************************************
// CamRoll.rollerCenter - calculates the interpolated coordinates of the center of the roller
// *********************************************************************************************************************
CamRoll.prototype.rollerCenter = function(q) {

  var r = this.roller.R;
  var theta = this.cam.theta;
  var xBx = this.cam.splineint(this.cam.alpha,this.cam.cx,this.cam.cx2,361,q); // point of contact?
  var xBy = this.cam.splineint(this.cam.alpha,this.cam.cy,this.cam.cy2,361,q); // point of contact?
  var uBx = this.cam.splineint(this.cam.alpha,this.cam.ux,this.cam.ux2,361,q); // surface normal
  var uBy = this.cam.splineint(this.cam.alpha,this.cam.uy,this.cam.uy2,361,q); // surface normal

  var xCr = Math.cos(theta)*(xBx - r*uBx) - Math.sin(theta)*(xBy - r*uBy);
  var yCr = Math.sin(theta)*(xBx - r*uBx) + Math.cos(theta)*(xBy - r*uBy);

  return [xCr, yCr];
}

/**********************************************************************************************************************/
/* CamRoll.drawGround - draw the pivot and ground slider
/**********************************************************************************************************************/
CamRoll.prototype.drawGround = function() {
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.pivot.draw(this.ctx[2]);
  this.groundSlider.draw(this.ctx[2]);
  this.ctx[2].restore();
}
