CamRock.prototype = new Linkage();

// **********************************************************************************
// Function CamRock creates a cam/follower linkage with cam, roller follower, ground pin and rocker bar
// **********************************************************************************
function CamRock(nDwell, rb, h, betad, betar, R, L, d) {
  this.cam = new Cam(nDwell, rb, h, betad, betar, this.geom, this.color[3], this.color[15]);
  this.roller = new Roller(R, this.geom, this.color[3], this.color[5]);
  this.bar = new Bar(L, this.geom, this.color[3], this.color[9]);
  this.pivot = [new Pivot(0, 0, this.geom),
                new Pivot(d, 0, this.geom)];
  
  this.bar.x = d;  // x coordinate of ground pin of rocker
  this.bar.y = 0;  // y coordinate of ground pin of rocker
	
	this.IC = new Array();						// initialize array for instant centers
	this.connect = [[1,4,3],[1,5,3]]; // connectivity matrix - floating IC must be middle #
}

// *********************************************************************************
// CamRock.draw - plots the cam and follower
// *********************************************************************************
CamRock.prototype.draw = function(angle) {
  this.cam.theta = -angle;
  this.solve();

// draw the cam and follower
  this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.cam.draw(this.ctx[1]);
  this.roller.draw(this.ctx[1]);
  this.bar.draw(this.ctx[1]);
  this.ctx[1].restore();
	
	// Calculate Instant Centers
	if (this.showIC) {
		this.IC[0] = new InstantCenter(this.pivot[1].x,this.pivot[1].y,"red","12",this.geom);	// IC12 at Pivot O2
		this.IC[1] = new InstantCenter(this.roller.x,this.roller.y,"red","23",this.geom);// IC23 at roller center
		this.IC[2] = new InstantCenter(this.PC.x,this.PC.y,"red","34",this.geom);			   // IC34 betwn cam/roller
		this.IC[3] = new InstantCenter(0,0,"red","14",this.geom);	// IC14 at Pivot O4
		this.IC[4] = this.calcIC([this.IC[0],this.IC[1]],[this.IC[2],this.IC[3]],
														 "pp","13",this.color[10]); //IC13
		this.IC[5] = this.calcIC([this.IC[0],this.IC[3]],[this.IC[1],this.IC[2]],
														 "pp","24",this.color[24]); //IC24
	}
}

// *********************************************************************************
// CamRock.solve - calculates the follower position
// *********************************************************************************
CamRock.prototype.solve = function() {

// estimate point of contact between cam and follower
  var theta = this.cam.theta;   // angle that cam has been rotated
  var r = this.roller.R;        // radius of roller
  var c = this.bar.L;           // length of rocker
  var d = this.pivot[1].x;      // x coordinate of second ground pin
  var minDiff = 1000;
  var minIndex = 0;
  for (i = 0; i < 361; i++) {
		var cpx = this.cam.cx[i] - r * this.cam.ux[i];              // find pitch curve of cam & roller
		var cpy = this.cam.cy[i] - r * this.cam.uy[i];
		var cpxr = Math.cos(theta)*cpx - Math.sin(theta)*cpy;       // rotated x coord of pitch circle
		var cpyr = Math.sin(theta)*cpx + Math.cos(theta)*cpy;       // rotated y coord of pitch circle
		var g = [cpxr - d, cpyr];  // vector from C to D
		var Lg = Math.sqrt(g[0]*g[0] + g[1]*g[1]);  // length of g
		var dL = Math.abs(Lg - c);            // difference in length
		var theta4 = Math.atan2(g[1],g[0]);  // angle of rocker (must be positive)

		if ((dL < minDiff) && (theta4 > 0)) {
			minDiff = dL;
			minIndex = i;
			this.roller.x = cpxr;
			this.roller.y = cpyr;
			this.bar.theta = theta4;
		}
  }

// ***** use Newton-Raphson to find where roller contacts cam *****
  var q = this.cam.alpha[minIndex];  // max x coordinate is starting point for N-R
  for (j = 0; j < 100; j++) {
    phi = this.phi(q);
    if (Math.abs(phi) < 1e-10) { // have we found a solution?
	  var X = this.rollerCenter(q);
      this.roller.x = X[0];
			this.roller.y = -X[1];
      break
    }
    var phi1 = this.phi(q-0.00001);  // calculate Jacobian 
    var phi2 = this.phi(q+0.00001);  // numerically
    var jac = (phi2 - phi1)/0.00002;

    var dq = -phi/jac;
    q = q + dq;
	q = q % (2*Math.PI);
  }
	
	this.PC = {x:this.roller.x-this.roller.R*0.75, // point of contact?
						 y:this.roller.y+this.roller.R*0.75};
}

// *********************************************************************************
// CamRock.phi - calculates the constraint function for roller follower
// *********************************************************************************
CamRock.prototype.phi = function(q) {

  q = q % (2*Math.PI); // keep q under 2*pi
  var c = this.bar.L;       // length of rocker
  var d = this.pivot[1].x;  // x coordinate of rocker pivot
  var xC = this.rollerCenter(q);
  var g = [xC[0] - d, xC[1]];  // vector from roller to rocker pivot
  var L = Math.sqrt(g[0]*g[0] + g[1]*g[1]);  // length of vector
  var phi = c - L;
  return phi;
}

// *********************************************************************************
// CamRock.rollerCenter - calculates the interpolated coordinates of the center of the roller
// *********************************************************************************
CamRock.prototype.rollerCenter = function(q) {
  q = q % (2*Math.PI);  // keep q under 2*pi
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

// *********************************************************************************
// CamRock.drawGround - draw the two pivots
// *********************************************************************************
CamRock.prototype.drawGround = function() {
  this.ctx[4].save();
  this.ctx[4].translate(this.x0,this.y0);
  this.pivot[0].draw(this.ctx[4]);
  this.pivot[1].draw(this.ctx[4]);
  this.ctx[4].restore();
}