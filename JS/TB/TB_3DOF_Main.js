"use strict"
window.onload = init;

/**********************************************************************************************************************/
/* function init()
/* initializes javascript on html page
/**********************************************************************************************************************/
function init() {
  
// *****  these are the default values for the initial trebuchet  *****
  var m1 = 10;                // mass of counterweight (kg)
  var m2 = 0.1;               // mass of projectile (kg)
  var L1 = 0.2;               // length from pivot to short end of arm (m)
  var L2 = 0.6;               // length from pivot to long end of arm (m)
  var L3 = 0.5;               // sling length (m)
  var L4 = 0.4;               // counterweight length (m)
  var w  = 0.1;               // height of arm (m)
  var t  = 0.01;              // thickness of arm (m)
  var h0  = 0.4;              // height of pivot (m)
  var rho = 600;              // density of arm (kg/m^3)
  var beta = -45*Math.PI/180; // launch hook angle (rad)
// ********************************************************************

  window.treb = new Treb(L1,L2,L3,L4,h0,t,w,rho,m1,m2,beta);  // create trebuchet          
  window.iLaunched = false;  // tells whether projectile has been launched
  window.iRamp = true;       // tells whether projectile is on ramp
  treb.update();             // get the trebuchet ready to be drawn
  treb.mass();               // calculate the mass properties of the trebuchet
  solve_treb(0);             // draw trebuchet in its initial configuration (with default values)
  
  defineNumberBoxes();                        // define min and max values for input fields
  display_form();                             // put values into web form
  plot_grid(grid_can,grid_ctx,80,20,100,70);  // draw grid on trajectory canvas
}

/**********************************************************************************************************************/
/* function solve_treb - solve equations of motion and draw trebuchet shapes on canvas
/**********************************************************************************************************************/
function solve_treb(i) {
  var t = i * treb.deltaT;      // current time step

  var L1 = treb.arm.L1;      // length from pivot to counterweight
  var L2 = treb.arm.L2;      // length from pivot to hook
  var L3 = treb.sling.L;     // length of sling
  var L4 = treb.hanger.L;    // length of counterweight hanger
  var m1 = treb.cwt.mass;    // mass of counterweight
  var m2 = treb.proj.mass;   // mass of projectile
  var I = treb.I;  // combined "moment of inertia" of arm, projectile and counterweight
  var m = treb.m;  // combined "mass" of arm, projectile and counterweight
  var I14 = treb.I14;        // cross-term in inertia matrix
  var I23 = treb.I23;        // cross-term in inertia matrix
  var I3 = treb.I3;          // diagonal term in inertia matrix
  var I4 = treb.I4;          // diagonal term in inertia matrix 
  
  if (t > 0) {   // solve equations of motion
    var theta = treb.arm.theta;
    var psi   = treb.sling.psi;
    var phi   = treb.hanger.psi;
    var p2 = treb.hanger.psidot * treb.hanger.psidot;  // phidot squared
    var q2 = treb.arm.thetadot * treb.arm.thetadot;    // thetadot squared
    var s2 = treb.sling.psidot * treb.sling.psidot;    // psidot squared
    
    var qp = theta - phi;  // theta - phi
    var qs = theta - psi;  // theta - psi

    if (iRamp == true) { // projectile is on ramp
      var A = [];
      var b = new Array();

      A[0] = [      I, I14*Math.cos(qp), -I23*Math.cos(qs), -L2*Math.cos(theta)];
      A[1] = [A[0][1],               I4,                 0,                   0];
      A[2] = [A[0][2],          A[1][2],                I3,    L3*Math.cos(psi)];
      A[3] = [A[0][3],          A[1][3],           A[2][3],                   0];
        
      b[0] = -I14*p2*Math.sin(qp) + I23*s2*Math.sin(qs) - m*treb.g*Math.cos(theta);
      b[1] =  I14*q2*Math.sin(qp) - m1*treb.g*L4*Math.cos(phi);
      b[2] = -I23*q2*Math.sin(qs) - m2*treb.g*L3*Math.cos(psi);
      b[3] = -L2*q2*Math.sin(theta) + L3*s2*Math.sin(psi);
      
      var LU = LU_Decomp(A,4);
      b = LU_Backsub(LU.A,4,LU.indx,b); 

      if (b[3] > 0) {
        iRamp = false;
      }
    } else { // projectile has left ramp
      var A = [];
      var b = new Array();
      
      A[0] = [      I, I14*Math.cos(qp), -I23*Math.cos(qs)];
      A[1] = [A[0][1],               I4,                 0];
      A[2] = [A[0][2],          A[1][2],                I3];
        
      b[0] = -I14*p2*Math.sin(qp) + I23*s2*Math.sin(qs) - m*treb.g*Math.cos(theta);
      b[1] =  I14*q2*Math.sin(qp) - m1*treb.g*L4*Math.cos(phi);
      b[2] = -I23*q2*Math.sin(qs) - m2*treb.g*L3*Math.cos(psi);
    
      var LU = LU_Decomp(A,3);
      b = LU_Backsub(LU.A,3,LU.indx,b);     
    }
    
    treb.arm.thetadot  += b[0] * treb.deltaT;
    treb.hanger.psidot += b[1] * treb.deltaT;
    treb.sling.psidot  += b[2] * treb.deltaT;

    treb.arm.theta  += treb.arm.thetadot * treb.deltaT;
    treb.hanger.psi += treb.hanger.psidot * treb.deltaT;
    treb.sling.psi  += treb.sling.psidot * treb.deltaT;
  }
  
// now draw stuff  
  treb_ctx2.clearRect(0,0,treb_can2.width,treb_can2.height);
  treb_ctx4.clearRect(0,0,treb_can4.width,treb_can4.height);  
  treb.draw();
  if ((-treb.sling.psi - Math.PI + treb.arm.theta) >= treb.arm.beta) iLaunched=true;
}

