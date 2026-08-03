// ********************************************************************************
// Function Pin creates a circle
// ********************************************************************************
function Pin (x, y, geom) {
  this.x = x;                           // x-coordinate of center of circle
  this.y = y;                           // y-coordinate of center of circle
  this.radius    = geom.pinRadius;      // radius of circle
  this.lineColor = geom.pinLineColor;   // outline color of circle
  this.fillColor = geom.pinFillColor;   // fill color of circle
}

Pin.prototype.draw = function(context) {
  context.lineWidth = 2;                // line width
  context.fillStyle = this.fillColor;   // fill color
  context.strokeStyle = this.lineColor; // outline color

  context.beginPath();               
  context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true); // draw circle
  context.closePath();
  context.fill();
  context.stroke();
}

// ********************************************************************************
// Function IC create instant center
// ********************************************************************************
function InstantCenter (x,y,fillColor,text,geom){
	this.x = x;
	this.y = y;
	this.pin = new Pin(x,y,geom);
	this.pin.radius = 10;
	this.pin.fillColor = fillColor;
	
	this.text = text;
}
InstantCenter.prototype.draw = function(context) {
	this.pin.draw(context);    					// draw pin in local coordinate system
  context.font = "12px Garamond";			// set font style
	context.fillStyle = "black";				// set font color
	context.textAlign = "center";				// set font horizontal alignment
	context.textBaseline = "middle";		// set font vertical alignment`
	context.fillText(this.text,this.x,this.y);		// place text
}


// ********************************************************************************
// Function Flywheel creates a flywheel with two pins and a circle with line
// ********************************************************************************
function Flywheel (r, R, geom, lineColor, fillColor) {
  this.x = 0;                          // x-coordinate of center of pin on flywheel
  this.y = 0;                          // y-coordinate of center of pin on flywheel
  this.theta = 0;                      // current angle of flywheel
  this.lineColor = lineColor;          // line color of flywheel
  this.fillColor = fillColor;          // fill color of flywheel
  this.r = r;                          // distance between pins on flywheel
  this.R = R;                          // outer radius of flywheel
  this.pin = [new Pin(0, 0, geom),     // pin at center of flywheel
              new Pin(r, 0, geom)];    // other pin on flywheel
}

Flywheel.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);    // move local origin to center of flywheel
  context.rotate(-this.theta);          // rotate the local coordinate system
  context.lineWidth = 2;                // line width
  context.fillStyle = this.fillColor;   // fill color
  context.strokeStyle = this.lineColor; // line color
  
  context.beginPath();                  
  context.arc( 0, 0,  this.R, 0,   2*Math.PI); // draw the flywheel
  context.closePath();
  context.fill();
  context.stroke();
  
  context.lineWidth = 1;        // draw radial line on flywheel
  context.beginPath();
  context.moveTo(0, 0);         // start at center of circle
  context.lineTo(this.R-1, 0);  // draw line to edge of circle
  context.closePath();
  context.stroke();

  this.pin[0].draw(context);    // draw first pin in local coordinate system
  this.pin[1].draw(context);    // draw second pin in local coordinate system
  context.restore();            // restore the original coordinate system
};

// ********************************************************************************
// Function Bar draws a bar with a pin at each end in the center of a knob
// ********************************************************************************
function Bar (L, geom, lineColor, fillColor) {
  this.x = 0;                 // x-coordinate of left end of bar
  this.y = 0;                 // y-coordinate of left end of bar
  this.theta = 0;             // rotation angle of bar
  this.w = geom.barWidth;     // width of bar
  this.d = geom.barDiam;      // diameter of knob at end of bar
  this.L = L;                 // length of bar (from pin to pin)
  this.lineColor = lineColor; // line color
  this.fillColor = fillColor; // fill color

  this.pin = [new Pin( 0, 0, geom),
              new Pin( L, 0, geom)] // create the two pins

  this.alpha = Math.asin(this.w/this.d);     // angle of sweep of knob
  this.xC = this.d/2 * Math.cos(this.alpha); // x coordinate where knob meets bar
  this.yC = this.w / 2;                      // y coordinate where knob meets bar
}

