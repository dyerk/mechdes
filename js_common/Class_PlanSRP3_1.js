PlanSRP3_1.prototype = new Linkage();

// *********************************************************************************************************************
// Function PlanSRP3_1 creates a sun, ring and three planet planetary gearset
// *********************************************************************************************************************
function PlanSRP3_1(Ns, Nr, Np1, Np2, Np3) {
  this.Ns  = Ns;        // number of teeth on sun gear
  this.Nr  = Nr;        // number of teeth on ring gear
  this.Np1 = Np1;       // number of teeth on planet1 gear
  this.Np2 = Np2;       // number of teeth on planet2 gear
  this.Np3 = Np3;       // number of teeth on planet3 gear

  this.sun = new Gear(Ns, this.geom, this.color[3], this.color[5], 1.0);
  this.ring = new Ring(Nr, this.geom, this.color[3], this.color[2], 1.0);
  this.planet1 = new Gear(Np1, this.geom, this.color[3], this.color[15], 0.5);
  this.planet2 = new Gear(Np2, this.geom, this.color[3], this.color[20], 1.0);
  this.planet3 = new Gear(Np3, this.geom, this.color[3], this.color[5], 0.5);

  this.L1 = this.sun.radius + this.planet1.radius;    // length to first pin
  this.L2 = this.ring.radius - this.planet3.radius;   // length to second pin
  this.arm = new Coupler(this.L1, this.L2, 0, this.geom, this.color[3], this.color[10]), // 3 pin link
  this.pivot = new Pivot(0, 0, this.geom);
  this.sun.x = 0;   this.sun.y = 0;
  this.ring.x = 0;  this.ring.y = 0;
}

// *********************************************************************************************************************
// PlanSRP3_1.draw - calculates the planet positions and draws the gears
// *********************************************************************************************************************
PlanSRP3_1.prototype.draw = function(angle) {
  var thetas = -angle
  var r1 = this.Np1/this.Ns;  var r2 = this.Np3/this.Np2;  var r3 = this.Nr/this.Np3;
  var thetaa = thetas/(1-r1*r2*r3);
  var thetap12 = thetaa*(1+r2*r3);
  var thetap3  = thetaa*(1-r3);

// update crank, coupler and rocker angles
  this.sun.theta = thetas; // sun1 angle
  this.arm.theta = -thetaa; // arm angle

  this.planet1.x = this.L1*Math.cos(thetaa);
  this.planet1.y = this.L1*Math.sin(thetaa);
  this.planet1.theta = thetap12;
  this.planet2.x = this.planet1.x;
  this.planet2.y = this.planet1.y;
  this.planet2.theta = thetap12;
  this.planet3.x = this.L2*Math.cos(thetaa);
  this.planet3.y = this.L2*Math.sin(thetaa);
  this.planet3.theta = thetap3;

// clear canvas
  this.ctx[2].clearRect(0, 0, this.can[1].width, this.can[1].height);
  this.ctx[3].clearRect(0, 0, this.can[3].width, this.can[3].height);
  this.ctx[4].clearRect(0, 0, this.can[4].width, this.can[4].height);

// draw the bars
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.planet3.draw(this.ctx[2]);
  this.planet2.draw(this.ctx[2]);
  this.planet1.draw(this.ctx[2]);
  this.ctx[2].restore();

  this.ctx[3].save();
  this.ctx[3].translate(this.x0,this.y0);
  this.sun.draw(this.ctx[3]);
  this.ctx[3].restore();

  this.ctx[4].save();
  this.ctx[4].translate(this.x0,this.y0);
  this.arm.draw(this.ctx[4]);
  this.ctx[4].restore();
}

/**********************************************************************************************************************/
/* PlanSRP3_1.drawGround - draw the pivot
/**********************************************************************************************************************/
PlanSRP3_1.prototype.drawGround = function() {
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.ring.draw(this.ctx[1]);
  this.pivot.draw(this.ctx[1]);
  this.ctx[1].restore();
}