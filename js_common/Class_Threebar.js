Threebar.prototype = new Linkage();

// **********************************************************************************
// Function Threebar creates a linkage of a bar, a slider, and two ground pins
// **********************************************************************************
function Threebar(a,p,g,d) {
  this.bar = [new Bar(a, this.geom, this.color[3], this.color[6]),
              new BarSlot(p, a, d, this.geom, this.color[3], this.color[12])];

  this.pivot = [new Pivot(0, 0, this.geom),
                new Pivot(d, 0, this.geom)];
	
	this.type = "threebar";						// declare type of linkage
		
	this.IC = new Array();						// initialize array for instant centers
	this.connect = [[1,2,3]];					// connectivity matrix - floating IC must be middle #
	
	this.tracePoint = new Array(2);		// initialize array for trace points
	for (var i = 0; i < 2; i++){
		this.tracePoint[i] = {x:0,y:0};
	}
	
	this.dB = {x:0,y:0}; // current displacement of point B
	this.dP = {x:0,y:0}; // current displacement of point P
 
  this.vB = {x:0,y:0}; // current velocity of point B
	this.vP = {x:0,y:0}; // current velocity of point P
  this.omega = 1;  		 // angular velocity of crank
 
	this.aB = {x:0,y:0}; // current acceleration of point B
	this.aP = {x:0,y:0}; // current acceleration of point P
}

// **********************************************************************************
// Threebar.draw - calculates the linkage angles and draws the bars
// **********************************************************************************
Threebar.prototype.draw = function(angle) {
  var a = this.bar[0].L;    // crank length
  var d = this.pivot[1].x;  // ground length
  var p = this.bar[1].L;    // length of slider

	// solve for slider angle and length of slider
  var theta = this.solve(a, d, angle);
  var theta2 = angle;
  var theta3 = -theta[0];
  var b      =  theta[1];
  this.bar[0].theta = theta2; // crank angle
  this.bar[1].theta = theta3; // slider angle

	// update link positions
  this.bar[1].x =     a*Math.cos(-theta2);
  this.bar[1].y =     a*Math.sin(-theta2);

	// perform velocity analysis
  var omega2 = this.omega;
  var det = -b;  // determinant of Jacobian matrix
  var s2 = Math.sin(theta2); var c2 = Math.cos(theta2);
  var s3 = Math.sin(theta3); var c3 = Math.cos(theta3);
  var b1 =  a*omega2*s2;
  var b2 = -a*omega2*c2;
  var a11 = -b*s3; var a12 = c3;
  var a21 =  b*c3; var a22 = s3;
  var omega3 = (a22*b1-a12*b2)/det;
  var bdot   = (a11*b2-a21*b1)/det;
  this.vB.x = -a*omega2*s2;
  this.vB.y =  a*omega2*c2;
  this.vP.x = this.vB.x - p*omega3*s3;
  this.vP.y = this.vB.y + p*omega3*c3;

	// perform acceleration analysis
  var d1 = a*omega2*omega2*c2 + 2*bdot*omega3*s3 + b*omega3*omega3*c3;
  var d2 = a*omega2*omega2*s2 - 2*bdot*omega3*c3 + b*omega3*omega3*s3;
  var alpha3 = (a22*d1-a12*d2)/det;
  var bddot  = (a11*d2-a21*d1)/det;
  this.aB.x = -a*omega2*omega2*c2;
  this.aB.y = -a*omega2*omega2*s2;
  this.aP.x = this.aB.x - p*omega3*omega3*c3 - p*alpha3*s3;
  this.aP.y = this.aB.y - p*omega3*omega3*s3 + p*alpha3*c3;

	// update tracing point positions
  this.tracePoint[0].x = this.bar[1].x;
  this.tracePoint[0].y = this.bar[1].y;
  this.tracePoint[1].x = this.bar[1].x + this.bar[1].P*Math.cos(-this.bar[1].theta);
  this.tracePoint[1].y = this.bar[1].y + this.bar[1].P*Math.sin(-this.bar[1].theta);

	// Displacement 
	this.dB.x = this.tracePoint[0].x;
  this.dB.y = -this.tracePoint[0].y;
  this.dP.x = this.tracePoint[1].x;
  this.dP.y = -this.tracePoint[1].y;		
	
	// Calculate Instant Centers
	if (this.showIC) {
		this.IC[0] = new InstantCenter(0,0,"red","12",this.geom);									 // IC12 at Pivot O2
		this.IC[1] = new InstantCenter(this.dB.x,-this.dB.y,"red","23",this.geom); // IC23 at Pin B
		this.IC[2] = this.calcIC([this.IC[0],this.IC[1]],[this.pivot[1],theta3],
															'pa','13',this.color[24]);											 // IC13
		this.IC[3] = new InstantCenter(this.pivot[1].x,this.pivot[1].y,"red","",this.geom);
		this.IC[3].pin.radius = 0; //IC3 is used as anchor point for drawing line but is not IC so hide it
	}
	
	// clear canvas
  this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);
  
	// draw the crank
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);  
  this.bar[0].draw(this.ctx[2]);
  this.ctx[2].restore();

	// draw the slider
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);   
  this.bar[1].draw(this.ctx[2]);
  this.ctx[2].restore();
}

// **********************************************************************************
// Threebar.solve - solves for the angle and slider length in threebar linkage
// **********************************************************************************
Threebar.prototype.solve = function(a,d,theta2) {
  var theta = [];
  theta[0] = Math.atan2(a*Math.sin(theta2), d - a*Math.cos(theta2));
  theta[1] = (d - a*Math.cos(theta2)) / Math.cos(theta[0]);
  return theta;
}

// **********************************************************************************
// Threebar.drawGround - draw the two pivots
// **********************************************************************************
Threebar.prototype.drawGround = function() {
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.pivot[0].draw(this.ctx[1]);
  this.pivot[1].draw(this.ctx[1]);
  this.ctx[1].restore();
}

