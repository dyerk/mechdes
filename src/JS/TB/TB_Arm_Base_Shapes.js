// *********************************************************************************************************************
// Function Ground_Flat draws the ground, a rectangle below the base
// *********************************************************************************************************************
function Ground_Flat (color) {
  this.x = 0;  // x coordinate of bottom center of base (top center of ground)
  this.y = 0;  // y coordinate of bottom center of base (top center of ground)
  this.h = 0;  // height of ground rectangle
  this.w = 0;  // width of ground rectangle
  this.color = color;
}
Ground_Flat.prototype.draw = function(context,scale) {
  context.save();
  context.translate(this.x, this.y);
  context.lineWidth = 2/scale;
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";
    
  context.beginPath();  // draw ground rectangle
  context.fillRect(-this.w/2,0,this.w,this.h);
  context.fill();
  context.moveTo(-this.w/2,0);
  context.lineTo( this.w/2,0);
  context.stroke();
  context.restore();
}
Ground_Flat.prototype.update = function(H) {
  this.w = H;
  this.h = 0.07*H;
}

// *********************************************************************************************************************
// Function Ground_Ramp draws the ground with a sloping ramp
// *********************************************************************************************************************
function Ground_Ramp (lambda,color) {
  this.x = 0;            // x coordinate of bottom center of base
  this.y = 0;            // y coordinate of bottom center of base
  this.H = 0;            // total height of base (used to scale ground)
  this.lambda = lambda;  // ramp angle
  this.color = color;
}

Ground_Ramp.prototype.draw = function(context,scale) {
  context.save();
  context.translate(this.x, this.y);  // move local coordinate system to bottom center of base
  context.lineWidth = 2/scale;        // scale line width with canvas scale
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";    // line color is black
  
  context.beginPath();                // draw ground rectangle and triangle
  context.moveTo(0,0);
  context.lineTo(-1.0*this.H, -1.0*this.H*Math.tan(this.lambda));
  context.lineTo(-1.0*this.H,  0.1*this.H);
  context.lineTo( 0.2*this.H,  0.1*this.H);
  context.lineTo( 0.2*this.H,  0);
  context.closePath();
  context.fill();                     // fill in the whole shape

  context.beginPath();                // but draw thick lines on top surface of ground
  context.moveTo(-1.0*this.H, -1.0*this.H*Math.tan(this.lambda));
  context.lineTo(0,0);
  context.lineTo(0.2*this.H,0);
  context.stroke();
  
  context.restore();
}

Ground_Ramp.prototype.update = function(H) {
  this.H = H;
}

// *********************************************************************************************************************
// Function Arm_Fixed creates a trapezoidal trebuchet arm
// *********************************************************************************************************************
function Arm_Fixed (L1, L2, w, t, rho, beta, color) {
  this.x = 0;         // x coordinate of pivot
  this.y = 0;         // y coordinate of pivot
  this.theta = 0;     // angle of arm
  this.thetadot = 0;  // angular velocity of arm
  this.theta0 = 0;    // initial angle of arm (used for efficiency calculations)   
  this.color = color; // color of arm
  
  this.pivot1 = new Ball(0,"#AAAAAA");  // pivot at upper end of arm
  this.pivot2 = new Ball(0,"#AAAAAA");  // pivot at lower end of arm
    
  this.L1 = L1;       // length from pivot to short end of arm (m)
  this.L2 = L2;       // length from pivot to long end of arm (m)
  this.w = w;         // height of arm (m)
  this.t = t;         // thickness of arm (m)
  this.rho = rho;     // density of arm (kg/m^3)

  this.Lb = 0;        // distance to CM of beam
  this.mb = 0;        // mass of beam (kg)
  this.Ib = 0;        // moment of inertia of beam (kg-m2)
  this.beta = beta;   // hook angle
}

Arm_Fixed.prototype.draw = function(context,scale) {
  context.save();
  context.translate(this.x, this.y);  // put pivot at (x,y)
  context.rotate(-this.theta);        // rotate by angle theta
  
  context.lineWidth = 2/scale;        // scale line width with canvas width
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";    // line color is black
        
  context.beginPath();                // draw the trapezoid
  context.moveTo( this.L1 + 0.2*this.w, 0.2*this.w);
  context.lineTo( this.L1 + 0.2*this.w,-0.2*this.w);
  context.lineTo( 0.2*this.L1,-0.5*this.w);
  context.lineTo(-0.2*this.L2,-0.5*this.w);
  context.lineTo(-this.L2 - 0.2*this.w,-0.1*this.w);
  context.lineTo(-this.L2 - 0.2*this.w, 0.1*this.w);
  context.lineTo(-0.2*this.L2, 0.5*this.w);
  context.lineTo( 0.2*this.L1, 0.5*this.w);
  context.closePath();
  context.fill();                     // fill the trapezoid
  context.stroke();                   // draw lines of trapezoid
  
  this.pivot1.draw(context,scale);     // draw the pivot at the top of the arm
  this.pivot2.draw(context,scale);     // draw the pivot at the bottom of the arm
  context.restore();
};

