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
  console.log(value)
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
