// *********************************************************************************************************************
// Function Ball creates a circle
// *********************************************************************************************************************
function Ball (mass, color) {
  this.x = 0;           // x-coordinate of center of circle (local coordinates)
  this.y = 0;           // y-coordinate of center of circle
  this.xdot = 0;        // x-velocity of circle
  this.ydot = 0;        // y-velocity of circle
  this.radius = 0;      // radius of circle
  this.mass = mass;     // mass of ball (for projectile and counterweight)
  this.color = color;   // color of ball
}

Ball.prototype.draw = function(context,scale) {
  context.save();
  context.translate(this.x,this.y);  // move local origin to center of circle
  context.lineWidth = 2/scale;       // scale line width with canvas scale
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";   // outline color is black

  context.beginPath();               
  context.arc(0, 0, this.radius, 0, Math.PI * 2, true); // draw circle
  context.closePath();
  context.fill();
  context.stroke();
  
  context.restore();  // restore original coordinate system
}

// *********************************************************************************************************************
// Function Counterweight draws a trapezoidal counterweight with a pivot in the middle
// *********************************************************************************************************************
function Counterweight (mass, color) {
  this.x = 0;         // x coordinate of middle of counterweight (local coordinates)
  this.y = 0;         // y-coordinate of middle of counterweight (local coordinates)
  this.H = 0;         // size of counterweight (for scaling)
  this.mass = mass;   // mass of counterweight
  this.color = color; // color of counterweight
  
  this.pivot = new Ball(0,"#AAAAAA");  // pivot at center of counterweight
  this.pivot.x = 0;                                // pivot is located in middle of counterweight
  this.pivot.y = 0;
}

Counterweight.prototype.draw = function(context,scale) {
  context.save();
  context.translate(this.x,this.y);  // move local origin to middle of counterweight
  context.lineWidth = 2/scale;       // scale line width with canvas scale
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";   // outline color is black
  
  context.beginPath();               // draw trapezoidal counterweight
  context.moveTo(-0.11*this.H, 0.09*this.H);
  context.lineTo( 0.11*this.H, 0.09*this.H);
  context.lineTo( 0.06*this.H,-0.05*this.H);
  context.lineTo(-0.06*this.H,-0.05*this.H);
  context.closePath();
  context.fill();
  context.stroke();
  
  this.pivot.draw(context,scale);     // draw the pivot at the center of counterweight  
  
  context.restore();  // restore original coordinate system
}

Counterweight.prototype.update = function(H) {
  this.H = H;
  this.pivot.x = 0;
  this.pivot.y = 0;
  this.pivot.radius = 0.02*H;
}

// *********************************************************************************************************************
// Function Sling draws the sling, which is just a line between the arm and the projectile (or counterweight)
// *********************************************************************************************************************
function Sling (L, color) {
  this.x = 0;      // x coordinate of end of sling
  this.y = 0;      // y coordinate of end of sling
  this.L = L;      // length of sling
  this.psi = 0;    // angle of sling
  this.psidot = 0; // angular velocity of sling
  this.color = color;
}

Sling.prototype.draw = function(context,scale) {
  context.save();
  context.translate(this.x, this.y);  // move local origin to end of sling
  context.rotate(-this.psi);          // rotate local coordinate system to align with sling
  context.strokeStyle = this.color;   // sling has no fill, just a line

  context.lineWidth = 3/scale;        // scale line width with canvas scale      
  context.beginPath();
  context.moveTo(0,0);                // draw line for sling
  context.lineTo(this.L,0);
  context.stroke();
  
  context.restore();  // restore original coordinate system
}

// *********************************************************************************************************************
// Function Slot draws a slot for the counterweight to slide in
// *********************************************************************************************************************
function Slot () {
  this.x = 0;          // x-coordinate of end of slot (local coordinates)
  this.y = 0;          // y-coordinate of end of slot (local coordinates)
  this.angle = 0;      // angle of slot
  this.L = 0;          // length of slot
  this.W = 0;          // width of slot
}

Slot.prototype.draw = function(context,scale) {
  context.save();                      // draw transparent cutout first
  context.translate(this.x, this.y);   // move local origin to end of slot
  context.rotate(-this.angle);         // rotate local coordinate system to aling with slot
  context.lineWidth = 1/scale;
  context.strokeStyle = "#000000";
  
  context.beginPath();
  context.moveTo(     0,this.W/2);
  context.lineTo(this.L,this.W/2);                                  // draw the slot line
  context.arc(this.L, 0, this.W/2, 0.5*Math.PI, 1.5*Math.PI, true); // draw the arc at one end of slot
  context.lineTo(0,-this.W/2);                                      // draw the slot line
  context.arc(     0, 0, this.W/2, 1.5*Math.PI, 0.5*Math.PI, true); // draw the arc at other end of slot
  context.closePath();
  
  context.globalCompositeOperation = "destination-out";  // this will cut the slot out of the background object
  context.fill();
  context.globalCompositeOperation = "source-over";      // this draws the outline on top of the background object
  context.stroke();
  
  context.restore();
}

// *********************************************************************************************************************
// Function Results stores the results of launching the trebuchet
// *********************************************************************************************************************
function Results () {
  this.sx0   = 0;  // x coordinate of initial position of projectile (zero, by definition)
  this.sy0   = 0;  // y coordinate of initial position of projectile (height of base and arm)
  this.vx0   = 0;  // initial x velocity of projectile
  this.vy0   = 0;  // initial y velocity of projectile
  this.v0    = 0;  // total initial velocity of projectile
  this.alpha = 0;  // launch angle of projectile
  this.tMax  = 0;  // time that projectile spends in flight
  this.xMin  = 0;  // minimum x coordinate of trajectory (could be negative, if projectile is launched backwards)
  this.xMax  = 0;  // maximum x coordinate of trajectory (could be zero, if projectile is launched backwards)
  this.yMin  = 0;  // minimum y coordinate of trajectory (zero, by definition)
  this.yMax  = 0;  // maximum y coordinate of trajectory (might be the same as sy0, if launched downward)
  this.range = 0;  // distance traveled by projectile (xMax - xMin)
  this.effE  = 0;  // energy efficiency of trebuchet
  this.effR  = 0;  // range efficiency of trebuchet
}
