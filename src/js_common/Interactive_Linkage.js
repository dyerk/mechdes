// ***************************************************************************************
// The Linkage object is the base object for all linkages
// ***************************************************************************************
function Linkage() {
  this.isPlaying = false; // is the animation playing?
  this.isGrashof = true;  // does the crank make a full revolution?
	this.showIC = false;		// show instant centers?
	this.showTrace = false;  // show traces?
	
	this.crankMin = 0;    // starting value for crank (only for non-Grashof linkages)
  this.crankMax = 0;    // ending value for crank (only for non-Grashof linkages)
  this.deltaT = 1.5;    // timestep in animation
  this.timeStep = 0;    // current value of time in animation
	this.crankAngle = 0;  // current angle of linkage
	
  // These are the colors for the links, pins, etc.
  // This color scheme is tetrad on paletton.com with base color 006DC7
this.color = ["#FFFFFF",  // [0]  white
                "#DDDDDD",  // [1]  light gray
                "#AAAAAA",  // [2]  medium gray
								"#333333",  // [3]  dark gray
								"#000000",  // [4]  black
                "#B0A1BA", 	// [5]  Main Primary color (Rose Quartz)
                "#F4F3F5",  // [6]  light
                "#D5CEDA",  // [7]  med light
                "#8E779E",  // [8]  med dark
                "#705285",  // [9]  dark
                "#1B998B", 	// [10] Main Secondary color (Perisan Green)
                "#5FC1B7",  // [11] light
                "#37A69B",  // [12] med light
                "#068376",  // [13] med dark
                "#00675C",  // [14] dark
                "#C5D86D", 	// [15] Main Secondary color (Mindaro)
                "#F1FACA",  // [16] light
                "#E7F7A3",  // [17] med light
                "#9CB13E",  // [18] med dark
                "#778B1C",  // [19] dark
                "#99621E", 	// [20] Main Complement color (Golden Brown)
                "#E2AE6E",  // [21] light
                "#B9813D",  // [22] med light
                "#724105",  // [23] med dark
                "#482800"]; // [24] dark

  // The geom object gives the dimensions of common shapes such as pins, pivots, etc.
  this.geom = {pinRadius: 4,                  // radius of all pins
               pinLineColor: this.color[3],   // line color for pins
							 pinFillColor: this.color[2],   // fill color for pins
               barWidth: 15,                  // width of bars
               barDiam: 20,                   // diameter of end knob on bar
               couplerRadius: 10,             // coupler fillet radius
               pivotWidth: 30,                // width of bottom of pivot
               pivotHeight: 20,               // vertical distance from pivot pin to bottom
               pivotRadius: 10,               // radius of top end of pivot
							 pivotLineColor: this.color[3], // line color for pivot
							 pivotFillColor: this.color[1], // pivot fill color
               pistonWidth: 40,               // width of piston
               pistonHeight: 50,              // height of piston
               rockerWidth: 60,               // width of top of rocker
               groundHeight: 20,              // height of ground slider rectangle
							 groundFillColor: this.color[1],// ground rectangle fill color
							 groundLineColor: this.color[4],// ground line color
               motorWidth1: 20,               // upper width of motor quadrilateral
               motorWidth2: 40,               // lower width of motor quadrilateral
               motorHeight: 25,               // height of motor quadrilateral
							 motorRadius: 20,               // radius of motor circle	
							 pitch: 1/3}                    // gear pitch in pixels per tooth
}

