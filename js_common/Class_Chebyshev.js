Chebyshev.prototype = new Linkage();

// *********************************************************************************************************************
// Function Chebyshev creates a Chebyshev paradoxical mechanism
// *********************************************************************************************************************
function Chebyshev(a,b,c,d,e,f,g,h,iForward) {
  this.bar = [new Bar(a, this.geom, this.color[3], this.color[6]),              // crank
              new Coupler(b, b+e, 0, this.geom, this.color[3], this.color[15]), // coupler
              new Bar(c, this.geom, this.color[3], this.color[5]),              // rocker
              new Bar(f, this.geom, this.color[3], this.color[10]),             // connecting link
              new Flywheel(g, g+20, this.geom, this.color[3], this.color[20])]; // flywheel

  this.pivot = [new Pivot(0, 0, this.geom),
                new Pivot(d, 0, this.geom),
                new Pivot(d, h, this.geom)];

  this.bar[2].x =  d;  // rocker is pinned to right pivot
  this.bar[2].y =  0;
  this.bar[4].x =  d;  // flywheel is pinned to upper pivot
  this.bar[4].y = -h;

  this.iForward = iForward; // is the flywheel link rotating clockwise?
  this.kPrev = f - g;       // previous value of k, the distance between fixed pivot and point p
  this.betaPrev = -Math.PI; // previous value of beta, the angle inside triangle fgk
  this.revCount = 0;        // counts revolutions of the flywheel
	
	this.tracePoint = new Array();		// initialize array for trace points
	for (var i = 0; i < 1; i++){
		this.tracePoint[i] = {x:0,y:0};
	}
}

// *********************************************************************************************************************
// Chebyshev.draw - calculates the linkage angles and draws the bars
// *********************************************************************************************************************
Chebyshev.prototype.draw = function(theta2) {
  var a = this.bar[0].L;      // crank length
  var b = this.bar[1].L;      // coupler length
  var c = this.bar[2].L;      // rocker length
  var d = this.pivot[1].x;    // ground length
  var e = this.bar[1].p - b;  // length of coupler extension
  var f = this.bar[3].L;      // length of link attached to coupler
  var g = this.bar[4].r;      // length of flywheel link
  var h = this.pivot[2].y;    // height of third pivot

// solve for coupler and rocker angles
  var theta = this.solve(b, -c, d-a*Math.cos(theta2), -a*Math.sin(theta2), true);
  this.bar[0].theta = theta2;    // crank angle
  var theta3 = theta[0];
  var theta4 = theta[1];
  this.bar[1].theta = theta3; // coupler angle
  this.bar[2].theta = theta4; // rocker angle

// solve for positions of other two links
  var px = a*Math.cos(-theta2) + (b+e)*Math.cos(-theta3);  // x coordinate at end of coupler
  var py = a*Math.sin(-theta2) + (b+e)*Math.sin(-theta3);  // y coordinate at end of coupler

  var dx = px - d;  // x distance from fixed pivot to point p
  var dy = py + h;  // y distance from fixed pivot to point p

  var k = Math.sqrt(dx*dx + dy*dy);  // distance from fixed pivot to point p
  var alpha = Math.atan2(dy, dx);
  if ((dx < 0) && (dy > 0)) {
    alpha = alpha - 2*Math.PI;
  }

  var betaArg = (g*g + k*k - f*f)/(2*g*k);
  if (theta2 > 0) {
    if (betaArg > 1) {
      var beta = 0;
    } else if (betaArg < -1) {
      var beta = Math.PI;
    } else {
      var beta = Math.acos(betaArg);
    }
  } else {
    var beta = -Math.PI;
  }

  var dk = k - this.kPrev;  // is k increasing or decreasing?
  this.kPrev = k;
  if (this.iForward * dk > 0) {
    beta = -beta;
  }

  if (theta2 > 0) {
    var dBeta = beta - this.betaPrev
    if (Math.abs(dBeta) > 1.9*Math.PI) {
      this.revCount++;
    }
  }
  this.betaPrev = beta;
  var theta6 = alpha + beta + this.iForward * this.revCount*2*Math.PI;

  dx = g*Math.cos(-theta6) + d - px;
  dy = -g*Math.sin(-theta6) - h - py;
  var theta5 = Math.atan2(-dy, dx);

  this.bar[3].theta = theta5;
  this.bar[4].theta = -theta6;

// update link positions
  this.bar[1].x = a*Math.cos(-theta2);
  this.bar[1].y = a*Math.sin(-theta2);
  this.bar[3].x = px;
  this.bar[3].y = py;

// update tracing positions
  this.tracePoint[0].x = px;
  this.tracePoint[0].y = py;

// draw the bars
  this.ctx[1].clearRect(0,0,this.can[1].width,this.can[1].height);
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.bar[0].draw(this.ctx[1]);
  this.bar[1].draw(this.ctx[1]);
  this.bar[2].draw(this.ctx[1]);
  this.ctx[1].restore();

  this.ctx[3].clearRect(0,0,this.can[1].width,this.can[1].height);
  this.ctx[3].save();
  this.ctx[3].translate(this.x0,this.y0);
  this.bar[4].draw(this.ctx[3]);
  this.bar[3].draw(this.ctx[3]);  
  this.ctx[3].restore();
}

/**********************************************************************************************************************/
/* Chebyshev.solve - solves for the two unknown angles of the fourbar linkage given the crank angle
/**********************************************************************************************************************/
Chebyshev.prototype.solve = function(p,q,r,s,open) {

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
/* Chebyshev.drawGround - draw the two pivots
/**********************************************************************************************************************/
Chebyshev.prototype.drawGround = function() {
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.pivot[0].draw(this.ctx[2]);
  this.pivot[1].draw(this.ctx[2]);
  this.pivot[2].draw(this.ctx[2]);
  this.ctx[2].restore();
}