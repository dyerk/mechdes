// Plot.js
// generates simple line plots 

// ***********************************************************************************
// Trace - class defining trace objects
// ***********************************************************************************
function Trace(traceName,traceColor){		// Trace Class 
	this.traceName = traceName;				// trace name used in legend
	this.traceColor = traceColor;			// color of trace
	this.traceWidth = 2;							// line width in px
	this.xVals = new Array();					// array to store x values
	this.yVals = new Array();			    // array to store y values
	this.vMin = 0;										// minimum value
	this.vMax = 0;										// maximum value
	
	this.xVals[0] = 0;								// initialize first value to 0
	this.yVals[0] = 0;								// initialize first value to 0
}

// **********************************************************************************
// Plot - class defining plot objects
// **********************************************************************************
function Plot(can,ctx){
	this.can = can;
	this.ctx = ctx;

	// 1. Get Device Pixel Ratio (defaults to 1 if undefined)
	this.dpr = window.devicePixelRatio || 1;

	// 2. Read current display bounds or default attributes
	const cssWidth = can.clientWidth || 500;
	const cssHeight = can.clientHeight || 125;

	// 3. Upscale canvas internal buffer resolution for high-DPI
	this.can.width = cssWidth * this.dpr;
	this.can.height = cssHeight * this.dpr;

	// 4. Ensure CSS display size matches original target dimensions
	this.can.style.width = cssWidth + "px";
	this.can.style.height = cssHeight + "px";

	// 5. Scale context so drawing coordinates (e.g., x=60, y=20) stay identical
	this.ctx.scale(this.dpr, this.dpr);

	// Layout Offsets (calculated using CSS dimensions, NOT scaled pixel buffer)
	this.l = 40; 														// left offest
	this.r = 15;														// right margin
	this.xMin = 0;													// minimum x axis value
	this.xMax = 360;												// maximum x axis value
	this.nXGrid = 13;												// number of x axis gridlines
	this.xZero = this.l;										// x pixel location of y axis (x=0)
	
	this.t = 10;														// top offset
	this.b = 25;														// bottom margin
	this.yMin = -100;												// minimum y axis value
	this.yMax = 100;												// maximum y axis value
	this.nYGrid = 5;												// number of y axis gridlines
	this.yBounds = "manual";	  						// "auto" or "manual" bounding of y axis
	//this.yZero = this.t+this.h; 						// y pixel location of x axis (y=0)
	
	this.plotColor = "#EEEEEE";							// plot background color
	this.lineColor = "#000";							// border and text color
	this.gridColor = "#444";							// gridline color
	
	this.traces = new Array();							// array to hold traces
	this.stopIndex = 0;									// index number to stop when plotting traces
	
	this.xLabel = "Crank Angle [deg]";					// label on x-axis
	this.yLabel = "Disp [mm]";							// label on y-axis
	this.title = "Displacement vs. Crank Angle";		// title
}

// ****************************************************************************
// drawPlot - main function that calls all support funtions to draw entire plot
// ****************************************************************************
Plot.prototype.drawPlot = function(traceList){
	this.checkSize();
	this.ctx.clearRect(0, 0, this.can.width, this.can.height);
	this.drawGrid();	
	//this.drawLabels();
	//this.drawLegend(traceList);
}
	
Plot.prototype.drawTraces = function(traceList, stopIndex) {
	//Plot all available traces
	for (var i = 0; i < traceList.length; i++) {
		this.drawTrace(this.traces[traceList[i]],stopIndex);	
	}
}

