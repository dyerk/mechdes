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
  var L1 = 0.15;              // length from pivot to short end of arm (m)
  var L2 = 0.4;               // length from pivot to long end of arm (m)
  var w  = 0.04;              // height of arm (m)
  var t  = 0.01;              // thickness of arm (m)
  var h0  = 0.2;              // height of pivot (m)
  var rho = 600;              // density of arm (kg/m^3)
  var beta = -70*Math.PI/180; // hook angle
// ********************************************************************
  
  window.treb = new Treb(L1,L2,h0,t,w,rho,m1,m2,beta);  // create trebuchet          
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
/* function solve_treb - draw trebuchet shapes on canvas
/**********************************************************************************************************************/
function solve_treb(i) {

  t = i * treb.deltaT;

  if (t > 0) {  
    var dOmega = (-treb.m*treb.g/treb.I)*Math.cos(treb.arm.theta);
    treb.arm.thetadot += dOmega * treb.deltaT;
    treb.arm.theta += treb.arm.thetadot * treb.deltaT;
  }
// now draw stuff
  treb_ctx2.clearRect(0,0,treb_can2.width,treb_can2.height);
  treb_ctx4.clearRect(0,0,treb_can4.width,treb_can4.height);  
  treb.draw();
  if (treb.arm.theta <= treb.arm.beta) iLaunched=true;
}









