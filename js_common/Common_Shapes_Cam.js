// ********************************************************************************
// Function Cam creates a multiple-dwell cam
// ********************************************************************************
function Cam (nDwell, rb, h, betad, betar, pinGeom, lineColor, fillColor) {
  this.x = 0;                        // x-coordinate of center of pin on cam
  this.y = 0;                        // y-coordinate of center of pin on cam
  this.theta = 0;                    // current angle of cam
  this.omega = 10;                   // angular velocity of cam
  this.fillColor = fillColor;        // fill color of cam
  this.lineColor = lineColor;        // outline color for cam
  this.nDwell = nDwell;              // number of dwells on cam
  this.rb = rb;                      // base radius of cam
  this.h = h;                        // heights of each dwell
  this.betad = betad;                // dwell angles
  this.betar = betar;                // rise/fall angles
  this.pin = new Pin(0, 0, pinGeom); // create pin for cam
  this.cx = [];                      // x coordinate of cam profile
  this.cy = [];                      // y coordinate of cam profile
  this.ux = [];                      // x coordinate of unit normal to cam profile
  this.uy = [];                      // y coordinate of unit normal to cam profile
  this.cx2 = [];                     // 2nd derivative of x-coordinate of profile
  this.cy2 = [];                     // 2nd derivative of y-coordinate of profile
  this.ux2 = [];                     // 2nd derivative of x-coordinate of unit normal
  this.uy2 = [];                     // 2nd derivative of y-coordinate of unit normal
  this.alpha = [];                   // one degree increments of angle around cam
  
  this.profile();                    // create profile of cam
}

Cam.prototype.draw = function(context) {
  var M = this.cx.length;
  context.save();
  context.translate(this.x,this.y);    // move local origin to center of cam
  context.rotate(-this.theta);         // rotate cam
  context.lineWidth = 2;               // line width
  context.fillStyle = this.fillColor;  // fill color
  context.strokeStyle = this.lineColor;// outline color is black

  context.beginPath();
  context.moveTo(this.cx[0],-this.cy[0]);
  for (i = 1; i < M; i++) {
    context.lineTo(this.cx[i],-this.cy[i]);
  }
  context.closePath();
  context.fill();
  context.stroke();

  context.lineWidth = 1;
  context.moveTo(0,0);
  context.lineTo(this.cx[0],-this.cy[0]);
  context.stroke();
  
  this.pin.draw(context);           // draw the pin for the cam
  context.restore();                // restore original coordinate system
}