// **************************************************************************
// drawGrid - plots box, gridlines, and numbers on plot
// **************************************************************************
Plot.prototype.drawGrid = function(){
	//Determine axis bounds
	if (this.yBounds == "auto") { //if auto scaling y bounds
		tempYMin = 100000000;
		tempYMax = -100000000;
		for (var i = 0; i < this.traces.length; i++) {
			// look for min and max values in arrays using array reduce functionality
			this.traces[i].vMin = this.traces[i].yVals.reduce(function(a, b) {return Math.min(a, b)});
			this.traces[i].vMax = this.traces[i].yVals.reduce(function(a, b) {return Math.max(a, b)});
			if (this.traces[i].vMin < tempYMin){
				tempYMin = this.traces[i].vMin;
				this.yMin = this.traces[i].vMin;
			}	
			if (this.traces[i].vMax > tempYMax){
				tempYMax = this.traces[i].vMax;
				this.yMax = this.traces[i].vMax;
			}	
		}
	}
		
	// set to base styles
	this.ctx.lineWidth = 1;	
	
	// draw plot bounds
	this.ctx.beginPath();
	this.ctx.fillStyle = this.plotColor;
	this.ctx.fillRect(this.l,this.t,this.w,this.h);
	
	// draw y-axis grid
	const yTicks = this.generateYTicks();

	for (var i = 0; i < yTicks.length; i++) {
		const val = yTicks[i];
		
		// Map tick data value precisely across canvas height
		const yPos = Math.floor(this.t + this.h - ((val - this.yMin) / (this.yMax - this.yMin)) * this.h) + 0.5;

		// Draw Tick Label
		this.ctx.font = "500 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
		this.ctx.fillStyle = this.lineColor;
		this.ctx.textAlign = "right";
		this.ctx.textBaseline = 'middle';
		this.ctx.fillText(val.toFixed(0), this.l - 3, yPos);

		// Draw Gridlines (solid for 0, dashed for grid lines)
		if (val !== this.yMin && val !== this.yMax) {
			this.ctx.beginPath();
			this.ctx.strokeStyle = (val === 0) ? this.lineColor : this.gridColor;
			this.ctx.setLineDash(val === 0 ? [] : [1, 5]);
			this.ctx.moveTo(this.l, yPos);
			this.ctx.lineTo(this.l + this.w, yPos);
			this.ctx.stroke();
		}
	}
	
	for (var i = 0; i < this.nXGrid; i++){
		//x-axis numbering
		const xPos = Math.floor(this.lerp(this.l, this.l + this.w, i / (this.nXGrid - 1))) + 0.5;
		this.ctx.font = "500 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
		this.ctx.fillStyle = this.lineColor;
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = 'top';
		this.ctx.fillText(parseFloat(this.lerp(this.xMin,this.xMax,i/(this.nXGrid-1))).toFixed(0),xPos,this.t+this.h+3);
		
		if ((i>0)&&(i<this.nXGrid-1)){
			//x-axis grid lines
			this.ctx.beginPath();
			this.ctx.strokeStyle = this.gridColor;
			this.ctx.setLineDash([1, 5]);
			this.ctx.moveTo(xPos,this.t);
			this.ctx.lineTo(xPos,this.t+this.h);
			this.ctx.stroke();	
		}
	}
	
	// draw x-axis
	this.yZero = this.t+this.scaleToPlot("y",this.yMax);
		
	if (this.yMin < 0){
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.lineColor;
		this.ctx.setLineDash([]);
		this.ctx.moveTo(this.l,this.yZero);
		this.ctx.lineTo(this.l+this.w,this.yZero);
		this.ctx.stroke();
	}
	
	// draw y-axis
	this.xZero = this.can.width-this.r-this.scaleToPlot("x",this.xMax);
		
	if (this.xMin < 0){
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.lineColor;
		this.ctx.setLineDash([]);
		this.ctx.moveTo(this.xZero,this.t);
		this.ctx.lineTo(this.xZero,this.t+this.h);
		this.ctx.stroke();
	}
		
	// draw plot outline
	this.ctx.beginPath();
	this.ctx.strokeStyle = this.lineColor;
	this.ctx.setLineDash([]);
	this.ctx.moveTo(this.l,this.t);
	this.ctx.lineTo(this.l+this.w,this.t);
	this.ctx.lineTo(this.l+this.w,this.t+this.h);
	this.ctx.lineTo(this.l,this.t+this.h);
	this.ctx.lineTo(this.l,this.t);
	this.ctx.stroke();
}

