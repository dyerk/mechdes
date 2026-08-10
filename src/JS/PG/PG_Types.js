// Animate Planetary Gearsets
window.onload = init;

// playing indicates whether an animation is currently playing, firstTime tells whether it is the first time a
// button has been clicked.

var playing1 = false, playing2 = false;

var firstTime1 = true, firstTime2 = true;

function init() {
// initialize buttons on canvas
  var button1 = document.getElementById("play1");
  var button2 = document.getElementById("play2");

// Create shorthand variables for canvas and context
  var canvas1 = document.getElementById('canvas1');
  var canvas2 = document.getElementById('canvas2');

  var context1 = canvas1.getContext('2d');
  var context2 = canvas2.getContext('2d');
  
// Enable play buttons
  button1.disabled = false;
  button2.disabled = false;
  
// Create shapes for each animation
  shapes_2S2P1 = init_2S2P1(canvas1,context1);
  shapes_2S2P2 = init_2S2P2(canvas2,context2);
  
// Draw static shapes on canvas
  draw_2S2P1(canvas1,context1,shapes_2S2P1,0);
  draw_2S2P2(canvas2,context2,shapes_2S2P2,0);
  
// Button handling functions
  button1.onclick = handle_2S2P1(canvas1,context1,shapes_2S2P1);
  button2.onclick = handle_2S2P2(canvas2,context2,shapes_2S2P2);
}
/**********************************************************************************************************************/
/* function handle_2S2P1 - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2S2P1(canvas,context,S) {
  return function () {

    playing1 = !playing1;
    togglePlayButtonUI("play1", playing1, "Large Sun Fixed Small Sun Input Animation");

    if (firstTime1) {
      firstTime1 = false;
      var i = 0;
      function drawFrame () {
        if (playing1 == false) { 
          return;
        } else {
          i += 1;
          draw_2S2P1(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function handle_2S2P2 - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_2S2P2(canvas,context,S) {
  return function () {

    playing2 = !playing2;
    togglePlayButtonUI("play2", playing2, "Small Sun Fixed Large Sun Input Animation");

    if (firstTime2) {
      firstTime2 = false;
      var i = 0;
      function drawFrame () {
        if (playing2 == false) { 
          return;
        } else {
          i += 1;
          draw_2S2P2(canvas,context,S,i)
        }
      }
      var handle = window.setInterval(drawFrame, 1000/60);
}}}
/**********************************************************************************************************************/
/* function init_2S2P1 - initializes gears for sun, ring, planet, carrier
/**********************************************************************************************************************/
function init_2S2P1(canvas,context) {

  var sun1    = new Gear(40,"#ff0000",1.00);  // front
  var sun2    = new Gear(60,"#ff00ff",1.00);  // back
  var plan1   = new Gear(40,"#00ff00",0.50); // front
  var plan2   = new Gear(20,"#0000ff",1.00); // back
  var carrier = new Segment(80, 10, "#808080");

  sun1.x  = canvas.width/2;
  sun1.y  = canvas.height/2;
  sun2.x  = canvas.width/2;
  sun2.y  = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;
  
  return {
    sun1: sun1,
    sun2: sun2,
    plan1: plan1,
    plan2: plan2,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_2S2P2 - initializes gears for sun, ring, planet, carrier
/**********************************************************************************************************************/
function init_2S2P2(canvas,context) {

  var sun1    = new Gear(40,"#ff0000",1.00);  // front
  var sun2    = new Gear(60,"#ff00ff",1.00);  // back
  var plan1   = new Gear(40,"#00ff00",0.50); // front
  var plan2   = new Gear(20,"#0000ff",1.00); // back
  var carrier = new Segment(80, 10, "#808080");

  sun1.x  = canvas.width/2;
  sun1.y  = canvas.height/2;
  sun2.x  = canvas.width/2;
  sun2.y  = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;
  
  return {
    sun1: sun1,
    sun2: sun2,
    plan1: plan1,
    plan2: plan2,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function draw_2S2P1 - draw sun, ring, planet, carrier on canvas
/**********************************************************************************************************************/
function draw_2S2P1(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bp = (-S.sun2.radius/S.plan2.radius);
  var b  = bp*(-S.plan1.radius/S.sun1.radius);
  var carrierRadius = S.sun1.radius + S.plan1.radius;

  S.sun1.rotation = angle;
  S.carrier.rotation = (S.sun1.rotation-b*S.sun2.rotation)/(1-b);
  S.plan2.rotation = S.carrier.rotation*(1-bp) + bp*S.sun2.rotation;
  S.plan1.rotation = S.plan2.rotation;
  S.plan1.x = canvas.width/2  + (carrierRadius)*Math.cos(S.carrier.rotation);
  S.plan1.y = canvas.height/2 + (carrierRadius)*Math.sin(S.carrier.rotation);
  S.plan2.x = S.plan1.x
  S.plan2.y = S.plan1.y;

  S.sun2.draw(context);
  S.plan2.draw(context);
  S.sun1.draw(context);
  S.plan1.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_2S2P1 - draw sun, ring, planet, carrier on canvas
/**********************************************************************************************************************/
function draw_2S2P2(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;  
  var bp = (-S.sun2.radius/S.plan2.radius);
  var b  = bp*(-S.plan1.radius/S.sun1.radius);
  var carrierRadius = S.sun1.radius + S.plan1.radius;
    
  S.sun2.rotation = angle;

  S.carrier.rotation = (S.sun1.rotation-b*S.sun2.rotation)/(1-b);
  S.plan2.rotation = S.carrier.rotation*(1-bp) + bp*S.sun2.rotation;
  S.plan1.rotation = S.plan2.rotation;
  S.plan1.x = canvas.width/2  + (carrierRadius)*Math.cos(S.carrier.rotation);
  S.plan1.y = canvas.height/2 + (carrierRadius)*Math.sin(S.carrier.rotation);
  S.plan2.x = S.plan1.x
  S.plan2.y = S.plan1.y;

  S.sun2.draw(context);
  S.plan2.draw(context);
  S.sun1.draw(context);
  S.plan1.draw(context);
  S.carrier.draw(context);
}