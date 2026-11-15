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

  this.color = [
    "#FFFFFF", "#DDDDDD", "#AAAAAA", "#333333", "#000000",
    "#B0A1BA", "#F4F3F5", "#D5CEDA", "#8E779E", "#705285",
    "#1B998B", "#5FC1B7", "#37A69B", "#068376", "#00675C",
    "#C5D86D", "#F1FACA", "#E7F7A3", "#9CB13E", "#778B1C",
    "#99621E", "#E2AE6E", "#B9813D", "#724105", "#482800"
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

Linkage.prototype.buttonCanvas = function (pageID, x0, y0) {
  var linkage = this;
  this.root = document.querySelector('[data-mechanism-id="' + pageID + '"]');

  if (!this.root) {
    console.error("Mechanism container not found for ID:", pageID);
    return;
  }

  this.btnPlay = this.root.querySelector('[data-role="btn-play"]');
  this.btnReset = this.root.querySelector('[data-role="btn-reset"]');
  this.iconPlay = this.root.querySelector('[data-role="icon-play"]');
  this.iconReset = this.root.querySelector('[data-role="icon-reset"]');
  this.srStatus = this.root.querySelector('[data-role="sr-status"]');

  if (!this.btnPlay || !this.btnReset) {
    console.error("Play/Reset buttons not found inside [data-mechanism-id='" + pageID + "']");
    return;
  }

  // Store initial accessible labels so pause/reset restore mechanism-specific names
  this.playLabelDefault = this.btnPlay.getAttribute("aria-label") || "Play animation";
  this.pauseLabelDefault = this.playLabelDefault.replace(/^Play\b/i, "Pause");

  this.btnPlay.addEventListener("click", function () {
    linkage.eventPlay();
  });
  this.btnReset.addEventListener("click", function () {
    linkage.eventReset();
  });

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

  var plotControl = this.root.querySelector(".plotControl");
  if (this.showPlots && plotControl) {
    this.selPin = this.root.querySelector('[data-role="sel-pin"]');
    this.pointSel = this.selPin.value || "B";

    this.B = { x: 0, y: 1 };
    this.P = { x: 2, y: 3 };
    this.C = { x: 4, y: 5 };

    this.selPin.addEventListener("change", function () {
      linkage.pointSel = linkage.selPin.value;
      linkage.initPlots();
      linkage.drawPinLabels();
      linkage.announceStatus("Plots updated for Point " + linkage.pointSel + ".");
    });

    // Plot height expand/collapse chevron buttons
    var resizeBtns = this.root.querySelectorAll("[data-plot-resize]");
    resizeBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var type = btn.getAttribute("data-plot-resize");
        linkage.eventPlotResize(type, btn);
      });
    });

    // Instantiate SVG Plots (bottom plot 'acc' permanently owns the shared X-axis ticks)
    this.plotDis = new Plot(this.root.querySelector('[data-plot-host="dis"]'), { showXAxis: false });
    this.setPlotAttr("plotDis", this.color[24], this.color[14], "DISPLACEMENT PLOT", "Disp [mm]", -10, 10);

    this.plotVel = new Plot(this.root.querySelector('[data-plot-host="vel"]'), { showXAxis: false });
    this.setPlotAttr("plotVel", this.color[24], this.color[14], "VELOCITY PLOT", "Velocity [mm/s]", -10, 10);

    this.plotAcc = new Plot(this.root.querySelector('[data-plot-host="acc"]'), { showXAxis: true });
    this.setPlotAttr("plotAcc", this.color[24], this.color[14], "ACCELERATION PLOT", "Accel [mm/s²]", -10, 10);
  }
};

// Helper to update the polite screen-reader live region
Linkage.prototype.announceStatus = function (message) {
  if (!this.srStatus) return;
  this.srStatus.textContent = "";
  var srEl = this.srStatus;
  setTimeout(function () {
    srEl.textContent = message;
  }, 50);
};

