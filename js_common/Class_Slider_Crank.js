SliderCrank.prototype = new Linkage();

// **********************************************************************************
// Function SliderCrank creates a linkage of two bars, a piston and ground
// **********************************************************************************
function SliderCrank(a,b,c) {
  this.bar = [new Bar(a, this.geom, this.color[3], this.color[6]),   // crank
              new Bar(b, this.geom, this.color[3], this.color[12]),  // connecting rod
              new Piston(this.geom, this.color[3], this.color[19])]; // piston

  var width  = this.geom.pistonWidth;  // width of piston
  var height = this.geom.pistonHeight; // height of piston
  var alpha = Math.asin(c/(b-a));      // angle when piston is farthest back
  var xmin = (b-a)*Math.cos(alpha);    // leftmost piston position
  alpha = Math.asin(c/(b+a));          // angle when piston is farthest forward
  var xmax = (b+a)*Math.cos(alpha);    // rightmost piston position
  var w = xmax - xmin + width;         // width of ground slider rectangle
  var x = (xmax + xmin)/2;             // coordinate of center of ground slider rectangle
  var y = c - height/2;                // y coordinate of top of ground slider rectangle

  this.groundSlider = new Ground_Slider(x, y, w, this.geom);
  this.pivot = new Pivot(0, 0, this.geom);

  this.bar[2].y = -c;                  // vertical coordinate of piston

	this.dB = {x:0,y:0}; // current displacement of point B
	this.dC = {x:0,y:0}; // current displacement of point C
	this.dP = {x:0,y:0}; // current displacement of point P
 
  this.vB = {x:0,y:0}; // current velocity of point B
	this.vC = {x:0,y:0}; // current velocity of point C
	this.vP = {x:0,y:0}; // current velocity of point P
  this.omega = 1;  // angular velocity of crank
 
	this.aB = {x:0,y:0}; // current acceleration of point B
	this.aC = {x:0,y:0}; // current acceleration of point C
	this.aP = {x:0,y:0}; // current acceleration of point P
	
	this.type = "slider";							// declare linkage type
	this.IC = new Array();						// initialize array for instant centers
	this.connect = [[1,2,3],[0,4,1]]; // connectivity matrix - floating IC must be middle #
	
	this.tracePoint = new Array(2);		// initialize array for trace points
	for (var i = 0; i < 2; i++){
		this.tracePoint[i] = {x:0,y:0};
	}
}

// **********************************************************************************
// SliderCrank.draw - calculates the linkage angles and draws the bars
// **********************************************************************************
SliderCrank.prototype.draw = function(angle) {
  var a =  this.bar[0].L;  // crank length
  var b =  this.bar[1].L;  // connecting rod length
  var c = -this.bar[2].y;  // vertical offset of slot
  var theta2 = angle;

  var theta3 = Math.asin((c - a*Math.sin(theta2))/b);  // solve for connecting rod angle
  var d = a*Math.cos(theta2) + b*Math.cos(theta3);     // solve for horizontal distance to slider

// perform velocity analysis
  var omega2 = this.omega;
  var s2 = Math.sin(theta2); var c2 = Math.cos(theta2);
  var s3 = Math.sin(theta3); var c3 = Math.cos(theta3);
  var det = b*c3;  // determinant of Jacobian matrix
  var b1 =  a*omega2*s2;
  var b2 = -a*omega2*c2;
  var a11 = -b*s3; var a12 = -1;
  var a21 =  b*c3; var a22 =  0;
  var omega3 = (a22*b1-a12*b2)/det;
  var ddot   = (a11*b2-a21*b1)/det;
  this.vB.x = -a*omega2*s2;
  this.vB.y =  a*omega2*c2;
  this.vC.x = ddot;
  this.vC.y = 0;
	this.vP.x = ddot;		// label as vP for ease of plotting
  this.vP.y = 0;			// label as vP for ease of plotting

// perform acceleration analysis
  var d1 = a*omega2*omega2*c2 + b*omega3*omega3*c3;
  var d2 = a*omega2*omega2*s2 + b*omega3*omega3*s3;
  var alpha3 = (a22*d1-a12*d2)/det;
  var dddot  = (a11*d2-a21*d1)/det;
  this.aB.x = -a*omega2*omega2*c2;
  this.aB.y = -a*omega2*omega2*s2;
  this.aC.x = dddot;
  this.aC.y = 0;
	this.aP.x = dddot;		// label as aP for ease of plotting
  this.aP.y = 0;				// label as aP for ease of plotting

// update link angles
  this.bar[0].theta = theta2;
  this.bar[1].theta = theta3;

// update link positions
  this.bar[1].x =  a*Math.cos(-theta2);
  this.bar[1].y =  a*Math.sin(-theta2);
  this.bar[2].x =  d;

// Displacement 
	this.dB.x = this.bar[1].x;
  this.dB.y = -this.bar[1].y;
  this.dC.x = this.bar[2].x;
  this.dC.y = -this.bar[2].y;
	
	// trace points
	this.tracePoint[0].x = this.dB.x;
	this.tracePoint[0].y = -this.dB.y;
	this.tracePoint[1].x = this.dC.x;
	this.tracePoint[1].y = -this.dC.y;	

	// Calculate Instant Centers
	if (this.showIC) {
		this.IC[0] = new InstantCenter(0,0,"red","12",this.geom);									// IC12 at Pivot O2
		this.IC[1] = new InstantCenter(this.dB.x,-this.dB.y,"red","23",this.geom); // IC23 at Pin B
		this.IC[3] = new InstantCenter(this.dC.x,-this.dC.y,"red","",this.geom); // Pseudo IC for locating
		this.IC[3].pin.radius = 0; 																		// do not plot psuedo
		
		// Find IC13
		line1 = lineParams(this.IC[0],this.IC[1]);
		x13 = this.IC[3].x;
		y13 = line1.m * x13 + line1.b
		this.IC[2] = new InstantCenter(x13,y13,this.color[24],"13",this.geom);
		
		//Find IC24
		line2 = lineParams(this.IC[1],this.IC[3]);
		x24 = this.IC[0].x;
		y24 = line2.m * x24 + line2.b
		this.IC[4] = new InstantCenter(x24,y24,this.color[12],"24",this.geom);
	}
	
	
// clear canvas
  this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);

// draw the bars
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.bar[0].draw(this.ctx[2]);
  this.bar[1].draw(this.ctx[2]);
  this.bar[2].draw(this.ctx[2]);
  this.ctx[2].restore();
}

// ********************************************************************************
// SliderCrank.drawGround - draw the pivot and ground slider
// ********************************************************************************
SliderCrank.prototype.drawGround = function() {
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.groundSlider.draw(this.ctx[1]);
  this.pivot.draw(this.ctx[1]);
  this.ctx[1].restore();
}