// ****************************************************************************************
// Linkage.buttonCanvas initializes the buttons and canvases for the linkage
// ****************************************************************************************
Linkage.prototype.buttonCanvas = function (pageID, x0, y0) {
	
  var linkage = this;         // make an explicit linkage object so buttons will work
	
	// define variables for all interactive html elements for each animation container
	var butPlay  = pageID + 'butPlay';
	var butReset = pageID + 'butReset';
	var butTrace = pageID + 'butTrace';
	var butIC = pageID + 'butIC';
	
	// capture button html id tags into script
  this.butPlay  = document.getElementById(butPlay); 	// play button for the linkage
  this.butReset = document.getElementById(butReset);  // reset button for the linkage
	this.butTrace = document.getElementById(butTrace);	// trace button for the linkage
	this.butIC = document.getElementById(butIC);				// IC button for the linkage
	
	// capture size selectors into script
	this.boxD = document.getElementById(pageID+"D");
	this.boxA = document.getElementById(pageID+"A");
	this.boxB = document.getElementById(pageID+"B");
	this.boxC = document.getElementById(pageID+"C");
	this.boxP = document.getElementById(pageID+"P");
	this.boxBeta = document.getElementById(pageID+"Beta");
	this.config = document.getElementById(pageID+"selConfig");
	this.cap = document.getElementById(pageID+"cap");
	
	// add event listeners to buttons
  this.butPlay.addEventListener('click',function (){linkage.eventPlay(linkage)},false);
	this.butReset.addEventListener('click',function (){linkage.eventReset(linkage)},false);
	this.butTrace.addEventListener('click',function(){linkage.eventToggleButton("butTrace")},false);
	this.butIC.addEventListener('click',function(){linkage.eventToggleButton("butIC")},false);
	
	//add event listeners to number boxes
	this.boxD.addEventListener('change',function (){linkage.eventChange("boxD")},false);
	this.boxA.addEventListener('change',function (){linkage.eventChange("boxA")},false);
	this.boxB.addEventListener('change',function (){linkage.eventChange("boxB")},false);
	this.boxC.addEventListener('change',function (){linkage.eventChange("boxC")},false);
	this.boxP.addEventListener('change',function (){linkage.eventChange("boxP")},false);
	this.boxBeta.addEventListener('change',function (){linkage.eventChange("boxBeta")},false);
	this.config.addEventListener('change',function (){linkage.eventChange("config")},false);
	
	// capture canvas html id tags for animation into script
	this.can = [];
	this.ctx = [];
  this.can[0] = document.getElementById(pageID + 'canTr');  // tracing canvas for the linkage
  this.ctx[0] = this.can[0].getContext('2d');               // tracing context for the linkage
	this.can[1] = document.getElementById(pageID + 'canM1');  // moving link 1 canvas for linkage
	this.ctx[1] = this.can[1].getContext('2d');               // moving link 1 context for the linkage
	this.can[2] = document.getElementById(pageID + 'canM2');	// moving link 2 canvas for linkage
	this.ctx[2] = this.can[2].getContext('2d');               // moving link 2 context for the linkage
	this.can[3] = document.getElementById(pageID + 'canM3');	// moving link 3 canvas for linkage
	this.ctx[3] = this.can[3].getContext('2d');               // moving link 3 context for the linkage
	this.can[4] = document.getElementById(pageID + 'canGr');  // ground canvas for the linkage
  this.ctx[4] = this.can[4].getContext('2d');               // ground context for the linkage

	// set canvas size
  for (var i = 0; i < 5; i++) {
    this.can[i].width = 500;                                 // set width of drawing canvas
    this.can[i].height = 450;                                // set height of drawing canvas
  }

	// set orgin
  this.x0 = x0;                                              // x coordinate of origin on canvas
  this.y0 = y0;                                              // y coordinate of origin on canvas
  
	// trace setup
  this.traceColor = [this.color[9],this.color[19],this.color[14]];// colors of the tracing points
	
	// initialize values in selector boxes
	switch (this.type){
		case "threebar":
			this.boxA.value = this.bar[0].L;
			this.boxD.value = this.pivot[1].x;
			this.boxP.value = this.bar[1].P;
			break;
		
		case "fourbar":
			this.boxA.value = this.bar[0].L;
			this.boxB.value = this.bar[1].L;
			this.boxC.value = this.bar[2].L;
			this.boxD.value = this.pivot[1].x;
			this.boxP.value = this.bar[1].p;
			this.boxBeta.value = this.bar[1].beta*180/Math.PI;
			if (this.open){
				this.config.value = "O";
			} else {
				this.config.value = "C";
			}
			break;
		
		case "slider":
			this.boxA.value = this.bar[0].L;
			this.boxB.value = this.bar[1].L;
			this.boxC.value = -this.bar[2].y;
			break;
			
		case "invSlider":
			this.boxA.value = 60;
			this.boxC.value = 70;
			this.boxD.value = 160;
			this.boxP.value = 220;
			this.boxBeta.value = 70;
			if (this.isOpen){
				this.config.value = "O";
			} else {
				this.config.value = "C";
			}
			break;
	}
}