// ****************************************************************************************
// Linkage.precomputePlots - computes the full 360-deg cycle on load, tunes Y-axis limits,
// draws the complete curves immediately, and resets the mechanism back to t = 0.
// ****************************************************************************************
Linkage.prototype.precomputePlots = function () {
  if (!this.showPlots || !this.plotDis) return;

  var maxSteps = Math.round((this.plotDis.xMax - this.plotDis.xMin) / this.deltaT);

  // Clear any prior trace arrays
  var plots = [this.plotDis, this.plotVel, this.plotAcc];
  for (var p = 0; p < plots.length; p++) {
    plots[p].isPrecomputed = false;
    for (var t = 0; t < plots[p].traces.length; t++) {
      plots[p].traces[t].xVals = [0];
      plots[p].traces[t].yVals = [0];
    }
  }

  // Silently step through 0 -> 360 deg to populate all kinematic arrays
  for (var s = 1; s <= maxSteps; s++) {
    this.timeStep = s;
    var crankAngle;
    if (this.isGrashof) {
      crankAngle = (this.deltaT * this.timeStep * Math.PI) / 180;
    } else {
      var amp = (0.999 * (this.crankMax - this.crankMin)) / 2;
      var off = (this.crankMax + this.crankMin) / 2;
      crankAngle = -amp * Math.cos((Math.PI * this.timeStep * this.deltaT) / 180) + off;
    }

    if (typeof this.calcKinematics === "function") {
      this.calcKinematics(crankAngle);
    } else {
      this.draw(crankAngle);
    }

    this._recordStepData("plotDis", crankAngle);
    this._recordStepData("plotVel", crankAngle);
    this._recordStepData("plotAcc", crankAngle);
  }

  // Mark plots as precomputed, auto-fit Y bounds, and render full polylines immediately
  var selectedIndices = [this[this.pointSel].x, this[this.pointSel].y];
  for (var k = 0; k < plots.length; k++) {
    plots[k].stopIndex = maxSteps;
    plots[k].isPrecomputed = true;
    plots[k].drawPlot(selectedIndices);
    plots[k].setCursorIndex(1);
  }

  // Reset mechanism canvases & timeStep back to 0 without wiping the precomputed plots
  for (var c = 0; c < 5; c++) {
    this.ctx[c].clearRect(0, 0, this.can[c].width, this.can[c].height);
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
  this.drawPinLabels();
};

// Internal helper to push one angle step into a plot's trace arrays
Linkage.prototype._recordStepData = function (plotName, crankAngle) {
  var prefix = plotName.substr(4, 1).toLowerCase();
  var deg = (crankAngle * 180) / Math.PI;
  var plot = this[plotName];

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
};

Linkage.prototype.eventPlay = function () {
  var linkage = this;
  this.isPlaying = !this.isPlaying;

  if (this.isPlaying) {
    this.iconPlay.classList.remove("fa-circle-play");
    this.iconPlay.classList.add("fa-circle-stop");
    this.btnPlay.setAttribute("aria-pressed", "true");
    this.btnPlay.setAttribute("aria-label", this.pauseLabelDefault);
    this.btnReset.disabled = false;
    this.iconReset.classList.remove("button-disabled");
    this.announceStatus("Animation playing.");
  } else {
    this.iconPlay.classList.remove("fa-circle-stop");
    this.iconPlay.classList.add("fa-circle-play");
    this.btnPlay.setAttribute("aria-pressed", "false");
    this.btnPlay.setAttribute("aria-label", this.playLabelDefault);
    this.announceStatus("Animation paused.");
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
    linkage.drawPinLabels();

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

Linkage.prototype.eventReset = function () {
  if (this.isPlaying) {
    this.isPlaying = false;
    this.iconPlay.classList.remove("fa-circle-stop");
    this.iconPlay.classList.add("fa-circle-play");
  }

  this.btnPlay.setAttribute("aria-pressed", "false");
  this.btnPlay.setAttribute("aria-label", this.playLabelDefault);
  this.btnReset.disabled = true;
  this.iconReset.classList.add("button-disabled");
  this.announceStatus("Animation reset to initial position.");

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
  this.drawPinLabels();

  if (this.showPlots && this.plotDis) {
    this.plotDis.resetTraces();
    this.plotVel.resetTraces();
    this.plotAcc.resetTraces();
  }
};

Linkage.prototype.eventPlotResize = function (type, btn) {
  var host = this.root.querySelector('[data-plot-host="' + type + '"]');
  var icon = btn.querySelector("i");
  var plotKey = "plot" + type.charAt(0).toUpperCase() + type.slice(1);
  var extraBottom = type === "acc" ? 16 : 0;
  var currentLabel = btn.getAttribute("aria-label") || "Expand plot";

  if (host.classList.contains("plot-short")) {
    host.classList.remove("plot-short");
    host.classList.add("plot-tall");
    host.style.height = (200 + extraBottom) + "px";
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", currentLabel.replace(/^Expand\b/i, "Collapse"));
    if (icon) {
      icon.classList.remove("fa-chevron-down");
      icon.classList.add("fa-chevron-up");
    }
  } else {
    host.classList.remove("plot-tall");
    host.classList.add("plot-short");
    host.style.height = (100 + extraBottom) + "px";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", currentLabel.replace(/^Collapse\b/i, "Expand"));
    if (icon) {
      icon.classList.remove("fa-chevron-up");
      icon.classList.add("fa-chevron-down");
    }
  }

  if (this[plotKey]) {
    this[plotKey].drawPlot([this[this.pointSel].x, this[this.pointSel].y]);
  }
};

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

Linkage.prototype.updatePlot = function (plotName, crankAngle) {
  var plot = this[plotName];
  var activeIndices = [this[this.pointSel].x, this[this.pointSel].y];

  // If precomputed on load, simply move the vertical cursor along the existing curve
  if (plot.isPrecomputed && plot.stopIndex > 0) {
    var cycleIdx = ((this.timeStep - 1) % plot.stopIndex) + 1;
    plot.drawTraces(activeIndices, cycleIdx, true);
    return;
  }

  // Fallback live-recording path if precomputePlots() wasn't called
  if (this.timeStep * this.deltaT <= plot.xMax - plot.xMin) {
    this._recordStepData(plotName, crankAngle);
    plot.stopIndex = this.timeStep;
    plot.drawTraces(activeIndices, this.timeStep, false);
  } else if (plot.stopIndex > 0) {
    var loopIdx = ((this.timeStep - 1) % plot.stopIndex) + 1;
    plot.drawTraces(activeIndices, loopIdx, true);
  }
};

Linkage.prototype.updateLimits = function (point) {
  if (this.limits && this.limits[point]) {
    var lim = this.limits[point];
    if (lim.dis && this.plotDis) {
      this.plotDis.yBounds = "manual";
      this.plotDis.yMin = lim.dis[0];
      this.plotDis.yMax = lim.dis[1];
    }
    if (lim.vel && this.plotVel) {
      this.plotVel.yBounds = "manual";
      this.plotVel.yMin = lim.vel[0];
      this.plotVel.yMax = lim.vel[1];
    }
    if (lim.acc && this.plotAcc) {
      this.plotAcc.yBounds = "manual";
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

  if (this.plotDis.isPrecomputed) {
    var idx = this.timeStep > 0 ? ((this.timeStep - 1) % this.plotDis.stopIndex) + 1 : 1;
    this.plotDis.setCursorIndex(idx);
    this.plotVel.setCursorIndex(idx);
    this.plotAcc.setCursorIndex(idx);
  }
};

// Draws high-contrast labels ("B", "P", "C") and highlights the currently selected point
Linkage.prototype.drawPinLabels = function () {
  if (!this.showPlots || !this.tracePoint || !this.ctx || !this.ctx[4]) return;

  // Read the configured point keys directly from the <select> options (e.g., ["B", "C"])
  var activeKeys = [];
  if (this.selPin && this.selPin.options) {
    for (var o = 0; o < this.selPin.options.length; o++) {
      activeKeys.push(this.selPin.options[o].value);
    }
  } else {
    activeKeys = ["B"];
    if (this.dP !== undefined) activeKeys.push("P");
    if (this.dC !== undefined) activeKeys.push("C");
  }

  var pointDefs = activeKeys.map(function (key, i) {
    return {
      key: key,
      idx: i,
      color: this.traceColor[i] || this.traceColor[0]
    };
  }, this);

  // Use layer 4 (top layer) unless Instant Centers are currently occupying layer 4
  var layerIdx = this.showIC ? 3 : 4;
  var ctx = this.ctx[layerIdx];

  if (!this.showIC) {
    ctx.clearRect(0, 0, this.can[layerIdx].width, this.can[layerIdx].height);
  }

  ctx.save();
  ctx.translate(this.x0, this.y0);
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";

  for (var i = 0; i < pointDefs.length; i++) {
    var def = pointDefs[i];
    var pt = this.tracePoint[def.idx];

    // Skip if this mechanism doesn't define that point (e.g., Threebar has no C, Slider-Crank has no P)
    if (!pt || this["d" + def.key] === undefined) continue;

    var isSelected = this.pointSel === def.key;

    // 1. Draw colored ring around the pin (thicker & pulsing-style double ring when selected)
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, isSelected ? 10 : 7, 0, 2 * Math.PI);
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.strokeStyle = isSelected ? "#dc3545" : def.color;
    ctx.stroke();

    // 2. Draw crisp white halo behind dark text so it stays readable over moving bars
    var labelX = pt.x + 10;
    var labelY = pt.y - 8;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#FFFFFF";
    ctx.strokeText(def.key, labelX, labelY);

    ctx.fillStyle = isSelected ? "#dc3545" : "#000000";
    ctx.fillText(def.key, labelX, labelY);
  }

  ctx.restore();
};