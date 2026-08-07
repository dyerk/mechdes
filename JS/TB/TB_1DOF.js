// JavaScript Document
// Animate Planetary Gearset
window.onload = init;

// playing indicates whether an animation is currently playing, firstTime tells whether it is the first time a
// button has been clicked.

var playing = false, firstTime = true;

/**********************************************************************************************************************/
/* function init()
/* initializes javascript on html page
/**********************************************************************************************************************/
function init() {
// Initialize buttons on canvas
  var launchButton = document.getElementById("launch");
  var resetButton  = document.getElementById("reset");
  var metersButton    = document.getElementById("meters");
  var inchesButton    = document.getElementById("inches");
  var kilogramsButton = document.getElementById("kilograms");
  var poundsButton    = document.getElementById("pounds");

// Create shorthand variables for canvas and context
  var canvas1 = document.getElementById('canvas1');
  var context1 = canvas1.getContext('2d');

// text fonts for animations
  context1.font = "1em Source Sans Pro";
  context1.textAlign = "right";;
    
// Enable play buttons
  launchButton.disabled = false;
  resetButton.disabled  = true;
  
// Create shapes for each animation
  S = init_treb(canvas1,context1);
  
// Draw static shapes on canvas
  draw_treb(0);
  display_form();

// Button handling functions
  launchButton.onclick = handle_treb();
  resetButton.onclick  = handle_reset();

}
/**********************************************************************************************************************/
/* function init_treb - initializes shapes for 1DOF trebuchet
/**********************************************************************************************************************/
function init_treb(canvas,context) {
  var m1 = 10;         // mass of counterweight (kg)
  var m2 = 0.1;        // mass of projectile (kg)
  var L1 = 0.0254*6.5; // length from pivot to short end of arm (m)
  var L2 = 0.0254*24;  // length from pivot to long end of arm (m)
  var w  = 0.0254*4;   // height of arm (m)
  var t  = 0.0254*0.5; // thickness of arm (m)
  var H  = L2 * Math.sin(Math.PI/4); // height of pivot (m)
  var rho = 600;       // density of arm (kg/m^3)
  var theta0 = 45*Math.PI/180;  // launch angle
  var deltaT = 0.01;   // time step (s)
  var g = 9.81;        // accel of gravity (m/s^2)

  var proj = new Ball(m2,"#E93A90");
  var arm  = new Arm(L1,L2,w,t,rho,"#AFF53D");
  var cwt  = new Ball(m1,"#DDDDDD");
  var base = new Base(H,"#9CA400")
  
  proj.radius = canvas.height/70;
  cwt.radius  = canvas.height/40;

  arm.theta  = theta0;
  arm.omega  = 0;
  arm.x  = canvas.width/2;
  arm.y  = canvas.height/2;
  base.x = arm.x;
  base.y = arm.y;

  return {
    proj: proj,
    arm: arm,
    cwt: cwt,
    base: base,
    deltaT: deltaT,
    theta0: theta0,
    g: g,
    canvas: canvas,
    context: context
  }
}
/**********************************************************************************************************************/
/* function draw_treb - draw trebuchet shapes on canvas
/**********************************************************************************************************************/
function draw_treb(t) {

  S.context.clearRect(0,0,S.canvas.width,S.canvas.height);

  var x0 = S.canvas.width/2;
  var y0 = S.canvas.height/2;
  S.arm.scale = 0.5*S.canvas.height/(S.arm.L1 + S.arm.L2);
  S.base.scale = S.arm.scale;

  var L1 = S.arm.scale*S.arm.L1;
  var L2 = S.arm.scale*S.arm.L2;

  var Iprime = S.cwt.mass*S.arm.L1^2 + S.proj.mass*S.arm.L2^2 + S.arm.Ib + S.arm.mb*S.arm.Lb^2;
  var Mprime = S.g * (S.cwt.mass*S.arm.L1 - S.proj.mass*S.arm.L2 - S.arm.mb*S.arm.Lb);
  
  var dOmega = (-Mprime/Iprime)*Math.cos(S.arm.theta);
  S.arm.omega += dOmega * S.deltaT;
  S.arm.theta += S.arm.omega * S.deltaT;

  S.proj.x = x0 - L2*Math.cos(-S.arm.theta);
  S.proj.y = y0 - L2*Math.sin(-S.arm.theta);
  S.cwt.x  = x0 + L1*Math.cos(-S.arm.theta);
  S.cwt.y  = y0 + L1*Math.sin(-S.arm.theta);
  
  S.arm.draw(S.context);
  S.proj.draw(S.context);
  S.cwt.draw(S.context);
  S.base.draw(S.context);
}
/**********************************************************************************************************************/
/* function handle_treb - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_treb() {
  return function () {
    var t = 0;
    
    function drawFrame () {
      t += S.deltaT;
      draw_treb(t);
      
      if (S.arm.theta <= -S.arm.beta) {
        clearInterval(handle);
        document.getElementById("launch").disabled = true;
        document.getElementById("reset").disabled = false;
        results_treb();
      }
    }
    var handle = setInterval(drawFrame, S.deltaT);
  }
}
/**********************************************************************************************************************/
/* function handle_reset - returns trebuchet to original position
/**********************************************************************************************************************/
function handle_reset() {
  return function () {
    reset_treb();
  }
}
/**********************************************************************************************************************/
/* function reset_treb - returns trebuchet to original position
/**********************************************************************************************************************/
function reset_treb() {
  S.arm.theta = S.theta0;
  S.arm.omega = 0;
  draw_treb(0);
  document.getElementById("launch").disabled = false;
  document.getElementById("reset").disabled = true;
}
/**********************************************************************************************************************/
/* function results_treb - calculates range and efficiency of trebuchet
/**********************************************************************************************************************/
function results_treb() {
  var thetadotf = S.arm.omega;   // final angular velocity of arm
  var thetaf    = S.arm.theta;   // launch angle of arm

  var vx =  S.arm.L2 * thetadotf*Math.sin(thetaf); // velocity of projectile at launch
  var vy = -S.arm.L2 * thetadotf*Math.cos(thetaf);
  S.proj.vx = vx;
  S.proj.vy = vy;
  S.proj.yMax = (vy*vy)/(2*S.g);
    
  var vf    = Math.sqrt(vx*vx + vy*vy);  // magnitude of launch velocity
  var alpha = Math.atan2(vy,vx);         // launch angle
  S.proj.xMax = 2*vf*vf * Math.sin(alpha) * Math.cos(alpha) / S.g;  // distance traveled by projectile

  var effE = S.proj.mass * vf*vf/(2*S.cwt.mass*S.g*S.arm.L1*(1+Math.sin(S.theta0)));  // energy efficiency of trebuchet
  var effR = 2*effE * Math.sin(alpha) * Math.cos(alpha);
  console.log(vf);

  anim_proj();
}
/**********************************************************************************************************************/
/* function anim_proj - animates the projectile after launch
/**********************************************************************************************************************/
function anim_proj() {
  var t = 0;
  var proj_canvas = document.getElementById('proj_canvas')
  var proj_context = proj_canvas.getContext('2d');

  var scale = Math.min(proj_canvas.width/S.proj.xMax,proj_canvas.height/S.proj.yMax);
  var x0 = 10;
  var y0 = proj_canvas.height - 10;
  
  S.proj.x = x0;
  S.proj.y = y0;
  function drawFrame () {
    proj_context.clearRect(0,0,proj_canvas.width,proj_canvas.height);
    t += S.deltaT/10;
    S.proj.y = ((1/2)*S.g*t*t - S.proj.vy*t)*scale + y0;
    S.proj.x = (S.proj.vx*t)*scale;
    plot_grid(proj_canvas,proj_context); 
    S.proj.draw(proj_context);
    proj_context.fillText(S.proj.xMax,200,50);
    if (S.proj.y > y0) {
      clearInterval(handle);
    }
  }
  var handle = setInterval(drawFrame, S.deltaT*1000);
}







