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
  var D  = 0.15;               // length from counterweight to moving pivot on arm (m)
  var w  = 0.04;              // height of arm (m)
  var t  = 0.01;              // thickness of arm (m)
  var h0 = 0.4;               // starting height of counterweight and total height of base (m)
  var H  = 0.2;               // height of fixed pivot (m)
  var W  = 0.2;               // horiz distance from counterweight to fixed pivot (m)
  var rho = 600;              // density of arm (kg/m^3)
  var beta = -80*Math.PI/180; // launch hook angle (rad)
// ********************************************************************

  window.treb = new Treb(L2,D,H,W,h0,t,w,rho,m1,m2,beta);  // create trebuchet          
  window.iLaunched = false;  // tells whether projectile has been launched
  window.iPin = false;       // tells whether moving pin is in fixed slot
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
  var D  = treb.arm.D;
  var W  = treb.base.W;
  var H  = treb.base.H;
  var m1 = treb.cwt.mass;    // mass of counterweight
  var m2 = treb.proj.mass;   // mass of projectile

  var I = treb.arm.Ib;  // combined moment of inertia of arm, projectile and counterweight
  
  if (t > 0) {   // solve equations of motion
    var theta = treb.arm.theta;
    var thetadot = treb.arm.thetadot;
    var h    = treb.h;
    var hdot = treb.hdot;

    var q2 = treb.arm.thetadot * treb.arm.thetadot;  // thetadot squared
    var CQ = Math.cos(theta);
    var SQ = Math.sin(theta);

    if (iPin == false) { // fixed pin is in moving slot (config 1)
      var A = [];
      var b = new Array();

      A[0] = [     m1,      0,      0,      0,     0,      1,           -CQ];
      A[1] = [      0,     m2,      0,      0,    -1,      0,             0];
      A[2] = [      0,      0,     m2,      0,     0,     -1,             0];
      A[3] = [      0,      0,      0,      I, L2*SQ, -L2*CQ, W*CQ-(H-h)*SQ];
      A[4] = [A[0][4],A[1][4],A[2][4],A[3][4],     0,      0,             0];
      A[5] = [A[0][5],A[1][5],A[2][5],A[3][5],     0,      0,             0];
      A[6] = [A[0][6],A[1][6],A[2][6],A[3][6],     0,      0,             0];
    
      b[0] = -m1*treb.g;
      b[1] = 0;
      b[2] = -m2*treb.g;
      b[3] = 0;
      b[4] = -L2*q2*CQ;
      b[5] = -L2*q2*SQ;
      b[6] = -2*hdot*thetadot*SQ + q2*(W*SQ + (H-h)*CQ);

      var LU = LU_Decomp(A,7);
      b = LU_Backsub(LU.A,7,LU.indx,b);

      treb.hdot          += b[0] * treb.deltaT;      
      treb.proj.xdot     += b[1] * treb.deltaT;
      treb.proj.ydot     += b[2] * treb.deltaT;
      treb.arm.thetadot  += b[3] * treb.deltaT;

      treb.h          += treb.hdot * treb.deltaT;
      treb.proj.x     += treb.proj.xdot * treb.deltaT;
      treb.proj.y     += treb.proj.ydot * treb.deltaT;
      treb.arm.theta  += treb.arm.thetadot * treb.deltaT;

      constraint_treb(1);
      if ((treb.h-D*Math.sin(treb.arm.theta)) < treb.base.H) iPin = true;
      
    } else if (iPin == true) { // moving pin is in fixed slot and projectile is above ramp (config 4)
      var A = [];
      var b = new Array();

      A[0] = [     m1,      0,      0,      0,     0,      1,     1];
      A[1] = [      0,     m2,      0,      0,    -1,      0,     0];
      A[2] = [      0,      0,     m2,      0,     0,     -1,     0];
      A[3] = [      0,      0,      0,      I, L2*SQ, -L2*CQ, -D*CQ];
      A[4] = [A[0][4],A[1][4],A[2][4],A[3][4],     0,      0,     0];
      A[5] = [A[0][5],A[1][5],A[2][5],A[3][5],     0,      0,     0];
      A[6] = [A[0][6],A[1][6],A[2][6],A[3][6],     0,      0,     0];
            
      b[0] = -m1*treb.g;
      b[1] = 0;
      b[2] = -m2*treb.g;
      b[3] = 0;
      b[4] = -L2*q2*CQ;
      b[5] = -L2*q2*SQ;
      b[6] = -D*q2*SQ;

      var LU = LU_Decomp(A,7);
      b = LU_Backsub(LU.A,7,LU.indx,b);

      treb.hdot          += b[0] * treb.deltaT;      
      treb.proj.xdot     += b[1] * treb.deltaT;
      treb.proj.ydot     += b[2] * treb.deltaT;
      treb.arm.thetadot  += b[3] * treb.deltaT;
  
      treb.h          += treb.hdot * treb.deltaT;
      treb.proj.x     += treb.proj.xdot * treb.deltaT;
      treb.proj.y     += treb.proj.ydot * treb.deltaT;
      treb.arm.theta  += treb.arm.thetadot * treb.deltaT;
      
      constraint_treb(2);
    } 
    var vx =  L2*treb.arm.thetadot*Math.sin(treb.arm.theta);
    var vy = -L2*treb.arm.thetadot*Math.cos(treb.arm.theta) + treb.hdot;
    var v0 = Math.sqrt(vx*vx + vy*vy);
  }
  