Cam.prototype.profile = function() {

// these values are calculated for unevenly-spaced points around the cam profile
  var alpha = [];  // angle on cam
  var cx = [];     // x-coordinate of cam profile
  var cy = [];     // y-coordinate of cam profile
  var ux = [];     // x-coordinate of unit normal to cam
  var uy = [];     // y-coordinate of unit normal to cam
  var nDwell = this.nDwell;  // number of dwell segments

  var N = 20;             // no. of points to calculate on each dwell/rise/fall
  var M = 2*nDwell*N + 1; // total number of points to calculate
  
// convert angular segments to radians
  for (i = 0; i < nDwell; i++) {
    this.betad[i] = Math.PI*this.betad[i]/180;
    this.betar[i] = Math.PI*this.betar[i]/180;
  }

// ***** calculate cam profile *****
  var k = 0;              // start index counter at 1
  var alpha0 = 0;         // starting angle for each segment

// main loop
  for (nd = 0; nd < nDwell; nd++) {  // loop through each dwell

// ***** dwell segment *****
    var beta = this.betad[nd];         // angle of dwell
    for (i = 0; i < N; i++) {          // loop through dwell segment
      var x = i/N;                     // x ranges from 0 to 1
      alpha[k] = x*beta + alpha0;      // current angle within dwell
	  var e = [Math.cos(alpha[k]), Math.sin(alpha[k])];  // unit vector in radial dir
      var r = this.rb + this.h[nd];    // radius to point B
	  cx[k] = r*e[0];                  // x coordinate of cam profile
	  cy[k] = r*e[1];                  // y coordinate of cam profile
	  ux[k] = -e[0];                   // x coordinate of unit normal
	  uy[k] = -e[1];                   // y coordinate of unit normal
      k = k + 1;                       // increment index counter
	}
    alpha0 = alpha0 + this.betad[nd];  // move angle to end of current dwell

// calculate the change in height from this dwell to the next
    if (nd == nDwell-1) {                     // if we are at final dwell, then height
      var dh = this.h[0] - this.h[nDwell-1];  // changes back to initial dwell,
    } else {                                  // otherwise height changes to next
      var dh = this.h[nd+1] - this.h[nd];     // dwell.
	}

// ***** rise (or fall) segment *****
    beta = this.betar[nd];             // angle of rise or fall
    var h = this.h[nd];                // starting height of rise or fall
    var z = this.omega/beta;           // omega/beta
    for (i = 0; i < N; i++) {
      x = i/N;                         // x ranges from 0 to 1
      alpha[k] = x*beta + alpha0;      // current angle within rise
      var svaj = this.camfunc(x,dh,h,z);
	  var s = svaj[0];                 // displacement
	  var v = svaj[1];
	  var a = svaj[2];
	  e = [ Math.cos(alpha[k]), Math.sin(alpha[k])];  // unit vector in radial dir
	  n = [-Math.sin(alpha[k]), Math.cos(alpha[k])];  // unit normal

      r = this.rb + s;                 // radius to point B
	  cx[k] = r*e[0];                  // x coordinate of cam profile
	  cy[k] = r*e[1];                  // y coordinate of cam profile

// calculate unit normal to cam profile    
      var V = v/this.omega;              // normalized velocity
      var A = a/(this.omega*this.omega); // normalized acceleration
      var tx = V*e[0] + r*n[0];             // tangent to cam profile
	  var ty = V*e[1] + r*n[1];
	  var L = Math.sqrt(tx*tx + ty*ty);
	  tx = tx / L;                          // convert to unit vector
	  ty = ty / L;
      ux[k] = -ty;                          // unit normal to cam profile
	  uy[k] =  tx;
      k = k + 1;                       // increment index counter
	}
    alpha0 = alpha0 + this.betar[nd];  // move angle to end of current rise
  }

// parameters at 360deg are the same as at 0deg
  alpha[M-1] = 2*Math.PI; // final angle is 360 degrees
  cx[M-1]    = cx[0];     // profile ends where it started
  cy[M-1]    = cy[0];     // profile ends where it started
  ux[M-1]    = ux[0];     // final unit normal is same as first
  uy[M-1]    = uy[0];     // final unit normal is same as first

// use campspline function to calculate estimated second derivatives
  var cx2 = this.spline(alpha, cx, M);  // these are for unevenly-spaced points
  var cy2 = this.spline(alpha, cy, M);  // around cam profile
  var ux2 = this.spline(alpha, ux, M);  // these are for unevenly-spaced points
  var uy2 = this.spline(alpha, uy, M);  // around cam profile
  
// use spline interpolation to estimate points every one degree around cam  
  for (i = 0; i < 361; i++) {
	this.alpha[i] = 2*i*Math.PI/360;
    this.cx[i] = this.splineint(alpha,cx,cx2,M,this.alpha[i]);
    this.cy[i] = this.splineint(alpha,cy,cy2,M,this.alpha[i]);	
    this.ux[i] = this.splineint(alpha,ux,ux2,M,this.alpha[i]);
    this.uy[i] = this.splineint(alpha,uy,uy2,M,this.alpha[i]);  	
  }
  
// estimate second derivatives for later use in spline interpolation  
  this.cx2 = this.spline(this.alpha, this.cx, 361);
  this.cy2 = this.spline(this.alpha, this.cy, 361);
  this.ux2 = this.spline(this.alpha, this.ux, 361);
  this.uy2 = this.spline(this.alpha, this.uy, 361);  
}

// This is the cam rise/fall function.  It uses a 3-4-5 polynomial
Cam.prototype.camfunc = function(x,dh,h,z) {

  var f = [];
  f[0] = dh*(10*Math.pow(x,3) - 15*Math.pow(x,4) + 6*Math.pow(x,5)) + h; // displacement
  f[1] = 30*dh*(Math.pow(x,2) -  2*Math.pow(x,3) +   Math.pow(x,4))*z;   // velocity
  f[2] = 60*dh*(          x   -  3*Math.pow(x,2) + 2*Math.pow(x,3))*Math.pow(z,2); // acceleration
  f[3] = 60*dh*(          1   -  6*x             + 6*Math.pow(x,2))*Math.pow(z,3); // jerk

  return f;
}

// This function estimates the second derivative of a cubic spline function
// that interpolates the points around the cam profile
Cam.prototype.spline = function(x,y,n) {
  var y2 = [];  // second derivative of function
  var u  = [];
  y2[0]   = 0;  // second derivative starts and ends at zero
  y2[n-1] = 0;
  u[0]  = 0;

  for (i = 1; i < n-1; i++) {
	var dx1 = x[i+1] - x[i];
    var dx2 = x[i] - x[i-1];
    var dx3 = dx1 + dx2;
	var dy1 = y[i+1] - y[i];
	var dy2 = y[i] - y[i-1];
	
    var sig = dx2 / dx3;
    var p = sig * y2[i-1] + 2;
    y2[i] = (sig - 1)/p;
    u[i] = (6*(dy1/dx1 -  dy2/dx2)/dx3 - sig*u[i-1])/p;
  }

  for (k = n-2; k > 1; k--) {
    y2[k] = y2[k]*y2[k+1] + u[k];
  }
  return y2
}

