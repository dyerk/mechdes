// ***************************************************************************************
// The Linkage object is the base object for all linkages
// ***************************************************************************************
function Linkage() {
  this.isPlaying = false; // is the animation playing?
  this.isGrashof = true;  // does the crank make a full revolution?
	this.showPlots = true;	// show Disp, Vel, Acc plots
	this.showIC = false;		// show instant centers?
	this.showTrace = true;  // show traces?
	
	this.crankMin = 0;    // starting value for crank (only for non-Grashof linkages)
  this.crankMax = 0;    // ending value for crank (only for non-Grashof linkages)
  this.deltaT = 1.5;    // timestep in animation
  this.timeStep = 0;    // current value of time in animation

  // These are the colors for the links, pins, etc.
  // This color scheme is tetrad on paletton.com with base color 006DC7
  this.color = ["#FFFFFF",  // [0]  white
                "#DDDDDD",  // [1]  light gray
                "#AAAAAA",  // [2]  medium gray
								"#333333",  // [3]  dark gray
								"#000000",  // [4]  black
                "#006DC7", 	// [5]  Main Primary color (pastel blue)
                "#1894FB",  // [6]  light
                "#058DFF",  // [7]  med light
                "#005296",  // [8]  med dark
                "#004075",  // [9]  dark
                "#0400CF", 	// [10] Main Secondary color (deep blue)
                "#2F2BFC",  // [11] light
                "#0F0AFF",  // [12] med light
                "#0300A2",  // [13] med dark
                "#03007F",  // [14] dark
                "#FFC000", 	// [15] Main Secondary color (yellow orange)
                "#FFC207",  // [16] light
                "#FFC000",  // [17] med light
                "#E8AF00",  // [18] med dark
                "#B68900",  // [19] dark
                "#FF9400", 	// [20] Main Complement color (orange)
                "#FF9707",  // [21] light
                "#FF9400",  // [22] med light
                "#E88600",  // [23] med dark
                "#E66900"]; // [24] dark

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
	
  var linkage = this;                     // make an explicit linkage object so buttons will work
	
	// define variables for all interactive html elements for each animation container
	var butPlay  = pageID + 'butPlay';
	var butReset = pageID + 'butReset';
	
	// capture button html id tags into script
  this.butPlay  = document.getElementById(butPlay); 		    // play button for the linkage
  this.butReset = document.getElementById(butReset);    		// reset button for the linkage
	
	// add event listeners buttons
  this.butPlay.addEventListener('click',function (){linkage.eventPlay(linkage)},false);
	
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

	// capture canvas html id tags for plots into script
	this.canAcc = document.getElementById(pageID+'canAcc');   // accel plot canvas
	this.ctxAcc = this.canAcc.getContext('2d');								// accel plot context
	this.canVel = document.getElementById(pageID+'canVel');   // vel plot canvas
	this.ctxVel = this.canVel.getContext('2d');								// vel plot context
	this.canDis = document.getElementById(pageID+'canDis');   // dis plot canvas
	this.ctxDis = this.canDis.getContext('2d');								// dis plot context
	
	// set canvas size
  for (var i = 0; i < 5; i++) {
    this.can[i].width = 500;                                 // set width of drawing canvas
    this.can[i].height = 400;                                // set height of drawing canvas
  }

	// set orgin
  this.x0 = x0;                                              // x coordinate of origin on canvas
  this.y0 = y0;                                              // y coordinate of origin on canvas
  
	// trace setup
  this.traceColor = [this.color[15],this.color[20],this.color[10]];// colors of the tracing points
	
	// Generate plot functionality if turned on in instance of linkage
	if (this.showPlots) {
		document.getElementById("item"+pageID).children[1].classList.remove('div-hide')
		
		// Get variables from page
		var selPin   = pageID + 'selPin';
		var butAcc   = pageID + 'butAcc';
		var butVel   = pageID + 'butVel';
		var butDis   = pageID + 'butDis';
		var sizeAcc  = pageID + 'sizeAcc';
		var sizeVel  = pageID + 'sizeVel';
		var sizeDis  = pageID + 'sizeDis';
		var caption   = pageID + 'cap';
		
		// capture html id tags into script
		this.selPin   = document.getElementById(selPin);			// pin selection for T,A,V,D plots
		this.butAcc   = document.getElementById(butAcc);	  	// button show/hide acceleration plot
		this.butVel   = document.getElementById(butVel);    	// button show/hide velocity plot
		this.butDis   = document.getElementById(butDis);			// button show/hide displacement plot
		this.sizeAcc = document.getElementById(sizeAcc);			// size acceleration plot
		this.sizeVel = document.getElementById(sizeVel);			// size velocity plot
		this.sizeDis = document.getElementById(sizeDis);			// size displacemnt plot
		this.butMon = [this.butAcc,this.butVel,this.butDis]; // make button array
		
		// add event listeners for plot buttons
		this.butAcc.addEventListener('click',function(){linkage.eventPlotToggle(linkage,butAcc)},false);
		this.butVel.addEventListener('click',function(){linkage.eventPlotToggle(linkage,butVel)},false);
		this.butDis.addEventListener('click',function(){linkage.eventPlotToggle(linkage,butDis)},false);
		this.sizeAcc.addEventListener('click',function(){linkage.eventPlotResize(linkage,sizeAcc)},false);
		this.sizeVel.addEventListener('click',function(){linkage.eventPlotResize(linkage,sizeVel)},false);
		this.sizeDis.addEventListener('click',function(){linkage.eventPlotResize(linkage,sizeDis)},false);
	
		//Determine desired plot point
		this.pointSel = this.selPin.value;			//string value from dropdown
		this.B = {x:0,y:1};		//index of the traces in the plot object
		this.P = {x:2,y:3};		//index of the traces in the plot object
		this.C = {x:4,y:5};		//index of the traces in the plot object
		
		//Create displacement plot
		this.plotDis = new Plot(this.canDis,this.ctxDis); 				// initialize plot
		this.setPlotAttr('plotDis',this.color[10],this.color[15], // set plot parameters
		"DISPLACEMENT PLOT","Disp [mm]",-100,150);								// set plot parameters

		//Create velocity plot
		this.plotVel = new Plot(this.canVel,this.ctxVel);					// initialize plot
		this.setPlotAttr('plotVel',this.color[10],this.color[15], // set plot parameters
		"VELOCITY PLOT","Velocity [mm/s]",-100,150);

		//Create acceleration plot
		this.plotAcc = new Plot(this.canAcc,this.ctxAcc);					// initialize plot
		this.setPlotAttr('plotAcc',this.color[10],this.color[15], // set plot parameters
		"ACCELERATION PLOT","Accel [mm/s"+String.fromCharCode(0x22C5)+"s]",
		-100,150);
	
	
		// Create caption strings from linkage dimensions
		this.cap = document.getElementById(caption);
		this.capDescrip = this.cap.innerHTML;
		this.capLengths = "<b>Link Lengths: </b>";
		
		// iterate through all bars and display lengths
		for (i in this.bar) { 
			switch (this.type) {
			
				case "threebar":
				case "fourbar":
					if (this.bar[i].L) {
						this.capLengths = this.capLengths+String.fromCharCode(65+parseInt(i))+" = "+this.bar[i].L+", ";
					}
					break;
					
				case "slider":
					if (this.bar[i].L) {
						this.capLengths = this.capLengths+String.fromCharCode(65+parseInt(i))+" = "+this.bar[i].L+", ";
					} else {
						this.capLengths = this.capLengths+String.fromCharCode(65+parseInt(i))+" = "+-this.bar[i].y;
					}
					break;
				
				case "invSlider":
					if ((this.bar[i].L) && (i!=1)) {
						this.capLengths = this.capLengths+String.fromCharCode(65+parseInt(i))+" = "+this.bar[i].L+", ";
					} 
					break;
			}
		}			

		// Get length between grounds
		if (this.pivot[1]){
		  this.capLengths = this.capLengths+"D = "+this.pivot[1].x; //get ground from 2nd pivot
		}
		
		// Check for P 
		if ((this.bar[1].p) && (this.bar[1].p != this.bar[1].L)){
			if (isNaN(this.bar[1].beta)) {
				var angle = "0";
			} else {
				var angle = this.bar[1].beta*180/Math.PI;
			}
			this.capLengths = this.capLengths+", P = "+this.bar[1].p+" @ "+angle+String.fromCharCode(176);
		}
	} else {
		if (document.getElementById("item"+pageID).children[1].classList["plotControl"]){
			document.getElementById("item"+pageID).children[1].classList.add('div-hide')
		}
	}
}

