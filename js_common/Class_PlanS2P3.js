PlanS2P3.prototype = new Linkage();

// *********************************************************************************************************************
// Function PlanS2P3 creates a two-sun, three planet planetary gearset
// *********************************************************************************************************************
function PlanS2P3(Ns1, Ns2, Np1, Np2, Np3) {
  this.Ns1 = Ns1;       // number of teeth on sun1 gear
  this.Ns2 = Ns2;       // number of teeth on sun2 gear
  this.Np1 = Np1;       // number of teeth on planet1 gear
  this.Np2 = Np2;       // number of teeth on planet2 gear
  this.Np3 = Np3;       // number of teeth on planet3 gear

  this.sun1 = new Gear(Ns1, this.geom, this.color[3], this.color[5], 1.0);
  this.sun2 = new Gear(Ns2, this.geom, this.color[3], this.color[2], 1.0);
  this.planet1 = new Gear(Np1, this.geom, this.color[3], this.color[15], 0.5);
  this.planet2 = new Gear(Np2, this.geom, this.color[3], this.color[20], 1.0);
  this.planet3 = new Gear(Np3, this.geom, this.color[3], this.color[15], 0.5);

  this.L1 = this.sun1.radius + this.planet1.radius;               // length to first pin
  this.L2 = this.L1 + this.planet1.radius + this.planet2.radius;  // length to second pin
  this.arm = new Coupler(this.L1, this.L2, 0, this.geom, this.color[3], this.color[10]), // 3 pin link
  this.sun1.x = 0;  this.sun1.y = 0;
  this.sun2.x = 0;  this.sun2.y = 0;
}

// *********************************************************************************************************************
// PlanS2P3.draw - calculates the planet positions and draws the gears
// *********************************************************************************************************************
PlanS2P3.prototype.draw = function(angle) {
  var thetas1 = -angle
  var r1 = this.Np1/this.Ns1;  var r2 = this.Np2/this.Np1;  var r3 = this.Ns2/this.Np3;
  var thetaa = thetas1/(r1*r2*r3+1);
  var thetap1 = thetaa*(1-r2*r3);
  var thetap2 = thetaa*(1+r3);

// update crank, coupler and rocker angles
  this.sun1.theta = thetas1; // sun1 angle
  this.arm.theta = -thetaa; // arm angle

  this.planet1.x = this.L1*Math.cos(thetaa);
  this.planet1.y = this.L1*Math.sin(thetaa);
  this.planet1.theta = thetap1;
  this.planet2.x = this.L2*Math.cos(thetaa);
  this.planet2.y = this.L2*Math.sin(thetaa);
  this.planet2.theta = thetap2;
  this.planet3.x = this.planet2.x;
  this.planet3.y = this.planet2.y;
  this.planet3.theta = thetap2;

// clear canvas
  this.ctx[2].clearRect(0, 0, this.can[1].width, this.can[1].height);
  this.ctx[3].clearRect(0, 0, this.can[3].width, this.can[3].height);

// draw the bars
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.planet3.draw(this.ctx[2]);
  this.planet2.draw(this.ctx[2]);
  this.planet1.draw(this.ctx[2]);
  this.sun1.draw(this.ctx[2]);
  this.ctx[2].restore();

  this.ctx[3].save();
  this.ctx[3].translate(this.x0,this.y0);
  this.arm.draw(this.ctx[3]);
  this.ctx[3].restore();
}

/**********************************************************************************************************************/
/* PlanS2P3.drawGround - draw the pivot
/**********************************************************************************************************************/
PlanS2P3.prototype.drawGround = function() {
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.sun2.draw(this.ctx[1]);
  this.ctx[1].restore();
}