Cam.prototype.splineint = function(xa,ya,y2a,n,x) {
  var klo = 0;
  var khi = n-1;
  while (khi - klo > 1) {
	k = Math.round((khi + klo) / 2);
	if (xa[k] > x) {
	  khi = k;
	} else {
	  klo = k;
	}
  }
  var h = xa[khi] - xa[klo];
  a = (xa[khi] - x)/h;
  b = (x - xa[klo])/h;
  y = a*ya[klo] + b*ya[khi] + (a*(a*a-1)*y2a[klo] + b*(b*b-1)*y2a[khi])*(h*h)/6;

  return y;
}

// ********************************************************************************
// Function Roller creates a roller with a pin and a circle
// ********************************************************************************
function Roller (R, geom, lineColor, fillColor) {
  this.x = 0;                          // x-coordinate of center of pin on roller
  this.y = 0;                          // y-coordinate of center of pin on roller
  this.lineColor = lineColor;          // line color of roller
  this.fillColor = fillColor;          // fill color of roller
  this.R = R;                          // outer radius of roller
  this.pin = new Pin(0, 0, geom);      // pin at center of flywheel
}

Roller.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);    // move local origin to center of roller
  context.lineWidth = 2;                // line width
  context.fillStyle = this.fillColor;   // fill color
  context.strokeStyle = this.lineColor; // line color
  
  context.beginPath();                  
  context.arc( 0, 0,  this.R, 0,   2*Math.PI); // draw the circle
  context.closePath();
  context.fill();
  context.stroke();

  this.pin.draw(context);     // draw pin in local coordinate system
  context.restore();          // restore the original coordinate system
};

// ********************************************************************************
// Function FollowFlat draws a flat-faced follower
// ********************************************************************************
function FollowFlat (L, W, geom, lineColor, fillColor) {
  this.x = 0;                      // x-coordinate of center of left face of follower
  this.y = 0;                      // y-coordinate of center of left face of follower
  this.w = geom.barWidth;          // width of bar on follower
  this.W = W;                      // height of head of follower
  this.L = L;                      // length of follower in x-direction
  this.lineColor = lineColor;      // line color
  this.fillColor = fillColor;      // fill color  
}

FollowFlat.prototype.draw = function(context) {
  var w  = this.w;     // width of follower rod
  var w2 = this.w/2;   // half width of follower rod
  var W2 = this.W/2;   // half width of follower head
  
  context.save();
  context.translate(this.x,this.y);     // move to center of pin
  context.lineWidth = 2;                // line width
  context.fillStyle = this.fillColor;   // fill color
  context.strokeStyle = this.lineColor; // outline is black
  
  context.beginPath();              // draw the follower
  context.moveTo(0, -W2);
  context.lineTo(w2, -W2);
  context.arc(w2, -W2+w2, w2, -Math.PI/2, 0, false); // draw circle
  context.lineTo(this.w, -w2);
  context.lineTo(this.L, -w2);
  context.lineTo(this.L,  w2);
  context.lineTo(this.w,  w2);
  context.lineTo(this.w,  W2-w2);
  context.arc(w2, W2-w2, w2, 0, Math.PI/2, false); // draw circle
  context.lineTo(0,  W2);
  context.closePath();
  context.fill();
  context.stroke();

  context.restore();       // restore the original coordinate system
};

// ********************************************************************************
// Function FollowKnife draws a knife-edged follower
// ********************************************************************************
function FollowKnife (L, geom, lineColor, fillColor) {
  this.x = 0;                      // x-coordinate of center of left face of follower
  this.y = 0;                      // y-coordinate of center of left face of follower
  this.w = geom.barWidth;          // width of bar on follower
  this.L = L;                      // length of follower in x-direction
  this.lineColor = lineColor;      // line color
  this.fillColor = fillColor;      // fill color
}

FollowKnife.prototype.draw = function(context) {
  var w  = this.w;     // width of follower
  var w2 = this.w/2;   // half width of follower rod
  
  context.save();
  context.translate(this.x,this.y);     // move to center of pin
  context.lineWidth = 2;                // line width
  context.fillStyle = this.fillColor;   // fill color
  context.strokeStyle = this.lineColor; // line color
  
  context.beginPath();                  // draw the follower
  context.moveTo(0, 0);
  context.lineTo(2*w2, -w2);
  context.lineTo(this.L, -w2);
  context.lineTo(this.L,  w2);
  context.lineTo(2*w2,  w2);
  context.closePath();
  context.fill();
  context.stroke();

  context.restore();       // restore the original coordinate system
};