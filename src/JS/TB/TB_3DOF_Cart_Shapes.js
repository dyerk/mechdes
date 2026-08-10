// *********************************************************************************************************************
// Function Treb pulls together the entire trebuchet
// *********************************************************************************************************************
function Treb (L1,L2,L3,h0,t,w,rho,m1,m2,mc,beta) {
  this.cwt     = new Counterweight(m1, "#DDDDDD");                  // counterweight
  this.proj    = new Ball(m2, "#E93A90");                           // projectile
  this.sling   = new Sling(L3, "#E93A90");                          // sling for projectile
  this.arm     = new Arm_Fixed(L1, L2, w, t, rho, beta, "#AFF53D"); // throwing arm
  this.base    = new Base_Cart(h0,mc,"#9CA400");                    // base
  this.ground  = new Ground_Flat("#A93CD4");                        // fixed ground
  this.results = new Results();                                     // array of results

  this.g      = 9.81;  // Acceleration of gravity (m/s^2)
  this.I      = 0;     // combined moment of inertia of arm, projectile and counterweight
  this.M23    = 0;     // first moment of projectile
  this.I23    = 0;     // cross-term in inertia matrix
  this.I3     = 0;     // diagonal term in inertia matrix
  this.M      = 0;     // first moment of inertia of arm, projectile and counterweight
  this.m      = 0;     // combined mass of cart, arm, counterweight and projectile
  this.deltaT = 0.001; // time step for simulation
}

// function Treb.update - gets the trebuchet ready for redrawing after dims have been changed
Treb.prototype.update = function() {

// set up scaling for canvas by finding max dimensions of trebuchet
  this.scale = 0.9*treb_can2.height/(this.base.h0 + this.sling.L + this.arm.L2 + this.arm.L1);

  this.x0 = treb_can2.width/2;      // initial x-coordinate of throwing arm pivot
  this.y0 = treb_can2.height - 120; // initial y-coordinate of throwing arm pivot

  this.arm.update();                   // update arm dimensions
  this.cwt.update(1.5*this.arm.L2);    // update counterweight dimensions
  this.ground.update(3*this.arm.L2);   // update ground dimensions
  this.ground.y = 1.25*this.base.h0;    // y-coordinate of top center of ground (below wheels)
  this.proj.radius = 0.3*this.arm.w;   // scale projectile to width of arm
    
// calculate initial angle of arm and sling
  if (this.arm.L2 > this.base.h0) {                // end of arm rests on ground
    this.arm.theta = Math.asin(this.base.h0/this.arm.L2);
    this.sling.psi = 0;                           // sling is horizontal
    iRamp = true;
  } else {                                        // end of arm is off ground
    this.arm.theta = Math.PI/3;                   // arbitrarily start arm at -60 degrees
    var Hprime = this.base.h0 - this.arm.L2*Math.sin(this.arm.theta); // height of sling above ground
    if (Hprime < this.sling.L) {                  // sling can still reach ground
      this.sling.psi = -Math.asin(Hprime/this.sling.L);
      iRamp = true;
    } else {                                      // sling dangles in the air
      this.sling.psi = -Math.PI/2;                
      iRamp = false;
    }
  }
  this.arm.theta0 = this.arm.theta;    // store initial angle of trebuchet arm (for efficiency calcs)
    
// set positions and velocities to zero (or initial configuration)
  this.base.x = 0;        // initial position of cart is zero
  this.base.xdot = 0;     // initial velocity of cart is zero
  this.arm.thetadot = 0;  // initial angular velocity of arm is zero
  this.sling.psidot = 0;  // initial angular velocity of sling is zero
  
// draw fixed parts of canvas
  treb_ctx1.save();
  treb_ctx1.translate(this.x0,this.y0);   // move to local coordinate system at bottom center of base
  treb_ctx1.scale(this.scale,this.scale); // scale according to canvas scale
  this.ground.draw(treb_ctx1,this.scale); // draw the ground
  treb_ctx1.restore();                    // go back to global coordinate system
}