// **************************************************************************
// drawTrace - iterates through trace array connecting each point with a line
// **************************************************************************
Plot.prototype.drawTrace = function(trace,index){
	this.ctx.strokeStyle = trace.traceColor;						// set trace color
	this.ctx.lineWidth = trace.traceWidth;							// set trace width
	this.ctx.beginPath();				
	x1 = this.xZero + this.scaleToPlot("x",trace.xVals[index-1]);			  // x1 scaled to graph
	x2 = this.xZero + this.scaleToPlot("x",trace.xVals[index]);     // x2 scaled to graph
	y1 = this.yZero - this.scaleToPlot("y",trace.yVals[index-1]);   // y1 scaled to graph
	y2 = this.yZero - this.scaleToPlot("y",trace.yVals[index]); // y2 scaled to graph
	
	// Make sure the point is within the plot bounds before plotting
	if ((x1 < this.l + this.w) && (x2 < this.l + this.w) && (y1 > this.t) &&
		(y2 > this.t) && (y1 < this.t + this.h) && (y2 < this.t + this.h)) {
		this.ctx.moveTo(x1,y1);
		this.ctx.lineTo(x2,y2);
		this.ctx.stroke();	
	}
}

// ****************************************************************
// drawLabels - draws title, x-axis, and y-axis labels
// ****************************************************************
Plot.prototype.drawLabels = function(){
	// Plot Title
	this.ctx.strokeStyle = this.lineColor;
	this.ctx.textAlign = "center";
	this.ctx.textBaseline = "bottom";
	this.ctx.fillText(this.title,this.l+this.w/2,this.t-2);
	
	// x-label
	this.ctx.textAlign = "center";
	this.ctx.fillText(this.xLabel,this.l+this.w/2,this.can.height-3);
	
	// y-label
	this.ctx.save();
	this.ctx.translate(0,0);
	this.ctx.rotate(-Math.PI/2); // rotate from orgin -90 degrees
	this.ctx.fillText(this.yLabel,-(this.t+this.h/2),this.l*2/5); // use new roated origin for coords 
	this.ctx.restore();
}

// *************************************************************************************
// drawLegend - draws plot legend
// *************************************************************************************
Plot.prototype.drawLegend = function(traceList){
	boxSize = 10;													// size of color patch
	curPos = this.can.width-this.r;				// current position
	legY = this.can.height-5-boxSize;			// legend y position
	for (var i = traceList.length-1; i > -1; i--){
		this.ctx.beginPath();
		this.ctx.fillStyle = this.traces[traceList[i]].traceColor;
		
		curPos = curPos-boxSize;
		this.ctx.fillRect(curPos,legY,boxSize,boxSize);
		
		txt = this.traces[traceList[i]].traceName;
		this.ctx.fillStyle = this.lineColor;
		this.ctx.textAlign = "right";
		this.ctx.textBaseline = "top"
		curPos = curPos - 2;																			// add spacing from box
		this.ctx.fillText(txt,curPos,legY)											  // place text
		
		curPos = curPos - this.ctx.measureText(txt).width - 7;		// spacing for next legend entry
	}
}

// *************************************************************************************
// lerp - executes linear interpolation given a min and max value and percentage between
// ************************************************************************************* 
Plot.prototype.lerp = function(min, max, percent){
	return (1-percent) * min + percent * max;
}

// *************************************************************************************
// checkSize - checks canvas size to accomodate change in window sizes
// *************************************************************************************
Plot.prototype.checkSize = function(){
    // Sync width with container or canvas attribute
    if (this.can.parentElement && this.can.parentElement.clientWidth > 0) {
        this.can.width = this.can.parentElement.clientWidth;
    } else if (!this.can.width || this.can.width === 0) {
        this.can.width = 500; 
    }

    // Sync height with canvas attribute / class height
    // If the canvas is in plot-short mode, force 125; if plot-tall, force 250
    if (this.can.classList.contains("plot-tall")) {
        this.can.height = 250;
    } else {
        this.can.height = 125;
    }

    // 3. Recalculate printable grid area
    this.w = this.can.width - this.l - this.r;  // 500 - 60 - 25 = 415
    this.h = this.can.height - this.t - this.b; // 125 - 20 - 35 = 70
};

