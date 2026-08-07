// shapes.js
// Gear shape (a circle with a line)
function Gear (radius, color, alpha) {
  if (radius === undefined) {radius = 40;}
  if (color  === undefined) {color = "#ff0000";}
  if (alpha === undefined) {alpha = 1.0;}
  this.x = 0;
  this.y = 0;
  this.radius = radius;
  this.rotation = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  this.color = color;
  this.alpha = alpha;
  this.lineWidth = 2;
}

Gear.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);
  context.scale(this.scaleX, this.scaleY);
  context.lineWidth = this.lineWidth;
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";

  context.globalAlpha = this.alpha;
  context.beginPath();
  // x, y, radius, start_angle, end_angle, anticlockwise
  context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
  context.globalAlpha = 1.0;
  if (this.lineWidth > 0) {context.stroke(); }

  context.beginPath();
  context.moveTo(0,0);
  context.lineTo(this.radius,0);
  context.stroke();
  context.restore();
};

Gear.prototype.getBounds = function() {
  return {
    x: this.x - this.radius,
    y: this.y - this.radius,
    width: this.radius * 2,
    height: this.radius * 2
  };
};

function Ring (innerRadius, outerRadius, color) {
  if (color  === undefined) {color = "#616161";}
  this.x = 0;
  this.y = 0;
  this.innerRadius = innerRadius;
  this.outerRadius = outerRadius;
  this.rotation = 0;
  this.color = color;
  this.lineWidth = 2;
}

Ring.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);
  context.lineWidth = this.lineWidth;
  context.fillStyle = this.color;

// Draw filled-in annulus
  context.strokeStyle = this.color;
  for (var i = this.innerRadius + 1; i < this.outerRadius - 1; i++ ) {
    context.beginPath();
    context.arc(0, 0, i, 0, Math.PI * 2, true);
    context.closePath();
    context.stroke();
  }

// Draw inner circle
  context.strokeStyle = "#000000"
  context.beginPath();
  context.arc(0, 0, this.innerRadius, 0, Math.PI * 2, true);
  context.closePath();
  context.stroke();

// Draw outer circle
  context.beginPath();
  context.arc(0, 0, this.outerRadius, 0, Math.PI * 2, true);
  context.closePath();
  context.stroke();

// Draw line that marks rotation of ring
  context.beginPath();
  context.moveTo(this.innerRadius,0);
  context.lineTo(this.outerRadius,0);
  context.stroke();
  context.restore();
};

function Segment (width, height, color) {
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
  this.vx = 0;
  this.vy = 0;
  this.rotation = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  this.color = color;
  this.lineWidth = 1;
}

Segment.prototype.draw = function (context) {
  var h  = this.height;
  var d  = this.width + h;  // top-right diagonal
  var cr = h/2;             // corner radius

  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);
  context.scale(this.scaleX, this.scaleY);
  context.lineWidth = this.lineWidth;
  context.fillStyle = this.color;
  context.strokeStyle = "#000000"

  context.globalAlpha = 0.75;
  context.beginPath();
  context.moveTo(0, -cr);  // top center
  context.lineTo(d - 2*cr, -cr);  // top horizontal line
  context.quadraticCurveTo(-cr+d, -cr, -cr+d, 0);  // top right corner
  context.lineTo(-cr+d, h-2*cr); // right vertical line
  context.quadraticCurveTo(-cr+d, -cr+h, d-2*cr, -cr+h);  // bottom right corner
  context.lineTo(0, -cr+h); // bottom horizontal line
  context.quadraticCurveTo(-cr, -cr+h, -cr, h-2*cr); // bottom left corner
  context.lineTo(-cr, 0);  // left vertical line
  context.quadraticCurveTo(-cr, -cr, 0, -cr);
  context.closePath();
  context.fill();
  context.stroke();
  // draw the two pins
  context.beginPath();
  context.arc(0,0,2,0, Math.PI*2, true);
  context.closePath();
  context.stroke();
  context.beginPath();
  context.arc(this.width, 0, 2, 0, Math.PI*2, true);
  context.closePath();
  context.stroke();
  context.restore();
  context.globalAlpha = 1.0;
}
function Segment2 (width, height, midpin, color) {
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
  this.midpin = midpin;
  this.rotation = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  this.color = color;
  this.lineWidth = 1;
}

