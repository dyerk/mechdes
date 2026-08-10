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
  var L2 = 0.4;               // length from counterweight to hook on arm (m)
  var D  = 0.15;              // length from counterweight to moving pivot on arm (m)
  var w  = 0.04;              // height of arm (m)
  var t  = 0.01;              // thickness of arm (m)
  var L3 = 0.2;               // length of sling (m)
  var h0 = 0.4;               // starting height of counterweight and total height of base (m)
  var H  = 0.2;               // height of fixed pivot (m)
  var W  = 0.2;               // horiz distance from counterweight to fixed pivot (m)
  var rho = 600;              // density of arm (kg/m^3)
  var beta = -65*Math.PI/180; // launch hook angle (rad)
  var lambda = 10*Math.PI/180;// ramp angle (rad)
// ********************************************************************

  window.treb = new Treb(L2,L3,D,H,W,h0,t,w,rho,m1,m2,beta,lambda);  // create trebuchet          
  window.iLaunched = false;  // tells whether projectile has been launched
  window.iRamp = true;       // tells whether projectile is on ramp
  window.iPin = false        // tells whether moving pin is in fixed slot
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
  var t  = i * treb.deltaT;
  
  var L2 = treb.arm.L2;    // length from pivot to counterweight
  var L3 = treb.sling.L;  // sling length
  var D  = treb.arm.D;
  var W  = treb.base.W;
  var H  = treb.base.H;
  var lambda = treb.base.lambda;
  var m1 = treb.cwt.mass;    // mass of counterweight
  var m2 = treb.proj.mass;   // mass of projectile

  var I = treb.arm.Ib;  // combined moment of inertia of arm, projectile and counterweight
  var m = treb.m;  // first moment of arm, projectile and counterweight
  var M2b = treb.M2b;  // combined mass of arm, cart, counterweight and projectile
  
  if (t > 0) {   // solve equations of motion
    var theta = treb.arm.theta;
    var psi   = treb.sling.psi;
    var thetadot = treb.arm.thetadot;
    var psidot = treb.sling.psidot;
    var h    = treb.h;
    var hdot = treb.hdot;
    
    var q2 = treb.arm.thetadot * treb.arm.thetadot;  // thetadot squared
    var s2 = treb.sling.psidot * treb.sling.psidot;  // psidot squared
    var CQ = Math.cos(theta);
    var SQ = Math.sin(theta);
    var CS = Math.cos(psi);
    var SS = Math.sin(psi);
    var CL = Math.cos(lambda);
    var SL = Math.sin(lambda);

    if ((iPin == false) && (iRamp == true)) { // fixed pin is in moving slot and projectile is on ramp (config 1)

      var A = [];
      var b = new Array();

      A[0] = [     m1,      0,      0,      0,      0,      0,     1,            -CQ,  0];
      A[1] = [      0,     m2,      0,      0,      0,     -1,     0,              0, SL];
      A[2] = [      0,      0,     m2,      0,      0,      0,     -1,             0, CL];
      A[3] = [      0,      0,      0,      I,      0,  L2*SQ, -L2*CQ, W*CQ-(H-h)*SQ,  0];
      A[4] = [      0,      0,      0,      0,      0, -L3*SS,  L3*CS,             0,  0];
      A[5] = [A[0][5],A[1][5],A[2][5],A[3][5],A[4][5],      0,      0,             0,  0];
      A[6] = [A[0][6],A[1][6],A[2][6],A[3][6],A[4][6],      0,      0,             0,  0];
      A[7] = [A[0][7],A[1][7],A[2][7],A[3][7],A[4][7],      0,      0,             0,  0];
      A[8] = [A[0][8],A[1][8],A[2][8],A[3][8],A[4][8],      0,      0,             0,  0];
      
      b[0] = -m1*treb.g;
      b[1] = 0;
      b[2] = -m2*treb.g;
      b[3] = 0;
      b[4] = 0;
      b[5] = -L2*q2*CQ + L3*s2*CS;
      b[6] = -L2*q2*SQ + L3*s2*SS;
      b[7] = -2*hdot*thetadot*SQ + q2*(W*SQ + (H-h)*CQ);
      b[8] = 0;

      var LU = LU_Decomp(A,9);
      b = LU_Backsub(LU.A,9,LU.indx,b);

      treb.hdot          += b[0] * treb.deltaT;      
      treb.sling.xdot    += b[1] * treb.deltaT;
      treb.sling.ydot    += b[2] * treb.deltaT;
      treb.arm.thetadot  += b[3] * treb.deltaT;
      treb.sling.psidot  += b[4] * treb.deltaT;

      treb.h          += treb.hdot * treb.deltaT;
      treb.sling.x    += treb.sling.xdot * treb.deltaT;
      treb.sling.y    += treb.sling.ydot * treb.deltaT;
      treb.arm.theta  += treb.arm.thetadot * treb.deltaT;
      treb.sling.psi  += treb.sling.psidot * treb.deltaT;
      
      if (b[8] >= 0) iRamp = false;      
      constraint_treb(1);
      if ((treb.h-D*Math.sin(treb.arm.theta)) < treb.base.H) iPin = true;

    } else if ((iPin == true) && (iRamp == true)) { // moving pin is in fixed slot and projectile is on ramp (config 2)
      var A = [];
      var b = new Array();

      A[0] = [     m1,      0,      0,      0,      0,      0,     1,      1,  0];
      A[1] = [      0,     m2,      0,      0,      0,     -1,     0,      0, SL];
      A[2] = [      0,      0,     m2,      0,      0,      0,     -1,     0, CL];
      A[3] = [      0,      0,      0,      I,      0,  L2*SQ, -L2*CQ, -D*CQ,  0];
      A[4] = [      0,      0,      0,      0,      0, -L3*SS,  L3*CS,     0,  0];
      A[5] = [A[0][5],A[1][5],A[2][5],A[3][5],A[4][5],      0,      0,     0,  0];
      A[6] = [A[0][6],A[1][6],A[2][6],A[3][6],A[4][6],      0,      0,     0,  0];
      A[7] = [A[0][7],A[1][7],A[2][7],A[3][7],A[4][7],      0,      0,     0,  0];
      A[8] = [A[0][8],A[1][8],A[2][8],A[3][8],A[4][8],      0,      0,     0,  0];
      
      b[0] = -m1*treb.g;
      b[1] = 0;
      b[2] = -m2*treb.g;
      b[3] = 0;
      b[4] = 0;
      b[5] = -L2*q2*CQ + L3*s2*CS;
      b[6] = -L2*q2*SQ + L3*s2*SS;
      b[7] = -D*q2*SQ;
      b[8] = 0;

      var LU = LU_Decomp(A,9);
      b = LU_Backsub(LU.A,9,LU.indx,b);

      treb.hdot          += b[0] * treb.deltaT;      
      treb.sling.xdot    += b[1] * treb.deltaT;
      treb.sling.ydot    += b[2] * treb.deltaT;
      treb.arm.thetadot  += b[3] * treb.deltaT;
      treb.sling.psidot  += b[4] * treb.deltaT;

      treb.h          += treb.hdot * treb.deltaT;
      treb.sling.x    += treb.sling.xdot * treb.deltaT;
      treb.sling.y    += treb.sling.ydot * treb.deltaT;
      treb.arm.theta  += treb.arm.thetadot * treb.deltaT;
      treb.sling.psi  += treb.sling.psidot * treb.deltaT;

      if (b[8] >= 0) iRamp = false;
      
      constraint_treb(2);
    } else if ((iPin == false) && (iRamp == false)) { // fixed pin is in moving slot and proj is above ramp (config 3)
      var A = [];
      var b = new Array();

      A[0] = [     m1,      0,      0,      0,      0,      0,     1,            -CQ];
      A[1] = [      0,     m2,      0,      0,      0,     -1,     0,              0];
      A[2] = [      0,      0,     m2,      0,      0,      0,     -1,             0];
      A[3] = [      0,      0,      0,      I,      0,  L2*SQ, -L2*CQ, W*CQ-(H-h)*SQ];
      A[4] = [      0,      0,      0,      0,      0, -L3*SS,  L3*CS,             0];
      A[5] = [A[0][5],A[1][5],A[2][5],A[3][5],A[4][5],      0,      0,             0];
      A[6] = [A[0][6],A[1][6],A[2][6],A[3][6],A[4][6],      0,      0,             0];
      A[7] = [A[0][7],A[1][7],A[2][7],A[3][7],A[4][7],      0,      0,             0];
      
      b[0] = -m1*treb.g;
      b[1] = 0;
      b[2] = -m2*treb.g;
      b[3] = 0;
      b[4] = 0;
      b[5] = -L2*q2*CQ + L3*s2*CS;
      b[6] = -L2*q2*SQ + L3*s2*SS;
      b[7] = -2*hdot*thetadot*SQ + q2*(W*SQ + (H-h)*CQ);

      var LU = LU_Decomp(A,8);
      b = LU_Backsub(LU.A,8,LU.indx,b);

      treb.hdot          += b[0] * treb.deltaT;      
      treb.sling.xdot    += b[1] * treb.deltaT;
      treb.sling.ydot    += b[2] * treb.deltaT;
      treb.arm.thetadot  += b[3] * treb.deltaT;
      treb.sling.psidot  += b[4] * treb.deltaT;

      treb.h          += treb.hdot * treb.deltaT;
      treb.sling.x    += treb.sling.xdot * treb.deltaT;
      treb.sling.y    += treb.sling.ydot * treb.deltaT;
      treb.arm.theta  += treb.arm.thetadot * treb.deltaT;
      treb.sling.psi  += treb.sling.psidot * treb.deltaT;

      constraint_treb(3);
      if ((treb.h-D*Math.sin(treb.arm.theta)) < treb.base.H) iPin = true;
      
    } else if ((iPin == true) && (iRamp == false)) { // moving pin is in fixed slot and proj is above ramp (config 4)
      var A = [];
      var b = new Array();

      A[0] = [     m1,      0,      0,      0,      0,      0,     1,      1];
      A[1] = [      0,     m2,      0,      0,      0,     -1,     0,      0];
      A[2] = [      0,      0,     m2,      0,      0,      0,     -1,     0];
      A[3] = [      0,      0,      0,      I,      0,  L2*SQ, -L2*CQ, -D*CQ];
      A[4] = [      0,      0,      0,      0,      0, -L3*SS,  L3*CS,     0];
      A[5] = [A[0][5],A[1][5],A[2][5],A[3][5],A[4][5],      0,      0,     0];
      A[6] = [A[0][6],A[1][6],A[2][6],A[3][6],A[4][6],A[5][6],      0,     0];
      A[7] = [A[0][7],A[1][7],A[2][7],A[3][7],A[4][7],A[5][7],A[6][7],     0];

      b[0] = -m1*treb.g;
      b[1] = 0;
      b[2] = -m2*treb.g;
      b[3] = 0;
      b[4] = 0;
      b[5] = -L2*q2*CQ + L3*s2*CS;
      b[6] = -L2*q2*SQ + L3*s2*SS;
      b[7] = -D*q2*SQ;

      var LU = LU_Decomp(A,8);
      b = LU_Backsub(LU.A,8,LU.indx,b);

      treb.hdot          += b[0] * treb.deltaT;      
      treb.sling.xdot    += b[1] * treb.deltaT;
      treb.sling.ydot    += b[2] * treb.deltaT;
      treb.arm.thetadot  += b[3] * treb.deltaT;
      treb.sling.psidot  += b[4] * treb.deltaT;

      treb.h          += treb.hdot * treb.deltaT;
      treb.sling.x    += treb.sling.xdot * treb.deltaT;
      treb.sling.y    += treb.sling.ydot * treb.deltaT;
      treb.arm.theta  += treb.arm.thetadot * treb.deltaT;
      treb.sling.psi  += treb.sling.psidot * treb.deltaT;

      constraint_treb(4);
    } 
  }
  
