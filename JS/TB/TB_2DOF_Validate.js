/**********************************************************************************************************************/
/* function lengthConvert - converts from inches, feet or yards into meters
/**********************************************************************************************************************/
function lengthConvert() {
  var length_imp = document.getElementById("length_imp").value;
  if (document.getElementById("inches").checked == true) {
    var length_met = Math.round(length_imp * 0.0254*1000)/1000;
  } else if (document.getElementById("feet").checked == true) {
    var length_met = Math.round(length_imp * 0.3048*1000)/1000;
  } else {
    var length_met = Math.round(length_imp * 0.9144*1000)/1000;
  }
  document.getElementById("length_metric").innerHTML = length_met;
}
/**********************************************************************************************************************/
/* function updateLength - writes the correct length unit in the unit conversion form
/**********************************************************************************************************************/
function updateLength(value) {
  if (value == "inches") {
    document.getElementById("length_label").innerHTML='inches = ';
  } else if (value == "feet") {
    document.getElementById("length_label").innerHTML='feet = ';
  } else {
    document.getElementById("length_label").innerHTML='yards = ';
  }
  lengthConvert();
}
/**********************************************************************************************************************/
/* function massConvert - converts from pounds or ounces into kilograms
/**********************************************************************************************************************/
function massConvert() {
  var mass_imp = document.getElementById("mass_imp").value;
  if (document.getElementById("pounds").checked == true) {
    var mass_met = Math.round(mass_imp * 0.4545*1000)/1000;
  } else {
    var mass_met = Math.round(mass_imp * 0.02841*1000)/1000;
  }
  document.getElementById("mass_metric").innerHTML = mass_met;
}
/**********************************************************************************************************************/
/* function updateMass - writes the correct mass unit in the unit conversion form
/**********************************************************************************************************************/
function updateMass(value) {
  if (value == "pounds") {
    document.getElementById("mass_label").innerHTML='pounds = ';
  } else {
    document.getElementById("mass_label").innerHTML='ounces = ';
  } 
  massConvert();
}
/**********************************************************************************************************************/
/* function update_L1 - validates the entry in the L1 field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_L1(L1) {
  if ((L1 < 0.1) || (L1 > 20)) {
    alert("please enter a value between 0.1 and 20 meters");
  } else {
    S.arm.L1 = L1;
  }
  reset_treb();
  display_form();
}
/**********************************************************************************************************************/
/* function update_L2 - validates the entry in the L2 field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_L2(L2) {
  if ((L2 < 0.1) || (L2 > 20)) {
    alert("please enter a value between 0.1 and 20 meters");
  } else {
    S.arm.L2 = L2;
  }
  reset_treb();
  display_form();
}
/**********************************************************************************************************************/
/* function update_L3 - validates the entry in the L3 field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_L3(L3) {
  if ((L3 < 0.1) || (L3 > 20)) {
    alert("please enter a value between 0.1 and 20 meters");
  } else {
    S.sling.L3 = L3;
  }
  reset_treb();
  display_form();
}
/**********************************************************************************************************************/
/* function update_w - validates the entry in the w field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_w(w) {
  var wMin = 0.05*S.arm.L2;
  var wMax = 0.30*S.arm.L2;
  alert(wMax)
  if ((w < wMin) || (w > wMax)) {
    alert("please enter a value greater than " + Math.round(wMin*1000)/1000 + " meters and less than " + 
          Math.round(wMax*1000)/1000 + " meters");
  } else {
    S.arm.w = w;
  }
  reset_treb();
  display_form();
}
/**********************************************************************************************************************/
/* function update_t - validates the entry in the t field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_t(t) {
  if ((t < 0.1) || (t > 20)) {
    alert("please enter a value between 0.1 and 20 meters");
  } else {
    S.arm.t = t;
  }
  reset_treb();
  display_form();
}
/**********************************************************************************************************************/
/* function update_H - validates the entry in the H field, resets and redraws the trebuchet
/**********************************************************************************************************************/
function update_H(H) {
  var minH = 0.1*S.arm.L2;
  var maxH = 0.9*S.arm.L2;
  if ((H < minH) || (H > maxH)) {
    alert("Please enter a value between " + Math.round(minH*1000)/1000 + " and " + Math.round(maxH*1000)/1000 + 
          " meters.  The pivot height should be between 10% and 90% of L2.");
  } else {
    S.base.H = H;
    S.theta0 = Math.asin(H/S.arm.L2);
    S.arm.theta = S.theta0;
  }
  reset_treb();
  display_form();
}
/**********************************************************************************************************************/
/* function update_m1 - validates the entry in the m1 field
/**********************************************************************************************************************/
function update_m1(m1) {
  if ((m1 < S.proj.mass) || (m1 > 1000)) {
    alert("Please enter a value between " + Math.round(S.proj.mass*1000)/1000 + "kg and 1000kg.  The counterweight "
    + "mass should be greater than the projectile mass.");
  } else {
    S.cwt.mass = m1;
  }
  reset_treb();
  display_form();
}
/**********************************************************************************************************************/
/* function update_m2 - validates the entry in the m2 field
/**********************************************************************************************************************/
function update_m2(m2) {
  if ((m2 > S.cwt.mass) || (m1 < 0.001)) {
    alert("Please enter a value between 0.001kg and " + Math.round(S.cwt.mass*1000)/1000 +"kg. The projectile "
    + "mass should be less than the counterweight mass.");
  } else {
    S.proj.mass = m2;
  }
  reset_treb();
  display_form();
}
function updaterho(rho) {
  S.arm.rho = rho;
}

