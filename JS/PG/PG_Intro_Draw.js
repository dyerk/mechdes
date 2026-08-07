/**********************************************************************************************************************/
/* function draw_CFSI - draw sun, ring, planet, carrier on canvas
/**********************************************************************************************************************/
function draw_CFSI(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bps = -S.sun.radius/S.plan.radius;
  var brs = -S.ring.innerRadius/S.sun.radius;

  S.sun.rotation = angle;
  S.plan.rotation = bps*S.sun.rotation;
  S.ring.rotation = S.sun.rotation/brs;

  S.ring.draw(context);
  S.sun.draw(context);
  S.plan.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_CFRI - draw sun, ring, planet, carrier on canvas
/**********************************************************************************************************************/
function draw_CFRI(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bps = -S.sun.radius/S.plan.radius;
  var brs = -S.ring.innerRadius/S.sun.radius;

  S.ring.rotation = angle;    // input is ring
  S.plan.rotation = S.ring.rotation*S.ring.innerRadius/S.plan.radius;
  S.sun.rotation = S.ring.rotation*brs;

  S.ring.draw(context);
  S.sun.draw(context);
  S.plan.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_SFCI - draw sun, ring, planet, carrier on canvas
/**********************************************************************************************************************/
function draw_SFCI(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bps = -S.sun.radius/S.plan.radius;
  var brs = -S.ring.innerRadius/S.sun.radius;
  
  S.carrier.rotation = angle; // input is carrier
  S.ring.rotation = (S.carrier.rotation/brs)*(brs - 1);
  S.plan.rotation = S.carrier.rotation*(1-bps);

  S.plan.x = canvas.width/2  + (S.sun.radius + S.plan.radius)*Math.cos(S.carrier.rotation);
  S.plan.y = canvas.height/2 + (S.sun.radius + S.plan.radius)*Math.sin(S.carrier.rotation);
      
  S.ring.draw(context);
  S.sun.draw(context);
  S.plan.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_SFRI - draw sun, ring, planet, carrier on canvas
/**********************************************************************************************************************/
function draw_SFRI(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bps = -S.sun.radius/S.plan.radius;
  var brs = -S.ring.innerRadius/S.sun.radius;
  
  S.ring.rotation = angle;    // input is ring
  S.carrier.rotation = -brs*S.ring.rotation/(1-brs);
  S.plan.rotation = S.carrier.rotation*(1-bps);

  S.plan.x = canvas.width/2  + (S.sun.radius + S.plan.radius)*Math.cos(S.carrier.rotation);
  S.plan.y = canvas.height/2 + (S.sun.radius + S.plan.radius)*Math.sin(S.carrier.rotation);
  
  S.ring.draw(context);
  S.sun.draw(context);
  S.plan.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_RFSI - draw sun, ring, planet, carrier on canvas
/**********************************************************************************************************************/
function draw_RFSI(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bps = -S.sun.radius/S.plan.radius;
  var brs = -S.ring.innerRadius/S.sun.radius;
  
  S.sun.rotation = angle;     // input is sun
  S.carrier.rotation = angle/(1-brs);
  S.plan.rotation = S.carrier.rotation*(1-bps)+bps*S.sun.rotation;

  S.plan.x = canvas.width/2  + (S.sun.radius + S.plan.radius)*Math.cos(S.carrier.rotation);
  S.plan.y = canvas.height/2 + (S.sun.radius + S.plan.radius)*Math.sin(S.carrier.rotation);
      
  S.ring.draw(context);
  S.sun.draw(context);
  S.plan.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_RFCI - draw sun, ring, planet, carrier on canvas
/**********************************************************************************************************************/
function draw_RFCI(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bps = -S.sun.radius/S.plan.radius;
  var brs = -S.ring.innerRadius/S.sun.radius;

  S.carrier.rotation = angle; // input is carrier
  S.sun.rotation = S.carrier.rotation*(1-brs);
  S.plan.rotation = S.carrier.rotation*(1-bps)+bps*S.sun.rotation;

  S.plan.x = canvas.width/2  + (S.sun.radius + S.plan.radius)*Math.cos(S.carrier.rotation);
  S.plan.y = canvas.height/2 + (S.sun.radius + S.plan.radius)*Math.sin(S.carrier.rotation);
      
  S.ring.draw(context);
  S.sun.draw(context);
  S.plan.draw(context);
  S.carrier.draw(context); 
}
/**********************************************************************************************************************/
/* function draw_two_input
/* draws planetary gearset with two inputs
/**********************************************************************************************************************/
function draw_two_input(canvas,context,S,i) {

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