Arm_Fixed.prototype.mass = function() {
  var L1 = this.L1;
  var L2 = this.L2;
  var w  = this.w;
  var rhoT = this.rho * this.t;
  
  var b1 = 0.8*L1;  // length of forward triangle
  var b2 = 0.2*L1;  // length of forward rectangle
  var b3 = 0.1*L2;  // length of rearward rectangle
  var b4 = 0.9*L2;  // length of rearward triangle
  var h1 = 0.3*w;   // height of forward triangle
  var h2 = 0.4*w;   // height of forward rectangle
  var h3 = 0.4*w;   // height or rearward triangle
  var h4 = 0.2*w;   // height of rearward rectangle
  
  var M1 = rhoT*h1*b1/2; // mass of forward triangle
  var M3 = rhoT*h3*b4/2; // mass of rearward triangle
  var M5 = rhoT*h2*b1;   // mass of forward rectangle
  var M6 = rhoT*h4*b4;   // mass of rearward rectangle
  var M7 = rhoT*w *b2;   // mass of rectangle forward of pivot
  var M8 = rhoT*w *b3;   // mass of rectangle rearward of pivot
  
  var x1 =  b2 + b1/3;  // CM of forward triangle
  var x3 = -b3 - b4/3;  // CM of rearward triangle
  var x5 =  b2 + b1/2;  // CM of forward rectangle
  var x6 = -b3 - b4/2;  // CM of rearward rectangle
  var x7 =  b2/2;       // CM of rectangle forward of pivot
  var x8 = -b3/2;       // CM of rectangle rearward of pivot
  
  var mb = 2*M1 + 2*M3 + M5 + M6 + M7 + M8;                         // mass of arm
  var Lb = (2*M1*x1 + 2*M3*x3 + M5*x5 + M6*x6 + M7*x7 + M8*x8)/mb;  // center of mass of arm (distance from pivot)

  var I1 = (M1/6)*(h1*h1 + b1*b1 + 4*b1*b2 + 6*b2*b2 + 2*h1*h2 + 1.5*h2*h2);  // forward triangle
  var I3 = (M3/6)*(h3*h3 + b4*b4 + 4*b3*b4 + 6*b3*b3 + 2*h3*h4 + 1.5*h4*h4);  // rearward triangle
  var I5 = (M5/12)*(h2*h2 + 4*b1*b1 + 12*b2*b2 + 12*b1*b2);                   // forward rectangle under triangle
  var I6 = (M6/12)*(h4*h4 + 4*b4*b4 + 12*b3*b3 + 12*b3*b4);                   // rearward rectangle under triangle
  var I7 = (M7/12)*(4*b2*b2 + w*w);                                           // rectangle forward of pivot
  var I8 = (M8/12)*(4*b3*b3 + w*w);                                           // rectangle rearward of pivot
  
  var Ipivot = 2*I1 + 2*I3 + I5 + I6 + I7 + I8;  // moment of inertia of arm about pivot
  var Ib = Ipivot - mb * Lb * Lb;                // moment of inertia of arm about CM

  this.Lb = Lb;   // center of mass of arm (distance from pivot)
  this.Ib = Ib;   // moment of inertia of arm about CM
  this.mb = mb;   // mass of arm
}

Arm_Fixed.prototype.update = function() {
  this.pivot1.x =  this.L1;
  this.pivot2.x = -this.L2;
  this.pivot1.radius = 0.1*this.w;
  this.pivot2.radius = 0.1*this.w;
}

// *********************************************************************************************************************
// Function Arm_Floating creates a rectangular arm for floating-arm trebuchet
// *********************************************************************************************************************
function Arm_Floating (L2, D, w, t, rho, beta, color) {
  this.x = 0;         // x coordinate of right end of arm
  this.y = 0;         // y coordinate of right end of arm
  this.theta = 0;     // angle of arm
  this.thetadot = 0;  // angular velocity of arm
  this.theta0 = 0;    // initial angle of arm (used for efficiency calculations)   
  this.color = color; // color of arm
  
  this.slot = new Slot();                    // slot that mates with fixed pin on base
  this.pivot = new Ball(0,"#AAAAAA");  // pivot that is attached to arm
  this.pivot.x = -D;                         // position the pivot on the arm (local coordinates)
  this.pivot.y = 0; 
      
  this.L2 = L2;       // length from counterweight to hook (m)
  this.D = D;         // length from counterweight to pivot on arm (m)
  this.w = w;         // height of arm (m)
  this.t = t;         // thickness of arm (m)
  this.rho = rho;     // density of arm (kg/m^3)
  this.beta = beta;   // hook angle
}

