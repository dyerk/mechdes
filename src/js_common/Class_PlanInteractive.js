PlanInteractive.prototype = Object.create(Linkage.prototype);
PlanInteractive.prototype.constructor = PlanInteractive;

// *********************************************************************************************************************
// Function PlanInteractive creates a 3-planet interactive planetary gearset with HTML sliders & controls
// *********************************************************************************************************************
function PlanInteractive(Ns, Np) {
  Linkage.call(this);

  this.Ns = Ns;         // number of teeth on sun gear
  this.Np = Np;         // number of teeth on planet
  this.Nr = Ns + 2*Np;  // number of teeth on ring

  // Initialize gear components matching Common_Shapes_Planetary.js
  this.sun = new Gear(this.Ns, this.geom, this.color[3], this.color[5], 1.0);
  this.ring = new Ring(this.Nr, this.geom, this.color[3], this.color[2]);

  // Create 3 balanced planets
  this.planet = [];
  for (var i = 0; i < 3; i++) {
    this.planet[i] = new Gear(this.Np, this.geom, this.color[3], this.color[18], 1.0);
  }

  // Create carrier arm
  var R = 0.5 * this.sun.radius;                      // hub radius
  this.L = this.sun.radius + this.planet[0].radius;  // pin-to-pin center distance
  var r = 2 * this.geom.pinRadius;                  // outer arm radius
  this.arm = new TriArm(R, r, this.L, this.geom, this.color[3], this.color[10], 0.8);

  // Pivot at ground center
  this.pivot = new Pivot(0, 0, this.geom);

  // Velocity state variables (radians/step or RPM scaling)
  this.omegaS = 5;
  this.omegaR = 5;
  this.omegaC = 0;

  // Track active input state: 'sun', 'ring', or 'carrier' (which component is driven vs. calculated)
  this.activeOutput = 'carrier'; // component calculated automatically

  // Store absolute component positions
  this.thetaS = 0;
  this.thetaR = 0;
  this.thetaC = 0;
  this.thetaP = 0;
}

// *********************************************************************************************************************
// PlanInteractive.buttonCanvas - Hooks canvases and HTML input controls for WCAG compliance
// *********************************************************************************************************************
PlanInteractive.prototype.buttonCanvas = function (pageID, x0, y0) {
  Linkage.prototype.buttonCanvas.call(this, pageID, x0, y0);

  var linkage = this;

  // Target Range Inputs
  this.sliderSun     = document.getElementById(pageID + 'sliderSun');
  this.sliderRing    = document.getElementById(pageID + 'sliderRing');
  this.sliderCarrier = document.getElementById(pageID + 'sliderCarrier');

  // Target Value Displays
  this.valSun     = document.getElementById(pageID + 'valSun');
  this.valRing    = document.getElementById(pageID + 'valRing');
  this.valCarrier = document.getElementById(pageID + 'valCarrier');

  // Target Output Radio Selectors
  this.btnSelectSun     = document.getElementById(pageID + 'btnSelectSun');
  this.btnSelectRing    = document.getElementById(pageID + 'btnSelectRing');
  this.btnSelectCarrier = document.getElementById(pageID + 'btnSelectCarrier');

  // Input Event Listeners
  if (this.sliderSun) {
    this.sliderSun.addEventListener('input', function () {
      linkage.omegaS = parseFloat(this.value);
      if (linkage.valSun) linkage.valSun.textContent = this.value;
      if (linkage.activeOutput === 'sun') linkage.setActiveOutput('carrier');
    });
  }
  if (this.sliderRing) {
    this.sliderRing.addEventListener('input', function () {
      linkage.omegaR = parseFloat(this.value);
      if (linkage.valRing) linkage.valRing.textContent = this.value;
      if (linkage.activeOutput === 'ring') linkage.setActiveOutput('carrier');
    });
  }
  if (this.sliderCarrier) {
    this.sliderCarrier.addEventListener('input', function () {
      linkage.omegaC = parseFloat(this.value);
      if (linkage.valCarrier) linkage.valCarrier.textContent = this.value;
      if (linkage.activeOutput === 'carrier') linkage.setActiveOutput('sun');
    });
  }

  // Radio Output Selection Listeners
  if (this.btnSelectSun) {
    this.btnSelectSun.addEventListener('change', function () { linkage.setActiveOutput('sun'); });
  }
  if (this.btnSelectRing) {
    this.btnSelectRing.addEventListener('change', function () { linkage.setActiveOutput('ring'); });
  }
  if (this.btnSelectCarrier) {
    this.btnSelectCarrier.addEventListener('change', function () { linkage.setActiveOutput('carrier'); });
  }
};

// *********************************************************************************************************************
// PlanInteractive.setActiveOutput - Controls active output locked component vs. user inputs
// *********************************************************************************************************************
PlanInteractive.prototype.setActiveOutput = function (targetComponent) {
  this.activeOutput = targetComponent;

  // Enable/Disable HTML sliders dynamically to signal driven vs calculated component
  if (this.sliderSun) this.sliderSun.disabled = (targetComponent === 'sun');
  if (this.sliderRing) this.sliderRing.disabled = (targetComponent === 'ring');
  if (this.sliderCarrier) this.sliderCarrier.disabled = (targetComponent === 'carrier');
};