// now draw stuff  
  treb_ctx2.clearRect(0,0,treb_can2.width,treb_can2.height);
  treb_ctx4.clearRect(0,0,treb_can4.width,treb_can4.height);  
  treb.draw();
  if ( treb.arm.theta <= treb.arm.beta) iLaunched=true;
}
/**********************************************************************************************************************/
/* function constraint_treb - enforce constraints on floating arm treb
/**********************************************************************************************************************/
function constraint_treb(i) {

// Step 1: Iterate until convergence ************************
  var tol = 0.00001;
  var iter = 0;
  var Phi = [];
  var Jac = [];
  
  var W  = treb.base.W;
  var H  = treb.base.H;
  var D  = treb.arm.D;
  var L2 = treb.arm.L2;
  var h  = treb.h;
  var theta = treb.arm.theta;

  var test = 0;

  if (i == 1) { // fixed pin in moving slot
    while (iter < 100) {
      iter++;
 
      Phi[0] =   -L2*Math.cos(theta) - treb.proj.x;
      Phi[1] = h -L2*Math.sin(theta) - treb.proj.y;
      Phi[2] = W*Math.sin(theta) + (H-h)*Math.cos(theta);

      test = Phi[0]*Phi[0] + Phi[1]*Phi[1] + Phi[2]*Phi[2];
      if (test < tol) break;

      Jac[0] = [               0, -1,  0];
      Jac[1] = [               1,  0, -1];
      Jac[2] = [-Math.cos(theta),  0,  0];

      var LU = LU_Decomp(Jac,3);
      Phi = LU_Backsub(LU.A,3,LU.indx,Phi);
      
      h = h - Phi[0];
      treb.proj.x = treb.proj.x - Phi[1];
      treb.proj.y = treb.proj.y - Phi[2];
    }
    treb.h = h;
  } else if (i == 2) { // moving pin in fixed slot
      while (iter < 100) {
      iter++;
 
      Phi[0] =   -L2*Math.cos(theta) - treb.proj.x;
      Phi[1] = h -L2*Math.sin(theta) - treb.proj.y;
      Phi[2] = h - D*Math.sin(theta) - H;
      
      test = Phi[0]*Phi[0] + Phi[1]*Phi[1] + Phi[2]*Phi[2];

      if (test < tol) break;

      Jac[0] = [0, -1,  0];
      Jac[1] = [1,  0, -1];
      Jac[2] = [1,  0,  0];

      var LU = LU_Decomp(Jac,3);
      Phi = LU_Backsub(LU.A,3,LU.indx,Phi);
      
      h = h - Phi[0];
      treb.proj.x = treb.proj.x - Phi[1];
      treb.proj.y = treb.proj.y - Phi[2];
    }
    treb.h = h;
  }
}
