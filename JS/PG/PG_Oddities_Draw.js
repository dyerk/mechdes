/**********************************************************************************************************************/
/* function draw_SR2P1 - draw sun, ring, two planets (1) on canvas
/**********************************************************************************************************************/
function draw_SR2P1(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);

  var angle = -i*2*Math.PI/360;
  var bp = (S.ring.innerRadius/S.plan2.radius);
  var b  = bp * (-S.plan1.radius/S.sun.radius);
  var carrierRadius = S.sun.radius + S.plan1.radius;
  
  S.sun.rotation = angle;
  S.carrier.rotation = (S.sun.rotation - b*S.ring.rotation)/(1-b);
  S.plan2.rotation = S.carrier.rotation*(1-bp) + bp*S.ring.rotation;
  S.plan1.rotation = S.plan2.rotation;
  S.plan2.x = canvas.width/2  + (carrierRadius)*Math.cos(S.carrier.rotation);
  S.plan2.y = canvas.height/2 + (carrierRadius)*Math.sin(S.carrier.rotation);
  S.plan1.x = S.plan2.x
  S.plan1.y = S.plan2.y;

  S.ring.draw(context);
  S.sun.draw(context);
  S.plan2.draw(context);
  S.plan1.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_SR2P2 - draw sun, ring, two planets (2) on canvas