// *********************************************************************************************************************
// PlanInteractive.solveKinematics - Computes speeds and updates accumulation angles
// *********************************************************************************************************************
PlanInteractive.prototype.solveKinematics = function () {
  var Ns = this.Ns;
  var Nr = this.Nr;
  var Np = this.Np;
  var brs = -Nr / Ns;

  // 1. Solve 2-DOF planetary gear kinematic equation
  if (this.activeOutput === 'sun') {
    this.omegaS = this.omegaC * (1 - brs) + brs * this.omegaR;
    var displayVal = Math.round(this.omegaS);
    if (this.sliderSun) this.sliderSun.value = displayVal;
    if (this.valSun) this.valSun.textContent = displayVal;
  } else if (this.activeOutput === 'ring') {
    this.omegaR = (1 / brs) * (this.omegaS + this.omegaC * (brs - 1));
    var displayVal = Math.round(this.omegaR);
    if (this.sliderRing) this.sliderRing.value = displayVal;
    if (this.valRing) this.valRing.textContent = displayVal;
  } else { // 'carrier' default
    this.omegaC = (this.omegaS - brs * this.omegaR) / (1 - brs);
    var displayVal = Math.round(this.omegaC);
    if (this.sliderCarrier) this.sliderCarrier.value = displayVal;
    if (this.valCarrier) this.valCarrier.textContent = displayVal;
  }

  // 2. Planet rotation speed relative to carrier
  var bps = -Ns / Np;
  var omegaP = bps * this.omegaS + this.omegaC * (1 - bps);

  // 3. Increment rotation angles
  var dt = 0.0015;
  this.thetaS += -this.omegaS * dt;
  this.thetaR += -this.omegaR * dt;
  this.thetaC += -this.omegaC * dt;
  this.thetaP += -omegaP * dt;
};

// *********************************************************************************************************************
// PlanInteractive.draw - Renders planetary gears across the canvas stack
// *********************************************************************************************************************
PlanInteractive.prototype.draw = function () {
  this.solveKinematics();

  // Set individual rotation properties
  this.sun.theta = this.thetaS;
  this.ring.theta = this.thetaR;
  this.arm.theta = -this.thetaC;

  // Position and rotate 3 planetary gears
  for (var i = 0; i < 3; i++) {
    var gamma = i * 120 * Math.PI / 180;
    this.planet[i].x = this.L * Math.cos(gamma + this.thetaC);
    this.planet[i].y = this.L * Math.sin(gamma + this.thetaC);
    this.planet[i].theta = this.thetaP;
  }

  // Clear stacked canvases (Canvas 1: Moving Links, Canvas 2: Ground/Ring, Canvas 3: Arm)
  if (this.ctx[1]) this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);
  if (this.ctx[2]) this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);
  if (this.ctx[3]) this.ctx[3].clearRect(0, 0, this.can[3].width, this.can[3].height);

  // Redraw ground/ring canvas (Canvas 2)
  this.drawGround();

  // Render Sun & Planets on Canvas 1
  if (this.ctx[1]) {
    this.ctx[1].save();
    this.ctx[1].translate(this.x0, this.y0);
    this.sun.draw(this.ctx[1]);
    for (var i = 0; i < 3; i++) {
      this.planet[i].draw(this.ctx[1]);
    }
    this.ctx[1].restore();
  }

  // Render Carrier TriArm on Canvas 3
  if (this.ctx[3]) {
    this.ctx[3].save();
    this.ctx[3].translate(this.x0, this.y0);
    this.arm.draw(this.ctx[3]);
    this.ctx[3].restore();
  }
};

// *********************************************************************************************************************
// PlanInteractive.drawGround - Renders central pivot and ring gear on Canvas 2
// *********************************************************************************************************************
PlanInteractive.prototype.drawGround = function () {
  if (this.ctx[2]) {
    this.ctx[2].save();
    this.ctx[2].translate(this.x0, this.y0);
    if (this.pivot) this.pivot.draw(this.ctx[2]);
    this.ring.draw(this.ctx[2]);
    this.ctx[2].restore();
  }
};

// *********************************************************************************************************************
// PlanInteractive.eventReset - Resets state, sliders, and HTML elements back to defaults
// *********************************************************************************************************************
PlanInteractive.prototype.eventReset = function(linkage) {
  // 1. Call base Linkage reset handler to clear canvases & stop animation frames
  Linkage.prototype.eventReset.call(this, linkage);

  // 2. Reset internal speed and position tracking values
  this.omegaS = 5;
  this.omegaR = 5;
  this.omegaC = 0;

  this.thetaS = 0;
  this.thetaR = 0;
  this.thetaC = 0;
  this.thetaP = 0;

  // 3. Reset default output state to 'carrier'
  this.setActiveOutput('carrier');

  // 4. Reset HTML range sliders back to default initial values
  if (this.sliderSun)     this.sliderSun.value = 5;
  if (this.sliderRing)    this.sliderRing.value = 5;
  if (this.sliderCarrier) this.sliderCarrier.value = 0;

  // 5. Reset HTML output value displays
  if (this.valSun)     this.valSun.textContent = "5";
  if (this.valRing)    this.valRing.textContent = "5";
  if (this.valCarrier) this.valCarrier.textContent = "0";

  // 6. Reset radio buttons selection to Carrier Output
  if (this.btnSelectCarrier) this.btnSelectCarrier.checked = true;
  if (this.btnSelectSun)     this.btnSelectSun.checked = false;
  if (this.btnSelectRing)    this.btnSelectRing.checked = false;

  // 7. Redraw static gearset at initial state angle (0)
  this.drawGround();
  this.draw(0);
};