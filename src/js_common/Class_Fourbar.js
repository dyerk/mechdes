Fourbar.prototype = new Linkage();

// *******************************************************************************************
// Function Fourbar creates a linkage of two bars, a coupler, and two ground pins
// *******************************************************************************************
function Fourbar(a,b,c,d,p,beta,iClass,open) {
  this.bar = [new Bar(a, this.geom, this.color[3], this.color[5]),
              new Coupler(b, p, beta, this.geom, this.color[3], this.color[15]),
              new Bar(c, this.geom, this.color[3], this.color[10])];

  this.pivot = [new Pivot(0, 0, this.geom),
                new Pivot(d, 0, this.geom)];

  this.open = open;  // open or crossed configuration?
  this.iClass = iClass;  // class of fourbar linkage (1-19)

	this.type = "fourbar";						// declare type of linkage
	
	this.IC = new Array();						// initialize array for instant centers
	this.connect = [[1,4,2],[0,5,1]]; // connectivity matrix - floating IC must be middle #
	
	this.tracePoint = new Array();		// initialize array for trace points
	for (var i = 0; i < 3; i++){
		this.tracePoint[i] = {x:0,y:0};
	}
	
	// find minimum and maximum crank angles for non-Grashof linkages
  switch (iClass) {
    case 5:
      this.crankMin = -Math.acos((a*a + d*d - (b+c)*(b+c))/(2*a*d));
      this.crankMax = -this.crankMin;
      break;
    case 6:
      this.crankMin = Math.acos((d*d + c*c - (a+b)*(a+b))/(2*c*d)) - Math.PI;
      this.crankMax = -2*Math.PI - this.crankMin;
      break;
    case 7:
      this.crankMin = Math.acos((d*d + c*c - (a-b)*(a-b))/(2*c*d)) - Math.PI;
      this.crankMax = -this.crankMin;
      break;
    case 8:
      this.crankMin = -Math.acos((a*a + d*d - (b-c)*(b-c))/(2*a*d));
      this.crankMax = -2*Math.PI - this.crankMin;
      break;
    case 9:
      this.crankMin = Math.acos((d*d + c*c - (b-a)*(b-a))/(2*c*d)) - Math.PI;
      this.crankMax = -this.crankMin;
      break;
    case 10:
      this.crankMin = -Math.acos((a*a + d*d - (c-b)*(c-b))/(2*a*d));
      this.crankMax = -2*Math.PI - this.crankMin;
      break;
  }
  
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
}

