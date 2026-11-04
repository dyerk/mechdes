PlanSRP_select.prototype = new Linkage();

// *********************************************************************************************************************
// Function PlanSRP_select creates a sun-ring-planet planetary gearset
// Configurable Input & Fixed components: 'sun', 'ring', 'arm', 'planet' (prepend '-' to reverse direction)
// *********************************************************************************************************************
function PlanSRP_select(Ns, Np, balanced, inputComponent, fixedComponent) {
  this.Ns = Ns;         // number of teeth on sun gear
  this.Np = Np;         // number of teeth on planet
  this.Nr = Ns + 2*Np;  // number of teeth on ring
  this.balanced = balanced;  // one planet or three?

  // Set default input and fixed components if not provided
  this.inputComponent = inputComponent || 'sun'; 
  this.fixedComponent = fixedComponent || 'ring'; 

  this.sun = new Gear(Ns, this.geom, this.color[3], this.color[5], 1.0);
  this.ring = new Ring(this.Nr, this.geom, this.color[3], this.color[2]);
  
  if (balanced) {  // create three planets
    this.planet = [];
    for (var i = 0; i < 3; i++) {
      this.planet[i] = new Gear(Np, this.geom, this.color[3], this.color[18], 1.0);
    }
    var R = 0.5 * this.sun.radius;  // radius of hub of tri-arm
    this.L = this.sun.radius + this.planet[0].radius;  // length of tri-arm
    var r = 2 * this.geom.pinRadius;  // radius of end of tri-arm
    this.arm = new TriArm(R, r, this.L, this.geom, this.color[3], this.color[10], 0.8);
  } else {
    this.planet = new Gear(Np, this.geom, this.color[3], this.color[18]);
    this.L = this.sun.radius + this.planet.radius;     // length of arm
    this.arm = new Bar(this.L, this.geom, this.color[3], this.color[10]);
  }

  this.pivot = new Pivot(0, 0, this.geom);
  this.sun.x = 0;
  this.sun.y = 0;

  // Initialize angles
  this.thetaS = 0;
  this.thetaR = 0;
  this.thetaA = 0;
  this.thetaP = 0;
}

// Helper method to set operational configuration dynamically
PlanSRP_select.prototype.setConfiguration = function(inputComponent, fixedComponent) {
  this.inputComponent = inputComponent;
  this.fixedComponent = fixedComponent;
};

// *********************************************************************************************************************
// PlanSRP_select.solveKinematics - calculates angular positions of all elements based on input angle and sign direction
// *********************************************************************************************************************
PlanSRP_select.prototype.solveKinematics = function(inputAngle) {
  var Ns = this.Ns;
  var Np = this.Np;
  var Nr = this.Nr;

  var compStr = String(this.inputComponent).trim();
  var dirFactor = 1.0;

  // Check for leading '-' to determine direction reversal
  if (compStr.charAt(0) === '-') {
    dirFactor = -1.0;
    compStr = compStr.substring(1); // extract name without sign
  }

  var input = inputAngle * dirFactor;

  var ts = 0, tr = 0, ta = 0, tp = 0;

  // Solve gear train kinematics based on choice of Input and Fixed elements
  switch (compStr) {
    case 'sun':
      ts = input;
      if (this.fixedComponent === 'ring') {
        tr = 0;
        ta = (Ns / (Ns + Nr)) * ts;
      } else if (this.fixedComponent === 'arm') {
        ta = 0;
        tr = -(Ns / Nr) * ts;
      }
      break;

    case 'ring':
      tr = input;
      if (this.fixedComponent === 'sun') {
        ts = 0;
        ta = (Nr / (Ns + Nr)) * tr;
      } else if (this.fixedComponent === 'arm') {
        ta = 0;
        ts = -(Nr / Ns) * tr;
      }
      break;

    case 'arm':
    case 'carrier':
      ta = input;
      if (this.fixedComponent === 'ring') {
        tr = 0;
        ts = ((Ns + Nr) / Ns) * ta;
      } else if (this.fixedComponent === 'sun') {
        ts = 0;
        tr = ((Ns + Nr) / Nr) * ta;
      }
      break;

    case 'planet':
      // Driving via planet relative rotation:
      tp = input;
      if (this.fixedComponent === 'ring') {
        tr = 0;
        ta = (Np / (Ns + Nr)) * tp;
        ts = ((Ns + Nr) / Ns) * ta;
      } else if (this.fixedComponent === 'sun') {
        ts = 0;
        ta = (Np / (Ns + Nr)) * tp;
        tr = ((Ns + Nr) / Nr) * ta;
      } else if (this.fixedComponent === 'arm') {
        ta = 0;
        ts = -(Np / Ns) * tp;
        tr = (Np / Nr) * tp;
      }
      break;
  }

  // Planet spin relative to carrier arm axis:
  // theta_planet_absolute = theta_arm - (Ns / Np) * (theta_sun - theta_arm)
  if (compStr !== 'planet') {
    tp = ta - (Ns / Np) * (ts - ta);
  }

  this.thetaS = ts;
  this.thetaR = tr;
  this.thetaA = ta;
  this.thetaP = tp;
};

// *********************************************************************************************************************
// PlanSRP_select.draw - solves gear positions and renders all components
// *********************************************************************************************************************
PlanSRP_select.prototype.draw = function(angle) {
  // Solve angles based on selected input, sign direction, and fixed configuration
  this.solveKinematics(angle);

  // Update component angles
  this.sun.theta = this.thetaS;
  this.ring.theta = this.thetaR;
  
  // Match arm visual rotation to planet orbital angle
  this.arm.theta = -this.thetaA;

  // Update planet position and absolute rotation
  if (this.balanced) {
    for (var i = 0; i < 3; i++) {
      var gamma = i * 120 * Math.PI / 180;
      this.planet[i].x = this.L * Math.cos(gamma + this.thetaA);
      this.planet[i].y = this.L * Math.sin(gamma + this.thetaA);
      this.planet[i].theta = this.thetaP;
    }
  } else {
    this.planet.x = this.L * Math.cos(this.thetaA);
    this.planet.y = this.L * Math.sin(this.thetaA);
    this.planet.theta = this.thetaP;
  }

  // Clear canvases
  this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);
  this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);
  this.ctx[3].clearRect(0, 0, this.can[3].width, this.can[3].height);

  // Redraw ground context for fixed/animated pivots and ring
  this.drawGround();

  // Draw Sun and Planets on Canvas 1
  this.ctx[1].save();
  this.ctx[1].translate(this.x0, this.y0);
  this.sun.draw(this.ctx[1]);
  if (this.balanced) {
    for (var i = 0; i < 3; i++) {
      this.planet[i].draw(this.ctx[1]);
    }
  } else {
    this.planet.draw(this.ctx[1]);
  }
  this.ctx[1].restore();

  // Draw Arm on Canvas 3
  this.ctx[3].save();
  this.ctx[3].translate(this.x0, this.y0);
  this.arm.draw(this.ctx[3]);
  this.ctx[3].restore();
};

// *********************************************************************************************************************
// PlanSRP_select.drawGround - draws the central pivot and ring gear canvas
// *********************************************************************************************************************
PlanSRP_select.prototype.drawGround = function() {
  this.ctx[2].save();
  this.ctx[2].translate(this.x0, this.y0);
  this.pivot.draw(this.ctx[2]);
  this.ring.draw(this.ctx[2]);
  this.ctx[2].restore();
};