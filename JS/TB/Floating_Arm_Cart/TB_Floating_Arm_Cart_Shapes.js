// *********************************************************************************************************************
// Function Base_Floating_Cart creates a base for the floating-arm trebuchet with a cart
// *********************************************************************************************************************
function Base_Floating_Cart (h0, H, W, lambda, mc, color) {
  this.x  = 0;          // x coordinate of bottom center of base
  this.y  = 0;          // y coordinate of bottom center of base
  this.h0 = h0;         // total height of base (and starting height of counterweight)
  this.H  = H;          // height of fixed pivot
  this.W  = W;          // horizontal distance from bottom of base to fixed pivot
  this.mc = mc;         // mass of cart
  this.lambda = lambda; // angle of ramp
  this.spring = 0.001;  // stiffness of artificial spring that keeps cart motion bounded
  this.pivot  = new Ball(0, "#AAAAAA");  // pivot point for arm
  this.wheel1 = new Ball(0, "#555555");  // rear wheel
  this.wheel2 = new Ball(0, "#555555");  // front wheel
  this.xdot = 0;        // x velocity of cart
  
  this.slotV = new Slot();              // slot for counterweight to ride in
  this.slotH = new Slot();              // slot for arm to ride in
  this.pivot = new Ball(0,"#AAAAAA");   // fixed pivot on base
  this.pivot.x = -W;                    // horizontal coordinate of fixed pivot (local coordinates)
  this.pivot.y = -H;                    // vertical coordinate of fixed pivot (local coordinates)
  this.color = color;
}

Base_Floating_Cart.prototype.draw = function(context,scale) {
  context.save();
  context.translate(this.x, this.y);  // move local coordinate system to bottom center of base
  context.lineWidth = 2/scale;        // scale line width with canvas scale
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";    // line color is black
  
  this.pivot.radius  = 0.02 * this.h0;  // radius of pivot (scaled to canvas)
  this.wheel1.radius = 0.05 * this.h0;  // radius of rear wheel (scaled to canvas)
  this.wheel2.radius = 0.05 * this.h0;  // radius of front wheel (scaled to canvas)
  
  this.wheel1.x = -1.05 * this.W;       // x coordinate of rear wheel
  this.wheel1.y =  0.1 * this.h0; // y coordinate of rear wheel
  this.wheel2.x =  0.35 * this.W;       // x coordinate of front wheel
  this.wheel2.y =  0.1 * this.h0; // y coordinate of front wheel
   
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
  context.lineTo(-this.W-0.10*this.h0, 0.1*this.h0);
  context.lineTo(0.5*this.W,0.1*this.h0);
  context.lineTo(0.5*this.W,0);
  context.closePath();
  context.fill();                     // fill in base
  context.stroke();                   // draw lines of base

  this.slotV.draw(context,scale);     // draw the vertical slot
  this.slotH.draw(context,scale);     // draw the horizontal slot
  this.pivot.draw(context,scale);     // draw fixed pivot on base
  this.wheel1.draw(context,scale);     // draw the rear wheel
  this.wheel2.draw(context,scale);     // draw the front wheel
    
  context.restore();
}

Base_Floating_Cart.prototype.update = function() {
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