Bar.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);    // move local origin to left end of bar
  context.rotate(-this.theta);          // rotate the local coordinate system
  context.lineWidth = 2;                // line width
  context.fillStyle = this.fillColor;   // fill color
  context.strokeStyle = this.lineColor; // outline color
  
  context.beginPath();                  // draw the bar
  context.moveTo(          this.xC, -this.yC);  // start at left end of bar
  context.lineTo( this.L - this.xC, -this.yC);  // move to right end
  context.arc( this.L, 0,  this.d/2, -Math.PI + this.alpha,   Math.PI - this.alpha); // draw right knob
  context.lineTo(          this.xC,  this.yC);  // go back to left side
  context.arc(      0, 0,  this.d/2,            this.alpha, 2*Math.PI - this.alpha); // draw left knob
  context.closePath();
  context.fill();
  context.stroke();

  this.pin[0].draw(context);            // draw first pin in local coordinate system
  this.pin[1].draw(context);            // draw second pin in local coordinate system
  context.restore();                    // restore the original coordinate system
};

// ********************************************************************************
// Function BarSlot draws a bar with a pin at one end and a slot along centerline
// ********************************************************************************
function BarSlot (P, A, D, geom, lineColor, fillColor) {
  this.x = 0;                 // x-coordinate of left end of bar
  this.y = 0;                 // y-coordinate of left end of bar
  this.theta = 0;             // rotation angle of bar
  this.w = geom.barWidth;     // width of bar
  this.d = geom.barDiam;      // diameter of knob at end of bar
  this.r = geom.pinRadius;    // radius (half width) of slot
  this.P = P;									// position of point P along slotted bar (defaults to end of bar)
	this.A = A;									// length of crank driving barslot
	this.D = D;									// distance between pivots
  this.lineColor = lineColor; // line color
  this.fillColor = fillColor; // fill color

	this.pin = [new Pin( 0, 0, geom),
							new Pin( P, 0, geom)];

  this.alpha = Math.asin(this.w/this.d);     // angle of sweep of knob
  this.xC = this.d/2 * Math.cos(this.alpha); // x coordinate where knob meets bar
  this.yC = this.w / 2;                      // y coordinate where knob meets bar
}

BarSlot.prototype.draw = function(context) {
	this.slotStart = Math.abs(this.D-this.A);	 // x coordinate of where slct starts
	this.slotEnd = this.A+this.D;							 // x coordinate of where slot ends
	if (this.slotEnd < this.P) {										 // calculate overal length of bar	
		this.L = this.P;												 // if P is past slot this is length of bar
	} else {
		this.L = this.slotEnd;									 // if P is before slot length of bar is end of slot
	}
	
  context.save();
  context.translate(this.x, this.y);    // move local origin to left end of bar
  context.rotate(-this.theta);          // rotate the local coordinate system
  context.lineWidth = 2;                // line width
  context.fillStyle = this.fillColor;   // fill color
  context.strokeStyle = this.lineColor; // outline color

// first, draw the bar  
  context.beginPath();                  // draw the bar
  context.moveTo(          this.xC, -this.yC);  // start at left end of bar
  context.lineTo(           this.L, -this.yC);  // move to right end
  context.arc( this.L, 0,  this.w/2, -Math.PI/2,   Math.PI/2); // draw right knob
  context.lineTo(          this.xC,  this.yC);  // go back to left side
  context.arc(      0, 0,  this.d/2,            this.alpha, 2*Math.PI - this.alpha); // draw left knob
  context.closePath();
  context.fill();
  context.stroke();

// next, draw the slot
  context.beginPath();
  context.moveTo(this.slotStart, this.r);
  context.lineTo(this.slotEnd  , this.r);                      // draw the slot line
  context.arc(this.slotEnd, 0, this.r, Math.PI/2, 3*Math.PI/2, true); // draw the arc at one end of slot
  context.lineTo(this.slotStart,-this.r);                      // draw the slot line
  context.arc(this.slotStart, 0, this.r, 3*Math.PI/2, Math.PI/2, true); // draw the arc at other end of slot
  context.closePath();
  
  context.globalCompositeOperation = "destination-out";  // cuts the slot out of the background object
  context.fill();
  context.globalCompositeOperation = "source-over";  // draws outline on top of background object
  context.stroke();
  
  this.pin[0].draw(context);               // draw pin in local coordinate system
	this.pin[1].draw(context);
  context.restore();                    // restore the original coordinate system
};


