// *********************************************************************************************************************
// Function Treb pulls together the entire trebuchet
// *********************************************************************************************************************
function Treb (L2,D,H,W,h0,t,w,rho,m1,m2,beta) {
  this.cwt     = new Counterweight(m1, "#DDDDDD");                     // counterweight
  this.proj    = new Ball(m2, "#E93A90");                              // projectile
  this.arm     = new Arm_Floating(L2, D, w, t, rho, beta, "#AFF53D");  // throwing arm
  this.base    = new Base_Floating(h0,H,W,0,"#9CA400");                // base
  this.ground  = new Ground_Flat("#A93CD4");                           // fixed ground
  this.results = new Results();                                        // array of results

  this.g = 9.81;       // Acceleration of gravity (m/s^2)
  this.I = 0;          // moment of inertia of arm 
  this.deltaT = 0.001; // time step for simulation
  
  this.h = 0;          // height of counterweight (variable)
  this.hdot = 0;       // y-velocity of counterweight (variable)
  this.x0 = 0;         // starting point of x-coordinate of pivot on base (constant)
  this.y0 = 0;         // starting point of y-coordinate of pivot on base (constant)
}

// function Treb.update - gets the trebuchet ready for redrawing after dims have been changed
Treb.prototype.update = function() {
  this.scale = 1.1*treb_can2.height/(this.base.h0 + this.arm.L2); // set up scaling for canvas

  this.x0 = treb_can2.width/2 + 50; // initial x-coordinate of bottom center of base
  this.y0 = treb_can2.height - 30;  // initial y-coordinate of bottom center of base

  this.arm.update();                 // update dimensions on arm (including slot and pivot)
  this.base.update();                // update dimensions of base (including slots and pivot)
  this.cwt.update(1.0*this.arm.L2);     // update dimensions of counterweight (including pivot)
  this.ground.update(3*this.arm.L2);  // update dimensions of ground
  this.ground.y = 0.15*this.base.h0;  // y-coordinate of top center of ground
  this.proj.radius = 0.3*this.arm.w; // scale projectile to width of arm
  this.h = this.base.h0;             // starting height of counterweight

// calculate initial angle of arm
  var h0 = this.base.h0;
  var H  = this.base.H;
  var W  = this.base.W;
  var D  = this.arm.D;
  var L2 = this.arm.L2;

  this.arm.theta = Math.atan((h0-H)/W);  // right side of arm is at maximum height
 
  iPin = false;
  if ((this.h-D*Math.sin(this.arm.theta)) < H) iPin = true;
  this.arm.theta0 = this.arm.theta;    // store initial angle of trebuchet arm (for efficiency calcs)
    
// set initial velocities to zero
  this.hdot = 0;
  this.arm.thetadot = 0;

// draw fixed parts of canvas
  treb_ctx1.save();
  treb_ctx1.translate(this.x0,this.y0);   // move to local coordinate system at bottom center of base
  treb_ctx1.scale(this.scale,this.scale); // scale according to canvas scale
  this.ground.draw(treb_ctx1,this.scale); // draw the ground
  treb_ctx1.restore();                    // go back to global coordinate system
  
  treb_ctx3.save();
  treb_ctx3.translate(this.x0,this.y0);   // move to local coordinate system at bottom center of base
  treb_ctx3.scale(this.scale,this.scale); // scale according to canvas scale
  this.base.draw(treb_ctx3,this.scale);   // draw the base
  treb_ctx3.restore();                    // go back to global coordinate system
}


// function Treb.mass - updates mass properties of entire trebuchet
Treb.prototype.mass = function() {
  this.arm.mass(); // update mass properties of arm
}

// function Treb.draw - draws the trebuchet in its current configuration
Treb.prototype.draw = function() {
  treb_ctx2.save();
  treb_ctx4.save();
  treb_ctx2.translate(this.x0,this.y0);   // move to local coordinate system at bottom center of base
  treb_ctx4.translate(this.x0,this.y0);
  treb_ctx2.scale(this.scale,this.scale); // scale according to canvas scale
  treb_ctx4.scale(this.scale,this.scale);

  this.arm.y = -this.h;                   // height of right side of arm
  this.cwt.y = -this.h;                   // height of counterweight
  this.proj.x =         - this.arm.L2*Math.cos(-this.arm.theta); // x-coordinate of projectile
  this.proj.y = -this.h - this.arm.L2*Math.sin(-this.arm.theta); // y-coordinate of projectile

  this.arm.draw(treb_ctx2,this.scale);    // draw the arm
  this.cwt.draw(treb_ctx4,this.scale);    // draw the counterweight
  this.proj.draw(treb_ctx4,this.scale);   // draw the projectile

  treb_ctx2.restore();  // go back to global coordinate system
  treb_ctx4.restore();  // go back to global coordinate system
}

// function Treb.launch - calculates range and efficiency of trebuchet
Treb.prototype.launch = function () {
// Dimensions of trebuchet
  var L2  = this.arm.L2;            // length from pivot to hook
  var g   = this.g                  // gravitational constant
  var h0  = this.base.h0;           // initial height of counterweight
  var D   = this.arm.D;             // distance from counterweight to moving pivot
  var H   = this.base.H;            // height of fixed slot
  var m1  = this.cwt.mass;          // counterweight mass
  var m2  = this.proj.mass;         // projectile mass

// Initial conditions of projectile at launch
  var hdot     = this.hdot;         // vertical velocity of counterweight at launch
  var theta    = this.arm.theta;    // launch angle of arm
  var thetadot = this.arm.thetadot; // final angular velocity of arm
  var theta0   = this.arm.theta0;   // prelaunch angle of arm
  
// Heights for calculating potential energy and range
  var H1 = h0-H+D;                                       // vertical distance traveled by counterweight
  var y20 = h0-L2*Math.sin(theta0);                      // initial height of projectile
  var H2 = H -(L2-D)*Math.sin(theta);                    // final height of projectile
  var Hstar = H + (L2-D);                                // max height that projectile could be lifted 
   
// Initial velocity of projectile
  var vx0   =  L2*thetadot*Math.sin(theta);                // x-velocity of projectile at launch
  var vy0   = -L2*thetadot*Math.cos(theta)+hdot;           // y-velocity of projectile at launch
  var v02   =  vx0*vx0 + vy0*vy0;                          // magnitude of launch velocity squared
  var tMax  = (vy0/g)+Math.sqrt((vy0*vy0)/(g*g) + 2*H2/g); // time of flight

// Potential and kinetic energy  
  var PE = (m1*H1 - m2*(H2-y20))*g;  // potential energy stored in counterweight
  var KE = 0.5*m2*v02;               // kinetic energy of projectile at launch

// Theoretical maximum ranges
  var R      = Math.abs(vx0) * tMax;                 // actual range of projectile
  var R0star = 2*PE/(m2*g);                          // max possible range when launched from ground height
  var Rstar  = R0star*Math.sqrt(2*H2/R0star + 1);    // max possible range when launched from actual height
  var RHstar = R0star*Math.sqrt(2*Hstar/R0star + 1); // max possible range when launched from max height

// Efficiencies
  this.results.effE = KE/PE;     // energy efficiency of trebuchet
  this.results.effR = R/Rstar;   // range efficiency of trebuchet
  this.results.effH = R/RHstar;  // height efficiency of trebuchet
  
// Populate results object
  this.results.H2   = H2;
  this.results.vx0  = vx0;
  this.results.vy0  = vy0;
  this.results.tMax = tMax;
  this.results.R    = R;
}

