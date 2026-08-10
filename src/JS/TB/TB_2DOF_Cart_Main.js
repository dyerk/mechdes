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
  var mc = 1.0;               // mass of cart (kg)
  var L1 = 0.2;               // length from pivot to short end of arm (m)
  var L2 = 0.6;               // length from pivot to long end of arm (m)
  var w  = 0.1;               // height of arm (m)
  var t  = 0.01;              // thickness of arm (m)
  var h0  = 0.4;              // height of pivot (m)
  var rho = 600;              // density of arm (kg/m^3)
  var beta = -70*Math.PI/180; // launch hook angle (rad)
// ********************************************************************

  window.treb = new Treb(L1,L2,h0,t,w,rho,m1,m2,mc,beta);  // create treb - a global variable
  window.iLaunched = false;  // tells whether projectile has been launched
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
  var theta = treb.arm.theta;   // current angle of arm
  var x = treb.base.x;          // current position of base

  var L1 = treb.arm.L1;      // length from pivot to counterweight
  var L2 = treb.arm.L2;      // length from pivot to hook
  var m1 = treb.cwt.mass;    // mass of counterweight
  var m2 = treb.proj.mass;   // mass of projectile
  var mc = treb.base.mass;   // mass of cart
  var k  = treb.base.spring; // artificial stiffness of cart (for stability)
  var I = treb.I;            // combined "moment of inertia" of arm, projectile and counterweight
  var M = treb.M;            // combined "mass" of arm, projectile and counterweight
  var m = treb.m;            // combined mass of arm, cart, projectile and counterweight
  
  if (t > 0) {   // solve equations of motion
    var q2 = treb.arm.thetadot * treb.arm.thetadot; // thetadot squared
    var A = [];
    var b = new Array();
    
    b[0] = -M * treb.g * Math.cos(theta);
    b[1] =  M*q2*Math.cos(theta) - k*x;

    A[0] = [      I, -M * Math.sin(theta)];
    A[1] = [A[0][1],                    m];
      
    var LU = LU_Decomp(A,2);
    b = LU_Backsub(LU.A,2,LU.indx,b);     
   

    treb.arm.thetadot += b[0] * treb.deltaT;
    treb.base.xdot += b[1] * treb.deltaT;

    treb.arm.theta += treb.arm.thetadot * treb.deltaT;
    treb.base.x += treb.base.xdot * treb.deltaT;
  }
  
// now draw stuff  
  treb.draw();
  if (treb.arm.theta <= treb.arm.beta) iLaunched=true;
}