// ********************************************************************************
// Function Gearbar draws a gear with a bar projecting outward.
// This is for the geared fivebar linkage
// ********************************************************************************
function Gearbar (D, L, geom, lineColor, fillColor) {
  this.x = 0;                 // x-coordinate of left end of bar
  this.y = 0;                 // y-coordinate of left end of bar
  this.theta = 0;             // rotation angle of bar
  this.w = geom.barWidth;     // width of bar
  this.d = geom.barDiam;      // diameter of knob at end of bar
  this.L = L;                 // length of bar (from pin to pin)
  this.D = D;                 // diameter of gear
  this.lineColor = lineColor; // line color
  this.fillColor = fillColor; // fill color
  this.pin = [new Pin( 0, 0, geom),
              new Pin( L, 0, geom)] // create the two pins

  this.alpha = Math.asin(this.w/this.d);     // angle of sweep at knob end
  this.beta = Math.asin(this.w/this.D);      // angle of sweep at gear end
  this.xK = this.L - this.d/2 * Math.cos(this.alpha); // x coord where knob meets bar
  this.yK = this.w / 2;                      // y coordinate where knob meets bar
  this.xG = this.D/2 * Math.cos(this.beta);  // x coordinate where gear meets bar
  this.yG = this.w / 2;                      // y coordinate where gear meets bar
}

Gearbar.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);    // move local origin to left end of bar
  context.rotate(-this.theta);          // rotate the local coordinate system
  context.lineWidth = 2;                // line width
  context.fillStyle = this.fillColor;   // fill color
  context.strokeStyle = this.lineColor; // line color
  
  context.beginPath();                  // draw the bar
  context.moveTo(          this.xG,  this.yG);  // start at lower left end of bar
  context.arc(      0, 0,  this.D/2,             this.beta, 2*Math.PI - this.beta);
  context.lineTo(          this.xK, -this.yK);  // move to right end
  context.arc( this.L, 0,  this.d/2, -Math.PI + this.alpha,   Math.PI - this.alpha); // draw right knob
  context.closePath();
  context.fill();
  context.stroke();

  this.pin[0].draw(context);            // draw first pin in local coordinate system
  this.pin[1].draw(context);            // draw second pin in local coordinate system
  context.restore();                    // restore the original coordinate system
};
// ********************************************************************************
// Function Coupler draws a triangle with three pins. Origin is at left pin of coupler
// ********************************************************************************
function Coupler (L, p, beta, geom, lineColor, fillColor) {
  this.x = 0;                   // x coordinate of origin of coupler
  this.y = 0;                   // y coordinate of origin of coupler
  this.theta = 0;               // rotation angle of coupler
  this.L = L;                   // length of bar (from left pin to right pin)
  this.p = p;                   // distance from left pin to top pin
  this.beta = beta;             // angle between horizontal and the line p
  this.r = geom.couplerRadius;  // radius of corner arcs of coupler
  this.lineColor = lineColor;   // line color
  this.fillColor = fillColor;   // fill color

  var b = Math.sqrt(p*p + L*L - 2*p*L*Math.cos(beta));                       // distance from top pin to right pin
  this.rcb = this.r*Math.cos(beta),       this.rsb = this.r*Math.sin(beta);  // coordinates of offset points
  this.pcb = this.p*Math.cos(beta),       this.psb = this.p*Math.sin(beta);  // on coupler triangle

  this.gamma = Math.atan2(this.psb, this.pcb - L);                           // other angle on triangle
  this.bcg = b*Math.cos(this.gamma),      this.bsg = b*Math.sin(this.gamma);
  this.rcg = this.r*Math.cos(this.gamma), this.rsg = this.r*Math.sin(this.gamma);

  this.pin = [new Pin( 0, 0, geom),               // define left pin (origin of coupler)
              new Pin( L, 0, geom),               // define right pin
              new Pin(this.pcb, -this.psb, geom)] // define top pin
}

