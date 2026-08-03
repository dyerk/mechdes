// Common_Shapes_Planetary
// Creates the objects that are used mainly with the planetary gearset animations

// ********************************************************************************
// Function Gear creates a gear, which is a circle with a line.  Transparency is also included in the properties
// ********************************************************************************
function Gear (N, geom, lineColor, fillColor, alpha) {
  this.x = 0;                     // x coordinate of center of gear
  this.y = 0;                     // y coordinate of center of gear
  this.theta = 0;                 // rotation angle of gear
  this.radius = N/(2*geom.pitch); // gear radius as a function of number of teeth
  this.lineColor = lineColor;     // outline color for gear
  this.fillColor = fillColor;     // fill color for gear
  this.alpha = alpha;             // transparency for gear
  this.pin = new Pin(0, 0, geom); // pin at center of gear
}

Gear.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.theta);
  context.lineWidth = 2;
  context.fillStyle = this.fillColor;   // set fill color
  context.strokeStyle = this.lineColor; // set line color
  context.globalAlpha = this.alpha;     // set transparency

  context.beginPath();   // draw circle
  context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
  context.globalAlpha = 1.0;
  context.stroke();      // outline is non-transparent

  context.lineWidth = 1; // draw radial line
  context.beginPath();
  context.moveTo(0,0);
  context.lineTo(this.radius,0);
  context.stroke();

  this.pin.draw(context);
  context.restore();
};

// ********************************************************************************
// Function Ring creates a ring gear, which consists of two circles and a radial line.
// ********************************************************************************
function Ring (N, geom, lineColor, fillColor) {
  this.x = 0;
  this.y = 0;
  this.radius = N/(2*geom.pitch);
  this.outerRadius = 1.1*this.radius;
  this.theta = 0;
  this.lineColor = lineColor;
  this.fillColor = fillColor;
}

Ring.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.theta);
  context.lineWidth = 2;
  context.strokeStyle = this.lineColor;
  context.fillStyle = this.fillColor;

	// draw outer circle
  context.beginPath();
  context.arc(0, 0, this.outerRadius, 0, Math.PI * 2, true);
  context.closePath();
  context.stroke();
  context.fill();

	// Draw inner circle
  context.beginPath();
  context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
  context.closePath();
  context.globalCompositeOperation = "destination-out";  // this will cut the slot out of the background object
  context.fill();
  context.globalCompositeOperation = "source-over";      // this draws the outline on top of the background object
  context.stroke();

	// Draw line that marks rotation of ring
  context.beginPath();
  context.moveTo(this.radius,0);
  context.lineTo(this.outerRadius,0);
  context.stroke();

  context.restore();
};

// ********************************************************************************
// Function TriArm creates a three-armed carrier for a planetary gearset
// ********************************************************************************
function TriArm (R, r, L, geom, lineColor, fillColor, vis) {
  this.x = 0;
  this.y = 0;
  this.R = R;  // hub radius for triarm
  this.L = L;  // pin-to-pin length for triarm
  this.r = r;  // radius of outer part of arm
  this.lineColor = lineColor;
  this.fillColor = fillColor;
  this.vis = vis;
  this.pin = [];

	// calculate geometry of tri-arm
  this.beta  = Math.PI/6;
  var w2     = R*Math.sin(this.beta);  // half width of base of arm
  this.xA0 = [R*Math.cos(this.beta), w2];
  var xC0 = [this.xA0[0], -this.xA0[1]];
  this.alpha = Math.atan2(w2 - r, L - this.xA0[0]);  // angle at end of arm
  var xB0 = [L + r*Math.sin(this.alpha), r*Math.cos(this.alpha)];
  this.Bx = []; this.By = [];  this.Cx = []; this.Cy = []; this.Dx = []; this.Dy = [];

  for (var i = 0; i < 3; i++) {
    var gamma = -120*i*Math.PI/180;
    this.pin[i] = new Pin(L*Math.cos(gamma), L*Math.sin(gamma), geom);
    this.Bx[i] = xB0[0]*Math.cos(gamma) - xB0[1]*Math.sin(gamma);
    this.By[i] = xB0[0]*Math.sin(gamma) + xB0[1]*Math.cos(gamma);
    this.Cx[i] = xC0[0]*Math.cos(gamma) - xC0[1]*Math.sin(gamma);
    this.Cy[i] = xC0[0]*Math.sin(gamma) + xC0[1]*Math.cos(gamma);
    this.Dx[i] = L*Math.cos(gamma);
    this.Dy[i] = L*Math.sin(gamma);
  }
  this.pin[3] = new Pin(0, 0, geom);
}

TriArm.prototype.draw = function (context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(-this.theta);
  context.lineWidth = 2;
  context.fillStyle = this.fillColor;
  context.strokeStyle = this.lineColor;
  context.globalAlpha = this.vis;

  context.beginPath();
  context.moveTo(this.xA0[0], this.xA0[1]);
  for (var i = 0; i < 3; i++) {
    var gamma = -120*i*Math.PI/180;
    context.lineTo(this.Bx[i], this.By[i]);
    var lambda1 = -Math.PI/2 - this.alpha + gamma;
    var lambda2 =  Math.PI/2 + this.alpha + gamma;
    context.arc(this.Dx[i], this.Dy[i], this.r, lambda2, lambda1, true);
    context.lineTo(this.Cx[i], this.Cy[i]);
    lambda1 =   -this.beta + gamma;
    lambda2 = -3*this.beta + gamma;
    context.arc(     0, 0, this.R, lambda1, lambda2, true);
  }
  context.closePath();

  context.stroke();
  context.fill();

  for (var i = 0; i < 4; i++) {
    this.pin[i].draw(context);
  }
  context.restore();
}