// *********************************************************************************************************************
// Function Treb pulls together the entire trebuchet
// *********************************************************************************************************************
function Treb(L1,L2,h0,t,w,rho,m1,m2,beta) {
  this.cwt     = new Counterweight(m1, "#DDDDDD");                     // counterweight
  this.proj    = new Ball(m2, "#E93A90");                              // projectile
  this.arm     = new Arm_Fixed(L1, L2, w, t, rho, beta, "#AFF53D");    // throwing arm
  this.base    = new Base_Fixed(h0,"#9CA400");                         // base
  this.ground  = new Ground_Flat("#A93CD4");                           // fixed ground
  this.results = new Results();                                        // array of results

  this.g = 9.81;       // Acceleration of gravity (m/s^2)
  this.I = 0;          // moment of inertia of arm 
  this.deltaT = 0.001; // time step for simulation
}  
// function Treb.update - gets the trebuchet ready for redrawing after dims have been changed
Treb.prototype.update = function() {
  this.scale = 0.8*treb_can2.height/(this.arm.L2 + this.base.h0); // set up scaling for canvas

  this.x0 = treb_can2.width/2; // initial x-coordinate at fixed pivot
  this.y0 = treb_can2.height - 120; // initial y-coordinate at fixed pivot

  this.ground.y = this.base.h0;
  this.arm.update();                 // update dimensions on arm (including pivots)
  this.cwt.update(this.arm.L2);     // update dimensions of counterweight (including pivot)
  this.ground.update(this.arm.L2);  // update dimensions of ground
  this.proj.radius = 0.5*this.arm.w; // scale projectile to width of arm

// calculate initial angle of arm
  if (this.base.h0 >= this.arm.L2) {
    this.arm.theta = -89*Math.PI/180;
  } else {
    this.arm.theta = Math.asin(this.base.h0/this.arm.L2);
  }
  this.arm.theta0 = this.arm.theta;    // store initial angle of trebuchet arm (for efficiency calcs)
    
// set initial velocities to zero
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
Treb.prototype.mass = function() {
  this.arm.mass();
  var L1 = this.arm.L1;
  var L2 = this.arm.L2;
  var Lb = this.arm.Lb;

  this.I = this.cwt.mass*L1*L1 + this.proj.mass*L2*L2 + this.arm.Ib + this.arm.mb*Lb*Lb;
  this.m = this.cwt.mass*L1 - this.proj.mass*L2 - this.arm.mb*Lb;
}

Treb.prototype.draw = function() {
  treb_ctx2.save();
  treb_ctx4.save();
  treb_ctx2.translate(this.x0,this.y0);   // move to local coordinate system at bottom center of base
  treb_ctx4.translate(this.x0,this.y0);
  treb_ctx2.scale(this.scale,this.scale); // scale according to canvas scale
  treb_ctx4.scale(this.scale,this.scale);

  this.cwt.x  =  this.arm.L1*Math.cos(-this.arm.theta);  // x-coordinate of counterweight
  this.cwt.y  =  this.arm.L1*Math.sin(-this.arm.theta);  // y-coordinate of counterweight
  this.proj.x = -this.arm.L2*Math.cos(-this.arm.theta);  // x-coordinate of projectile
  this.proj.y = -this.arm.L2*Math.sin(-this.arm.theta);  // y-coordinate of projectile

  this.arm.draw(treb_ctx2,this.scale);    // draw the arm
  this.cwt.draw(treb_ctx4,this.scale);    // draw the counterweight
  this.proj.draw(treb_ctx4,this.scale);   // draw the projectile

  treb_ctx2.restore();  // go back to global coordinate system
  treb_ctx4.restore();  // go back to global coordinate system
}

// function Treb.launch - calculates range and efficiency of trebuchet
Treb.prototype.launch = function () {
// Dimensions of trebuchet
  var L1  = this.arm.L1;            // length from pivot to counterweight
  var L2  = this.arm.L2;            // length from pivot to hook
  var g   = this.g                  // gravitational constant
  var h0  = this.base.h0;           // height of pivot
  var m1  = this.cwt.mass;          // counterweight mass
  var m2  = this.proj.mass;         // projectile mass

// Initial conditions of projectile at launch
  var theta0    = this.arm.theta;    // launch angle of arm
  var thetadot0 = this.arm.thetadot; // final angular velocity of arm
  
// Heights for calculating potential energy and range
  var H1 = L1*(1 + Math.sin(this.arm.theta0));           // vertical distance traveled by counterweight
  var H2 = h0 - L2*Math.sin(theta0);                     // height that projectile is lifted during launch
  var Hstar = h0 + L2;                                   // max height that projectile could be lifted 
   
// Initial velocity of projectile
  var vx0   =  L2 * thetadot0*Math.sin(theta0);                               // x-velocity of projectile at launch
  var vy0   = -L2 * thetadot0*Math.cos(theta0);                               // y-velocity of projectile at launch
  var v02   =  vx0*vx0 + vy0*vy0;                                             // magnitude of launch velocity squared
  var tMax  = (vy0/g)+Math.sqrt((vy0*vy0)/(g*g) + 2*H2/g);                    // time of flight

// Potential and kinetic energy  
  var PE = (m1*H1 - m2*H2)*g;  // potential energy stored in counterweight
  var KE = 0.5*m2*v02;         // kinetic energy of projectile at launch

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