// ************************************************************************************** 
// Linkage.eventPlay - handles play button clicks for linkages
// **************************************************************************************
Linkage.prototype.eventPlay = function(linkage) {
  linkage.isPlaying = !linkage.isPlaying;            			// toggle play state
  if (linkage.isPlaying) {  // is the animation playing?  then enable the stop button
    linkage.butPlay.innerHTML = "<i class='fa-solid fa-stop'></i> Stop";
  } else {      // otherwise, animation is stopped re-enable the play button and reset button
		linkage.butPlay.innerHTML = "<i class='fa-solid fa-play'></i> Play";
  }

	// ******* drawFrame updates all plots and animations ********
  function drawFrame () {
    var anim = requestAnimationFrame(drawFrame);	// setup animation frame call
		linkage.timeStep += 1;                     		// increment the current time step

		// calculate the crank angle of the linkage
    if (linkage.isGrashof) {   // for the Grashof linkage, the crank rotates continuously
      linkage.crankAngle = linkage.deltaT * linkage.timeStep * Math.PI/180;
    } else {                   // for non-Grashof linkage the crank angle varies sinusoidally
      var amp = 0.999*(linkage.crankMax - linkage.crankMin)/2;  // amplitude of sine wave
      var off = (linkage.crankMax + linkage.crankMin)/2;        // offset of sine wave from zero
      linkage.crankAngle = -amp*Math.cos(Math.PI*linkage.timeStep*linkage.deltaT/180) + off;
    }

		// draw the linkage at the calculated crank angle
    linkage.draw(linkage.crankAngle);
    if (linkage.showTrace) {                                // should we draw the traced points?
      linkage.drawTrace(linkage.canTr, linkage.ctxTr);
    } else {
			linkage.ctx[0].clearRect(0, 0, linkage.can[0].width, linkage.can[0].height);  // clear the drawing canvas
		} 
		
		// draw instant centers of linkage
		if (linkage.showIC) {
			linkage.drawIC();
		} else {
			linkage.ctx[4].clearRect(0, 0, linkage.can[4].width, linkage.can[4].height);  // clear the drawing canvas
			linkage.drawGround();
		}
		
		// stop animation if the stop button has been pressed
		if (linkage.isPlaying == false) {                       // has the stop button been pressed?
      cancelAnimationFrame(anim);
    }
  }
	drawFrame();
}

// ****************************************************************************************
// Linkage.eventReset - handles reset button for linkages
// ****************************************************************************************
Linkage.prototype.eventReset = function(linkage) {
  
  linkage.butReset.classList.remove("button-enabled");  // change from enabled "reset" button
  linkage.butReset.classList.add("button-disabled");    // to disabled "reset" button
  linkage.butReset.removeEventListener('click', function () {linkage.eventReset(linkage)},false);
  
	// restore default values
	switch (this.type){
		case "threebar":
			var boxlist = ["boxD","boxA","boxP"];
			this.boxA.value = 60;  // set crank
			this.boxD.value = 160; // set ground
			this.boxP.value = 250;  // set p
			break;
			
		case "fourbar":
			var boxlist = ["boxD","boxA","boxB","boxC","boxP","boxBeta"];
			this.boxA.value = 80;  // set crank
			this.boxB.value = 170;	// set coupler
			this.boxC.value = 120; // set rocker
			this.boxD.value = 160; // set ground
			this.boxP.value = 70;		// set coupler p
			this.boxBeta.value = 40;  // set coupler beta
			break;
		
		case "slider":
			var boxlist = ["boxA","boxB","boxC"];
			this.boxA.value = 60; // set crank
  		this.boxB.value = 130; // set coupler
			this.boxC.value = 60; // set ground
			break;

		case "invSlider":
			var boxlist = ["boxA", "boxB", "boxC", "boxD", "boxP", "boxBeta"];
			this.boxA.value = 60;
			this.boxC.value = 70;
			this.boxD.value = 160;
			this.boxP.value = 220;
			this.boxBeta.value = 70;
			break;
	}
	
	for (box in boxlist) {					 //iterate through all box resets above and execute 
		this.eventChange(boxlist[box]);//change events for them to reset animation
	}
	
  for (var i = 0; i < 5; i++) {  
    this.ctx[i].clearRect(0, 0, this.can[i].width, this.can[i].height);  // clear the drawing canvas
  }
 
	this.drawGround();
	
	this.timeStep = 0;
  if (this.isGrashof) {
    this.draw(0);
  } else {
    this.draw((this.crankMin + this.crankMax)/2);
  }
}