// ****************************************************************************************
// Fourbar.draw - calculates the linkage angles and draws the bars
// ****************************************************************************************
Fourbar.prototype.draw = function(angle) {
  var a = this.bar[0].L;    // crank length
  var b = this.bar[1].L;    // coupler length
  var c = this.bar[2].L;    // rocker length
  var d = this.pivot[1].x;  // ground length
  var p = this.bar[1].p;    // length to point p on coupler

  switch (this.iClass) {

// ***** these are the cases where the crank drives the linkage *****
    case 2:
      var theta = this.solve(b, -c, d-a*Math.cos(angle),-a*Math.sin(angle), this.open);
      var theta2 = angle;
      var theta3 = theta[0];
      var theta4 = theta[1];
      break;

// ***** these are the cases where the coupler drives the linkage *****
    case 1:
    case 3:
      var theta = this.solve(a, -c, d-b*Math.cos(angle), -b*Math.sin(angle), this.open);
      var theta3 = angle;
      var theta2 = theta[0];
      var theta4 = theta[1];
      break;

// ***** these are the cases where the rocker drives the linkage *****      
    case 4:
      var theta = this.solve(a, b, c*Math.cos(angle) + d, c*Math.sin(angle), this.open);
      var theta4 = angle;
      var theta2 = theta[0];
      var theta3 = theta[1];
      break;

// ***** Non-Grashof cases	                                    *****
// ***** these are the cases where the crank drives the linkage *****
    case 5:
    case 8:
    case 10:
      var theta = this.solve(b, -c, d-a*Math.cos(angle),-a*Math.sin(angle), this.open);
      var theta2 = angle;
      var theta3 = theta[0];
      var theta4 = theta[1];
      break;

// ***** these are the cases where the rocker drives the linkage *****
    case 6:
    case 7:
    case 9:
      var theta = this.solve(a, b, c*Math.cos(angle) + d, c*Math.sin(angle), this.open);
      var theta4 = angle;
      var theta2 = theta[0];
      var theta3 = theta[1];
      break;

// ***** Special-case Grashof linkages
// ***** these are the cases where the crank drives the linkage *****
    case 12:
      var theta = this.solve(b, -c, d-a*Math.cos(angle),-a*Math.sin(angle), this.open);
      var theta2 = angle;
      var theta3 = theta[0];
      var theta4 = theta[1];
      break;

// ***** these are the cases where the coupler drives the linkage *****
    case 11:
    case 13:
      var theta = this.solve(a, -c, d-b*Math.cos(angle), -b*Math.sin(angle), this.open);
      var theta3 = angle;
      var theta2 = theta[0];
      var theta4 = theta[1];
      break;

// ***** these are the cases where the rocker drives the linkage *****      
    case 14:
      var theta = this.solve(a, b, c*Math.cos(angle) + d, c*Math.sin(angle), this.open);
      var theta4 = angle;
      var theta2 = theta[0];
      var theta3 = theta[1];
      break;
	  
// ***** Special Case Linkages - two identical pairs *****
// ground and crank are short links
    case 15:
      var theta2 = angle;
      var delta = Math.asin(a*Math.sin(theta2/2)/b);
      var theta3 = theta2/2 - delta;
      var theta4 = theta2/2 + delta;
      break;

// crank and coupler are short links
    case 16:
      var theta2 = angle;
      var gamma = 2*Math.atan2(a*Math.sin(theta2), d-a*Math.cos(theta2));
      var theta4 = Math.PI - gamma;
      var theta3 = theta4 - theta2;
      break;

// coupler and rocker are short links
    case 17:
      var theta4 = angle;
      var theta2 = 2*Math.atan2(b*Math.sin(theta4), a + b*Math.cos(theta4));
      var delta = 2*theta4 - theta2;
      var theta3 = theta4 - delta;
      break;

// rocker and ground are short links
    case 18:
      var theta4 = angle;
      var beta = 2*Math.asin(d*Math.cos(theta4/2)/a);
      var theta2 = 0.5*(Math.PI - beta + theta4);
      var theta3 = theta4 - theta2;
      break;

// parallelogram linkages
    case 19:
      var theta2 = angle;
      if (this.open) {
        var theta3 = 0;
        var theta4 = theta2;
      } else {
        var r = d - a*Math.cos(angle);
        var s = -a*Math.sin(angle);
        var p = b;
        var q = -c;
        var D = (r*r+s*s-p*p-q*q)/(2*p*q);
        if (Math.sin(angle) < 0) {
          var delta = Math.acos(D);
        } else {
          var delta = -Math.acos(D);
        }
        var A = p+q*D;
        var B = q*Math.sin(delta);
        var theta3 = Math.atan2(A*s-B*r, A*r+B*s);
        var theta4 = theta3 + delta;
      }
      break;	  
  }

// perform velocity analysis
  var omega2 = this.omega;
  var det = b*c*Math.sin(theta3-theta4);  // determinant of Jacobian matrix
  var s2 = Math.sin(theta2); var c2 = Math.cos(theta2);
  var s3 = Math.sin(theta3); var c3 = Math.cos(theta3);
  var s4 = Math.sin(theta4); var c4 = Math.cos(theta4);
  var s3b = Math.sin(theta3 + this.bar[1].beta);
  var c3b = Math.cos(theta3 + this.bar[1].beta);

  var b1 =  a*omega2*s2;
  var b2 = -a*omega2*c2;
  var a11 = -b*s3; var a12 =  c*s4;
  var a21 =  b*c3; var a22 = -c*c4;
  var omega3 = (a22*b1-a12*b2)/det;
  var omega4 = (a11*b2-a21*b1)/det;
  this.vB.x = -a*omega2*s2;
  this.vB.y =  a*omega2*c2;
  this.vC.x = -c*omega4*s4;
  this.vC.y =  c*omega4*c4;
  this.vP.x = this.vB.x - p*omega3*s3b;
  this.vP.y = this.vB.y + p*omega3*c3b;

// perform acceleration analysis
  var d1 = a*omega2*omega2*c2 + b*omega3*omega3*c3 - c*omega4*omega4*c4;
  var d2 = a*omega2*omega2*s2 + b*omega3*omega3*s3 - c*omega4*omega4*s4;
  var alpha3 = (a22*d1-a12*d2)/det;
  var alpha4 = (a11*d2-a21*d1)/det;
  this.aB.x = -a*omega2*omega2*c2;
  this.aB.y = -a*omega2*omega2*s2;
  this.aC.x = -c*omega4*omega4*c4 - c*alpha4*s4;
  this.aC.y = -c*omega4*omega4*s4 + c*alpha4*c4;
  this.aP.x = this.aB.x - p*omega3*omega3*c3b - p*alpha3*s3b;
  this.aP.y = this.aB.y - p*omega3*omega3*s3b + p*alpha3*c3b;
 
// update crank, coupler and rocker angles
  this.bar[0].theta = theta2; // crank angle
  this.bar[1].theta = theta3; // coupler angle
  this.bar[2].theta = theta4; // rocker angle

// update link positions
  this.bar[1].x =     a*Math.cos(theta2);
  this.bar[1].y =    -a*Math.sin(theta2);

// update tracing point positions
  this.tracePoint[0].x = this.bar[1].x;
  this.tracePoint[0].y = this.bar[1].y;
  this.tracePoint[1].x = this.bar[1].x + this.bar[1].p*Math.cos(-theta3 - this.bar[1].beta);
  this.tracePoint[1].y = this.bar[1].y + this.bar[1].p*Math.sin(-theta3 - this.bar[1].beta);
  this.tracePoint[2].x = c * Math.cos(-this.bar[2].theta) + d;
  this.tracePoint[2].y = c * Math.sin(-this.bar[2].theta);
	
// Displacement 
	this.dB.x = this.tracePoint[0].x;
  this.dB.y = -this.tracePoint[0].y;
  this.dP.x = this.tracePoint[1].x;
  this.dP.y = -this.tracePoint[1].y;
  this.dC.x = this.tracePoint[2].x;
  this.dC.y = -this.tracePoint[2].y;
	
	// Calculate Instant Centers
	if (this.showIC) {
		this.IC[0] = new InstantCenter(0,0,"red","12",this.geom);									  // IC12 at Pivot O2
		this.IC[1] = new InstantCenter(this.dB.x,-this.dB.y,"red","23",this.geom);	// IC23 at Pin B
		this.IC[2] = new InstantCenter(this.dC.x,-this.dC.y,"red","34",this.geom);	// IC34 at Pin C
		this.IC[3] = new InstantCenter(this.pivot[1].x,this.pivot[1].y,"red","14",this.geom);// IC14 at Pivot O4
		this.IC[4] = this.calcIC([this.IC[1],this.IC[0]],[this.IC[3],this.IC[2]],
														 "pp","13",this.color[24]);													// IC13
		this.IC[5] = this.calcIC([this.IC[1],this.IC[2]],[this.IC[0],this.IC[3]],
														 "pp","24",this.color[12]);													// IC24
	}
	
// clear canvas
  this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);
  this.ctx[3].clearRect(0, 0, this.can[3].width, this.can[3].height);

// draw the bars
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.bar[0].draw(this.ctx[1]);
  this.bar[2].draw(this.ctx[1]);
  this.ctx[1].restore();

  this.ctx[3].save();
  this.ctx[3].translate(this.x0,this.y0);
  this.bar[1].draw(this.ctx[3]);
  this.ctx[3].restore();
}

// **********************************************************************************************
// Fourbar.solve - solves for the two unknown angles of the fourbar linkage given the crank angle
// **********************************************************************************************
Fourbar.prototype.solve = function(p,q,r,s,open) {

  var theta = [];
  var D = (r*r+s*s-p*p-q*q)/(2*p*q);
  if (open) {
    var delta = Math.acos(D);
  } else {
    var delta = -Math.acos(D);
  }
  var A = p+q*D;
  var B = q*Math.sin(delta);
  theta[0] = Math.atan2(A*s-B*r, A*r+B*s);
  theta[1] = theta[0] + delta;
  return theta;
}

// *********************************************************************************************
// Fourbar.drawGround - draw the two pivots
// *********************************************************************************************
Fourbar.prototype.drawGround = function() {
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.pivot[0].draw(this.ctx[2]);
  this.pivot[1].draw(this.ctx[2]);
  this.ctx[2].restore();
}

