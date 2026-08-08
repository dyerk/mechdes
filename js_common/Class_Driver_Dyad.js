DriverDyad.prototype = new Linkage();

// *********************************************************************************************************************
// Function DriverDyad creates a fourbar linkage with driver dyad
// *********************************************************************************************************************
function DriverDyad(a, b, c, d, e, f, g, h, open, dyad) {

  if (dyad) {
    this.bar = [new Bar(a, this.geom, this.color[3], this.color[5]),  // Crank
                new Bar(b, this.geom, this.color[3], this.color[15]),  // Coupler
                new Coupler(c, e, 0, this.geom, this.color[3], this.color[10]), // 3 pin link
                new Bar(f, this.geom, this.color[3], this.color[5]),  // Coupler of second linkage
                new Bar(g, this.geom, this.color[3], this.color[10])], // Rocker of second linkage
    this.pivot = [new Pivot(  d, 0, this.geom),        // middle ground pivot
                  new Pivot(d+h, 0, this.geom)];       // right ground pivot
    this.bar[4].x = d + h;  // rocker on second linkage is grounded to right ground pivot

  } else {    // no driver dyad, just a normal fourbar

    this.bar = [new Bar(a, this.geom, this.color[3], this.color[5]),  // Crank
                new Bar(b, this.geom, this.color[3], this.color[15]), // Coupler
                new Bar(c, this.geom, this.color[3], this.color[10])]; // Rocker
    this.pivot = new Pivot(d, 0, this.geom);      // rocker ground pivot
  }

  this.bar[2].x = d;  // rocker on first linkage is grounded to middle ground pivot

  this.open   = open;     // open or crossed?
  this.dyad   = dyad;     // does it have a driver dyad?
  this.motor = new Motor(0, 0, this.geom, this.color[3], this.color[1]);  // create the motor at the origin pin
	this.tracePoint = new Array();		// initialize array for trace points
	for (var i = 0; i < 3; i++){
		this.tracePoint[i] = {x:0,y:0};
	}
}

// *********************************************************************************************************************
// DriverDyad.draw - calculates the linkage angles and draws the bars
// *********************************************************************************************************************
DriverDyad.prototype.draw = function(angle) {
  var a = this.bar[0].L;  // crank length
  var b = this.bar[1].L;  // coupler length
  var c = this.bar[2].L;     // rocker length
  var d = this.bar[2].x;  // ground length
  if (this.dyad) {
    var c = this.bar[2].L;     // rocker length of first fourbar
    var e = this.bar[2].p;     // crank length for second fourbar
    var f = this.bar[3].L;     // coupler length for second fourbar
    var g = this.bar[4].L;     // rocker length for second fourbar
    var h = this.bar[4].x - d; // ground length for second fourbar
  }

  var theta = this.solve(b, -c, d-a*Math.cos(angle), -a*Math.sin(angle), this.open);
  var theta2 = angle;
  var theta3 = theta[0];
  var theta4 = theta[1];

  if (this.dyad) {
    theta = this.solve(f, -g, h-e*Math.cos(theta4), -e*Math.sin(theta4), true);
    var theta5 = theta[0];
    var theta6 = theta[1];
    this.bar[3].theta = theta5;
    this.bar[4].theta = theta6;
  }

// update link angles
  this.bar[0].theta = theta2;  // crank angle
  this.bar[1].theta = theta3;  // coupler angle
  this.bar[2].theta = theta4;  // rocker angle

// update link positions
  this.bar[1].x = a*Math.cos(-theta2);
  this.bar[1].y = a*Math.sin(-theta2);

  if (this.dyad) {
    this.bar[3].x = e*Math.cos(-theta4) + d;  // x coordinate of second coupler
    this.bar[3].y = e*Math.sin(-theta4);      // y coordinate of second coupler
  }

// calculate tracing positions

  if (this.dyad) {
    this.tracePoint[0].x = this.bar[1].x;
    this.tracePoint[0].y = this.bar[1].y;
    this.tracePoint[1].x = this.bar[3].x;
    this.tracePoint[1].y = this.bar[3].y;
    this.tracePoint[2].x = g*Math.cos(-theta6) + d + h;
    this.tracePoint[2].y = g*Math.sin(-theta6);
  } else {
    this.tracePoint[0].x = this.bar[1].x;
    this.tracePoint[0].y = this.bar[1].y;
    this.tracePoint[1].x = c*Math.cos(-theta4) + d;
    this.tracePoint[1].y = c*Math.sin(-theta4);
  }

// move to screen origin and draw the bars
  this.ctx[1].clearRect(0,0,this.can[1].width,this.can[1].height);
  this.ctx[1].save();
  this.ctx[1].translate(this.x0, this.y0);

  if (this.dyad) {
    this.bar[0].draw(this.ctx[1]);
    this.bar[1].draw(this.ctx[1]);
    this.bar[2].draw(this.ctx[1]);
    this.bar[3].draw(this.ctx[1]);
    this.bar[4].draw(this.ctx[1]);
  } else {
    this.bar[0].draw(this.ctx[1]);  // draw the crank
    this.bar[1].draw(this.ctx[1]);  // draw the coupler
    this.bar[2].draw(this.ctx[1]);  // draw the rocker
  };
  this.ctx[1].restore();
}

/**********************************************************************************************************************/
/* DriverDyad.solve - solves for the two unknown angles of the fourbar linkage given the crank angle
/**********************************************************************************************************************/
DriverDyad.prototype.solve = function(p,q,r,s,open) {

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
/* DriverDyad.drawGround - draw the two pivots
/**********************************************************************************************************************/
DriverDyad.prototype.drawGround = function() {
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);

  if (this.dyad) {
    this.motor.draw(this.ctx[2]);   // draw the motor
    this.pivot[0].draw(this.ctx[2]);
    this.pivot[1].draw(this.ctx[2]);
  } else {
    this.motor.draw(this.ctx[2]);   // draw the motor
    this.pivot.draw(this.ctx[2]);
  };

  this.ctx[2].restore();
}
