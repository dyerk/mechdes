// js_common/Linkage.js
// Base object for all mechanisms

function Linkage() {
  this.isPlaying = false;
  this.isGrashof = true;
  this.showPlots = true;
  this.showIC = false;
  this.showTrace = true;
  this.calcLengths = true;

  this.crankMin = 0;
  this.crankMax = 0;
  this.deltaT = 1.5;
  this.timeStep = 0;

  // Paletton tetrad color palette (base 006DC7)
  this.color = [
    "#FFFFFF", // [0]  white
    "#DDDDDD", // [1]  light gray
    "#AAAAAA", // [2]  medium gray
    "#333333", // [3]  dark gray
    "#000000", // [4]  black
    "#B0A1BA", // [5]  Main Primary color (Rose Quartz)
    "#F4F3F5", // [6]  light
    "#D5CEDA", // [7]  med light
    "#8E779E", // [8]  med dark
    "#705285", // [9]  dark
    "#1B998B", // [10] Main Secondary color (Persian Green)
    "#5FC1B7", // [11] light
    "#37A69B", // [12] med light
    "#068376", // [13] med dark
    "#00675C", // [14] dark
    "#C5D86D", // [15] Main Secondary color (Mindaro)
    "#F1FACA", // [16] light
    "#E7F7A3", // [17] med light
    "#9CB13E", // [18] med dark
    "#778B1C", // [19] dark
    "#99621E", // [20] Main Complement color (Golden Brown)
    "#E2AE6E", // [21] light
    "#B9813D", // [22] med light
    "#724105", // [23] med dark
    "#482800"  // [24] dark
  ];

  this.geom = {
    pinRadius: 4,
    pinLineColor: this.color[3],
    pinFillColor: this.color[2],
    barWidth: 15,
    barDiam: 20,
    couplerRadius: 10,
    pivotWidth: 30,
    pivotHeight: 20,
    pivotRadius: 10,
    pivotLineColor: this.color[3],
    pivotFillColor: this.color[1],
    pistonWidth: 40,
    pistonHeight: 50,
    rockerWidth: 60,
    groundHeight: 20,
    groundFillColor: this.color[1],
    groundLineColor: this.color[4],
    motorWidth1: 20,
    motorWidth2: 40,
    motorHeight: 25,
    motorRadius: 20,
    pitch: 1 / 3
  };
}