/**********************************************************************************************************************/
function draw_SR2P2(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bp2 = S.ring.innerRadius/S.plan2.radius;
  var bp1 = bp2 * (-S.plan2.radius/S.plan1.radius);
  var b   = bp1 * (-S.plan1.radius/S.sun.radius);
  var carrierRadius1 = S.sun.radius + S.plan1.radius;
  var carrierRadius2 = carrierRadius1 + S.plan1.radius + S.plan2.radius;

  S.sun.rotation = angle;
  S.carrier.rotation = (S.sun.rotation-b*S.ring.rotation)/(1-b);
  S.plan2.rotation = S.carrier.rotation*(1-bp2) + bp2*S.ring.rotation;
  S.plan1.rotation = S.carrier.rotation*(1-bp1) + bp1*S.ring.rotation;
  S.plan2.x = canvas.width/2  + (carrierRadius2)*Math.cos(S.carrier.rotation);
  S.plan2.y = canvas.height/2 + (carrierRadius2)*Math.sin(S.carrier.rotation);
  S.plan1.x = canvas.width/2  + (carrierRadius1)*Math.cos(S.carrier.rotation);
  S.plan1.y = canvas.height/2 + (carrierRadius1)*Math.sin(S.carrier.rotation);

  S.ring.draw(context);
  S.plan2.draw(context);
  S.plan1.draw(context);
  S.sun.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_SR3P1 - draw sun, ring, three planets (1) on canvas
/**********************************************************************************************************************/
function draw_SR3P1(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bp1 = (S.ring.innerRadius/S.plan3.radius);
  var bp2 = bp1 * (-S.plan3.radius/S.plan2.radius);
  var b   = bp2 * (-S.plan1.radius/S.sun.radius);
  var carrierRadius1 = S.sun.radius + S.plan1.radius;
  var carrierRadius2 = carrierRadius1 + S.plan2.radius + S.plan3.radius;

  S.sun.rotation = angle;
  S.carrier.rotation = (S.sun.rotation-b*S.ring.rotation)/(1-b);
  S.plan3.rotation = S.carrier.rotation*(1-bp1) + bp1*S.ring.rotation;
  S.plan2.rotation = S.carrier.rotation*(1-bp2) + bp2*S.ring.rotation;
  S.plan1.rotation = S.plan2.rotation;
  S.plan3.x = canvas.width/2  + (carrierRadius2)*Math.cos(S.carrier.rotation);
  S.plan3.y = canvas.height/2 + (carrierRadius2)*Math.sin(S.carrier.rotation);
  S.plan2.x = canvas.width/2  + (carrierRadius1)*Math.cos(S.carrier.rotation);
  S.plan2.y = canvas.height/2 + (carrierRadius1)*Math.sin(S.carrier.rotation);
  S.plan1.x = S.plan2.x;
  S.plan1.y = S.plan2.y;

  S.ring.draw(context);
  S.plan1.draw(context);
  S.plan2.draw(context);
  S.plan3.draw(context);
  S.sun.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_SR3P2 - draw sun, ring, three planets (2) on canvas
/**********************************************************************************************************************/
function draw_SR3P2(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bp1 = (S.ring.innerRadius/S.plan3.radius);
  var bp2 = bp1 * (-S.plan2.radius/S.plan1.radius);
  var b   = bp2 * (-S.plan1.radius/S.sun.radius);
  var carrierRadius1 = S.sun.radius + S.plan1.radius;
  var carrierRadius2 = carrierRadius1 + S.plan2.radius + S.plan3.radius;

  S.sun.rotation = angle;
  S.carrier.rotation = (S.sun.rotation-b*S.ring.rotation)/(1-b);
  S.plan3.rotation = S.carrier.rotation*(1-bp1) + bp1*S.ring.rotation;
  S.plan2.rotation = S.plan3.rotation;
  S.plan1.rotation = S.carrier.rotation*(1-bp2) + bp2*S.ring.rotation
  S.plan3.x = canvas.width/2  + (carrierRadius2)*Math.cos(S.carrier.rotation);
  S.plan3.y = canvas.height/2 + (carrierRadius2)*Math.sin(S.carrier.rotation);
  S.plan2.x = S.plan3.x;
  S.plan2.y = S.plan3.y;
  S.plan1.x = canvas.width/2  + (carrierRadius1)*Math.cos(S.carrier.rotation);
  S.plan1.y = canvas.height/2 + (carrierRadius1)*Math.sin(S.carrier.rotation);

  S.ring.draw(context);
  S.plan3.draw(context);
  S.plan1.draw(context);
  S.plan2.draw(context);
  S.sun.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_SR4P - draw sun, ring, four planets on canvas
/**********************************************************************************************************************/
function draw_SR4P(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bp1 = (S.ring.innerRadius/S.plan4.radius);
  var bp2 = bp1 * (-S.plan3.radius/S.plan2.radius);
  var b   = bp2 * (-S.plan1.radius/S.sun.radius);
  var carrierRadius1 = S.sun.radius + S.plan1.radius;
  var carrierRadius2 = carrierRadius1 + S.plan2.radius + S.plan3.radius;

  S.sun.rotation = angle;
  S.carrier.rotation = (S.sun.rotation-b*S.ring.rotation)/(1-b);
  S.plan4.rotation = S.carrier.rotation*(1-bp1) + bp1*S.ring.rotation;
  S.plan3.rotation = S.plan4.rotation;
  S.plan2.rotation = S.carrier.rotation*(1-bp2) + bp2*S.ring.rotation;
  S.plan1.rotation = S.plan2.rotation;
  S.plan4.x = canvas.width/2  + (carrierRadius2)*Math.cos(S.carrier.rotation);
  S.plan4.y = canvas.height/2 + (carrierRadius2)*Math.sin(S.carrier.rotation);
  S.plan3.x = S.plan4.x;
  S.plan3.y = S.plan4.y;
  S.plan2.x = canvas.width/2  + (carrierRadius1)*Math.cos(S.carrier.rotation);
  S.plan2.y = canvas.height/2 + (carrierRadius1)*Math.sin(S.carrier.rotation);
  S.plan1.x = S.plan2.x;
  S.plan1.y = S.plan2.y;

  S.ring.draw(context);
  S.plan4.draw(context);
  S.plan1.draw(context);
  S.plan2.draw(context);
  S.plan3.draw(context);
  S.sun.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_2R2P - draw two rings, two planets on canvas
/**********************************************************************************************************************/
function draw_2R2P(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bp = (S.ring2.innerRadius/S.plan2.radius);
  var b = bp * (S.plan1.radius/S.ring1.innerRadius);
  var carrierRadius = S.ring2.innerRadius - S.plan2.radius;

  S.ring1.rotation = angle;
  S.carrier.rotation = (S.ring1.rotation-b*S.ring2.rotation)/(1-b);
  S.plan2.rotation = S.carrier.rotation*(1-bp) + bp*S.ring2.rotation;
  S.plan1.rotation = S.plan2.rotation;
  S.plan2.x = canvas.width/2  + (carrierRadius)*Math.cos(S.carrier.rotation);
  S.plan2.y = canvas.height/2 + (carrierRadius)*Math.sin(S.carrier.rotation);
  S.plan1.x = S.plan2.x;
  S.plan1.y = S.plan2.y;

  S.ring2.draw(context);
  S.plan2.draw(context);
  S.plan1.draw(context);
  S.ring1.draw(context);
  S.carrier.draw(context)  
}
/**********************************************************************************************************************/
/* function draw_2R3P - draw two rings, three planets on canvas
/**********************************************************************************************************************/
function draw_2R3P(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bp2 = (S.ring2.innerRadius/S.plan3.radius);
  var bp1 = bp2 * (-S.plan3.radius/S.plan2.radius)
  var b   = bp1 * (S.plan1.radius/S.ring1.innerRadius);
  var carrierRadius2 = S.ring2.innerRadius - S.plan3.radius;
  var carrierRadius1 = S.ring1.innerRadius - S.plan1.radius;

  S.ring1.rotation = angle;
  S.carrier.rotation = (S.ring1.rotation-b*S.ring2.rotation)/(1-b);
  S.plan3.rotation = S.carrier.rotation*(1-bp2) + bp2*S.ring2.rotation;
  S.plan2.rotation = S.carrier.rotation*(1-bp1) + bp1*S.ring2.rotation;
  S.plan1.rotation = S.plan2.rotation;
  S.plan3.x = canvas.width/2  + (carrierRadius2)*Math.cos(S.carrier.rotation);
  S.plan3.y = canvas.height/2 + (carrierRadius2)*Math.sin(S.carrier.rotation);
  S.plan2.x = canvas.width/2  + (carrierRadius1)*Math.cos(S.carrier.rotation);
  S.plan2.y = canvas.height/2 + (carrierRadius1)*Math.sin(S.carrier.rotation);
  S.plan1.x = S.plan2.x;
  S.plan1.y = S.plan2.y;

  S.ring2.draw(context);
  S.plan1.draw(context);
  S.ring1.draw(context);
  S.plan3.draw(context);
  S.plan2.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_2R4P - draw two rings, four planets on canvas
/**********************************************************************************************************************/
function draw_2R4P(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bp2 = (S.ring2.innerRadius/S.plan4.radius);
  var bp1 = bp2 * (-S.plan3.radius/S.plan2.radius)
  var b   = bp1 * (S.plan1.radius/S.ring1.innerRadius);
  var carrierRadius2 = S.ring2.innerRadius - S.plan4.radius;
  var carrierRadius1 = S.ring1.innerRadius - S.plan1.radius;

  S.ring1.rotation = angle;
  S.carrier.rotation = (S.ring1.rotation-b*S.ring2.rotation)/(1-b);
  S.plan3.rotation = S.carrier.rotation*(1-bp2) + bp2*S.ring2.rotation;
  S.plan2.rotation = S.carrier.rotation*(1-bp1) + bp1*S.ring2.rotation;
  S.plan1.rotation = S.plan2.rotation;
  S.plan4.rotation = S.plan3.rotation;
  S.plan3.x = canvas.width/2  + (carrierRadius2)*Math.cos(S.carrier.rotation);
  S.plan3.y = canvas.height/2 + (carrierRadius2)*Math.sin(S.carrier.rotation);
  S.plan2.x = canvas.width/2  + (carrierRadius1)*Math.cos(S.carrier.rotation);
  S.plan2.y = canvas.height/2 + (carrierRadius1)*Math.sin(S.carrier.rotation);
  S.plan1.x = S.plan2.x;
  S.plan1.y = S.plan2.y;
  S.plan4.x = S.plan3.x;
  S.plan4.y = S.plan3.y;

  S.ring2.draw(context);
  S.plan4.draw(context);
  S.plan2.draw(context);
  S.plan3.draw(context);
  S.plan1.draw(context);
  S.ring1.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_2S3P - draw two suns, three planets on canvas
/**********************************************************************************************************************/
function draw_2S3P(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bp2 = (-S.sun2.radius/S.plan3.radius);
  var bp1 = bp2 * (-S.plan2.radius/S.plan1.radius)
  var b   = bp1 * (-S.plan1.radius/S.sun1.radius);
  var carrierRadius1 = S.sun1.radius + S.plan1.radius;
  var carrierRadius2 = carrierRadius1 + S.plan1.radius + S.plan2.radius;

  S.sun1.rotation = angle;
  S.carrier.rotation = (S.sun1.rotation-b*S.sun2.rotation)/(1-b);
  S.plan3.rotation = S.carrier.rotation*(1-bp2) + bp2*S.sun2.rotation;
  S.plan2.rotation = S.plan3.rotation;
  S.plan1.rotation = S.carrier.rotation*(1-bp1) + bp1*S.sun2.rotation;
  S.plan3.x = canvas.width/2  + (carrierRadius2)*Math.cos(S.carrier.rotation);
  S.plan3.y = canvas.height/2 + (carrierRadius2)*Math.sin(S.carrier.rotation);
  S.plan2.x = S.plan3.x;
  S.plan2.y = S.plan3.y;
  S.plan1.x = canvas.width/2  + (carrierRadius1)*Math.cos(S.carrier.rotation);
  S.plan1.y = canvas.height/2 + (carrierRadius1)*Math.sin(S.carrier.rotation);

  S.sun2.draw(context);
  S.plan3.draw(context);
  S.plan2.draw(context);
  S.plan1.draw(context);
  S.sun1.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_2S4P - draw two suns, four planets on canvas
/**********************************************************************************************************************/
function draw_2S4P(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bp2 = (-S.sun2.radius/S.plan4.radius);
  var bp1 = bp2 * (-S.plan3.radius/S.plan2.radius)
  var b   = bp1 * (-S.plan1.radius/S.sun1.radius);
  var carrierRadius1 = S.sun1.radius + S.plan1.radius;
  var carrierRadius2 = carrierRadius1 + S.plan2.radius + S.plan3.radius;

  S.sun1.rotation = angle;
  S.carrier.rotation = (S.sun1.rotation-b*S.sun2.rotation)/(1-b);
  S.plan4.rotation = S.carrier.rotation*(1-bp2) + bp2*S.sun2.rotation;
  S.plan3.rotation = S.plan4.rotation;
  S.plan2.rotation = S.carrier.rotation*(1-bp1) + bp1*S.sun2.rotation;
  S.plan1.rotation = S.plan2.rotation;
  S.plan4.x = canvas.width/2  + (carrierRadius2)*Math.cos(S.carrier.rotation);
  S.plan4.y = canvas.height/2 + (carrierRadius2)*Math.sin(S.carrier.rotation);
  S.plan3.x = S.plan4.x;
  S.plan3.y = S.plan4.y;
  S.plan2.x = canvas.width/2  + (carrierRadius1)*Math.cos(S.carrier.rotation);
  S.plan2.y = canvas.height/2 + (carrierRadius1)*Math.sin(S.carrier.rotation);
  S.plan1.x = S.plan2.x;
  S.plan1.y = S.plan2.y;

  S.sun2.draw(context);
  S.plan4.draw(context);
  S.plan1.draw(context);
  S.sun1.draw(context);
  S.plan2.draw(context);
  S.plan3.draw(context);
  S.carrier.draw(context);
}
/**********************************************************************************************************************/
/* function draw_2R2S - draw two rings, two suns on canvas
/**********************************************************************************************************************/
function draw_2R2S(canvas,context,S,i) {

  context.clearRect(0,0,canvas.width,canvas.height);
  
  var angle = -i*2*Math.PI/360;
  var bp = S.sun2.radius/S.ring2.innerRadius;
  var b  = bp * (S.ring1.innerRadius/S.sun1.radius);
  var carrierRadius = S.ring1.innerRadius - S.sun1.radius;

  S.sun1.rotation = angle;
  S.carrier.rotation = (S.sun1.rotation-b*S.sun2.rotation)/(1-b);
  S.ring2.rotation = S.carrier.rotation*(1-bp) + bp*S.sun2.rotation;
  S.ring1.rotation = S.ring2.rotation;
  S.ring1.x = canvas.width/2  + (carrierRadius)*Math.cos(S.carrier.rotation);
  S.ring1.y = canvas.height/2 + (carrierRadius)*Math.sin(S.carrier.rotation);
  S.ring2.x = S.ring1.x;
  S.ring2.y = S.ring1.y;

  S.ring2.draw(context);
  S.sun2.draw(context);
  S.sun1.draw(context);
  S.ring1.draw(context);
  S.carrier.draw(context);
}

