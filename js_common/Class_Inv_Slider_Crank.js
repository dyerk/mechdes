InvSlide.prototype = new Linkage();

// **********************************************************************************
// Function InvSlide creates a linkage two bars, a slider and a rocker
// **********************************************************************************
function InvSlide(a,p,c,d,gamma,isOpen) {
  this.bar = [new Bar(a, this.geom, this.color[3], this.color[6]),
              new Slider(p, this.geom, this.color[3], this.color[12]),
              new Rocker(c, gamma, this.geom, this.color[3], this.color[9])];

  this.pivot = [new Pivot(0, 0, this.geom),
                new Pivot(d, 0, this.geom)];

  this.bar[2].x = d;

  this.bar[2].x = d;  // x coordinate of grounded rocker pivot
  this.bar[2].y = 0;  // y coordinate of grounded rocker pivot

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
	
	this.type = "invSlider";					// declare linkage type
	this.IC = new Array();						// initialize array for instant centers
	this.connect = [[1,3,2],[0,4,1]]; // connectivity matrix - floating IC must be middle #
	
	this.tracePoint = new Array(3);		// initialize array for trace points
	for (var i = 0; i < 2; i++){
		this.tracePoint[i] = {x:0,y:0};
	}
  this.isOpen = isOpen; // open or crossed configuration?
}

// **********************************************************************************
// InvSlide.draw - calculates the linkage angles and draws the bars
// **********************************************************************************
InvSlide.prototype.draw = function(angle) {
  var a = this.bar[0].L;         // crank length
  var c = this.bar[2].L;         // rocker length
  var d = this.pivot[1].x;       // distance between ground pivots
  var p = this.bar[1].p;         // slider length
  var gamma = this.bar[2].gamma; // angle between rocker and slider
  var theta2 = angle;            // current crank angle

// ***** solve for angle of rocker and length of slider
  var A = -c*Math.cos(gamma);
  var B = -c*Math.sin(gamma);
  var r = -a*Math.cos(theta2) + d;
  var s = -a*Math.sin(theta2);
  var f2 = r*r + s*s;
  if (this.isOpen) {
    var b = -A + Math.sqrt(f2 - B*B);  // length of slider (open)
  } else {
    var b = -A - Math.sqrt(f2 - B*B);  // length of slider (crossed)
  }
  A = b + A;
  
  var theta3 = Math.atan2(A*s-B*r, A*r+B*s);  // angle of slider
  var theta4 = theta3 + gamma;                // angle of rocker

// perform velocity analysis
  var omega2 = this.omega;
  var s2 = Math.sin(theta2); var c2 = Math.cos(theta2);
  var s3 = Math.sin(theta3); var c3 = Math.cos(theta3);
  var s4 = Math.sin(theta4); var c4 = Math.cos(theta4);
  var det = -b + c*Math.cos(theta4-theta3);  // determinant of Jacobian matrix

  var b1 =  a*omega2*s2;
  var b2 = -a*omega2*c2;
  var a11 = -b*s3 + c*s4; var a12 = c3;
  var a21 =  b*c3 - c*c4; var a22 = s3;
  var omega3 = (a22*b1-a12*b2)/det;
  var bdot   = (a11*b2-a21*b1)/det;
  this.vB.x = -a*omega2*s2;
  this.vB.y =  a*omega2*c2;
  this.vP.x = this.vB.x - p*omega3*s3;
  this.vP.y = this.vB.y + p*omega3*c3;

// perform acceleration analysis
  var d1 = a*omega2*omega2*c2 + 2*bdot*omega3*s3 + b*omega3*omega3*c3 - c*omega3*omega3*c4;
  var d2 = a*omega2*omega2*s2 - 2*bdot*omega3*c3 + b*omega3*omega3*s3 - c*omega3*omega3*s4;
  var alpha3 = (a22*d1-a12*d2)/det;
  var bddot  = (a11*d2-a21*d1)/det;
  this.aB.x = -a*omega2*omega2*c2;
  this.aB.y = -a*omega2*omega2*s2;
  this.aP.x = this.aB.x - p*omega3*omega3*c3 - p*alpha3*s3;
  this.aP.y = this.aB.y - p*omega3*omega3*s3 + p*alpha3*c3;

// update link angles
  this.bar[0].theta = theta2;  // crank angle
  if (this.isOpen) {
    this.bar[1].theta = theta3;  // slider angle
  } else {
    this.bar[1].theta = Math.PI + theta3;  // slider angle
  }
  this.bar[2].theta = theta4;  // rocker angle

// update link positions
  this.bar[1].x = a*Math.cos(-theta2);
  this.bar[1].y = a*Math.sin(-theta2);

// update trace positions
  this.tracePoint[1].x = this.bar[1].x + this.bar[1].p*Math.cos(-this.bar[1].theta);
  this.tracePoint[1].y = this.bar[1].y + this.bar[1].p*Math.sin(-this.bar[1].theta);
	this.tracePoint[0].x = this.bar[1].x;
	this.tracePoint[0].y = this.bar[1].y;
	
// Displacement
	this.dB.x = this.bar[1].x;
  this.dB.y = -this.bar[1].y;
  this.dP.x = this.tracePoint[0].x;
  this.dP.y = -this.tracePoint[0].y;
	
	// Calculate Instant Centers
	if (this.showIC) {
		this.IC[0] = new InstantCenter(0,0,"red","12",this.geom);									// IC12 at Pivot O2
		this.IC[1] = new InstantCenter(this.dB.x,-this.dB.y,"red","23",this.geom); // IC23 at Pin B
		this.IC[2] = new InstantCenter(this.pivot[1].x,-this.pivot[1].y,"red","14",this.geom); // IC14 at Pivot O4
		this.IC[3] = this.calcIC([this.IC[0],this.IC[1]],[this.IC[2],theta3],
												"pa","13",this.color[24]); //IC13
		this.IC[4] = this.calcIC([this.IC[0],this.IC[2]],[this.IC[1],theta3],
												"pa","24",this.color[12]); //IC24
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

// **********************************************************************************
// InvSlide.drawGround - draw the two pivots
// **********************************************************************************
InvSlide.prototype.drawGround = function() {
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.pivot[0].draw(this.ctx[1]);
  this.pivot[1].draw(this.ctx[1]);
  this.ctx[1].restore();
}

