PlanSRP.prototype = new Linkage();

// *********************************************************************************************************************
// Function PlanSRP creates a sun-ring-planet planetary gearset
// *********************************************************************************************************************
function PlanSRP(Ns, Np, balanced) {
  this.Ns = Ns;         // number of teeth on sun gear
  this.Np = Np;         // number of teeth on planet
  this.Nr = Ns + 2*Np;  // number of teeth on ring
  this.balanced = balanced;  // one planet or three?

  this.sun = new Gear(Ns, this.geom, this.color[3], this.color[6], 1.0);
  this.ring = new Ring(Ns + 2*Np, this.geom, this.color[3], this.color[2]);
  if (balanced) {  // create three planets
    this.planet = [];
    for (var i = 0; i < 3; i++) {
      this.planet[i] = new Gear(Np, this.geom, this.color[3], this.color[15], 1.0);
    }
    var R = 0.5*this.sun.radius;  // radius of hub of tri-arm
    this.L = this.sun.radius + this.planet[0].radius;  // length of tri-arm
    var r = 2*this.geom.pinRadius;  // radius of end of tri-arm
    this.arm = new TriArm(R, r, this.L, this.geom, this.color[3], this.color[9], 0.8);
  } else {
    this.planet = new Gear(Np, this.geom, this.color[3], this.color[15], 1.0);
    this.L = this.sun.radius + this.planet.radius;     // length of arm
    this.arm = new Bar(this.L, this.geom, this.color[3], this.color[9]);
  }

  this.pivot = new Pivot(0, 0, this.geom);
  this.sun.x = 0;
  this.sun.y = 0;
}

// *********************************************************************************************************************
// PlanSRP.draw - calculates the planet positions and draws the gears
// *********************************************************************************************************************
PlanSRP.prototype.draw = function(angle) {
  var thetas = -angle
  var thetap = -(this.Ns/(2*this.Np))*thetas;
  var thetaa = (this.Ns/(2*(this.Np+this.Ns)))*thetas;

// update crank, coupler and rocker angles
  this.sun.theta = thetas; // sun angle
  this.arm.theta = -thetaa; // arm angle

// update planet positions
  if (this.balanced) {
    for (var i = 0; i < 3; i++) {
      var gamma = i*120*Math.PI/180;
      this.planet[i].x = this.L*Math.cos(gamma + thetaa);
      this.planet[i].y = this.L*Math.sin(gamma + thetaa);
      this.planet[i].theta = thetap;
    }
  } else {
    this.planet.x = this.L*Math.cos(thetaa);
    this.planet.y = this.L*Math.sin(thetaa);
    this.planet.theta = thetap;
  }

// clear canvas
  this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);
  this.ctx[3].clearRect(0, 0, this.can[3].width, this.can[3].height);

// draw the bars
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.sun.draw(this.ctx[1]);
  if (this.balanced) {
    for (var i = 0; i < 3; i++) {
      this.planet[i].draw(this.ctx[1]);
    }
  } else {
    this.planet.draw(this.ctx[1]);
  }
  this.ctx[1].restore();

  this.ctx[3].save();
  this.ctx[3].translate(this.x0,this.y0);
  this.arm.draw(this.ctx[3]);
  this.ctx[3].restore();
}

/**********************************************************************************************************************/
/* PlanSRP.drawGround - draw the two pivots
/**********************************************************************************************************************/
PlanSRP.prototype.drawGround = function() {
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.pivot.draw(this.ctx[2]);
  this.ring.draw(this.ctx[2]);
  this.ctx[2].restore();
}