Arm_Floating.prototype.draw = function(context,scale) {
  context.save();
  context.translate(this.x,this.y);   // move local origin to right end of arm
  context.rotate(-this.theta);        // rotate by angle theta

  context.lineWidth = 2/scale;        // scale line width with canvas scale
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";    // line color is black

  context.beginPath();                // draw the rectangular arm
  context.rect(-this.L2,-this.w/2,this.L2+0.1*this.w,this.w);
  context.closePath();        
  context.fill();                     // fill the rectangle
  context.stroke();                   // draw lines of rectangle

  this.slot.draw(context,scale);      // draw the slot
  this.pivot.draw(context,scale);     // draw the pivot attached to the arm

  context.restore(); 
};

Arm_Floating.prototype.update = function() {
  this.pivot.x = -this.D;
  this.pivot.y = 0;
  this.pivot.radius = 0.1*this.w;
  this.slot.L =  0.4*this.L2;
  this.slot.W =  0.2*this.w;
  this.slot.x = -0.9*this.L2; 
  this.slot.y = 0;
  this.slot.angle = 0;  
}

Arm_Floating.prototype.mass = function() {
  var L2  = this.L2;
  var w  = this.w;
  var mb = this.rho * this.t * w * L2;    // mass of arm
  this.Ib = (mb/12)*(L2*L2 + w*w);        // moment of inertia of arm about CM
}

// *********************************************************************************************************************
// Function Base_Fixed creates a trebuchet base in the shape of a quadrilateral
// *********************************************************************************************************************
function Base_Fixed (h0, color) {
  this.x = 0;           // x coordinate of pivot point
  this.y = 0;           // y coordinate of pivot point
  this.h0 = h0;         // this is height from bottom to pivot point (not to top of base)
  this.spring = 0.001;  // stiffness of artificial spring that keeps cart motion bounded
  this.pivot  = new Ball(0, "#AAAAAA");  // pivot point for arm
  this.color = color;
}

Base_Fixed.prototype.draw = function(context,scale) {
  context.save();
  context.translate(this.x, this.y);
  context.lineWidth = 2/scale;
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";
  
  var h0 = this.h0;  // scale various lengths on base
  var W1 = 0.15 * h0; // top width is 15% of height
  var W2 = 0.30 * h0; // bottom width is 30% of height
  
  this.pivot.radius  = 0.05 * h0;  // radius of pivot (scaled to canvas)
  
  this.pivot.x  = this.x;            // x coordinate of pivot
  this.pivot.y  = this.y;            // y coordinate of pivot

  context.beginPath();                 // draw base outline
  context.moveTo( W1/2,-0.1*h0);
  context.lineTo(-W1/2,-0.1*h0);
  context.lineTo(-W2/2, h0);
  context.lineTo( W2/2, h0);
  context.closePath();
  context.fill();                      // fill in base
  context.stroke();                    // draw lines of base
  context.restore();
  
  this.pivot.draw(context,scale);      // draw the pivot
}
// *********************************************************************************************************************
// Function Base_Cart creates a trebuchet base with two wheels
// *********************************************************************************************************************
function Base_Cart (h0, mc, color) {
  this.x = 0;           // x coordinate of pivot point
  this.y = 0;           // y coordinate of pivot point
  this.h0 = h0;         // this is height from bottom to pivot point (not to top of base)
  this.mc = mc;         // mass of cart
  this.spring = 0.001;  // stiffness of artificial spring that keeps cart motion bounded
  this.pivot  = new Ball(0, "#AAAAAA");  // pivot point for arm
  this.wheel1 = new Ball(0, "#555555");  // rear wheel
  this.wheel2 = new Ball(0, "#555555");  // front wheel
  
  this.xdot = 0;        // x velocity of cart
  this.color = color;
}