// ****************************************************************************************
// Linkage.eventTogleButton - toggles visibility of plot
// ****************************************************************************************
Linkage.prototype.eventToggleButton = function(button) {
	var buttonFlag = button.replace('but','show');		 // flag for button
	this[buttonFlag] = !this[buttonFlag];
	
	if (this[buttonFlag]) {     													 //If button is "on"
		this[button].classList.add("active");        // toggle button selection
		if (button=="butIC"){
			this.draw(this.crankAngle);
			this.drawIC();
		}
		
	} else {
		this[button].classList.remove("active");     // it deslected
		if (button=="butTrace") {
			this.ctx[0].clearRect(0, 0, this.can[0].width, this.can[0].height);
			this.draw(this.crankAngle)
		}
		if (button=="butIC") {
			this.ctx[4].clearRect(0, 0, this.can[4].width, this.can[4].height);
			this.drawGround();
		}
	}
}

// ***************************************************************************************
// Linkage.eventChange - changes lengths of links when num box is changed 
// ***************************************************************************************
Linkage.prototype.eventChange = function(button) {
	switch(this.type){
		case "threebar":
			switch(button){
				case "boxA":
					this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);  // clear the ground canvas
					this.bar[0].L = parseFloat(this.boxA.value);
					this.bar[0].pin[1].x = parseFloat(this.boxA.value);
					this.bar[1].A = parseFloat(this.boxA.value);
					break;
					
				case "boxD":
					this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);  // clear the ground canvas
					this.pivot[1].x = parseFloat(this.boxD.value);
					this.bar[1].D = parseFloat(this.boxD.value);
					this.drawGround();
					break;
					
				case "boxP":
				  this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);  // clear the ground
					this.bar[1].P = parseFloat(this.boxP.value);
					this.bar[1].pin[1].x = parseFloat(this.boxP.value);
					break;	
			}
			break;
			
		case "fourbar":
			switch(button){
				case "boxA": //Resize crank
					this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);
					this.bar[0].L = parseFloat(this.boxA.value);
					this.bar[0].pin[1].x = parseFloat(this.boxA.value);
					break;
				
				case "boxB": //Resize coupler
					this.ctx[3].clearRect(0, 0, this.can[3].width, this.can[3].height);
					this.bar[1].L = parseFloat(this.boxB.value);
					this.bar[1].pin[1].x = parseFloat(this.boxB.value);
					this.bar[1].calcPoints();
					break;
					
				case "boxC": //Resize rocker
					this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);
					this.bar[2].L = parseFloat(this.boxC.value); 
					this.bar[2].pin[1].x = parseFloat(this.boxC.value);
					break;
					
				case "boxD": //Resize ground
					this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);  // clear the ground canvas
					this.pivot[1].x = parseFloat(this.boxD.value);
					this.bar[2].x = parseFloat(this.boxD.value);
					this.drawGround();
					break;
				
				case "boxP": //Resize p on coupler
					this.ctx[3].clearRect(0, 0, this.can[3].width, this.can[3].height);
					this.bar[1].p = parseFloat(this.boxP.value);
					this.bar[1].calcPoints();
					this.bar[1].pin[2].x = parseFloat(this.bar[1].pcb);
					this.bar[1].pin[2].y = parseFloat(-this.bar[1].psb);
					break;
				
				case "boxBeta": //Change angle of p on coupler
					this.ctx[3].clearRect(0, 0, this.can[3].width, this.can[3].height);
					this.bar[1].beta = parseFloat(this.boxBeta.value)*Math.PI/180;
					this.bar[1].calcPoints();
					this.bar[1].pin[2].x = parseFloat(this.bar[1].pcb);
					this.bar[1].pin[2].y = parseFloat(-this.bar[1].psb);
					break;
				
				case "config":
					if (this.config.value == "O") {
						this.open = true;
					} else {
						this.open = false;
					}
					break;
			}
			this.classify(this.bar[0].L,this.bar[1].L,this.bar[2].L,this.pivot[1].x);
			break;
			
		case "slider":
			switch(button) {
					case "boxA":
						this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);
						this.bar[0].L = parseFloat(this.boxA.value);
						this.bar[0].pin[1].x = parseFloat(this.boxA.value);
						break;
						
					case "boxB":
						this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);
						this.bar[1].L = parseFloat(this.boxB.value);
						this.bar[1].pin[1].x = parseFloat(this.boxB.value);
						break;

					case "boxC":
						if (parseFloat(this.boxC.value) > parseFloat(this.boxA.value)+parseFloat(this.boxB.value)){
							this.boxC.value = parseFloat(this.boxA.value)+parseFloat(this.boxB.value);
						}
						this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);
						this.bar[2].y = -parseFloat(this.boxC.value);
						this.groundSlider.y = -(this.bar[2].y+this.bar[2].h/2);
						this.drawGround();
						break;						
				}
			this.classify(this.bar[0].L,this.bar[1].L,-this.bar[2].y)
			break;
			
		case "invSlider":
			switch(button) {
				case "boxA":
					this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);  // clear the ground
					this.bar[0].L = parseFloat(this.boxA.value);
					this.bar[0].pin[1].x = parseFloat(this.boxA.value);
					break;
					
				case "boxC": //Resize rocker
					this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);
					this.bar[2].L = parseFloat(this.boxC.value); 
					break;
				
				case "boxD":
					this.ctx[1].clearRect(0, 0, this.can[1].width, this.can[1].height);  // clear the ground canvas
					this.pivot[1].x = parseFloat(this.boxD.value);
					this.bar[2].x = parseFloat(this.boxD.value);
					this.drawGround();
					break;
					
				case "boxP":
					this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);  // clear the ground canvas
					this.bar[1].p = parseFloat(this.boxP.value);
					break;
					
				case "boxBeta": //Change angle of p on coupler
					this.ctx[2].clearRect(0, 0, this.can[2].width, this.can[2].height);
					this.bar[2].gamma = parseFloat(this.boxBeta.value)*Math.PI/180;
					this.bar[2].cG = Math.cos(parseFloat(this.boxBeta.value)*Math.PI/180);
					this.bar[2].sG = Math.sin(parseFloat(this.boxBeta.value)*Math.PI/180);
					break;
					
					case "config":
					if (this.config.value == "O") {
						this.isOpen = true;
					} else {
						this.isOpen = false;
					}
					break;
			}
			this.classify(this.bar[0].L,this.bar[2].L,this.pivot[1].x,this.bar[2].gamma);
			break;
	}
	
	// For all changes
	this.ctx[0].clearRect(0, 0, this.can[0].width, this.can[0].height);
	this.draw(this.crankAngle)
}

