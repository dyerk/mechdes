Fivebar.prototype = new Linkage();

// **********************************************************************************
// Function Fivebar creates a linkage of two gears, two couplers and two ground pins
// **********************************************************************************
function Fivebar(a,b,c,u,v,p,q,gamma3,gamma4,D1,D2) {
  this.bar = [new Gearbar(D1, a, this.geom, this.color[3], this.color[6]),
              new Coupler(b, p, gamma3, this.geom, this.color[3], this.color[16]),
              new Coupler(c, q, gamma4, this.geom, this.color[3], this.color[21]),
              new Gearbar(D2, v, this.geom, this.color[3], this.color[9])];

  this.pivot = [new Pivot(0, 0, this.geom),
                new Pivot(u, 0, this.geom)];

  this.bar[3].x = u;  // x coordinate of second gear
  this.bar[3].y = 0;  // y coordinate of second gear
	
	this.type = "fivebar";						// declare type of linkage
	this.IC = new Array();						// initialize array for instant centers
	this.connect = [[0,6,4],[0,7,4],[5,8,2],[5,9,2]]; // connectivity matrix - floating IC must be middle #
	
	this.tracePoint = new Array(3);		// initialize array for trace points
	for (var i = 0; i < 3; i++){
		this.tracePoint[i] = {x:0,y:0};
	}
}

// **********************************************************************************
// Fivebar.draw - calculates the linkage angles and draws the bars
// **********************************************************************************
Fivebar.prototype.draw = function(angle) {
  var a = this.bar[0].L;    // crank length
  var b = this.bar[1].L;    // coupler 1 length
  var c = this.bar[2].L;    // coupler 2 length
  var u = this.pivot[1].x;  // ground length
  var v = this.bar[3].L;    // rocker length

  var theta2 = angle;
  var theta5 = -(this.bar[0].D/this.bar[3].D)*theta2;  // angle of second gear
  
// solve for coupler and rocker angles
  var d = Math.sqrt(u*u + v*v + 2*u*v*Math.cos(theta5));
  var beta = Math.atan2(v*Math.sin(theta5), u + v*Math.cos(theta5));
  var theta2prime = theta2 - beta;
  var r = d - a*Math.cos(theta2prime);
  var s = a*Math.sin(theta2prime);
  var D = (b*b + c*c - r*r - s*s)/(2*b*c);
  var delta = Math.acos(D);
  var g = b - c*Math.cos(delta);
  var h = c*Math.sin(delta);
  var theta3prime = Math.atan2(h*r - g*s, g*r + h*s);
  
  this.bar[0].theta = theta2;                    // crank angle
  this.bar[1].theta = theta3prime + beta;        // coupler 1 angle
  this.bar[2].theta = this.bar[1].theta + delta; // coupler 2 angle
  this.bar[3].theta = theta5;                    // rocker angle

// update link positions
  this.bar[1].x =     a*Math.cos(-theta2);
  this.bar[1].y =     a*Math.sin(-theta2);
  this.bar[2].x = u + v*Math.cos(-theta5);
  this.bar[2].y =     v*Math.sin(-theta5);

// update tracing point positions
  this.tracePoint[0].x = this.bar[1].x + b*Math.cos(-this.bar[1].theta);
  this.tracePoint[0].y = this.bar[1].y + b*Math.sin(-this.bar[1].theta);
  this.tracePoint[1].x = this.bar[1].x + this.bar[1].p*Math.cos(-this.bar[1].theta - this.bar[1].beta);
  this.tracePoint[1].y = this.bar[1].y + this.bar[1].p*Math.sin(-this.bar[1].theta - this.bar[1].beta);
  this.tracePoint[2].x = this.bar[2].x + this.bar[2].p*Math.cos(-this.bar[2].theta - this.bar[2].beta);
  this.tracePoint[2].y = this.bar[2].y + this.bar[2].p*Math.sin(-this.bar[2].theta - this.bar[2].beta);

	// Calculate Instant Centers
	if (this.showIC) {
		this.IC[0] = new InstantCenter(0,0,"red","12",this.geom);														// IC12 at Pivot O2
		this.IC[1] = new InstantCenter(this.bar[1].x,this.bar[1].y,"red","23",this.geom);// IC23 
		this.IC[2] = new InstantCenter(this.tracePoint[0].x,this.tracePoint[0].y,"red","34",this.geom);// IC34
		this.IC[3] = new InstantCenter(this.bar[2].x,this.bar[2].y,"red","45",this.geom);// IC34
		this.IC[4] = new InstantCenter(this.pivot[1].x,this.pivot[1].y,"red","15",this.geom);// IC15 at Pivot O4
		this.IC[5] = new InstantCenter(this.bar[0].D/2,0,"red","25",this.geom);								// IC25 between gears
		this.IC[8] = this.calcIC([this.IC[5],this.IC[1]],[this.IC[2],this.IC[3]],
														 "pp","35",this.color[20]);													// IC35
		this.IC[9] = this.calcIC([this.IC[5],this.IC[3]],[this.IC[1],this.IC[2]],
														 "pp","24",this.color[24]);													// IC24
		this.IC[6] = this.calcIC([this.IC[0],this.IC[1]],[this.IC[4],this.IC[8]],
														 "pp","13",this.color[10]);													// IC13
		this.IC[7] = this.calcIC([this.IC[0],this.IC[9]],[this.IC[4],this.IC[3]],
														 "pp","14",this.color[15]);													// IC14
		
	}
	
// clear canvas
  this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);
  this.ctx[3].clearRect(0, 0, this.can[3].width, this.can[3].height);

// draw the bars
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.bar[3].draw(this.ctx[1]); // draw gear 2
  this.bar[0].draw(this.ctx[1]); // draw gear 1
  this.ctx[1].restore();

  this.ctx[3].save();
  this.ctx[3].translate(this.x0,this.y0);
  this.bar[1].draw(this.ctx[3]); // draw bar 1
  this.bar[2].draw(this.ctx[3]); // draw bar 2
  this.ctx[3].restore();
}
// **********************************************************************************
// Fivebar.drawGround - draw the two pivots
// **********************************************************************************
Fivebar.prototype.drawGround = function() {
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.pivot[0].draw(this.ctx[2]);
  this.pivot[1].draw(this.ctx[2]);
  this.ctx[2].restore();
}