// ****************************************************************************************
// Linkage.buttonCanvas - binds scoped DOM controls, canvases, and responsive SVG plots
// ****************************************************************************************
Linkage.prototype.buttonCanvas = function (pageID, x0, y0) {
  var linkage = this;
  this.root = document.querySelector('[data-mechanism-id="' + pageID + '"]');

  if (!this.root) {
    console.error("Mechanism container not found for ID:", pageID);
    return;
  }

  // Animation Controls
  this.btnPlay = this.root.querySelector('[data-role="btn-play"]');
  this.btnReset = this.root.querySelector('[data-role="btn-reset"]');
  this.iconPlay = this.root.querySelector('[data-role="icon-play"]');
  this.iconReset = this.root.querySelector('[data-role="icon-reset"]');

  this.btnPlay.addEventListener("click", function () {
    linkage.eventPlay();
  });
  this.btnReset.addEventListener("click", function () {
    linkage.eventReset();
  });

  // Animation Canvases (Layers 0-4)
  this.can = [];
  this.ctx = [];
  for (var i = 0; i < 5; i++) {
    this.can[i] = this.root.querySelector('canvas[data-layer="' + i + '"]');
    this.ctx[i] = this.can[i].getContext("2d");
    this.can[i].width = 500;
    this.can[i].height = 400;
  }

  this.x0 = x0;
  this.y0 = y0;
  this.traceColor = [this.color[9], this.color[19], this.color[14]];

  // Initialize Plots if enabled and present in template
  var plotControl = this.root.querySelector(".plotControl");
  if (this.showPlots && plotControl) {
    this.selPin = this.root.querySelector('[data-role="sel-pin"]');
    this.pointSel = this.selPin.value || "B";

    this.B = { x: 0, y: 1 };
    this.P = { x: 2, y: 3 };
    this.C = { x: 4, y: 5 };

    this.limits = {
      B: { dis: [-100, 150], vel: [-200, 200], acc: [-500, 500] },
      P: { dis: [-50, 200], vel: [-150, 150], acc: [-400, 400] },
      C: { dis: [0, 300], vel: [-300, 300], acc: [-600, 600] }
    };

    // Instant plot update on dropdown change (even while paused)
    this.selPin.addEventListener("change", function () {
      linkage.pointSel = linkage.selPin.value;
      linkage.initPlots();
    });

    // Plot visibility toggle buttons (Dis, Vel, Acc)
    var toggleBtns = this.root.querySelectorAll("[data-plot-toggle]");
    toggleBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var type = btn.getAttribute("data-plot-toggle");
        linkage.eventPlotToggle(type, btn);
      });
    });

    // Plot height resize buttons
    var resizeBtns = this.root.querySelectorAll("[data-plot-resize]");
    resizeBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var type = btn.getAttribute("data-plot-resize");
        linkage.eventPlotResize(type, btn);
      });
    });

    // Instantiate SVG Plots
    this.plotDis = new Plot(this.root.querySelector('[data-plot-host="dis"]'));
    this.setPlotAttr("plotDis", this.color[24], this.color[14], "DISPLACEMENT PLOT", "Disp [mm]", -100, 150);

    this.plotVel = new Plot(this.root.querySelector('[data-plot-host="vel"]'));
    this.setPlotAttr("plotVel", this.color[24], this.color[14], "VELOCITY PLOT", "Velocity [mm/s]", -100, 150);

    this.plotAcc = new Plot(this.root.querySelector('[data-plot-host="acc"]'));
    this.setPlotAttr("plotAcc", this.color[24], this.color[14], "ACCELERATION PLOT", "Accel [mm/s²]", -100, 150);
  }
};

// **************************************************************************************
// Linkage.eventPlay - handles play/pause button clicks
// **************************************************************************************
Linkage.prototype.eventPlay = function () {
  var linkage = this;
  this.isPlaying = !this.isPlaying;

  if (this.isPlaying) {
    this.iconPlay.classList.remove("fa-circle-play");
    this.iconPlay.classList.add("fa-circle-stop");

    // Enable reset button once animation has started
    this.btnReset.disabled = false;
    this.iconReset.classList.remove("button-disabled");
  } else {
    this.iconPlay.classList.remove("fa-circle-stop");
    this.iconPlay.classList.add("fa-circle-play");
    return;
  }

  function drawFrame() {
    if (!linkage.isPlaying) return;
    requestAnimationFrame(drawFrame);

    linkage.timeStep += 1;

    var crankAngle;
    if (linkage.isGrashof) {
      crankAngle = (linkage.deltaT * linkage.timeStep * Math.PI) / 180;
    } else {
      var amp = (0.999 * (linkage.crankMax - linkage.crankMin)) / 2;
      var off = (linkage.crankMax + linkage.crankMin) / 2;
      crankAngle = -amp * Math.cos((Math.PI * linkage.timeStep * linkage.deltaT) / 180) + off;
    }

    linkage.draw(crankAngle);

    if (linkage.showTrace) {
      linkage.drawTrace();
    }
    if (linkage.showIC) {
      linkage.drawIC();
    }
    if (linkage.showPlots && linkage.plotDis) {
      linkage.updatePlot("plotDis", crankAngle);
      linkage.updatePlot("plotVel", crankAngle);
      linkage.updatePlot("plotAcc", crankAngle);
    }
  }

  drawFrame();
};

// ****************************************************************************************
// Linkage.eventReset - resets mechanism position, trace canvas, and plot data
// ****************************************************************************************
Linkage.prototype.eventReset = function () {
  if (this.isPlaying) {
    this.isPlaying = false;
    this.iconPlay.classList.remove("fa-circle-stop");
    this.iconPlay.classList.add("fa-circle-play");
  }

  this.btnReset.disabled = true;
  this.iconReset.classList.add("button-disabled");

  for (var i = 0; i < 5; i++) {
    this.ctx[i].clearRect(0, 0, this.can[i].width, this.can[i].height);
  }

  if (this.showIC) {
    this.drawIC();
  } else {
    this.drawGround();
  }

  this.timeStep = 0;
  if (this.isGrashof) {
    this.draw(0);
  } else {
    this.draw((this.crankMin + this.crankMax) / 2);
  }

  if (this.showPlots && this.plotDis) {
    this.plotDis.resetTraces();
    this.plotVel.resetTraces();
    this.plotAcc.resetTraces();
  }
};