Segment2.prototype.draw = function (context) {
  var h  = this.height;
  var d  = this.width + h;  // top-right diagonal
  var cr = h/2;             // corner radius

  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);
  context.scale(this.scaleX, this.scaleY);
  context.lineWidth = this.lineWidth;
  context.fillStyle = this.color;

  context.globalAlpha = 0.75;     // draw outline of segment
  context.beginPath();
  context.moveTo(0, -cr);         // top center
  context.lineTo(d - 2*cr, -cr);  // top horizontal line
  context.quadraticCurveTo(-cr+d, -cr, -cr+d, 0);         // top right corner
  context.lineTo(-cr+d, h-2*cr);  // right vertical line
  context.quadraticCurveTo(-cr+d, -cr+h, d-2*cr, -cr+h);  // bottom right corner
  context.lineTo(0, -cr+h);       // bottom horizontal line
  context.quadraticCurveTo(-cr, -cr+h, -cr, h-2*cr);      // bottom left corner
  context.lineTo(-cr, 0);         // left vertical line
  context.quadraticCurveTo(-cr, -cr, 0, -cr);             // top left corner
  context.closePath();
  context.fill();
  context.stroke();

  // draw the three pins
  context.beginPath();
  context.arc(0,0,2,0, Math.PI*2, true);
  context.closePath();
  context.stroke();

  context.beginPath();
  context.arc(this.midpin, 0, 2, 0, Math.PI*2, true);
  context.closePath();
  context.stroke();

  context.beginPath();
  context.arc(this.width, 0, 2, 0, Math.PI*2, true);
  context.closePath();
  context.stroke();

  context.restore();
  context.globalAlpha = 1.0;
}
/**********************************************************************************************************************/
/* function cam
/* creates cam object
/**********************************************************************************************************************/
function cam(radius,amp,color) {
  this.x = 0;
  this.y = 0;
  this.rotation = 0;
  this.radius = radius;
  this.amp = amp;
  this.angle = Math.PI/2;
  this.color = color;
  this.lineWidth = 2;
}
cam.prototype.draw = function(context) {
  var amp = this.amp;
  var radius = this.radius;
  var angle = this.angle;
  var M = Math.PI/angle;
  var i = 0;
  var theta = 0;
  var R = 0;

  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);
  context.lineWidth = this.lineWidth;
  context.fillStyle = this.color;

  context.beginPath();
  context.moveTo(this.radiusCalc(0),0);
  for (i = 1; i < 51; i++) {
    theta = (2*i/50)*Math.PI;
    R = this.radiusCalc(theta);
    context.lineTo(R*Math.cos(theta),R*Math.sin(theta));
  }
  context.closePath();
  context.fill();
  context.stroke();

  context.beginPath();
  context.moveTo(0,0);
  context.lineTo(radius+2*amp,0);
  context.stroke();
  context.restore();
}

cam.prototype.radiusCalc = function(theta) {
  var M = Math.PI / this.angle;
  theta = theta % (2 * Math.PI);
  if ((theta > (2*Math.PI - this.angle)) || (theta < this.angle)) {
    return this.radius + this.amp * (Math.cos(M*theta) + 1);
  } else {
    return this.radius
  };
}
/**********************************************************************************************************************/
/* function chain
/* creates chain object.  Both sprockets are the same size (I took the easy way out!)
/**********************************************************************************************************************/
function chain(radius,C,colorGear,colorChain) {
  this.x = 0;
  this.y = 0;
  this.rotation = 0;
  this.radius = radius;
  this.C      = C;
  this.colorGear = colorGear;
  this.colorChain = colorChain;
  this.lineWidth = 2;
  this.sprocket1 = new Gear(radius,colorGear,1);
  this.sprocket2 = new Gear(radius,colorGear,1);
  this.sprocket1.x =  0;
  this.sprocket1.y =  0;
  this.sprocket2.x =  0;
  this.sprocket2.y = -C;
}
chain.prototype.draw = function(context) {
  var R = this.sprocket1.radius;
  var PiR = Math.PI*R;
  var C = this.C;       // center distance
  var N = 20;           // number of links on chain
  var S = 0;            // current distance along chain
  var L  = 2*(PiR + C); // chain length
  var dx = L/N;         // spacing between links on chain  
  var X = 0, Y = 0;     // coordinates of an individual link
  var alpha = 0;        // angular location of link on a sprocket
  var gamma = dx/R;     // angular distance between links
  var theta = this.sprocket1.rotation % gamma;
  var S0    = theta*R;

  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);
  context.lineWidth = this.lineWidth;
  context.fillStyle = this.colorGear;

  this.sprocket1.draw(context);
  this.sprocket2.draw(context);
 
  context.fillStyle = this.colorChain;  
  for (var i = 0; i < N; i++) {
    S = (i)*dx - S0;  // current distance along chain
    if (S <= C) {   // right-hand vertical piece
      X =  R;
      Y = -S;
    } else if ((S > C) & (S <= (C + PiR))) {
      alpha = (S - C)/R;
      X =  R*Math.cos(alpha);
      Y = -R*Math.sin(alpha) - C;
    } else if ((S > (C + PiR)) & (S <=  2*C + PiR)) {
      X = -R;
      Y = -C + (S - (C + PiR));
    } else {
      alpha = (S - 2*C - PiR)/R;
      X = -R*Math.cos(alpha);
      Y =  R*Math.sin(alpha);
    }
    context.beginPath();
    context.arc(X,Y,4,0,2*Math.PI);
    context.fill();
  }
  context.restore();
}