/**********************************************************************************************************************/
/* captureMouse - obtains x and y coordinates for mouse on canvas
/**********************************************************************************************************************/
captureMouse = function (element) {
  var mouse = { x: 0, y: 0 };

  element.addEventListener('mousemove', function (event) {
    var rect = element.getBoundingClientRect();
    // Scale event coordinates to internal canvas resolution
    mouse.x = (event.clientX - rect.left) * (element.width / rect.width);
    mouse.y = (event.clientY - rect.top) * (element.height / rect.height);
  }, false);

  return mouse;
};
/**********************************************************************************************************************/
/* slider - creates a slider control on the canvas
/**********************************************************************************************************************/
function slider(canvas,context,width,height,isActive,isButton,sliderText) {
  this.isActive = isActive;  // is the slider active?
  this.isButton = isButton;  // is there a pushbutton?
  this.width = width;        // rectangle width
  this.height = height;      // rectangle height
  this.x = 0;                // x coordinate of center of rectangle
  this.y = 0;                // y coordinate of center of rectangle
  this.min = 0;              // minimum value of slider
  this.max = 0;              // maximum value of slider
  this.sliderText = sliderText;
  
  this.knob = new knob(20,10,isActive);
  this.pushButton = new pushButton(8,isActive)
};
slider.prototype.draw = function(context) {
  var w = this.width/2;        // half width of rectangle
  var h = this.height/2;       // half height of rectangle
  var W = this.knob.width/2;   // half height of knob
  var H = this.knob.height/2;  // half height of knob

  context.clearRect(this.x - W - 20, this.y - h - H - 30 , 2*W+40, 2*h + 2*H + 60);
  if (this.isActive) {
    context.fillStyle = "#F7FE72";
    this.pushButton.isActive = false;
    this.knob.isActive = false;
  } else {
    context.fillStyle = "#DDDDDD";
    this.pushButton.isActive = true;
    this.knob.isActive = true;
  }
  context.fillRect(this.x - w, this.y - h, 2*w, 2*h);
  context.rect(this.x - w, this.y - h, 2*w, 2*h);
  context.stroke();

  this.knob.draw(context);
  if (this.isButton) {
    this.pushButton.draw(context);
  };
  context.fillStyle = "#000000";
  context.fillText(this.sliderText,this.x,this.y - h - 10);
  if (this.isActive) {
    context.fillText(Math.round(this.value),this.x, this.y + h + 20);
  }
}
/**********************************************************************************************************************/
/* pushButton - creates a pushbutton control below a slider
/**********************************************************************************************************************/
function pushButton(radius,isActive) {
  this.isActive = isActive;
  this.radius = radius;
  this.x = 0;
  this.y = 0;
}

pushButton.prototype.draw = function(context) {
  var buttonGradient = context.createLinearGradient(this.x,this.y + this.radius,this.x,this.y - this.radius-1);
  buttonGradient.addColorStop(0,"#92EC00");
  buttonGradient.addColorStop(1,"#F0FC00");
  
  context.strokeStyle = "#777777";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
  context.stroke();
  
  if (!this.isActive) {
    context.fillStyle = buttonGradient;
  } else {
    context.fillStyle = "#5F9900";
  }
  context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);

  context.closePath();
  context.fill();
  context.stroke();
}
/**********************************************************************************************************************/
/* knob - creates a knob to control the slider
/**********************************************************************************************************************/
function knob(width,height,isActive) {
  this.isActive = isActive;
  this.width = width;
  this.height = height;
  this.x = 0;
  this.y = 0;
}