// ************************************************************************************
// scaleToPlot - scale value to plot pixel value
// ************************************************************************************
Plot.prototype.scaleToPlot = function(axis,val){
	switch (axis.toLowerCase()) {
		case "x":
			pxVal = val*this.w/(this.xMax-this.xMin);
			break;
		case "y":
			pxVal = val*this.h/(this.yMax-this.yMin);		
			break;
		default:
			console.log("scaleToPlot :: invalid axis specified use x or y");
			break;
	}
	return pxVal;
}

// ************************************************************************************
// attachResizeObserver - watch for window resize events and handle rescaling
// ************************************************************************************
Plot.prototype.attachResizeObserver = function(traceList) {
	if (typeof ResizeObserver === 'undefined') return;

	const observer = new ResizeObserver(() => {
		const cssWidth = this.can.parentElement.clientWidth || 500;
		const cssHeight = this.can.classList.contains("plot-tall") ? 250 : 125;

		this.can.width = cssWidth * this.dpr;
		this.can.height = cssHeight * this.dpr;
		this.can.style.width = cssWidth + "px";
		this.can.style.height = cssHeight + "px";

		// Re-apply DPR scale after buffer size reset
		this.ctx.scale(this.dpr, this.dpr);

		// Redraw plot with newly calculated resolution
		this.drawPlot(traceList);
	});

	observer.observe(this.can.parentElement);
};


// *************************************************************************************
// Linkage.updateLimits - updates plot yMin/yMax based on selected point
// *************************************************************************************
Linkage.prototype.updateLimits = function(point) {
    if (this.limits && this.limits[point]) {
        const lim = this.limits[point];

        if (lim.dis) {
            this.plotDis.yMin = lim.dis[0];
            this.plotDis.yMax = lim.dis[1];
        }
        if (lim.vel) {
            this.plotVel.yMin = lim.vel[0];
            this.plotVel.yMax = lim.vel[1];
        }
        if (lim.acc) {
            this.plotAcc.yMin = lim.acc[0];
            this.plotAcc.yMax = lim.acc[1];
        }
    }
};

// **************************************************************************
// getNiceStepSize - calculates a round step increment (e.g. 10, 25, 50, 100)
// **************************************************************************
Plot.prototype.getNiceStepSize = function(yMin, yMax, targetTicks) {
    const range = yMax - yMin;
    if (range === 0) return 10;
    const rawStep = range / (targetTicks || 5);
    const exponent = Math.floor(Math.log10(rawStep));
    const fraction = rawStep / Math.pow(10, exponent);
    
    let niceFraction;
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;

    return niceFraction * Math.pow(10, exponent);
};

// **************************************************************************
// generateYTicks - expands yMin/yMax to the nearest tick mark anchored at 0
// **************************************************************************
Plot.prototype.generateYTicks = function() {
    const targetTicks = this.nYGrid || 5;
    
    // 1. Calculate clean step size based on initial limits
    const step = this.getNiceStepSize(this.yMin, this.yMax, targetTicks);

    // 2. Snap yMin DOWN to the next lower tick multiple (if yMin isn't already a multiple)
    if (this.yMin < 0) {
        this.yMin = Math.floor(this.yMin / step) * step;
    } else if (this.yMin > 0) {
        this.yMin = Math.max(0, Math.floor(this.yMin / step) * step);
    }

    // 3. Snap yMax UP to the next higher tick multiple
    if (this.yMax > 0) {
        this.yMax = Math.ceil(this.yMax / step) * step;
    } else if (this.yMax < 0) {
        this.yMax = Math.min(0, Math.ceil(this.yMax / step) * step);
    }

    // 4. Generate all tick marks from updated yMin to yMax
    const ticks = [];
    let current = this.yMin;
    
    // Use Math.round to eliminate floating point rounding precision errors
    while (current <= this.yMax + (step / 2)) {
        ticks.push(Math.round(current * 1000) / 1000);
        current += step;
    }

    return ticks;
};