// ****************************************************************************************
// Linkage.eventPlotToggle - toggles visibility of individual plot cards
// ****************************************************************************************
Linkage.prototype.eventPlotToggle = function (type, btn) {
  var container = this.root.querySelector('[data-plot-container="' + type + '"]');
  if (!container) return;

  var isHidden = container.classList.contains("d-none");
  if (isHidden) {
    container.classList.remove("d-none");
    btn.classList.remove("btn-outline-secondary");
    btn.classList.add("btn-secondary", "active");
    btn.setAttribute("aria-pressed", "true");

    // Redraw plot now that container has visible width
    var plotKey = "plot" + type.charAt(0).toUpperCase() + type.slice(1);
    if (this[plotKey]) {
      this[plotKey].drawPlot([this[this.pointSel].x, this[this.pointSel].y]);
    }
  } else {
    container.classList.add("d-none");
    btn.classList.remove("btn-secondary", "active");
    btn.classList.add("btn-outline-secondary");
    btn.setAttribute("aria-pressed", "false");
  }
};

// **************************************************************************************
// Linkage.eventPlotResize - toggles height of SVG plot container between 125px and 250px
// **************************************************************************************
Linkage.prototype.eventPlotResize = function (type, btn) {
  var host = this.root.querySelector('[data-plot-host="' + type + '"]');
  var icon = btn.querySelector("i");
  var plotKey = "plot" + type.charAt(0).toUpperCase() + type.slice(1);

  if (host.classList.contains("plot-short")) {
    host.classList.remove("plot-short");
    host.classList.add("plot-tall");
    host.style.height = "250px";
    if (icon) {
      icon.classList.remove("fa-expand");
      icon.classList.add("fa-compress");
    }
  } else {
    host.classList.remove("plot-tall");
    host.classList.add("plot-short");
    host.style.height = "125px";
    if (icon) {
      icon.classList.remove("fa-compress");
      icon.classList.add("fa-expand");
    }
  }

  if (this[plotKey]) {
    this[plotKey].drawPlot([this[this.pointSel].x, this[this.pointSel].y]);
  }
};

// ***************************************************************************************
// Linkage.drawIC - draws instant centers
// ***************************************************************************************
Linkage.prototype.drawIC = function () {
  this.ctx[4].clearRect(0, 0, this.can[4].width, this.can[4].height);
  this.drawGround(0);

  this.ctx[4].lineWidth = 1;
  this.ctx[4].save();
  this.ctx[4].translate(this.x0, this.y0);

  for (var j in this.connect) {
    this.ctx[4].strokeStyle = this.IC[this.connect[j][1]].pin.fillColor;
    this.ctx[4].beginPath();
    this.ctx[4].moveTo(this.IC[this.connect[j][0]].x, this.IC[this.connect[j][0]].y);
    this.ctx[4].lineTo(this.IC[this.connect[j][1]].x, this.IC[this.connect[j][1]].y);
    this.ctx[4].lineTo(this.IC[this.connect[j][2]].x, this.IC[this.connect[j][2]].y);
    this.ctx[4].stroke();
  }

  for (var i in this.IC) {
    this.IC[i].draw(this.ctx[4]);
  }

  this.ctx[4].restore();
};

// ***************************************************************************************
// Linkage.drawTrace - traces paths of selected pins
// ***************************************************************************************
Linkage.prototype.drawTrace = function () {
  this.ctx[0].lineWidth = 1;
  this.ctx[0].save();
  this.ctx[0].translate(this.x0, this.y0);

  for (var i in this.tracePoint) {
    this.ctx[0].strokeStyle = this.traceColor[i];
    this.ctx[0].beginPath();
    this.ctx[0].arc(this.tracePoint[i].x, this.tracePoint[i].y, 1, 0, 2 * Math.PI, true);
    this.ctx[0].closePath();
    this.ctx[0].stroke();
  }
  this.ctx[0].restore();
};

