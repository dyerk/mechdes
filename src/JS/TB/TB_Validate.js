/**********************************************************************************************************************/
/* function defineNumberBoxes - sets the min, max and step values for the number boxes
/**********************************************************************************************************************/
function defineNumberBoxes() {
  window.L1Box     = document.getElementById("L1");
  window.L2Box     = document.getElementById("L2");
  window.L3Box     = document.getElementById("L3");
  window.L4Box     = document.getElementById("L4");
  window.DBox      = document.getElementById("D");
  window.HBox      = document.getElementById("H");
  window.WBox      = document.getElementById("W");
  window.h0Box     = document.getElementById("h0");
  window.tBox      = document.getElementById("t");
  window.wBox      = document.getElementById("w");
  window.rhoBox    = document.getElementById("rho");
  window.m1Box     = document.getElementById("m1");
  window.m2Box     = document.getElementById("m2");
  window.mcBox     = document.getElementById("mc");
  window.betaBox   = document.getElementById("beta");
  window.lambdaBox = document.getElementById("lambda");  
  var temp = "";

// *************  this is where we set the minimum and maximum values for the number input fields **********************  
  if (L1Box) {
    L1Box.onchange   = update_L1;
    L1Box.min  = 0.1;
    L1Box.max  = 10;
    L1Box.step = 0.01;
    temp = "<i>L</i><sub>1</sub>&nbsp (" + L1Box.min + " &mdash; " + L1Box.max + " m)";
    document.getElementById("L1Label").innerHTML = temp;
  }
  if (L2Box) {
    L2Box.onchange   = update_L2;
    L2Box.min  = 0.1;
    L2Box.max  = 20;
    L2Box.step = 0.01;
    temp = "<i>L</i><sub>2</sub>&nbsp; (" + L2Box.min + " &mdash; " + L2Box.max + " m)";
    document.getElementById("L2Label").innerHTML = temp; 
  }
  if (L3Box) {
    L3Box.onchange   = update_L3;
    L3Box.min  = 0.1;
    L3Box.max  = 20;
    L3Box.step = 0.01;
    temp = "<i>L</i><sub>3</sub>&nbsp; (" + L3Box.min + " &mdash; " + L3Box.max + " m)";
    document.getElementById("L3Label").innerHTML = temp; 
  }
  if (L4Box) {
    L4Box.onchange   = update_L4;
    L4Box.min  = 0.1;
    L4Box.max  = 5;
    L4Box.step = 0.01;
    temp = "<i>L</i><sub>4</sub>&nbsp; (" + L4Box.min + " &mdash; " + L4Box.max + " m)";
    document.getElementById("L4Label").innerHTML = temp;  
  }
  if (DBox) {
    DBox.onchange   = update_D;
    DBox.min  = 0.1;
    DBox.max  = 20;
    DBox.step = 0.01; 
    temp = "<i>D</i>&nbsp; (" + DBox.min + " &mdash; <i>L</i><sub>2</sub> m)";
    document.getElementById("DLabel").innerHTML = temp; 
  }
  if (HBox) {
    HBox.onchange   = update_H;
    HBox.min  = 0.1;
    HBox.max  = 10;
    HBox.step = 0.01;
    temp = "<i>H</i>&nbsp; (" + HBox.min + " &mdash; " + HBox.max + " m)";
    document.getElementById("HLabel").innerHTML = temp;  
  }
  if (WBox) {
    WBox.onchange   = update_W;
    WBox.min  = 0.1;
    WBox.max  = 10;
    WBox.step = 0.01;
    temp = "<i>W</i>&nbsp; (" + WBox.min + " &mdash; " + WBox.max + " m)";
    document.getElementById("WLabel").innerHTML = temp;  
  }
  if (h0Box) {
    h0Box.onchange   = update_h0;
    h0Box.min  = 0.1;
    h0Box.max  = 15;
    h0Box.step = 0.01;
    temp = "<i>h</i><sub>0</sub>&nbsp; (" + h0Box.min + " &mdash; " + h0Box.max + " m)";
    document.getElementById("h0Label").innerHTML = temp;  
  }
  if (tBox) {
    tBox.onchange   = update_t;
    tBox.min  = 0.01;
    tBox.max  = 0.5;
    tBox.step = 0.01;
    temp = "<i>t</i>&nbsp; (" + tBox.min + " &mdash; " + tBox.max + " m)";
    document.getElementById("tLabel").innerHTML = temp;  
  }
  if (wBox) {
    wBox.onchange   = update_w;
    wBox.min  = 0.01;
    wBox.max  = 1.0;
    wBox.step = 0.01;
    temp = "<i>w</i>&nbsp; (" + wBox.min + " &mdash; " + wBox.max + " m)";
    document.getElementById("wLabel").innerHTML = temp;  
  }
  if (rhoBox) {
    rhoBox.onchange   = update_rho;
    rhoBox.min  = 1;
    rhoBox.max  = 10000;
    rhoBox.step = 1;
    temp = "<i>&rho;</i>&nbsp; (" + rhoBox.min + " &mdash; " + rhoBox.max + " kg/m<sup>3</sup>)";
    document.getElementById("rhoLabel").innerHTML = temp;  
  }   
  if (m1Box) {
    m1Box.onchange   = update_m1;
    m1Box.min  = 0.1;
    m1Box.max  = 1000;
    m1Box.step = 0.1;
    temp = "<i>m</i><sub>1</sub>&nbsp; (" + m1Box.min + " &mdash; " + m1Box.max + " kg)";
    document.getElementById("m1Label").innerHTML = temp;  
  } 
  if (m2Box) {
    m2Box.onchange   = update_m2;
    m2Box.min  = 0.01;
    m2Box.max  = 10;
    m2Box.step = 0.01;
    temp = "<i>m</i><sub>2</sub>&nbsp; (" + m2Box.min + " &mdash; " + m2Box.max + " kg)";
    document.getElementById("m2Label").innerHTML = temp;  
  } 
  if (mcBox) {
    mcBox.onchange   = update_mc;
    mcBox.min  = 0.1;
    mcBox.max  = 100;
    mcBox.step = 0.1;
    temp = "<i>m</i><sub>c</sub>&nbsp; (" + mcBox.min + " &mdash; " + mcBox.max + " kg)";
    document.getElementById("mcLabel").innerHTML = temp;  
  } 
  if (betaBox) {
    betaBox.onchange   = update_beta;
    betaBox.min  = -90;
    betaBox.max  =  90;
    betaBox.step = 1;
    temp = "<i>&beta;</i>&nbsp; (" + betaBox.min + "&deg; &mdash; " + betaBox.max + "&deg;)";
    document.getElementById("betaLabel").innerHTML = temp;  
  } 
  if (lambdaBox) {
    lambdaBox.onchange   = update_lambda;
    lambdaBox.min  = 0;
    lambdaBox.max  = 45;
    lambdaBox.step = 1;
    temp = "<i>&lambda;</i>&nbsp; (" + lambdaBox.min + "&deg; &mdash; " + L2Box.max + "&deg;)";
    document.getElementById("lambdaLabel").innerHTML = temp;  
  }     
}
/**********************************************************************************************************************/
/* function update_L1 - validates the entry in the L1 field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_L1() {
  if ((1*L1Box.value < 1*L1Box.min) || (1*L1Box.value > 1*L1Box.max)) {
    alert("please enter a value between " + L1Box.min + " and " + L1Box.max + " meters");
  } else {
    treb.arm.L1 = 1*L1Box.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_L2 - validates the entry in the L2 field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_L2() {
  if ((1*L2Box.value < 1*L2Box.min) || (1*L2Box.value > 1*L2Box.max)) {
    alert("please enter a value between " + L2Box.min + " and " + L2Box.max + " meters");
  } else {
    treb.arm.L2 = 1*L2Box.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_L3 - validates the entry in the L3 field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_L3() {
  if ((1*L3Box.value < 1*L3Box.min) || (1*L3Box.value > 1*L3Box.max)) {
    alert("please enter a value between " + L3Box.min + " and " + L3Box.max + " meters");
  } else {
    treb.sling.L = 1*L3Box.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_L4 - validates the entry in the L4 field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_L4() {
  if ((1*L4Box.value < 1*L4Box.min) || (1*L4Box.value > 1*L4Box.max)) {
    alert("please enter a value between " + L4Box.min + " and " + L4Box.max + " meters");
  } else {
    treb.hanger.L = 1*L4Box.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_D - validates the entry in the D field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_D() {
  if (1*DBox.value < 1*DBox.min) {
    alert("please enter a value greater than " + DBox.min + " meters");
  } else if (1*DBox.value > 1*L2Box.value) {
    alert("please enter a value less than the total length of the arm");
  } else {
    treb.arm.D = 1*DBox.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_H - validates the entry in the H field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_H() {
  if ((1*HBox.value < 1*HBox.min) || (1*HBox.value > 1*HBox.max)) {
    alert("please enter a value between " + HBox.min + " and " + HBox.max + " meters");
  } else {
    treb.base.H = 1*HBox.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_W - validates the entry in the W field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_W() {
  if ((1*WBox.value < 1*WBox.min) || (1*WBox.value > 1*WBox.max)) {
    alert("please enter a value between " + WBox.min + " and " + WBox.max + " meters");
  } else {
    treb.base.W = 1*WBox.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_h0 - validates the entry in the h0 field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_h0() {
  if ((1*h0Box.value < 1*h0Box.min) || (1*h0Box.value > 1*h0Box.max)) {
    alert("please enter a value between " + h0Box.min + " and " + h0Box.max + " meters");
  } else {
    treb.base.h0 = 1*h0Box.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_t - validates the entry in the t field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_t() {
  if ((1*tBox.value < 1*tBox.min) || (1*tBox.value > 1*tBox.max)) {
    alert("please enter a value between " + tBox.min + " and " + tBox.max + " meters");
  } else {
    treb.arm.t = 1*tBox.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_w - validates the entry in the w field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_w() {
  if ((1*wBox.value < 1*wBox.min) || (1*wBox.value > 1*wBox.max)) {
    alert("please enter a value between " + wBox.min + " and " + wBox.max + " meters");
  } else {
    treb.arm.w = 1*wBox.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_rho - validates the entry in the density field
/**********************************************************************************************************************/
function update_rho() {
  if ((1*rhoBox.value < 1*rhoBox.min) || (1*rhoBox.value > 1*rhoBox.max)) {
    alert("Please enter a density between " + rhoBox.min + " and " + rhoBox.max + " kg/m3");
  } else {
    treb.arm.rho = 1*rhoBox.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_m1 - validates the entry in the m1 field
/**********************************************************************************************************************/
function update_m1() {
  if ((1*m1Box.value < 1*m1Box.min) || (1*m1Box.value > 1*m1Box.max)) {
    alert("Please enter a value between " + m1Box.min + " and " + m1Box.max + " kg");
  } else {
    treb.cwt.mass = 1*m1Box.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_m2 - validates the entry in the m2 field
/**********************************************************************************************************************/
function update_m2() {
  if ((1*m2Box.value < 1*m2Box.min) || (1*m2Box.value > 1*m2Box.max)) {
    alert("Please enter a value between " + m2Box.min + " and " + m2Box.max + " kg");
  } else {
    treb.proj.mass = 1*m2Box.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_mc - validates the entry in the mc field
/**********************************************************************************************************************/
function update_mc() {
  if ((1*mcBox.value < 1*mcBox.min) || (1*mcBox.value > 1*mcBox.max)) {
    alert("Please enter a value between " + mcBox.min + " and " + mcBox.max + " kg");
  } else {
    treb.base.mc = 1*mcBox.value;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_beta - validates the entry in the hook angle field
/**********************************************************************************************************************/
function update_beta() {
  if ((1*betaBox.value < 1*betaBox.min) || (1*betaBox.value > 1*betaBox.max)) {
    alert("Please enter an angle between " + betaBox.min + " and " + betaBox.max + " degrees");
  } else {
    treb.arm.beta = 1.0*Math.PI*betaBox.value/180;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function update_lambda - validates the entry in the ramp angle field
/**********************************************************************************************************************/
function update_lambda() {
  if ((1*lambdaBox.value < 1*lambdaBox.min) || (1*lambdaBox.value > 1*lambdaBox.max)) {
    alert("Please enter an angle between " + lambdaBox.min + " and " + lambdaBox.max + " degrees");
  } else {
    treb.base.lambda = Math.PI*lambdaBox.value/180;
  }
  handle_reset();
  display_form();
}
/**********************************************************************************************************************/
/* function display_form - writes the updated values to the html form.
/**********************************************************************************************************************/
function display_form() {
  if (L1Box)     L1Box.value     = Math.round(treb.arm.L1*1000)/1000;
  if (L2Box)     L2Box.value     = Math.round(treb.arm.L2*1000)/1000;
  if (L3Box)     L3Box.value     = Math.round(treb.sling.L*1000)/1000;
  if (L4Box)     L4Box.value     = Math.round(treb.hanger.L*1000)/1000;
  if (DBox)      DBox.value      = Math.round(treb.arm.D*1000)/1000;
  if (HBox)      HBox.value      = Math.round(treb.base.H*1000)/1000;
  if (WBox)      WBox.value      = Math.round(treb.base.W*1000)/1000;
  if (h0Box)     h0Box.value     = Math.round(treb.base.h0*1000)/1000;
  if (tBox)      tBox.value      = Math.round(treb.arm.t*1000)/1000;
  if (wBox)      wBox.value      = Math.round(treb.arm.w*1000)/1000;
  if (rhoBox)    rhoBox.value    = Math.round(treb.arm.rho*1000)/1000;
  if (m1Box)     m1Box.value     = Math.round(treb.cwt.mass*1000)/1000;
  if (m2Box)     m2Box.value     = Math.round(treb.proj.mass*1000)/1000;
  if (mcBox)     mcBox.value     = Math.round(treb.base.mc*1000)/1000;
  if (betaBox)   betaBox.value   = Math.round(treb.arm.beta*180/(Math.PI));
  if (lambdaBox) lambdaBox.value = Math.round(treb.base.lambda*180/(Math.PI));  
}