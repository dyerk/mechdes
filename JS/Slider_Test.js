// Animate Planetary Gearset

window.onload = init;

// playing indicates whether an animation is currently playing, firstTime tells whether it is the first time a
// button has been clicked.

var playing1 = false;

var firstTime1 = true;

/**********************************************************************************************************************/
/* function init()
/* initializes javascript on html page
/**********************************************************************************************************************/
function init() {
// Initialize buttons on canvas


// Create shorthand variables for canvas and context

  var canvas1 = document.getElementById('canvas1');
  canvas1.mouse = captureMouse(canvas1);
  context1 = canvas1.getContext('2d');
  canvas1.context = context1;

  context1.font = "1em Source Sans Pro";
  context1.textAlign = "center";

  init_Slider(canvas1,context1);
  
  canvas1.x0 = 425;
  canvas1.y0 = 160;
  canvas1.addEventListener("mousedown", mousedown, false);
  canvas1.addEventListener("click", pushButtonClick, false); 
  context1.fillStyle = "#F0F0F0";
  context1.fillRect(10, 10, 240, 230);
  context1.fillRect(10, 250, 240, 60);
  context1.fillStyle = "#000000";
  context1.fillText("Drag the sliders to change speed",130,220);
  context1.fillText("Click a button to choose output",130,300);

  for (var i = 0; i < canvas1.slider.length; i++) {
    canvas1.slider[i].draw(context1);
  }

  shapes_CFSI = init_CFSI(canvas1);
  draw_CFSI(canvas1,context1,shapes_CFSI,0);
  play1.onclick = handle_CFSI(canvas1,context1,shapes_CFSI);
}
/**********************************************************************************************************************/
/* function sliderDraw
/* draws the sliders on the canvas
/**********************************************************************************************************************/
function init_Slider(canvas,context) {
 
  canvas.slider = new Array(2);  // create new slider(s)
  canvas.slider[0] = new slider(canvas,context,10,100,true,"Sun");
  canvas.slider[1] = new slider(canvas,context,10,100,true,"Ring");
  canvas.slider[2] = new slider(canvas,context,10,100,false,"Carrier");
  
  for (var i = 0; i < canvas.slider.length; i++) {
    canvas.slider[i].x = 60 + 70*i;
    canvas.slider[i].y = 110;
    canvas.slider[i].knob.x = canvas.slider[i].x;
    canvas.slider[i].knob.y = canvas.slider[i].y;
    canvas.slider[i].min = -20;
    canvas.slider[i].max =  20;
    canvas.slider[i].value = 5;
    canvas.slider[i].pushButton.x = canvas.slider[i].x;
    canvas.slider[i].pushButton.y = 270;
  }
}