// **************************************************************************************
// Linkage.setPlotAttr - initialize a plot
// **************************************************************************************
Linkage.prototype.setPlotAttr = function (plotName, xColor, yColor, title, yLabel, yMin, yMax) {
  this[plotName].traces[0] = new Trace("x", xColor);
  this[plotName].traces[1] = new Trace("y", yColor);
  this[plotName].traces[2] = new Trace("x", xColor);
  this[plotName].traces[3] = new Trace("y", yColor);
  this[plotName].traces[4] = new Trace("x", xColor);
  this[plotName].traces[5] = new Trace("y", yColor);
  this[plotName].yMin = yMin;
  this[plotName].yMax = yMax;
  this[plotName].title = title;
  this[plotName].yLabel = yLabel;
  this[plotName].drawPlot([this[this.pointSel].x, this[this.pointSel].y]);
};

// *************************************************************************************
// Linkage.updatePlot - records first-cycle kinematics and updates SVG traces/cursor
// *************************************************************************************
Linkage.prototype.updatePlot = function (plotName, crankAngle) {
  var prefix = plotName.substr(4, 1).toLowerCase();
  var deg = (crankAngle * 180) / Math.PI;
  var plot = this[plotName];
  var activeIndices = [this[this.pointSel].x, this[this.pointSel].y];

  // Record points during the first full 360-degree revolution
  if (this.timeStep * this.deltaT <= plot.xMax - plot.xMin) {
    plot.traces[this.B.x].xVals.push(deg);
    plot.traces[this.B.x].yVals.push(this[prefix + "B"].x);
    plot.traces[this.B.y].xVals.push(deg);
    plot.traces[this.B.y].yVals.push(this[prefix + "B"].y);

    if (this.dP !== undefined) {
      plot.traces[this.P.x].xVals.push(deg);
      plot.traces[this.P.x].yVals.push(this[prefix + "P"].x);
      plot.traces[this.P.y].xVals.push(deg);
      plot.traces[this.P.y].yVals.push(this[prefix + "P"].y);
    }

    if (this.dC !== undefined) {
      plot.traces[this.C.x].xVals.push(deg);
      plot.traces[this.C.x].yVals.push(this[prefix + "C"].x);
      plot.traces[this.C.y].xVals.push(deg);
      plot.traces[this.C.y].yVals.push(this[prefix + "C"].y);
    }

    plot.stopIndex = this.timeStep;
    plot.drawTraces(activeIndices, this.timeStep, false);
  } else if (plot.stopIndex > 0) {
    // Subsequent cycles: keep full curve static and slide vertical cursor line
    var cycleIdx = ((this.timeStep - 1) % plot.stopIndex) + 1;
    plot.drawTraces(activeIndices, cycleIdx, true);
  }
};

// *************************************************************************************
// Linkage.updateLimits & initPlots
// *************************************************************************************
Linkage.prototype.updateLimits = function (point) {
  if (this.limits && this.limits[point]) {
    var lim = this.limits[point];
    if (lim.dis && this.plotDis) {
      this.plotDis.yMin = lim.dis[0];
      this.plotDis.yMax = lim.dis[1];
    }
    if (lim.vel && this.plotVel) {
      this.plotVel.yMin = lim.vel[0];
      this.plotVel.yMax = lim.vel[1];
    }
    if (lim.acc && this.plotAcc) {
      this.plotAcc.yMin = lim.acc[0];
      this.plotAcc.yMax = lim.acc[1];
    }
  }
};

Linkage.prototype.initPlots = function () {
  if (!this.showPlots || !this.plotDis) return;

  this.updateLimits(this.pointSel);
  var selectedIndices = [this[this.pointSel].x, this[this.pointSel].y];

  this.plotDis.drawPlot(selectedIndices);
  this.plotVel.drawPlot(selectedIndices);
  this.plotAcc.drawPlot(selectedIndices);
};