knob.prototype.draw = function(context) {
  var h = this.height/2;
  var w = this.width/2;

  context.save();
  context.translate(this.x, this.y);
  context.lineWidth = 2;
 
  if (this.isActive) {
    context.fillStyle = "#5F9900";
  } else {
    context.fillStyle = "#92EC00";
  }
  context.strokeStyle = "#000000"
  context.beginPath();
  context.moveTo(   w, 0);
  context.lineTo( w-h, h);
  context.lineTo(-w+h, h);
  context.lineTo(  -w, 0);
  context.lineTo(-w+h,-h);
  context.lineTo (w-h,-h);
  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
}
/**********************************************************************************************************************/
/* Mouse drag and drop functions for slider
/**********************************************************************************************************************/
function mousedown(e) {

  for(var i=0; i< this.slider.length; i++){        //loop through the sliders
    var knob = this.slider[i].knob;
    var dx = this.mouse.x - knob.x; // x distance from mouse to slider
    var dy = this.mouse.y - knob.y; // y distance from mouse to slider

    // is mouse is within slider knob?
    if ((Math.abs(dx) < knob.width/2) & (Math.abs(dy) < knob.height/2) & (this.slider[i].isActive)) {
      I = i;            //store the slider being dragged
      dragOffsetX = dx; //store offsets so item doesn't 'jump'
      dragOffsetY = dy;
      this.addEventListener("mousemove",mousemove); // start dragging
      this.addEventListener("mouseup",mouseup);     // listen for user to unclick mouse
      return;
    }
  }
}

function mousemove(e) {
  var y = this.mouse.y + dragOffsetY;
  var botY = this.slider[I].y + this.slider[I].height/2;
  var topY = this.slider[I].y - this.slider[I].height/2;
  
  if (y > botY) {
    this.slider[I].knob.y = botY
    this.slider[I].value = this.slider[I].min;
  } else if (y < topY) {
    this.slider[I].knob.y = topY;
    this.slider[I].value = this.slider[I].max;
  } else {
    this.slider[I].knob.y = y;
    this.slider[I].value = ((y - botY)/(topY - botY)) * (this.slider[I].max - this.slider[I].min) + this.slider[I].min;
  }
  for (var i = 0; i < this.slider.length; i++) {
    this.slider[i].draw(this.context);
  }
}

function mouseup(e) {
  dragIdx = -1; //reset for next mousedown
  this.removeEventListener("mousemove",mousemove); //remove the move/up events when done
  this.removeEventListener("mouseup",mouseup);
}
/**********************************************************************************************************************/
/* Pushbutton click listener function
/**********************************************************************************************************************/
function pushButtonClick (e) {

// check to see if radio buttons have been clicked
  for(var i=0; i< this.slider.length; i++){
    var dx = this.mouse.x - this.slider[i].pushButton.x; // x distance from mouse to pushbutton
    var dy = this.mouse.y - this.slider[i].pushButton.y; // y distance from mouse to pushbutton
    var iClick = -1;
    
// is mouse is within pushbutton?
    if ((Math.sqrt((dx*dx) + (dy*dy)) < this.slider[i].pushButton.radius) & (this.slider[i].isActive)) {
      var iClick = i;
      break;
    }
  }
  if (iClick > -1) {
    for(var i=0; i< this.slider.length; i++){      
      if (iClick == i) {
        this.slider[i].isActive = false;
      } else {
        this.slider[i].isActive = true;
      }
      this.slider[i].draw(this.context); 
    }
    return
  }
}
  
/**
 * Toggles a button's UI between Play and Pause states
 * @param {string} buttonId - The HTML element ID of the button
 * @param {boolean} isPlaying - Current state of the animation
 * @param {string} labelContext - Accessible context description for screen readers
 */
function togglePlayButtonUI(buttonId, isPlaying, labelContext) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  const icon = btn.querySelector("i");
  const span = btn.querySelector("span");

  if (isPlaying) {
    if (span) span.textContent = "Pause";
    if (icon) icon.className = "fa-solid fa-pause me-1";
    btn.setAttribute("aria-label", `Pause ${labelContext}`);
  } else {
    if (span) span.textContent = "Play";
    if (icon) icon.className = "fa-solid fa-play me-1";
    btn.setAttribute("aria-label", `Play ${labelContext}`);
  }
}
  
 