// ************************************************************************************** 
// Linkage.eventPlay - handles play button clicks for linkages
// **************************************************************************************
Linkage.prototype.eventPlay = function(linkage) {
  linkage.isPlaying = !linkage.isPlaying;            			// toggle play state
  if (linkage.isPlaying) {  // is the animation playing?  then enable the stop button
    linkage.butPlay.classList.remove("fa-play-circle");    // remove "play" icon and change it by 
	  linkage.butPlay.classList.add("fa-stop-circle");       // adding "stop" icon in its place
	  linkage.butReset.classList.remove("button-enabled");   // change from enabled "reset" button
	  linkage.butReset.classList.add("button-disabled");     // to disabled "reset" button
    linkage.butReset.removeEventListener('click', function () {linkage.eventReset(linkage)},false);
  } else {      // otherwise, animation is stopped re-enable the play button and reset button
    linkage.butPlay.classList.remove("fa-stop-circle");    // change from "stop" button to 
	  linkage.butPlay.classList.add("fa-play-circle");       // to "play" button
	  linkage.butReset.classList.remove("button-disabled");  // change from disabled "reset" button
	  linkage.butReset.classList.add("button-enabled");      // to enabled "reset" button
	  linkage.butReset.addEventListener('click', function () {linkage.eventReset(linkage)},false);
  }

	// ******* drawFrame updates all plots and animations ********
  function drawFrame () {
    var anim = requestAnimationFrame(drawFrame);	// setup animation frame call
		linkage.timeStep += 1;                     		// increment the current time step

		// calculate the crank angle of the linkage
    if (linkage.isGrashof) {   // for the Grashof linkage, the crank rotates continuously
      var crankAngle = linkage.deltaT * linkage.timeStep * Math.PI/180;
    } else {                   // for non-Grashof linkage the crank angle varies sinusoidally
      var amp = 0.999*(linkage.crankMax - linkage.crankMin)/2;  // amplitude of sine wave
      var off = (linkage.crankMax + linkage.crankMin)/2;        // offset of sine wave from zero
      var crankAngle = -amp*Math.cos(Math.PI*linkage.timeStep*linkage.deltaT/180) + off;
    }

		// draw the linkage at the calculated crank angle
    linkage.draw(crankAngle);
    if (linkage.showTrace) {                                // should we draw the traced points?
      linkage.drawTrace(linkage.canTr, linkage.ctxTr);
    } 
		
		// draw instant centers of linkage
		if (linkage.showIC) {
			linkage.drawIC();
		}
		
		// stop animation if the stop button has been pressed
		if (linkage.isPlaying == false) {                       // has the stop button been pressed?
      cancelAnimationFrame(anim);
    }
		
		// update Dis, Vel, Acc plots if they are enabled in this instance of linkage class
		if (linkage.showPlots) {
			linkage.updatePlot("plotDis",crankAngle);
			linkage.updatePlot("plotVel",crankAngle);
			linkage.updatePlot("plotAcc",crankAngle);
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
  
  for (var i = 0; i < 5; i++) {  
    this.ctx[i].clearRect(0, 0, this.can[i].width, this.can[i].height);  // clear the drawing canvas
  }
  if (this.showIC){
		this.drawIC();
	} else {
	this.drawGround();
	}
	
	this.timeStep = 0;
  if (this.isGrashof) {
    this.draw(0);
  } else {
    this.draw((this.crankMin + this.crankMax)/2);
  }
	
	// redraw plot background without traces
	if (this.showPlots) {
		this.plotDis.drawPlot([this[this.pointSel].x,this[this.pointSel].y]);
		this.plotVel.drawPlot([this[this.pointSel].x,this[this.pointSel].y]);
		this.plotAcc.drawPlot([this[this.pointSel].x,this[this.pointSel].y]);
	}
}

// ****************************************************************************************
// Linkage.eventPlotToggle - toggles visibility of plot
// ****************************************************************************************
Linkage.prototype.eventPlotToggle = function(linkage,plotSelection) {
	var conName = document.getElementById(plotSelection.replace('but','con'));
	var butName = document.getElementById(plotSelection);
	
	if (conName.classList.contains("div-hide")) {      //If plot is showing
		conName.classList.remove("div-hide");				     // remove hide class
		conName.classList.add("div-show");					     // add show class
		//butName.classList.remove("button-deselected"); // to make selected
		butName.classList.add("button-selected");        // toggle button selection
	} else {
		conName.classList.remove("div-show");						 // remove show class
		conName.classList.add("div-hide");							 // add hide class
		butName.classList.remove("button-selected");     // it deslected
		//butName.classList.add("button-deselected");    // toggle button to make
	}
	
	if (this.showPlots) {
		for (i in this.butMon){
			if (this.butMon[i].classList.contains("button-selected")){
				this.cap.innerHTML = this.capLengths;
				break;
			} else {
				this.cap.innerHTML = this.capDescrip;
			}
		}	
	}
}

// **************************************************************************************
// Linkage.eventPlotResize - toggles height of plot
// **************************************************************************************
Linkage.prototype.eventPlotResize= function(linkage,plotSelection) {
	var sizeName = document.getElementById(plotSelection); 							// size id
	var canName = document.getElementById(plotSelection.replace('size','can'));	// canvas id
	var plotName = "plot".concat(plotSelection.substr(plotSelection.length-3));
	
	if (canName.classList.contains("plot-short")) { // If plot is short
		canName.classList.remove("plot-short");				// remove short class
		canName.classList.add("plot-tall");						// add tall class
		sizeName.classList.remove("fa-toggle-down"); 		// and change from expand icon
		sizeName.classList.add("fa-toggle-up"); 			// to compress icon
		canName.height = 250;
		this[plotName].drawPlot([this[this.pointSel].x,this[this.pointSel].y]);
	} else {
		canName.classList.remove("plot-tall");				// remove tall class
		canName.classList.add("plot-short");					// add short class
		sizeName.classList.remove("fa-toggle-up"); 	// and change from compress icon
		sizeName.classList.add("fa-toggle-down"); 			  // to expand icon
		canName.height = 125;
		this[plotName].drawPlot([this[this.pointSel].x,this[this.pointSel].y]);
	}
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

// **************************************************************************************
// Linkage.setPlotAttr - initialize a plot
// **************************************************************************************
Linkage.prototype.setPlotAttr = function(plotName,xColor,yColor,title,yLabel,yMin,yMax){	
	this[plotName].traces[0] = new Trace("x",xColor);
	this[plotName].traces[1] = new Trace("y",yColor);
	this[plotName].traces[2] = new Trace("x",xColor);
	this[plotName].traces[3] = new Trace("y",yColor);
	this[plotName].traces[4] = new Trace("x",xColor);
	this[plotName].traces[5] = new Trace("y",yColor);
	this[plotName].yMin = yMin;
	this[plotName].yMax = yMax;
	this[plotName].title = title;
	this[plotName].yLabel = yLabel;
	this[plotName].drawPlot([this[this.pointSel].x,this[this.pointSel].y]);
}

// *************************************************************************************
// Linkage.updatePlot - updates the p,v,a plots while the animation runs
// *************************************************************************************
Linkage.prototype.updatePlot = function(plotName,crankAngle){
	if (this.pointSel != this.selPin.value){ 						 // if point selection changes
		this.pointSel = this.selPin.value;								 // update the selection 
		
		this.plotDis.drawPlot([this[this.pointSel].x,this[this.pointSel].y]); // and redraw plots
		this.plotVel.drawPlot([this[this.pointSel].x,this[this.pointSel].y]);
		this.plotAcc.drawPlot([this[this.pointSel].x,this[this.pointSel].y]);
	}
	
	var tempPoint = plotName.substr(4,1).toLowerCase()+this.pointSel;
	
	// if on first pass through animation capture values into traces of plot object
	// each component of a point e.g. Bx has x component crank angle and y component x-pos value
	if (this.timeStep*this.deltaT < (this[plotName].xMax-this[plotName].xMin)) {
		//Point B
		this[plotName].traces[this.B.x].xVals.push(crankAngle*180/Math.PI);
		this[plotName].traces[this.B.x].yVals.push(this[plotName.substr(4,1).toLowerCase()+"B"].x);
		this[plotName].traces[this.B.y].xVals.push(crankAngle*180/Math.PI);
		this[plotName].traces[this.B.y].yVals.push(this[plotName.substr(4,1).toLowerCase()+"B"].y);
		//Point P
		if (this.dP != undefined) {
			this[plotName].traces[this.P.x].xVals.push(crankAngle*180/Math.PI);
			this[plotName].traces[this.P.x].yVals.push(this[plotName.substr(4,1).toLowerCase()+"P"].x);
			this[plotName].traces[this.P.y].xVals.push(crankAngle*180/Math.PI);
			this[plotName].traces[this.P.y].yVals.push(this[plotName.substr(4,1).toLowerCase()+"P"].y);
		}
		//Point C
		if (this.dC != undefined) {
			this[plotName].traces[this.C.x].xVals.push(crankAngle*180/Math.PI);
			this[plotName].traces[this.C.x].yVals.push(this[plotName.substr(4,1).toLowerCase()+"C"].x);
			this[plotName].traces[this.C.y].xVals.push(crankAngle*180/Math.PI);
			this[plotName].traces[this.C.y].yVals.push(this[plotName.substr(4,1).toLowerCase()+"C"].y);
		}
	
		if (this[plotName].stopIndex > 0){ //only start plotting if you have two values
			this[plotName].drawTraces([this[this.pointSel].x,this[this.pointSel].y],this.timeStep);
		}
		this[plotName].stopIndex = this.timeStep;
		
	} else { // on subsequent passes through animation
		if (this.timeStep % this[plotName].stopIndex == 1){ 							//if 360 degrees is hit
			this[plotName].drawPlot([this[this.pointSel].x,this[this.pointSel].y]);	//redraw plot from scratch
		}
		if (this.timeStep % this[plotName].stopIndex > 1){					
			this[plotName].drawTraces([this[this.pointSel].x,this[this.pointSel].y],this.timeStep % this[plotName].stopIndex); // cycle thru populated arrays
		}
	}
}

// *************************************************************************************
// Linkage.setLims - sets y limits of the p,v,a plots
// *************************************************************************************
// input structure -> {{dLow,dHigh},{vLow,vHigh},{aLow,aHigh},{xMin,xMax}}
Linkage.prototype.setLims = function(input) {
	var plotName = ['plotDis','plotVel','plotAcc','x'];
	for (var i = 0; i < 3; i++){
		if (input[i] != undefined) {
			if (input[3] != undefined) {
				this[plotName[i]].xMin = parseInt(input[3][0]);
				this[plotName[i]].xMax = parseInt(input[3][1]);
			}
			this[plotName[i]].yMin = parseInt(input[i][0]);
			this[plotName[i]].yMax = parseInt(input[i][1]);
			this[plotName[i]].drawPlot([0,1]);
		}
	}
}