// function Treb.mass - updates mass properties of entire trebuchet
Treb.prototype.mass = function() {
  this.arm.mass(); // update mass properties of arm

  var L1 = this.arm.L1;
  var L2 = this.arm.L2;
  var L3 = this.sling.L;
  var Lb = this.arm.Lb;
  var mb = this.arm.mb;
  var Ib = this.arm.Ib;
  var m1 = this.cwt.mass;
  var m2 = this.proj.mass;
  var mc = this.base.mc;

  this.I = m1*L1*L1 + m2*L2*L2 + mb*Lb*Lb + Ib;  // combined "moment of inertia" of arm, proj, and cwt
  this.M = m1*L1 - m2*L2 - mb*Lb;                // first moment of arm, proj, and cwt
  this.m = m1 + m2 + mb + mc;                    // combined mass of arm, proj, cwt and cart
  this.I23 = m2*L2*L3;                           // cross-term in inertia matrix
  this.I3  = m2*L3*L3;                           // diagonal term in inertia matrix
  this.M23 = m2*L3;                              // first moment of projectile
}

// function Treb.draw - draws the trebuchet in its current configuration
Treb.prototype.draw = function() {
  treb_ctx2.clearRect(0,0,treb_can2.width,treb_can2.height);  // clear canvases prior to drawing
  treb_ctx3.clearRect(0,0,treb_can3.width,treb_can3.height);
  treb_ctx4.clearRect(0,0,treb_can4.width,treb_can4.height);
  treb_ctx2.save();
  treb_ctx3.save();
  treb_ctx4.save();
  treb_ctx2.translate(this.x0,this.y0);   // move to local coordinate system at bottom center of base
  treb_ctx3.translate(this.x0,this.y0);
  treb_ctx4.translate(this.x0,this.y0);
  treb_ctx2.scale(this.scale,this.scale); // scale according to canvas scale
  treb_ctx3.scale(this.scale,this.scale);
  treb_ctx4.scale(this.scale,this.scale);

  this.arm.x    = this.base.x;                                          // x-coordinate of arm pivot
  this.sling.x  = this.base.x - this.arm.L2*Math.cos(-this.arm.theta);  // x-coordinate of sling
  this.sling.y  = this.base.y - this.arm.L2*Math.sin(-this.arm.theta);  // y-coordinate of sling
  this.cwt.x    = this.base.x + this.arm.L1*Math.cos(-this.arm.theta);  // x-coordinate of hanger
  this.cwt.y    = this.base.y + this.arm.L1*Math.sin(-this.arm.theta);  // y-coordinate of hanger
  this.proj.x   = this.sling.x + this.sling.L*Math.cos(-this.sling.psi);  // x-coordinate of proj
  this.proj.y   = this.sling.y + this.sling.L*Math.sin(-this.sling.psi);  // y-coordinate of proj

  this.arm.draw(treb_ctx2,this.scale);
  this.base.draw(treb_ctx3,this.scale);
  this.cwt.draw(treb_ctx4,this.scale);
  this.sling.draw(treb_ctx4,this.scale);
  this.proj.draw(treb_ctx4,this.scale); 
  
  treb_ctx2.restore();  // go back to global coordinate system
  treb_ctx3.restore();  // go back to global coordinate system
  treb_ctx4.restore();  // go back to global coordinate system
}

// function Treb.launch - calculates range and efficiency of trebuchet
Treb.prototype.launch = function () {
// Dimensions of trebuchet
  var L1  = this.arm.L1;            // length from pivot to counterweight
  var L2  = this.arm.L2;            // length from pivot to hook
  var L3  = this.sling.L;           // length of sling
  var g   = this.g                  // gravitational constant
  var h0  = this.base.h0;           // height of pivot
  var m1  = this.cwt.mass;          // counterweight mass
  var m2  = this.proj.mass;         // projectile mass

// Initial conditions of projectile at launch
  var xdot0     = this.base.xdot;    // velocity of cart at launch
  var theta0    = this.arm.theta;    // launch angle of arm
  var thetadot0 = this.arm.thetadot; // final angular velocity of arm
  var psi0      = this.sling.psi;    // launch angle of sling
  var psidot0   = this.sling.psidot; // final angular velocity of sling
  
// Heights for calculating potential energy and range
  var H1 = L1*(1 + Math.sin(this.arm.theta0));           // vertical distance traveled by counterweight
  var H2 = h0 - L2*Math.sin(theta0) + L3*Math.sin(psi0); // height that projectile is lifted during launch
  var Hstar = h0 + L2 + L3;                              // max height that projectile could be lifted 
   
// Initial velocity of projectile
  var vx0   =  L2*thetadot0*Math.sin(theta0)-L3*psidot0*Math.sin(psi0)+xdot0; // x-velocity of projectile at launch
  var vy0   = -L2*thetadot0*Math.cos(theta0)+L3*psidot0*Math.cos(psi0);       // y-velocity of projectile at launch
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
