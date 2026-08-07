// shapes_treb.js
// creates shapes for trebuchets

function Ball (mass,color) {
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.xMax = 0;
  this.yMax = 0;
  this.tMax = 0;
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
  this.thetadot = 0;
  this.scale = 1;
  
  this.L1 = L1;   // length from pivot to short end of arm (m)
  this.L2 = L2;   // length from pivot to long end of arm (m)
  this.w = w;     // height of arm (m)
  this.t = t;     // thickness of arm (m)
  this.rho = rho; // density of arm (kg/m^3)
  this.color = color;


  this.Lb = 0;      // distance to CM of beam
  this.mb = 0;      // mass of beam (kg)
  this.Ib = 0;      // moment of inertia of beam (kg-m2)
  this.Mprime = 0;  // combined mass of beam, projectile and counterweight
  this.Iprime = 0;  // combined moment of inertia of beam, projectile and counterweight
  this.I2 = 0;      // moment of inertia with arm and sling lengths
  this.I3 = 0;      // moment of inertia with sling length
  this.mb1 = 0;     // mass of arm forward of pivot
  this.Lb2 = 0;     // location of CM of arm forward of pivot
  this.Ib1 = 0;     // moment of inertia of arm forward of pivot
  this.beta = 45*Math.PI/180; // hook angle
  this.sigma = new Array();
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
  context.lineTo( 0.2*L1,-w);
  context.lineTo(-0.2*L2,-w);
  context.lineTo(-L2 - 0.2*w,-w/6);
  context.lineTo(-L2 - 0.2*w, w/6);
  context.lineTo(-0.2*L2, w);
  context.lineTo( 0.2*L1, w);
  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
};

function Base (H,color) {
  this.x = 0;
  this.y = 0;
  this.H = H;
  this.scale = 1;
  this.color = color;
}

Base.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);
  context.lineWidth = 2;
  context.fillStyle = this.color;
  context.strokeStyle = "#000000";
  
  var H = this.H * this.scale;
  var W1 = 0.15 * this.H * this.scale;
  var W2 = 0.3 * this.H * this.scale;
  
  context.beginPath();
  context.moveTo( W1/2,-0.1*H);
  context.lineTo(-W1/2,-0.1*H);
  context.lineTo(-W2/2, H);
  context.lineTo( W2/2, H);
  context.closePath();
  context.fill();
  context.stroke();
  
  context.fillStyle = "#000000";
  context.beginPath();
  context.arc(0, 0, 5, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
}

function Sling (L3,color) {
  this.x = 0;
  this.y = 0;
  this.psi = 0;
  this.psidot = 0;
  this.scale = 1;

  this.L3 = L3;
  this.color = color;
}

Sling.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(-this.psi);
  context.strokeStyle = this.color;

  var L3 = this.L3 * this.scale; 
  context.lineWidth = 2;
  context.moveTo(0,0);
  context.lineTo(L3,0);
  context.stroke();
  context.restore();
}