Coupler.prototype.calcPoints = function() {
	var b = Math.sqrt(this.p*this.p + this.L*this.L - 2*this.p*this.L*Math.cos(this.beta));                       // distance from top pin to right pin
  this.rcb = this.r*Math.cos(this.beta),       this.rsb = this.r*Math.sin(this.beta);  // coordinates of offset points
  this.pcb = this.p*Math.cos(this.beta),       this.psb = this.p*Math.sin(this.beta);  // on coupler triangle

  this.gamma = Math.atan2(this.psb, this.pcb - this.L);                           // other angle on triangle
  this.bcg = b*Math.cos(this.gamma),      this.bsg = b*Math.sin(this.gamma);
  this.rcg = this.r*Math.cos(this.gamma), this.rsg = this.r*Math.sin(this.gamma);
}

Coupler.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);   // move local origin to midpoint of bar
  context.rotate(-this.theta);         // rotate the local coordinate system
  context.lineWidth = 2;               // line width
  context.fillStyle = this.fillColor;  // fill color
  context.strokeStyle = this.lineColor;// line color
  
// draw triangular coupler
  context.beginPath();
  if (this.beta > 0) {
    context.moveTo(          -this.rsb,            -this.rcb);
    context.lineTo(this.pcb - this.rsb, -this.psb - this.rcb);
    context.arc(this.pcb, -this.psb, this.r,  -this.beta - Math.PI/2,-this.gamma + Math.PI/2, false);
    context.lineTo(  this.L + this.rsg,              this.rcg);
    context.arc(  this.L,         0, this.r, -this.gamma + Math.PI/2,              Math.PI/2, false);
    context.lineTo(                  0,              this.r);
    context.arc(       0,         0, this.r,              Math.PI/2,  -this.beta - Math.PI/2, false);
  } else {
    context.moveTo(                  0,             -this.r);
    context.lineTo(             this.L,             -this.r);
    context.arc(  this.L,         0, this.r,             -Math.PI/2, -Math.PI/2 - this.gamma, false);
    context.lineTo(this.bcg - this.rsg + this.L, -this.bsg - this.rcg);
    context.arc(this.pcb, -this.psb, this.r, -Math.PI/2 - this.gamma, Math.PI/2 - this.beta,  false);
    context.lineTo(           this.rsb,             this.rcb);
    context.arc(       0,         0, this.r,        Math.PI/2 - this.beta, -Math.PI/2, false);
  }
  context.closePath();
  context.fill();
  context.stroke();

  this.pin[0].draw(context);  // draw first pin
  this.pin[1].draw(context);  // draw second pin
  this.pin[2].draw(context);  // draw third pin
  context.restore();          // restore the original coordinate system
};

// ********************************************************************************
// Function Slider draws the slider in the inverted slider-crank
// ********************************************************************************
function Slider (p, geom, lineColor, fillColor) {
  this.x = 0;                         // x-coordinate of pin
  this.y = 0;                         // y-coordinate of pin
  this.theta = 0;                     // rotation angle of slider
  this.w = geom.barWidth;             // width of slider
  this.d = geom.barDiam;              // diameter of knob
  this.p = p;                         // length of slider (from pin to end)
  this.lineColor = lineColor;         // line color
  this.fillColor = fillColor;         // fill color
  this.pin = new Pin(0, 0, geom);     // create the pin

  this.alpha = Math.asin(this.w/this.d);     // angle of sweep of knob
  this.xC = this.d/2 * Math.cos(this.alpha); // x coordinate where knob meets bar
  this.yC = this.w / 2;                      // y coordinate where knob meets bar
}

Slider.prototype.draw = function(context) {
  context.save();
  context.translate(this.x,this.y);     // move to center of pin
  context.rotate(-this.theta);          // rotate the local coordinate system
  context.lineWidth = 2;                // line width
  context.fillStyle = this.fillColor;   // fill color
  context.strokeStyle = this.lineColor; // outline is black
  
  context.beginPath();                  // draw the bar
  context.moveTo( this.xC, -this.yC);   // start at left side of bar
  context.lineTo(  this.p, -this.yC);   // move to right end, top
  context.lineTo(  this.p,  this.yC);   // move to right end, botton
  context.lineTo( this.xC,  this.yC);   // move back to left side
  context.arc( 0, 0,  this.d/2,  this.alpha, 2*Math.PI - this.alpha);  // draw knob at left end
  context.closePath();
  context.fill();
  context.stroke();

  this.pin.draw(context);               // draw the pin at the knob end
  context.restore();                    // restore the original coordinate system
};

