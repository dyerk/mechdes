/**********************************************************************************************************************/
/* function init_treb - initializes shapes for 1DOF trebuchet
/**********************************************************************************************************************/
function init_treb(canvas,context) {
  var m1 = 100;       // mass of counterweight (kg)
  var m2 = 0.1;       // mass of projectile (kg)
  var L1 = 0.2;       // length from pivot to short end of arm (m)
  var L2 = 0.6;       // length from pivot to long end of arm (m)
  var L3 = 0.5;       // length of sling (m)
  var w  = 0.1;       // height of arm (m)
  var t  = 0.01;      // thickness of arm (m)
  var H  = 0.0254*16; // height of pivot (m)
  var rho = 500;      // density of arm (kg/m^3)
  var beta = -25*Math.PI/180; // launch hook angle (rad)
  
  var theta0 = Math.asin(H/L2);  // launch angle
  var deltaT = 0.001;   // time step (s)
  var g = 9.81;        // accel of gravity (m/s^2)

  var proj  = new Ball(m2,"#E93A90");
  var arm   = new Arm(L1,L2,w,t,rho,"#AFF53D");
  var sling = new Sling(L3,"#111111");
  var cwt   = new Ball(m1,"#DDDDDD");
  var base  = new Base(H,"#9CA400");
  
// set up scaling for canvas  
  var scale = 0.9*canvas.height/(H + L2 + L3);
  arm.scale = scale;
  base.scale = scale;
  sling.scale = scale;
  var x0 = canvas.width/2;
  var y0 = canvas.height - 10 - scale*H;

  proj.radius = canvas.height/70;
  cwt.radius  = canvas.height/40;

  arm.theta    = theta0;
  arm.thetadot = 0;
  sling.psi    = 0;
  sling.psidot = 0;
  
  arm.x  = x0;
  arm.y  = y0;
  arm.beta = beta;
  
  base.x = arm.x;
  base.y = arm.y;

  return {
    proj: proj,
    arm: arm,
    sling: sling,
    cwt: cwt,
    base: base,
    deltaT: deltaT,
    theta0: theta0,
    g: g,
    x0: x0,
    y0: y0
  }
}
/**********************************************************************************************************************/
/* function update_treb - updates mass properties of trebuchet
/**********************************************************************************************************************/
function treb_mass_props() {
  var L1 = S.arm.L1;
  var L2 = S.arm.L2;
  var w  = S.arm.w;
  var L3 = S.sling.L3;
  var rhoT = S.arm.rho * S.arm.t;
  
// calculate the inertial properties of the trapezoidal throwing arm
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
  
  var mb = 2*M1 + 2*M3 + M5 + M6 + M7 + M8;  // mass of arm
  var Lb = (2*M1*x1 + 2*M3*x3 + M5*x5 + M6*x6 + M7*x7 + M8*x8)/mb;  // center of mass of arm (distance from pivot)

  var I1 = (M1/6)*(h1*h1 + b1*b1 + 4*b1*b2 + 6*b2*b2 + 2*h1*h2 + 1.5*h2*h2);  // forward triangle
  var I3 = (M3/6)*(h3*h3 + b4*b4 + 4*b3*b4 + 6*b3*b3 + 2*h3*h4 + 1.5*h4*h4);  // rearward triangle
  var I5 = (M5/12)*(h2*h2 + 4*b1*b1 + 12*b2*b2 + 12*b1*b2);  // forward rectangle under triangle
  var I6 = (M6/12)*(h4*h4 + 4*b4*b4 + 12*b3*b3 + 12*b3*b4);  // rearward rectangle under triangle
  var I7 = (M7/12)*(4*b2*b2 + w*w);  // rectangle forward of pivot
  var I8 = (M8/12)*(4*b3*b3 + w*w);  // rectangle rearward of pivot
  
  var Ipivot = 2*I1 + 2*I3 + I5 + I6 + I7 + I8;  // moment of inertia of arm about pivot
  var Ib = Ipivot - mb * Lb * Lb;

  var mb1 = 2*M1 + M5 + M7;
  var Lb2 = (2*M1*x1 + M5*x5 + M7*x7)/mb1;
  var Ib1 = 2*I1 + I5 + I7 - mb1 * Lb2 * Lb2;

  var m1 = S.cwt.mass;
  var m2 = S.proj.mass;

  S.arm.Lb = Lb;
  S.arm.Ib = Ib;
  S.arm.mb = mb;
  S.arm.Iprime = m1*L1*L1 + m2*L2*L2 + mb*Lb*Lb + Ib;
  S.arm.Mprime = (m1*L1 - m2*L2 - mb*Lb)*S.g;
  S.arm.I2 = m2*L2*L3;
  S.arm.I3 = m2*L3*L3;
  S.arm.mb1 = mb1;
  S.arm.Lb2 = Lb2;
  S.arm.Ib1 = Ib1;
}