// now draw stuff  
  treb.draw();
  if ((-treb.sling.psi - Math.PI + treb.arm.theta) >= treb.arm.beta) iLaunched=true;
}
/**********************************************************************************************************************/
/* function constraint_treb - enforce constraints on floating arm treb
/**********************************************************************************************************************/
function constraint_treb(i) {

// Step 1: Iterate until convergence ************************
  var tol = 0.00001;
  var iter = 0;
  var Phi = new Array();
  var Jac = [];
  
  var W = treb.base.W;
  var H = treb.base.H;
  var D = treb.arm.D;
  var L2 = treb.arm.L2;
  var L3 = treb.sling.L;
  var lambda = treb.base.lambda;
  var CL = Math.cos(lambda);
  var SL = Math.sin(lambda);
  var h = treb.h;
  var theta = treb.arm.theta;
  var psi = treb.sling.psi;

  var test = 0;

  if (i == 1) { // fixed pin in moving slot, projectile on ramp
    while (iter < 100) {
      iter++;
 
      Phi[0] =   -L2*Math.cos(theta) - treb.sling.x + L3*Math.cos(psi);
      Phi[1] = h -L2*Math.sin(theta) - treb.sling.y + L3*Math.sin(psi);
      Phi[2] = W*Math.sin(theta) + (H-h)*Math.cos(theta);
      Phi[3] = treb.sling.x*SL + treb.sling.y*CL;

      test = Phi[0]*Phi[0] + Phi[1]*Phi[1] + Phi[2]*Phi[2] + Phi[3]*Phi[3];

      if (test < tol) break;

      Jac[0] = [               0, -1,  0, -L2*Math.sin(psi)];
      Jac[1] = [               1,  0, -1,  L2*Math.cos(psi)];
      Jac[2] = [-Math.cos(theta),  0,  0,                 0];
      Jac[3] = [               0, SL, CL,                 0];

      var LU = LU_Decomp(Jac,4);
      Phi = LU_Backsub(LU.A,4,LU.indx,Phi);
      
      h = h - Phi[0];
      treb.sling.x = treb.sling.x - Phi[1];
      treb.sling.y = treb.sling.y - Phi[2];
      psi = psi - Phi[3];
    }
    treb.h = h;
    treb.arm.theta = theta;
    treb.sling.psi = psi;
    
  } else if (i == 2) { // moving pin in fixed slot, projectile on ramp
      while (iter < 100) {
      iter++;
 
      Phi[0] =   -L2*Math.cos(theta) - treb.sling.x + L3*Math.cos(psi);
      Phi[1] = h -L2*Math.sin(theta) - treb.sling.y + L3*Math.sin(psi);
      Phi[2] = h - D*Math.sin(theta) - H;
      Phi[3] = treb.sling.x*SL + treb.sling.y*CL;
      
      test = Phi[0]*Phi[0] + Phi[1]*Phi[1] + Phi[2]*Phi[2] + Phi[3]*Phi[3];

      if (test < tol) break;

      Jac[0] = [0, -1,  0, -L2*Math.sin(psi)];
      Jac[1] = [1,  0, -1,  L2*Math.cos(psi)];
      Jac[2] = [1,  0,  0,                 0];
      Jac[3] = [0, SL, CL,                 0];

      var LU = LU_Decomp(Jac,4);
      Phi = LU_Backsub(LU.A,4,LU.indx,Phi);
      
      h = h - Phi[0];
      treb.sling.x = treb.sling.x - Phi[1];
      treb.sling.y = treb.sling.y - Phi[2];
      psi = psi - Phi[3];
    }
    treb.h = h;
    treb.arm.theta = theta;
    treb.sling.psi = psi;
    
  } else if (i == 3) { // fixed pin in moving slot, projectile above ramp
    while (iter < 100) {
      iter++;
 
      Phi[0] =   -L2*Math.cos(theta) - treb.sling.x + L3*Math.cos(psi);
      Phi[1] = h -L2*Math.sin(theta) - treb.sling.y + L3*Math.sin(psi);
      Phi[2] = W*Math.sin(theta) + (H-h)*Math.cos(theta);

      test = Phi[0]*Phi[0] + Phi[1]*Phi[1] + Phi[2]*Phi[2];

      if (test < tol) break;

      Jac[0] = [               0, -1,  0];
      Jac[1] = [               1,  0, -1];
      Jac[2] = [-Math.cos(theta),  0,  0];

      var LU = LU_Decomp(Jac,3);
      Phi = LU_Backsub(LU.A,3,LU.indx,Phi);
      
      h = h - Phi[0];
      treb.sling.x = treb.sling.x - Phi[1];
      treb.sling.y = treb.sling.y - Phi[2];
    }
    treb.h = h;
    treb.arm.theta = theta;
    
  } else if (i == 4) { // moving pin in fixed slot, projectile above ramp
      while (iter < 100) {
      iter++;
 
      Phi[0] =   -L2*Math.cos(theta) - treb.sling.x + L3*Math.cos(psi);
      Phi[1] = h -L2*Math.sin(theta) - treb.sling.y + L3*Math.sin(psi);
      Phi[2] = h - D*Math.sin(theta) - H;
      
      test = Phi[0]*Phi[0] + Phi[1]*Phi[1] + Phi[2]*Phi[2];

      if (test < tol) break;

      Jac[0] = [0, -1,  0];
      Jac[1] = [1,  0, -1];
      Jac[2] = [1,  0,  0];

      var LU = LU_Decomp(Jac,3);
      Phi = LU_Backsub(LU.A,3,LU.indx,Phi);
      
      h = h - Phi[0];
      treb.sling.x = treb.sling.x - Phi[1];
      treb.sling.y = treb.sling.y - Phi[2];
    }
    treb.h = h;
    treb.arm.theta = theta;
  }
}
