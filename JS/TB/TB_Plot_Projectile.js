/**********************************************************************************************************************/
/* function plot_projectile - makes animated plot of projectile on canvas
/**********************************************************************************************************************/
function plot_projectile() {

  var effE  = treb.results.effE;
  var effR  = treb.results.effR;
  var effH  = treb.results.effH;
  var H2    = treb.results.H2;
  var vx0   = treb.results.vx0;
  var vy0   = treb.results.vy0;
  var tMax  = treb.results.tMax;
  var R     = treb.results.R;

  var g = treb.g;                           // gravitational constant
  var deltaT = tMax / 100;                  // divide into 100 time steps
  var projectile  = new Ball(0,"#D72D80");  // create projectile object
  projectile.radius = 10;

// calculate maximum horizontal range of projectile
  if (vx0 > 0) {               // Did we launch forwards?
    var xMin = 0;              // Projectile starts at zero.
    var xMax = vx0 * tMax;     // Horizontal range of flight based on initial velocity.
  } else {                     // Nope, we launched backwards.
    var xMin = vx0 * tMax;     // Projectile ends at xMin
    var xMax = 0;              // and starts at zero.
  }
  
// calculate maximum vertical range of projectile
  var yMin = 0;                      // projectile must land on ground
  if (vy0 > 0) {                     // Did we launch upwards?
    var yMax = (vy0*vy0)/(2*g) + H2; // Maximum vertical height based on launch velocity
  } else {                           // Nope, we launched downwards.
    var yMax = H2;                   // Maximum height is launch height.
  } 
  var alpha = Math.atan2(vy0,vx0);   // launch angle
    
// calculate starting position of projectile
  if (vx0 > 0) {              // Did we launch forwards?
    var x0 = 0;               // Starts at LHS of canvas.
  } else {                    // Nope, we launched backwards.
    var x0 = proj_can.width;  // Starts at RHS of canvas
  }
  var y0 = proj_can.height;   // Projectile starts at bottom of canvas at launch height
  
  plot_scale(grid_can,grid_ctx,xMin,xMax,yMin,yMax,80,20,100,70);  // Draw grid on canvas

  if (proj_can.height/(yMax - yMin) < proj_can.width/(xMax - xMin)) { // scale based upon max dims (vertical or horiz)
    var scale = proj_can.height/(yMax - yMin);
  } else {
    var scale = proj_can.width/(xMax - xMin);
  }
  
  var t = 0;  
  function drawFrame () {
    proj_ctx.clearRect(0,0,proj_can.width,proj_can.height);
    
    t += deltaT;                                           // increment time step
    projectile.x = scale * (vx0 * t) + x0;                 // x position of projectile
    projectile.y = scale * (0.5*g*t*t - vy0*t - H2) + y0;  // y position of projectile
    projectile.radius = 5;
    projectile.draw(proj_ctx,scale);                             // draw the projectile
    
    if (t < tMax - 0.9*deltaT) {  // draw the chain of dots following projectile
      grid_ctx.beginPath();       // put this on the grid canvas, not the projectile canvas
      grid_ctx.arc(projectile.x + 80, projectile.y + 20, 2, 0, Math.PI * 2, true);
      grid_ctx.fillStyle = "#B7F15B";
      grid_ctx.fill();

    } else {
      clearInterval(handle);
    }
  }
  var handle = setInterval(drawFrame, 2000*deltaT/tMax);

// draw text in upper right corner of canvas
  var xPos = 320;
  var yPos = 20;
  grid_ctx.clearRect(xPos,yPos,160,80);  // clear this rectangle on the canvas
  grid_ctx.fillStyle = "#F5FD60";
  grid_ctx.fillRect( xPos,yPos,160,80);   // draw a new white rectangle
  grid_ctx.font = "0.8em Source Sans Pro";
  grid_ctx.textAlign = "right";
  if (vx0 > 0) {
    grid_ctx.fillStyle = "#599000";
    grid_ctx.fillText("Range: " +           Math.round(R*100)/100 +                    "m",xPos+150,yPos+12);
  } else {
    grid_ctx.fillStyle = "#D72D80";
    grid_ctx.fillText("Range: " +           Math.round(R*100)/100 +                    "m",xPos+150,yPos+12);
  }
  grid_ctx.fillText("Launch Angle: " +      Math.round(alpha*180*100/Math.PI)/100 + " deg",xPos+150,yPos+27);
  grid_ctx.fillText("Energy Efficiency: " + Math.round(effE*100*100)/100 +            " %",xPos+150,yPos+42);
  grid_ctx.fillText("Range Efficiency: " +  Math.round(effR*100*100)/100 +            " %",xPos+150,yPos+57);
  grid_ctx.fillText("Height Efficiency: " + Math.round(effH*100*100)/100 +            " %",xPos+150,yPos+72);
}