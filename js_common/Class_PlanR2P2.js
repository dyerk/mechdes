PlanR2P2.prototype = new Linkage();

// *********************************************************************************************************************
// Function PlanS2P2 creates a two-ring, two planet planetary gearset
// *********************************************************************************************************************
function PlanR2P2(Nr1, Nr2, Np1, Np2) {
  this.Nr1 = Nr1;       // number of teeth on sun1 gear
  this.Nr2 = Nr2;       // number of teeth on sun2 gear
  this.Np1 = Np1;       // number of teeth on planet1 gear
  this.Np2 = Np2;       // number of teeth on planet2 gear

  this.ring1 = new Ring(Nr1, this.geom, this.color[3], this.color[6], 1.0);
  this.ring2 = new Ring(Nr2, this.geom, this.color[3], this.color[2], 1.0);
  this.planet1 = new Gear(Np1, this.geom, this.color[3], this.color[24], 0.5);
  this.planet2 = new Gear(Np2, this.geom, this.color[3], this.color[15], 0.8);

  this.L = this.ring1.radius - this.planet1.radius;  // length to first pin
  this.arm = new Bar(this.L, this.geom, this.color[3], this.color[9]), // 2 pin link
  this.pivot = new Pivot(0, 0, this.geom);
  this.ring1.x = 0;  this.ring1.y = 0;
  this.ring2.x = 0;  this.ring2.y = 0;
}

// *********************************************************************************************************************
// PlanR2P2.draw - calculates the planet positions and draws the gears
// *********************************************************************************************************************
PlanR2P2.prototype.draw = function(angle) {
  var thetas1 = -angle
  var r1 = this.Np1/this.Nr1;  var r2 = this.Nr2/this.Np2;
  var thetaa = thetas1/(1-r1*r2);
  var thetap1 = thetaa*(1-r2);

// update crank, coupler and rocker angles
  this.ring1.theta = thetas1; // sun1 angle
  this.arm.theta = -thetaa; // arm angle

  this.planet1.x = this.L*Math.cos(thetaa);
  this.planet1.y = this.L*Math.sin(thetaa);
  this.planet1.theta = thetap1;
  this.planet2.x = this.planet1.x;
  this.planet2.y = this.planet1.y;
  this.planet2.theta = thetap1;

// clear canvas
  this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);
  this.ctx[3].clearRect(0, 0, this.can[3].width, this.can[3].height);
  this.ctx[4].clearRect(0, 0, this.can[4].width, this.can[4].height);

// draw the bars
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.planet2.draw(this.ctx[2]);
  this.planet1.draw(this.ctx[2]);
  this.ctx[2].restore();

  this.ctx[3].save();
  this.ctx[3].translate(this.x0,this.y0);
  this.ring1.draw(this.ctx[3]);
  this.ctx[3].restore();

  this.ctx[4].save();
  this.ctx[4].translate(this.x0,this.y0);
  this.arm.draw(this.ctx[4]);
  this.ctx[4].restore();
}

/**********************************************************************************************************************/
/* PlanR2P2.drawGround - draw the pivot
/**********************************************************************************************************************/
PlanR2P2.prototype.drawGround = function() {
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.ring2.draw(this.ctx[1]);
  this.pivot.draw(this.ctx[1]);
  this.ctx[1].restore();
}