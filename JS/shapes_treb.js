// shapes_treb.js
// creates shapes for trebuchets

function Ball (mass,color) {
  this.x = 0;
  this.y = 0;
  this.radius = 10;
  this.mass = mass;
  this.color = color;
}

Ball.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);
  context.lineWidth = 2;
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";

  context.beginPath();
  context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
};

function Arm (L1,L2,w,t,rho,color) {
  this.x = 0;
  this.y = 0;
  this.theta = 0;
  this.omega = 0;
  this.scale = 1;
  
  this.L1 = L1;   // length from pivot to short end of arm (m)
  this.L2 = L2;   // length from pivot to long end of arm (m)
  this.w = w;     // height of arm (m)
  this.t = t;     // thickness of arm (m)
  this.rho = rho; // density of arm (kg/m^3)
  this.color = color;

  this.Lb = (this.L2 - this.L1)/2;                       // distance to CM of beam
  this.mb = (this.L1 + this.L2)*this.w*this.t*this.rho;  // mass of beam (kg)
  this.Ib = (this.mb/12)*(this.L1+this.L2)^2;            // moment of inertia of beam (kg-m2)
  this.beta = 45*Math.PI/180;                            // hook angle
}

Arm.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(-this.theta);
  context.lineWidth = 2;
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";

  var L1 = this.scale*this.L1;
  var L2 = this.scale*this.L2;
  var w  = this.scale*this.w;
        
  context.beginPath();
  context.moveTo( L1 + 0.2*w, w/6);
  context.lineTo( L1 + 0.2*w,-w/6);
  context.lineTo( (L1 + L2)/6,-w);
  context.lineTo(-(L1 + L2)/6,-w);
  context.lineTo(-L2 - 0.2*w,-w/6);
  context.lineTo(-L2 - 0.2*w, w/6);
  context.lineTo(-(L1 + L2)/6, w);
  context.lineTo( (L1 + L2)/6, w);
  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
};