// ***************************************************************************************
// Linkage.drawIC - draws instant centers
// ***************************************************************************************
Linkage.prototype.drawIC = function() {
	//clear ground canvas
	this.ctx[4].clearRect(0, 0, this.can[4].width, this.can[4].height);
	this.drawGround(0);
	
	this.ctx[4].lineWidth = 1;                       // all circles have linewidth 1
	this.ctx[4].save();
	this.ctx[4].translate(this.x0, this.y0);         // move to origin of linkage
	
	// Draw lines from linkage to "floating" instant centers
	for (j in this.connect) {
		this.ctx[4].strokeStyle = this.IC[this.connect[j][1]].pin.fillColor;
		this.ctx[4].beginPath();
		this.ctx[4].moveTo(this.IC[this.connect[j][0]].x,this.IC[this.connect[j][0]].y);
		this.ctx[4].lineTo(this.IC[this.connect[j][1]].x,this.IC[this.connect[j][1]].y);
		this.ctx[4].lineTo(this.IC[this.connect[j][2]].x,this.IC[this.connect[j][2]].y);
		this.ctx[4].stroke();
	}
	
	// Draw dots at each instant center
	for (i in this.IC) {
		this.IC[i].draw(this.ctx[4]);
	}
	
	this.ctx[4].restore();                           // move back to global origin
}

// ***************************************************************************************
// Linkage.drawTrace - traces the paths of selected pins on the linkage
// ***************************************************************************************
Linkage.prototype.drawTrace = function() {
  this.ctx[0].lineWidth = 1;                       // all circles have linewidth 1
  this.ctx[0].save();
  this.ctx[0].translate(this.x0, this.y0);         // move to origin of linkage

  for (i in this.tracePoint) {
    this.ctx[0].strokeStyle = this.traceColor[i];  // color of tracing point
    this.ctx[0].beginPath();                       // start drawing
    this.ctx[0].arc(this.tracePoint[i].x, this.tracePoint[i].y, 1, 0, 2*Math.PI,true);
    this.ctx[0].closePath();
    this.ctx[0].stroke();
  }
  this.ctx[0].restore();                           // move back to global origin
}