// ********************************************************************************
// Function Rocker draws the rocker in the inverted slider-crank, a T-shaped link
// ********************************************************************************
function Rocker (L, gamma, geom, lineColor, fillColor) {
  this.x = 0;                      // x-coordinate of pin
  this.y = 0;                      // y-coordinate of pin
  this.theta = 0;                  // rotation angle of rocker
  this.w = geom.barWidth;          // width of bar on rocker
  this.d = geom.barDiam;           // diameter of knob on rocker
  this.W = geom.rockerWidth;       // width of head of rocker
  this.L = L;                      // length of rocker (from pin to center of slot)
  this.gamma = gamma;              // angle of slot with rocker
  this.lineColor = lineColor;      // line color
  this.fillColor = fillColor;      // fill color
  this.pin = new Pin(0, 0, geom);  // create the pin

  this.alpha = Math.asin(this.w/this.d);      // angle of sweep of knob
  this.xC = this.d/2 * Math.cos(this.alpha); // x coordinate where knob meets bar
  this.yC = this.w/2;                        // y coordinate where knob meets bar

  this.cG  = Math.cos(gamma);  // these are calculated to save time during plotting
  this.sG  = Math.sin(gamma);
}

Rocker.prototype.draw = function(context) {
  var w2 = this.w/2;   // half width of rocker rod
  var W2 = this.W/2;   // half width of slider
  
  context.save();
  context.translate(this.x,this.y);    // move to center of pin
  context.rotate(-this.theta);         // rotate the local coordinate system
  context.lineWidth = 2;               // line width
  context.fillStyle = this.fillColor;  // fill color
  context.strokeStyle = this.lineColor;// line color
  
  context.beginPath();                  // draw the rocker
  context.moveTo(this.xC, -this.yC);
  context.lineTo(this.L - (this.yC*(1+this.cG)+w2)/this.sG, -this.yC);
  context.lineTo(this.L - this.yC/this.sG - W2*this.cG - w2*this.sG, -W2*this.sG+w2*this.cG);
  context.lineTo(this.L - this.yC/this.sG - W2*this.cG, -W2*this.sG);
  context.lineTo(this.L - this.yC/this.sG + W2*this.cG,  W2*this.sG);
  context.lineTo(this.L - this.yC/this.sG + W2*this.cG - w2*this.sG,  W2*this.sG+w2*this.cG);
  context.lineTo(this.L - (this.yC*(1-this.cG)+w2)/this.sG,  this.yC);
  context.lineTo(this.xC,  this.yC);
  context.arc( 0, 0,  this.d/2,  this.alpha, 2*Math.PI - this.alpha);
  context.closePath();
  context.fill();
  context.stroke();

  this.pin.draw(context);  // draw the pin in the lower end

  context.restore();       // restore the original coordinate system
};

// ********************************************************************************
// Function Piston draws a rectangular slider with a pin
// ********************************************************************************
function Piston (geom, lineColor, fillColor) {
  this.x = 0;                      // x coordinate of piston
  this.y = 0;                      // y coordinate of piston
  this.w = geom.pistonWidth;       // width of piston
  this.h = geom.pistonHeight;      // height of piston
  this.lineColor = lineColor;      // line color of piston
  this.fillColor = fillColor;      // fill color of piston
  this.pin = new Pin(0, 0, geom);  // create the pin
}

Piston.prototype.draw = function(context) {
  context.save();
  context.translate(this.x,this.y);     // move to center of pin
  context.lineWidth = 2;                // line width
  context.fillStyle = this.fillColor;   // fill color
  context.strokeStyle = this.lineColor; // line color
  
  context.beginPath();                  // draw the piston, a rectangle
  context.rect(-0.5*this.w,-this.h/2,this.w,this.h);
  context.closePath();
  context.fill();
  context.stroke();
  this.pin.draw(context);            // draw the pin

  context.restore();                 // restore the original coordinate system
}
// ********************************************************************************
// Function Pivot draws a grounded pivot with a pin
// ********************************************************************************
function Pivot (x, y, geom) {
  this.x = x;                      // x coordinate of center of pivot pin
  this.y = y;                      // y coordinate of center of pivot pin
  this.w = geom.pivotWidth;        // width of pivot
  this.h = geom.pivotHeight;       // height of pivot
  this.r = geom.pivotRadius;       // radius of top of pivot
  this.lineColor = geom.pivotLineColor;  // line color for pivot
  this.fillColor = geom.pivotFillColor;    // fill color of pivot
  this.pin = new Pin(0, 0, geom);  // create the pin

  this.w2 = this.w/2;                                 // half width of pivot
  var W = Math.sqrt(this.w2*this.w2 + this.h*this.h); // hypotenuse of triangle formed by w2 and H
  this.gamma = Math.PI - Math.acos(this.r/W) - Math.asin(this.w2/W);
  this.rCG = this.r*Math.cos(this.gamma);             // these are here to save time in the drawing routine
  this.rSG = this.r*Math.sin(this.gamma);
}