Base_Cart.prototype.draw = function(context,scale) {
  context.save();

  context.translate(this.x, this.y);
  context.lineWidth = 2/scale;
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";
  
  var h0 = this.h0;         // scale various lengths on base
  var W1 = 0.15 * h0;      // top width is 15% of height
  var W2 = 0.30 * h0;      // bottom width is 30% of height
  var W3 = h0;             // left cart width (same as height)
  var W4 = 0.60 * h0;      // right cart width
  
  this.pivot.radius  = 0.03 * h0;  // radius of pivot (scaled to canvas)
  this.wheel1.radius = 0.10 * h0;  // radius of rear wheel (scaled to canvas)
  this.wheel2.radius = 0.10 * h0;  // radius of front wheel (scaled to canvas)
  
  this.wheel1.x = -0.8 * W3; // x coordinate of rear wheel
  this.wheel1.y =  h0 + W1;   // y coordinate of rear wheel
  this.wheel2.x =  0.4 * W3; // x coordinate of front wheel
  this.wheel2.y =  h0 + W1;   // y coordinate of front wheel

  context.beginPath();                 // draw base outline
  context.moveTo( W1/2,-0.1*h0);
  context.lineTo(-W1/2,-0.1*h0);
  context.lineTo(-W2/2, h0);
  context.lineTo(-W3, h0);
  context.lineTo(-W3, h0+W1);
  context.lineTo( W4, h0+W1);
  context.lineTo( W4, h0);
  context.lineTo( W2/2, h0);
  context.closePath();
  context.fill();                      // fill in base
  context.stroke();                    // draw lines of base

  this.pivot.draw(context,scale);      // draw the pivot
  this.wheel1.draw(context,scale);     // draw the rear wheel
  this.wheel2.draw(context,scale);     // draw the front wheel
  
  context.restore();
}

// *********************************************************************************************************************
// Function Base_Floating creates a base for the floating-arm trebuchet
// *********************************************************************************************************************
function Base_Floating (h0, H, W, lambda, color) {
  this.x  = 0;           // x coordinate of bottom center of base
  this.y  = 0;           // y coordinate of bottom center of base
  this.h0 = h0;          // total height of base (and starting height of counterweight)
  this.H  = H;           // height of fixed pivot
  this.W  = W;           // horizontal distance from bottom of base to fixed pivot
  this.lambda = lambda;  // ramp angle

  this.slotV = new Slot();              // slot for counterweight to ride in
  this.slotH = new Slot();              // slot for arm to ride in
  this.pivot = new Ball(0,"#AAAAAA"); // fixed pivot on base
  this.pivot.x = -W;                    // horizontal coordinate of fixed pivot (local coordinates)
  this.pivot.y = -H;                    // vertical coordinate of fixed pivot (local coordinates)
  this.color = color;
}

Base_Floating.prototype.draw = function(context,scale) {
  context.save();
  context.translate(this.x, this.y);  // move local coordinate system to bottom center of base
  context.lineWidth = 2/scale;        // scale line width with canvas scale
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";    // line color is black
 
  context.beginPath();                // draw base outline
  context.moveTo(         0.1*this.h0,                    0);
  context.lineTo(         0.1*this.h0,        -1.05*this.h0);
  context.lineTo(        -0.1*this.h0,        -1.05*this.h0);
  context.lineTo(        -0.1*this.h0, -this.H-0.05*this.h0);
  context.lineTo(-this.W-0.05*this.h0, -this.H-0.05*this.h0);
  context.lineTo(-this.W-0.05*this.h0, -this.H+0.05*this.h0);
  context.lineTo(        -0.1*this.h0, -this.H+0.05*this.h0);
  context.lineTo(        -0.1*this.h0, -0.1*this.h0*Math.tan(this.lambda));
  context.lineTo(-this.W-0.10*this.h0, -(this.W+0.1*this.h0)*Math.tan(this.lambda));
  context.lineTo(-this.W-0.10*this.h0,         0.15*this.h0);
  context.lineTo(          0.5*this.W,         0.15*this.h0);
  context.lineTo(          0.5*this.W,                    0);
  context.closePath();
  context.fill();                     // fill in base
  context.stroke();                   // draw lines of base

  this.slotV.draw(context,scale);     // draw the vertical slot
  this.slotH.draw(context,scale);     // draw the horizontal slot
  this.pivot.draw(context,scale);     // draw fixed pivot on base
  
  context.restore();
}

Base_Floating.prototype.update = function() {
  this.x = 0;                 // x-coordinate of bottom center of base (local coordinates)
  this.y = 0;                 // y-coordinate of bottom center of base (local coordinates)
  this.slotV.L =  0.90*this.h0;
  this.slotV.W =  0.05*this.h0;
  this.slotV.x =  0;
  this.slotV.y = -0.05*this.h0;
  this.slotV.angle = Math.PI/2;
  this.slotH.L =  0.70*this.W;
  this.slotH.W =  0.05*this.h0;
  this.slotH.x = -0.85*this.W;
  this.slotH.y = -this.H;
  this.slotH.angle = 0;
  this.pivot.x = -this.W;
  this.pivot.y = -this.H;
  this.pivot.radius = 0.02*this.W;
}