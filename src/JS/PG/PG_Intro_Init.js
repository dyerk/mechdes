/**********************************************************************************************************************/
/* function init_CFSI - initializes gears for sun, ring, planet, carrier
/**********************************************************************************************************************/
function init_CFSI(canvas,context) {

  var sun     = new Gear(40,"#E93A90");
  var plan    = new Gear(20,"#AFF53D");
  var ring    = new Ring(80,90,"#B6BD2F");
  var carrier = new Segment(60,10,"#808080");

  sun.x     = canvas.width/2;
  sun.y     = canvas.height/2;
  ring.x    = canvas.width/2;
  ring.y    = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;
  plan.x = canvas.width/2 + sun.radius + plan.radius;
  plan.y = canvas.height/2;

  return {
    sun: sun,
    plan: plan,
    ring: ring,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_CFRI - initializes gears for sun, ring, planet, carrier
/**********************************************************************************************************************/
function init_CFRI(canvas,context) {

  var sun     = new Gear(40,"#E93A90");
  var plan    = new Gear(20,"#AFF53D");
  var ring    = new Ring(80,90,"#B6BD2F");
  var carrier = new Segment(60,10,"#808080");

  sun.x     = canvas.width/2;
  sun.y     = canvas.height/2;
  ring.x    = canvas.width/2;
  ring.y    = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;
  plan.x = canvas.width/2 + sun.radius + plan.radius;
  plan.y = canvas.height/2;

  return {
    sun: sun,
    plan: plan,
    ring: ring,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_SFCI - initializes gears for sun, ring, planet, carrier
/**********************************************************************************************************************/
function init_SFCI(canvas,context) {

  var sun     = new Gear(40,"#E93A90");
  var plan    = new Gear(20,"#AFF53D");
  var ring    = new Ring(80,90,"#B6BD2F");
  var carrier = new Segment(60,10,"#808080");

  sun.x     = canvas.width/2;
  sun.y     = canvas.height/2;
  ring.x    = canvas.width/2;
  ring.y    = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;

  return {
    sun: sun,
    plan: plan,
    ring: ring,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_SFRI - initializes gears for sun, ring, planet, carrier
/**********************************************************************************************************************/
function init_SFRI(canvas,context) {

  var sun     = new Gear(40,"#E93A90");
  var plan    = new Gear(20,"#AFF53D");
  var ring    = new Ring(80,90,"#B6BD2F");
  var carrier = new Segment(60,10,"#808080");

  sun.x     = canvas.width/2;
  sun.y     = canvas.height/2;
  ring.x    = canvas.width/2;
  ring.y    = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;

  return {
    sun: sun,
    plan: plan,
    ring: ring,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_RFSI - initializes gears for sun, ring, planet, carrier
/**********************************************************************************************************************/
function init_RFSI(canvas,context) {

  var sun     = new Gear(40,"#E93A90");
  var plan    = new Gear(20,"#AFF53D");
  var ring    = new Ring(80,90,"#B6BD2F");
  var carrier = new Segment(60,10,"#808080");

  sun.x     = canvas.width/2;
  sun.y     = canvas.height/2;
  ring.x    = canvas.width/2;
  ring.y    = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;

  return {
    sun: sun,
    plan: plan,
    ring: ring,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_RFCI - initializes gears for sun, ring, planet, carrier
/**********************************************************************************************************************/
function init_RFCI(canvas,context) {

  var sun     = new Gear(40,"#E93A90");
  var plan    = new Gear(20,"#AFF53D");
  var ring    = new Ring(80,90,"#B6BD2F");
  var carrier = new Segment(60,10,"#808080");

  sun.x     = canvas.width/2;
  sun.y     = canvas.height/2;
  ring.x    = canvas.width/2;
  ring.y    = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;

  return {
    sun: sun,
    plan: plan,
    ring: ring,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_two_input
/* initializes planetary gearset
/**********************************************************************************************************************/
function init_two_input(canvas) {

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