/**********************************************************************************************************************/
/* function init_CFSI
/* initializes planetary gearset
/**********************************************************************************************************************/
function init_CFSI(canvas) {

  var sun      = new Gear(60,"#E93A90");
  var plan1    = new Gear(30,"#AFF53D");
  var plan2    = new Gear(30,"#AFF53D");
  var plan3    = new Gear(30,"#AFF53D");
  var ring     = new Ring(120,130,"#B6BD2F");
  var carrier1 = new Segment(90,10,"#808080");
  var carrier2 = new Segment(90,10,"#808080");
  var carrier3 = new Segment(90,10,"#808080");
  var cHub     = new Gear(10,"#000000",1);

  sun.x     = canvas.x0;
  sun.y     = canvas.y0;
  ring.x    = canvas.x0;
  ring.y    = canvas.y0;
  carrier1.x = canvas.x0;
  carrier1.y = canvas.y0;
  carrier2.x = canvas.x0;
  carrier2.y = canvas.y0;
  carrier3.x = canvas.x0;
  carrier3.y = canvas.y0;
  cHub.x = canvas.x0;
  cHub.y = canvas.y0;

  return {
    sun: sun,
    plan1: plan1,
    plan2: plan2,
    plan3: plan3,
    ring: ring,
    carrier1: carrier1,
    carrier2: carrier2,
    carrier3: carrier3,
    cHub: cHub
  };
}
/**********************************************************************************************************************/
/* function draw_CFSI
/* draws planetary gearset
/**********************************************************************************************************************/
function draw_CFSI(canvas,context,S,i) {

  context.clearRect(300,0,canvas.width-300,canvas.height);

  var angle = -i*2*Math.PI/360;
  var bps = -S.sun.radius/S.plan1.radius;
  var brs = -S.ring.innerRadius/S.sun.radius;

  var omega_s = -canvas.slider[0].value;
  var omega_r = -canvas.slider[1].value;
  var omega_c = -canvas.slider[2].value;

// omega_s = omega_c * (1-b) + b*omega_r
// omega_r = (1/b)*(omega_s + omega_c(b-1))
// omega_c = (omega_s - b*omega_r)/(1-b)
  if (!canvas.slider[0].isActive) {
    omega_s = omega_c * (1 - brs) + brs*omega_r;
  }
  if (!canvas.slider[1].isActive) {
    omega_r = (1/brs)*(omega_s + omega_c*(brs - 1));
  }  
  if (!canvas.slider[2].isActive) {
    omega_c = (omega_s - brs*omega_r)/(1-brs);
  }

  var omega_p = bps*omega_s + omega_c*(1-bps);
  S.sun.rotation     = S.sun.rotation + omega_s/1000;
  S.plan1.rotation   = S.plan1.rotation + omega_p/1000;
  S.plan2.rotation   = S.plan1.rotation;
  S.plan3.rotation   = S.plan1.rotation;
  S.ring.rotation    = S.ring.rotation + omega_r/1000;
  S.carrier1.rotation = S.carrier1.rotation + omega_c/1000;
  S.carrier2.rotation = S.carrier1.rotation + 2*Math.PI/3;
  S.carrier3.rotation = S.carrier1.rotation + 4*Math.PI/3;
  S.cHub.rotation = S.carrier1.rotation;
  
  S.plan1.x = canvas.x0 + (S.sun.radius + S.plan1.radius)*Math.cos(S.carrier1.rotation);
  S.plan1.y = canvas.y0 + (S.sun.radius + S.plan1.radius)*Math.sin(S.carrier1.rotation);
  S.plan2.x = canvas.x0 + (S.sun.radius + S.plan2.radius)*Math.cos(S.carrier2.rotation);
  S.plan2.y = canvas.y0 + (S.sun.radius + S.plan2.radius)*Math.sin(S.carrier2.rotation);
  S.plan3.x = canvas.x0 + (S.sun.radius + S.plan3.radius)*Math.cos(S.carrier3.rotation);
  S.plan3.y = canvas.y0 + (S.sun.radius + S.plan3.radius)*Math.sin(S.carrier3.rotation);

  S.ring.draw(context);
  S.sun.draw(context);
  S.plan1.draw(context);
  S.plan2.draw(context);
  S.plan3.draw(context);
  S.carrier1.draw(context);
  S.carrier2.draw(context);
  S.carrier3.draw(context);
  S.cHub.draw(context);
}
/**********************************************************************************************************************/
/* function handle_CFSI - toggles between play and pause, and initiates the animation upon first play
/**********************************************************************************************************************/
function handle_CFSI(canvas,context,S) {
  return function () {

    playing1 = !playing1;
    if (!playing1) {    
      document.getElementById("play1").value = "Play";
    } else {
      document.getElementById("play1").value = "Pause";
      if (firstTime1) {
        firstTime1 = false;
        var i = 0;
        function drawFrame () {
          if (!playing1) {
            return;
          } else {
            i += 2;
            draw_CFSI(canvas,context,S,i);
          }
        }
        var handle = window.setInterval(drawFrame, 500/60);
}}}}