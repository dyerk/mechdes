SixbarW1.prototype = new Linkage();  // create Watt's type I linkage from basic linkage

// *********************************************************************************************************************
// Function SixbarW1 creates a Watt type 1 sixbar linkage
// *********************************************************************************************************************
function SixbarW1(a,b,c,d,p,q,u,v,gamma3,gamma4) {
  this.bar = [new Bar(a, this.geom, this.color[3], this.color[6]),
              new Coupler(b, p, gamma3, this.geom, this.color[3], this.color[15]),
              new Coupler(c, q, gamma4, this.geom, this.color[3], this.color[20]),
              new Bar(u, this.geom, this.color[3], this.color[5]),
              new Bar(v, this.geom, this.color[3], this.color[10])];

  this.bar[0].x = 0;  // crank is pinned to ground
  this.bar[0].y = 0;  // at (0,0)
  this.bar[2].x = d;  // rocker is pinned to ground at
  this.bar[2].y = 0;  // right ground pivot
  
  this.pivot = [new Pivot(0, 0, this.geom),
                new Pivot(d, 0, this.geom)];
	
	this.type = "sixbar";					  	// declare type of linkage
	this.IC = new Array();						// initialize array for instant centers
	this.tracePoint = new Array();		// initialize array for trace points
	for (var i = 0; i < 3; i++){
		this.tracePoint[i] = {x:0,y:0};
	}
}

// *********************************************************************************************************************
// SixbarW1.draw - calculates the linkage angles and draws the bars
// *********************************************************************************************************************
SixbarW1.prototype.draw = function(angle) {
  var a = this.bar[0].L;   // crank length
  var b = this.bar[1].L;   // coupler length
  var c = this.bar[2].L;   // rocker length
  var d = this.pivot[1].x; // length between ground pivots
  var p = this.bar[1].p;   // length to third pin on crank
  var q = this.bar[2].p;   // length to third pin on coupler
  var u = this.bar[3].L;   // length of right lower bar
  var v = this.bar[4].L;   // length of right upper bar
  var gamma3 = this.bar[1].beta;
  var gamma4 = this.bar[2].beta;

// solve for coupler and rocker angles
  var theta = this.fourbarSolver(b,-c, d-a*Math.cos(angle),-a*Math.sin(angle),true);
  this.bar[0].theta = angle;    // crank angle
  this.bar[1].theta = theta[0]; // coupler angle
  this.bar[2].theta = theta[1]  // rocker angle

// solve for pin positions
  var Bx = a*Math.cos(angle);                      // top crank pin
  var By = a*Math.sin(angle);
  var Cx = Bx + b*Math.cos(this.bar[1].theta);     // right coupler pin
  var Cy = By + b*Math.sin(this.bar[1].theta);
  var Ex = Bx + p*Math.cos(this.bar[1].theta + gamma3); // third pin on upper coupler
  var Ey = By + p*Math.sin(this.bar[1].theta + gamma3);
  var Fx = q*Math.cos(this.bar[2].theta + gamma4) + d;  // third pin on lower coupler
  var Fy = q*Math.sin(this.bar[2].theta + gamma4);

// solve for angles of other two links
  theta = this.sixbarSolver(Ex,Ey,Cx,Cy,Fx,Fy,u,v);
  this.bar[3].theta = theta[0];
  this.bar[4].theta = theta[1];

  var Gx = Ex + u*Math.cos(this.bar[3].theta);     // top pin
  var Gy = Ey + u*Math.sin(this.bar[3].theta);

// update link positions
  this.bar[1].x =  Bx;  // right pin on crank
  this.bar[1].y = -By;
  this.bar[3].x =  Ex;
  this.bar[3].y = -Ey;
  this.bar[4].x =  Fx;
  this.bar[4].y = -Fy;

// calculate coordinates of trace points
  this.tracePoint[0].x =  Ex;
  this.tracePoint[0].y = -Ey;
  this.tracePoint[1].x =  Fx;
  this.tracePoint[1].y = -Fy;
  this.tracePoint[2].x =  Gx;
  this.tracePoint[2].y = -Gy;
  
// draw the bars
  this.ctx[1].clearRect(0,0,this.can[1].width,this.can[1].height);
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.bar[0].draw(this.ctx[1]);
  this.bar[2].draw(this.ctx[1]);
  this.ctx[1].restore();

  this.ctx[3].clearRect(0,0,this.can[3].width,this.can[3].height);
  this.ctx[3].save();
  this.ctx[3].translate(this.x0,this.y0);
  this.bar[1].draw(this.ctx[3]);
  this.bar[3].draw(this.ctx[3]);
  this.bar[4].draw(this.ctx[3]);
  this.ctx[3].restore();
}

/**********************************************************************************************************************/
/* SixbarW1.solve - solves for the two unknown angles of the fourbar linkage given the crank angle
/**********************************************************************************************************************/
SixbarW1.prototype.fourbarSolver = function(p,q,r,s,open) {

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

/**********************************************************************************************************************/
/* SixbarW1.sixbarSolver - solves for the two remaining unknown angles of the sixbar linkage
/**********************************************************************************************************************/
SixbarW1.prototype.sixbarSolver = function(Ax,Ay,Bx,By,Cx,Cy,u,v) {
  var dx1 = Ax - Bx;
  var dx2 = Cx - Bx;
  var dy1 = Ay - By;
  var dy2 = Cy - By;
  var beta = Math.atan2(dy2, dx2);        // new ground angle
  var theta2star = Math.atan2(dy1, dx1) - beta;  // new crank angle
  var aStar = Math.sqrt(dx1*dx1 + dy1*dy1);  // new crank length
  var dStar = Math.sqrt(dx2*dx2 + dy2*dy2);  // new ground length
  var theta = this.fourbarSolver(u,-v,dStar-aStar*Math.cos(theta2star),-aStar*Math.sin(theta2star),true);
  theta[0] = theta[0] + beta;
  theta[1] = theta[1] + beta;
  return theta;
}

/**********************************************************************************************************************/
/* SixbarW1.drawGround - draw the two pivots
/**********************************************************************************************************************/
SixbarW1.prototype.drawGround = function() {
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.pivot[0].draw(this.ctx[2]);
  this.pivot[1].draw(this.ctx[2]);
  this.ctx[2].restore();
}
