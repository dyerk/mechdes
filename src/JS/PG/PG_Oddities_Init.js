/**********************************************************************************************************************/
/* function init_SR2P1 - initializes gears for sun, ring, two planets (1)
/**********************************************************************************************************************/
function init_SR2P1(canvas,context) {
  var sun  = new Gear(32,"#ab5c00",1.00);
  var plan1  = new Gear(16,"#ffff00",1.00);
  var plan2  = new Gear(24,"#00ff00",1.00);
  var ring    = new Ring(72,82,"#00ddff");
  var carrier = new Segment(48,10,"#808080");
      
  sun.x     = canvas.width/2;
  sun.y     = canvas.height/2;
  plan1.x   = canvas.width/2 + sun.radius + plan1.radius;
  plan1.y   = canvas.height/2;
  plan2.x   = plan1.x;
  plan2.y   = plan1.y;
  ring.x    = canvas.width/2;
  ring.y    = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;

  return {
    sun:   sun,
    plan1: plan1,
    plan2: plan2,
    ring:  ring,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_SR2P2 - initializes gears for sun, ring, two planets (2)
/**********************************************************************************************************************/
function init_SR2P2(canvas,context) {
  var sun     = new Gear(16,"#ffff00",1.00);
  var plan1   = new Gear(24,"#00ff00",1.00);  
  var plan2   = new Gear(24,"#00aa00",1.00); 
  var ring    = new Ring(112,122,"#00dd00"); 
  var carrier = new Segment2(88,10,40,"#808080");   

  sun.x  = canvas.width/2;
  sun.y  = canvas.height/2;
  ring.x  = canvas.width/2;
  ring.y  = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;

  return {
    sun:   sun,
    plan1: plan1,
    plan2: plan2,
    ring:  ring,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_SR3P1 - initializes gears for sun, ring, three planets (1)
/**********************************************************************************************************************/
function init_SR3P1(canvas,context) {
  var sun      = new Gear(24,"#00ff00",1.00);
  var plan1    = new Gear(24,"#00aa00",1.00);
  var plan2    = new Gear(16,"#ffff00",1.00);
  var plan3    = new Gear(24,"#006600",1.00);
  var ring     = new Ring(112,122,"#00dd00");
  var carrier  = new Segment2(88,10,48,"#808080");
  
  sun.x  = canvas.width/2;
  sun.y  = canvas.height/2;
  ring.x  = canvas.width/2;
  ring.y  = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;
  
  return {
    sun:   sun,
    plan1: plan1,
    plan2: plan2,
    plan3: plan3,
    ring:  ring,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_SR3P2 - initializes gears for sun, ring, three planets (2)
/**********************************************************************************************************************/
function init_SR3P2(canvas,context) {
  var sun      = new Gear(24,"#00ff00",1.00);
  var plan1    = new Gear(24,"#00aa00",1.00);
  var plan2    = new Gear(16,"#ffff00",1.00);
  var plan3    = new Gear(24,"#006600",1.00);
  var ring     = new Ring(112,122,"#00dd00");
  var carrier  = new Segment2(88,10,48,"#808080");

  sun.x  = canvas.width/2;
  sun.y  = canvas.height/2;
  ring.x  = canvas.width/2;
  ring.y  = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;
    
  return {
    sun:   sun,
    plan1: plan1,
    plan2: plan2,
    plan3: plan3,
    ring:  ring,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_SR4P - initializes gears for sun, ring, four planets
/**********************************************************************************************************************/
function init_SR4P(canvas,context) {
  var sun      = new Gear(32,"#ab5c00",1.00);
  var plan1    = new Gear(24,"#00ff00",1.00);
  var plan2    = new Gear(16,"#ffff00",1.00);
  var plan3    = new Gear(16,"#dddd00",1.00);
  var plan4    = new Gear(24,"#00aa00",1.00);
  var ring     = new Ring(112,122,"#00dd00");
  var carrier  = new Segment2(88,10,56,"#808080");
  
  sun.x  = canvas.width/2;
  sun.y  = canvas.height/2;
  ring.x  = canvas.width/2;
  ring.y  = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;
  
  return {
    sun:   sun,
    plan1: plan1,
    plan2: plan2,
    plan3: plan3,
    plan4: plan4,
    ring:  ring,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_2R2P - initializes gears for two rings, two planets
/**********************************************************************************************************************/
function init_2R2P(canvas,context) {
  var ring1   = new Ring(72,82,"#00ddff");
  var plan1   = new Gear(16,"#ffff00",1.00);
  var plan2   = new Gear(56,"#aa0000",1.00); 
  var ring2   = new Ring(112,122,"#00dd00");   
  var carrier = new Segment(56,10,"#808080");
  
  ring1.x  = canvas.width/2;
  ring1.y  = canvas.height/2;
  ring2.x  = canvas.width/2;
  ring2.y  = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;
  
  return {
    ring1: ring1,
    plan1: plan1,
    plan2: plan2,
    ring2: ring2,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_2R3P - initializes gears for two rings, three planets
/**********************************************************************************************************************/
function init_2R3P(canvas,context) {
  var ring1   = new Ring(72,82,"#00ddff");
  var plan1   = new Gear(24,"#00ff00",1.00);  
  var plan2   = new Gear(16,"#ffff00",1.00);
  var plan3   = new Gear(24,"#00aa00",1.00);  
  var ring2   = new Ring(112,122,"#00dd00");
  var carrier = new Segment2(88,10,48,"#808080");
  
  ring1.x  = canvas.width/2;
  ring1.y  = canvas.height/2;
  ring2.x  = canvas.width/2;
  ring2.y  = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;
  
  return {
    ring1: ring1,
    plan1: plan1,
    plan2: plan2,
    plan3: plan3,
    ring2: ring2,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_2R4P - initializes gears for two rings, four planets
/**********************************************************************************************************************/
function init_2R4P(canvas,context) {
  var ring1   = new Ring(48,53,"#00ddff");
  var plan1   = new Gear(16,"#ffff00",1.00);
  var plan2   = new Gear(24,"#00ff00",1.00);  
  var plan3   = new Gear(24,"#00aa00",1.00);
  var plan4   = new Gear(32,"#ab5c00",1.00);
  var ring2   = new Ring(112,122,"#00dd00");
  var carrier = new Segment2(80,10,32,"#808080");
   
  ring1.x  = canvas.width/2;
  ring1.y  = canvas.height/2;
  ring2.x  = canvas.width/2;
  ring2.y  = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;
  
  return {
    ring1: ring1,
    plan1: plan1,
    plan2: plan2,
    plan3: plan3,
    plan4: plan4,
    ring2: ring2,
    carrier: carrier
  };     
}
/**********************************************************************************************************************/
/* function init_2S3P - initializes gears for two suns, three planets
/**********************************************************************************************************************/
function init_2S3P(canvas,context) {
  var sun1    = new Gear(16,"#ffff00",1.00);
  var plan1   = new Gear(24,"#00ff00",1.00);
  var plan2   = new Gear(16,"#dddd00",1.00);
  var plan3   = new Gear(32,"#ab5c00",1.00);
  var sun2    = new Gear(48,"#aa0000",1.00);
  var carrier = new Segment2(80,10,40,"#808080");

  sun1.x  = canvas.width/2;
  sun1.y  = canvas.height/2;
  sun2.x  = canvas.width/2;
  sun2.y  = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;
  
  return {
    sun1:  sun1,
    plan1: plan1,
    plan2: plan2,
    plan3: plan3,
    sun2:  sun2,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_2S4P - initializes gears for two suns, four planets
/**********************************************************************************************************************/
function init_2S4P(canvas,context) {
  var sun1    = new Gear(16,"#ffff00",1.00);
  var plan1   = new Gear(24,"#00ff00",1.00);  
  var plan2   = new Gear(16,"#dddd00",1.00);
  var plan3   = new Gear(16,"#aaaa00",1.00); 
  var plan4   = new Gear(24,"#00aa00",1.00);
  var sun2    = new Gear(48,"#aa0000",1.00);
  var carrier = new Segment2(72,10,40,"#808080");
 
  sun1.x  = canvas.width/2;
  sun1.y  = canvas.height/2;
  sun2.x  = canvas.width/2;
  sun2.y  = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;
   
  return {
    sun1:  sun1,
    plan1: plan1,
    plan2: plan2,
    plan3: plan3,
    plan4: plan4,
    sun2:  sun2,
    carrier: carrier
  };
}
/**********************************************************************************************************************/
/* function init_2R2S - initializes gears for two rings, two suns
/**********************************************************************************************************************/
function init_2R2S(canvas,context) {
  var sun1    = new Gear(16,"#ffff00",1.00);
  var ring1   = new Ring(64,70,"#00ddff");  
  var ring2   = new Ring(80,86,"#00dd00");  
  var sun2    = new Gear(32,"#aa0000",1.00);
  var carrier = new Segment(56,10,"#808080");

  sun1.x  = canvas.width/2;
  sun1.y  = canvas.height/2;
  sun2.x  = canvas.width/2;
  sun2.y  = canvas.height/2;
  carrier.x = canvas.width/2;
  carrier.y = canvas.height/2;
  
  return {
    sun1:  sun1,
    ring1: ring1,
    ring2: ring2,
    sun2:  sun2,
    carrier: carrier
  };
}



