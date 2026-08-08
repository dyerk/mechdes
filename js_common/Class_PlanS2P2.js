PlanS2P2.prototype = new Linkage();

// *********************************************************************************************************************
// Function PlanS2P2 creates a two-sun, two planet planetary gearset
// *********************************************************************************************************************
function PlanS2P2(Ns1, Ns2, Np1, Np2, balanced) {
  this.Ns1 = Ns1;       // number of teeth on sun1 gear
  this.Ns2 = Ns2;       // number of teeth on sun2 gear
  this.Np1 = Np1;       // number of teeth on planet1 gear
  this.Np2 = Np2;       // number of teeth on planet2 gear
  this.balanced = balanced;  // one planet or three?

  this.sun1 = new Gear(Ns1, this.geom, this.color[3], this.color[5], 0.8);
  this.sun2 = new Gear(Ns2, this.geom, this.color[3], this.color[2], 1.0);
  if (balanced) {  // create three planets
    this.planet1 = [];  this.planet2 = [];
    for (var i = 0; i < 3; i++) {
      this.planet1[i] = new Gear(Np1, this.geom, this.color[3], this.color[15], 0.5);
      this.planet2[i] = new Gear(Np2, this.geom, this.color[3], this.color[20], 1.0);
    }

    var R = 0.5*this.sun1.radius;  // radius of hub of tri-arm
    this.L = this.sun1.radius + this.planet1[0].radius;  // length of tri-arm
    var r = 2*this.geom.pinRadius;  // radius of end of tri-arm
    this.arm = new TriArm(R, r, this.L, this.geom, this.color[3], this.color[10], 1.0);

  } else {
    this.planet1 = new Gear(Np1, this.geom, this.color[3], this.color[15], 0.5);
    this.planet2 = new Gear(Np2, this.geom, this.color[3], this.color[20], 1.0);
    this.L = this.sun1.radius + this.planet1.radius;     // length of arm
    this.arm = new Bar(this.L, this.geom, this.color[3], this.color[10]);
  }

  this.pivot = new Pivot(0, 0, this.geom);
  this.sun1.x = 0;  this.sun1.y = 0;
  this.sun2.x = 0;  this.sun2.y = 0;
}

// *********************************************************************************************************************
// PlanS2P2.draw - calculates the planet positions and draws the gears
// *********************************************************************************************************************
PlanS2P2.prototype.draw = function(angle) {
  var thetas1 = -angle
  var r1 = this.Ns1/this.Np1;  var r2 = this.Ns2/this.Np2;
  var thetap = thetas1*r1*(r2+1)/(r1-r2);
  var thetaa = thetas1*r1/(r1-r2);

// update crank, coupler and rocker angles
  this.sun1.theta = thetas1; // sun1 angle
  this.arm.theta = -thetaa; // arm angle

// update planet positions
  if (this.balanced) {
    for (var i = 0; i < 3; i++) {
      var gamma = i*120*Math.PI/180;
      this.planet1[i].x = this.L*Math.cos(gamma + thetaa);
      this.planet1[i].y = this.L*Math.sin(gamma + thetaa);
      this.planet1[i].theta = thetap;
      this.planet2[i].x = this.planet1[i].x;
      this.planet2[i].y = this.planet1[i].y;
      this.planet2[i].theta = thetap;
    }
  } else {
    this.planet1.x = this.L*Math.cos(thetaa);
    this.planet1.y = this.L*Math.sin(thetaa);
    this.planet1.theta = thetap;
    this.planet2.x = this.planet1.x;
    this.planet2.y = this.planet1.y;
    this.planet2.theta = thetap;
  }

// clear canvas
  this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);
  this.ctx[3].clearRect(0, 0, this.can[3].width, this.can[3].height);

// draw the bars
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.sun2.draw(this.ctx[1]);
  if (this.balanced) {
    for (var i = 0; i < 3; i++) {
      this.planet2[i].draw(this.ctx[1]);
      this.planet1[i].draw(this.ctx[1]);
    }
  } else {
    this.planet2.draw(this.ctx[1]);
    this.planet1.draw(this.ctx[1]);
  }
  this.sun1.draw(this.ctx[1]);
  this.ctx[1].restore();

  this.ctx[3].save();
  this.ctx[3].translate(this.x0,this.y0);
  this.arm.draw(this.ctx[3]);
  this.ctx[3].restore();
}

/**********************************************************************************************************************/
/* PlanS2P2.drawGround - draw the pivot
/**********************************************************************************************************************/
PlanS2P2.prototype.drawGround = function() {
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.pivot.draw(this.ctx[2]);
  this.ctx[2].restore();
}