Pivot.prototype.draw = function(context) {
  context.save();
  context.translate(this.x,-this.y);     // move to center of pin
  context.lineWidth = 2;                // line width
  context.fillStyle = this.fillColor;       // fill color
  context.strokeStyle = this.lineColor;      // outline is black
  
  context.beginPath();                    // draw the pivot
  context.moveTo(-this.w2, this.h);       // start at lower left corner of pivot
  context.lineTo( -this.rSG, -this.rCG);  // go to upper left (tangent point with arc)
  context.arc(0, 0, this.r, -Math.PI/2 - this.gamma, -Math.PI/2 + this.gamma,false);
  context.lineTo( this.w2, this.h);       // go back down to lower right
  context.closePath();
  context.fill();
  context.stroke();

  this.pin.draw(context);            // draw the pin
  context.restore();                 // restore the original coordinate system
};

// ********************************************************************************
// Function Ground_Slider draws a ground rectangle
// ********************************************************************************
function Ground_Slider(x, y, w, geom) {
  this.x = x;                    // x coordinate of top center of slider
  this.y = y;                    // y coordinate of top center of slider
  this.w = w;                    // width of slider
  this.h = geom.groundHeight;    // height of slider
  this.fillColor = geom.groundFillColor; // fill color of ground rectangle
  this.lineColor = geom.groundLineColor; // line color of top of ground rectangle
}

Ground_Slider.prototype.draw = function(context) {
  context.save();

  context.translate(this.x, -this.y);   // move to center of rectangle
  context.lineWidth = 2;                // line width
  context.fillStyle = this.fillColor;       // fill color
  context.strokeStyle = this.lineColor;      // outline is black

  context.beginPath();
  context.rect(-this.w/2, 0, this.w, this.h);    // draw the rectangle for the slider
  context.fill();
  context.closePath();
  
  context.beginPath();                           // draw the line at the top of the rectangle
  context.moveTo(-this.w/2, 0);
  context.lineTo( this.w/2, 0);
  context.closePath();
  context.stroke();

  context.restore();
}

// ********************************************************************************
// Function Motor draws a grounded motor with pin.  The motor is a circle and a quadrilateral
// ********************************************************************************
function Motor (x, y, geom, lineColor, fillColor) {
  this.x = x;                      // x coordinate of center of motor circle
  this.y = y;                      // y coordinate of center of motor circle
  this.w1 = geom.motorWidth1;      // upper width of base of motor
  this.w2 = geom.motorWidth2;      // lower width of base of motor
  this.h = geom.motorHeight;       // height of base of motor
  this.r = geom.motorRadius;       // radius motor circle
  this.lineColor = lineColor;      // line color of motor
  this.fillColor = fillColor;      // fill color of motor  
  this.pin = new Pin(0, 0, geom);  // create the pin at center of motor circle
}

Motor.prototype.draw = function(context) {
  context.save();
  context.translate(this.x,this.y);     // move to center of pin
  context.lineWidth = 2;                // line width
  context.fillStyle = this.fillColor;   // fill color
  context.strokeStyle = this.lineColor; // outline is black

  context.beginPath();                  // draw the quadrilateral
  context.moveTo(-this.w2/2, this.h);
  context.lineTo(-this.w1/2,      0);
  context.lineTo( this.w1/2,      0);
  context.lineTo( this.w2/2, this.h);
  context.closePath();
  context.fill();
  context.stroke();

  context.beginPath();
  context.arc(0, 0, this.r, 0, 2*Math.PI,false);
  context.closePath();
  context.fill();
  context.stroke();

  this.pin.draw(context);            // draw the pin
  context.restore();                 // restore the original coordinate system
};