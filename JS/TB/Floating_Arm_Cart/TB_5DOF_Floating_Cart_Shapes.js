// *********************************************************************************************************************
// Function Treb pulls together the entire trebuchet
// *********************************************************************************************************************
function Treb (L1,D,w,t,rho,beta,L2,H0,H,W,m1,m2,lambda) {
  this.cwt     = new Counterweight(m1, "#DDDDDD");                     // counterweight
  this.proj    = new Ball(m2, "#E93A90");                              // projectile
  this.sling   = new Sling(L2,"#D30068");                              // sling
  this.arm     = new Arm_Floating(L1, D, w, t, rho, beta, "#AFF53D");  // throwing arm
  this.base    = new Base_Floating(H0,H,W,"#9CA400");                  // base
  this.ground  = new Ground_Ramp(lambda,"#A93CD4");                    // fixed ground
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
  this.scale = 1.1*treb_can2.height/(this.base.H0 + this.arm.L); // set up scaling for canvas

  this.x0 = treb_can2.width/2 + 50; // initial x-coordinate of bottom center of base
  this.y0 = treb_can2.height - 30;  // initial y-coordinate of bottom center of base

  this.arm.update();                 // update dimensions on arm (including slot and pivot)
  this.base.update();                // update dimensions of base (including slots and pivot)
  this.cwt.update(this.base.H0);     // update dimensions of counterweight (including pivot)
  this.ground.update(this.base.H0);  // update dimensions of ground
  this.proj.radius = 0.5*this.arm.w; // scale projectile to width of arm
  this.h = this.base.H0;             // starting height of counterweight

// calculate initial angle of arm
  var H0 = this.base.H0;
  var H  = this.base.H;
  var W  = this.base.W;
  var L1 = this.arm.L;
  var L2 = this.sling.L;

  this.arm.theta = Math.atan((H0-H)/W);  // right side of arm is at maximum height
  var theta = this.arm.theta;            // now calculate starting angle of sling
  var lambda = this.ground.lambda;
  var test = (L1*Math.sin(lambda + theta) - H0*Math.cos(lambda))/L2;  // test if sling can reach ramp
  if ((test > 1) || (test < -1)) {              // sling is not long enough to reach ramp
    this.sling.psi = -Math.PI/2;                // so it hangs vertically
    iRamp = false;
  } else {                                      // sling is long enough to reach ramp
    this.sling.psi = Math.asin(test) - lambda;  // so it rests on ramp
    iRamp = true;
  }

  this.arm.theta0 = this.arm.theta;    // store initial angle of trebuchet arm (for efficiency calcs)
    
// set initial velocities to zero
  this.hdot = 0;
  this.arm.thetadot = 0;
  this.sling.psidot = 0;
  this.sling.xdot = 0;
  this.sling.ydot = 0;

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
  this.sling.x =         - this.arm.L*Math.cos(-this.arm.theta); // x-coordinate of end of sling
  this.sling.y = -this.h - this.arm.L*Math.sin(-this.arm.theta); // y-coordinate of end of sling
  this.proj.x  = this.sling.x + this.sling.L*Math.cos(-this.sling.psi);  // x-coordinate of projectile
  this.proj.y  = this.sling.y + this.sling.L*Math.sin(-this.sling.psi);  // y-coordinate of projectile

  this.arm.draw(treb_ctx2,this.scale);    // draw the arm
  this.cwt.draw(treb_ctx4,this.scale);    // draw the counterweight
  this.sling.draw(treb_ctx4,this.scale);  // draw the sling
  this.proj.draw(treb_ctx4,this.scale);   // draw the projectile

  treb_ctx2.restore();  // go back to global coordinate system
  treb_ctx4.restore();  // go back to global coordinate system
}

// function Treb.launch - calculates range and efficiency of trebuchet
Treb.prototype.launch = function () {
// Dimensions of trebuchet
  var L1  = this.arm.L;            // length from pivot to counterweight
  var L2  = this.sling.L;          // length of sling
  var g   = this.g                 // gravitational constant
  var h   = this.h;                // height of counterweight
  var m1  = this.cwt.mass;         // counterweight mass
  var m2  = this.proj.mass;        // projectile mass

// Initial conditions of projectile at launch
  var theta    = this.arm.theta;    // launch angle of arm
  var thetadot = this.arm.thetadot; // final angular velocity of arm
  var psi      = this.sling.psi;    // launch angle of sling
  var psidot   = this.sling.psidot; // final angular velocity of sling

// Initial height and velocities of projectile
  var sy0   =  -this.proj.y;             // Launch height of projectile
  var vx0   =  L1 * thetadot*Math.sin(theta) - L2*psidot*Math.sin(psi); // x-velocity of projectile at launch
  var vy0   = -L1 * thetadot*Math.cos(theta) + L2*psidot*Math.cos(psi); // y-velocity of projectile at launch
  var v0    = Math.sqrt(vx0*vx0 + vy0*vy0);                             // magnitude of launch velocity
  var tMax  = (vy0/g)+Math.sqrt((vy0*vy0)/(g*g) + 2*sy0/g);             // time of flight
  var alpha = Math.atan2(vy0,vx0);                                      // launch angle
  
  this.results.sy0   = sy0;
  this.results.vx0   = vx0;
  this.results.vy0   = vy0;
  this.results.v0    = v0;
  this.results.tMax  = tMax;
  this.results.alpha = alpha;

// calculate maximum horizontal range of projectile
  if (vx0 > 0) {                            // Did we launch forwards?
    this.results.xMin = 0;                  // Projectile starts at zero.
    this.results.xMax = vx0 * tMax;         // Horizontal range of flight based on initial velocity.
    this.results.range = this.results.xMax; // Return value for range
  } else {                                  // Nope, we launched backwards.
    this.results.xMin = vx0 * tMax;         // Projectile ends at xMin
    this.results.xMax = 0;                  // and starts at zero.
    this.results.range = this.results.xMin; // Return value for range
  }
  
// calculate maximum vertical range of projectile
  if (vy0 > 0) {                               // Did we launch upwards?
    this.results.yMax = (vy0*vy0)/(2*g) + sy0; // Maximum vertical height based on launch velocity
  } else {                                     // Nope, we launched downwards.
    this.results.yMax = sy0;                   // Maximum height is launch height.
  }

  this.results.effE = m2*v0*v0/(2*m1*g*L1*(1+Math.sin(this.arm.theta0)));      // energy efficiency of trebuchet
  this.results.effR = 2*this.results.effE * Math.sin(alpha) * Math.cos(alpha); // range efficiency of trebuchet
}

