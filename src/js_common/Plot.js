// js_common/Plot.js
// Generates responsive HTML/SVG line plots with shared X-axis & automatic Y-axis scaling

function Trace(traceName, traceColor) {
  this.traceName = traceName;
  this.traceColor = traceColor;
  this.traceWidth = 2;
  this.xVals = [0];
  this.yVals = [0];
  this.vMin = 0;
  this.vMax = 0;
}

function Plot(hostElement, options) {
  this.host = hostElement;
  this.svgNS = "http://www.w3.org/2000/svg";
  options = options || {};

  this.showXAxis = options.showXAxis !== undefined ? options.showXAxis : true;

  // Layout offsets
  this.l = 42;
  this.r = 12;
  this.t = 6;
  this.b = this.showXAxis ? 20 : 4;

  this.xMin = 0;
  this.xMax = 360;
  this.nXGrid = 9;

  this.yBounds = options.yBounds || "auto";
  this.yMin = -10;
  this.yMax = 10;
  this.nYGrid = 5;

  this.plotColor = "#FAFAFA";
  this.gridColor = "#CCCCCC";

  this.traces = [];
  this.activeTraceIndices = [0, 1];
  this.stopIndex = 0;
  this.isPrecomputed = false;
  this.currentCursorIndex = 1;

  this.xLabel = "Crank Angle [deg]";
  this.yLabel = "Disp [mm]";
  this.title = "Displacement vs. Crank Angle";

  this.svg = document.createElementNS(this.svgNS, "svg");
  this.svg.setAttribute("class", "w-100 h-100 d-block");
  this.svg.setAttribute("role", "img");
  this.svg.style.overflow = "visible";

  var uid = "plot-" + Math.random().toString(36).substr(2, 9);
  this.svgTitle = this._createEl("title", { id: uid + "-title" });
  this.svgDesc = this._createEl("desc", { id: uid + "-desc" });
  this.svg.setAttribute("aria-labelledby", uid + "-title " + uid + "-desc");

  this.svg.appendChild(this.svgTitle);
  this.svg.appendChild(this.svgDesc);

  this.gridGroup = this._createEl("g", { class: "plot-grid", "aria-hidden": "true" });

  this.host.innerHTML = "";
  this.host.appendChild(this.svg);

  this.gridGroup = this._createEl("g", { class: "plot-grid" });
  this.traceGroup = this._createEl("g", { class: "plot-traces" });
  this.cursorLine = this._createEl("line", {
    stroke: "#dc3545",
    "stroke-width": "1.5",
    "stroke-dasharray": "3,3",
    visibility: "hidden"
  });

  this.svg.appendChild(this.gridGroup);
  this.svg.appendChild(this.traceGroup);
  this.svg.appendChild(this.cursorLine);

  this.polylines = [];

  var self = this;
  if (typeof ResizeObserver !== "undefined") {
    this.resizeObserver = new ResizeObserver(function () {
      if (self.host.clientWidth > 0 && self.host.clientHeight > 0) {
        self.drawPlot(self.activeTraceIndices);
        if (self.isPrecomputed) {
          self.setCursorIndex(self.currentCursorIndex);
        }
      }
    });
    this.resizeObserver.observe(this.host);
  }
}

Plot.prototype._createEl = function (tag, attrs) {
  var el = document.createElementNS(this.svgNS, tag);
  if (attrs) {
    for (var key in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) {
        el.setAttribute(key, attrs[key]);
      }
    }
  }
  return el;
};

Plot.prototype.setShowXAxis = function (show) {
  if (this.showXAxis === show) return;
  this.showXAxis = show;
  this.b = show ? 20 : 4;
  this.drawPlot(this.activeTraceIndices);
};

Plot.prototype.checkSize = function () {
  this.width = this.host.clientWidth || 500;
  this.height = this.host.clientHeight || (this.host.classList.contains("plot-tall") ? 200 : 100);

  this.svg.setAttribute("viewBox", "0 0 " + this.width + " " + this.height);

  this.w = Math.max(10, this.width - this.l - this.r);
  this.h = Math.max(10, this.height - this.t - this.b);
};

Plot.prototype.computeAutoBounds = function () {
  if (this.yBounds !== "auto" || !this.traces.length) return false;

  var dataMin = Infinity;
  var dataMax = -Infinity;
  var hasPoints = false;

  for (var i = 0; i < this.activeTraceIndices.length; i++) {
    var idx = this.activeTraceIndices[i];
    var trace = this.traces[idx];
    if (!trace || trace.yVals.length <= 1) continue;

    for (var p = 1; p < trace.yVals.length; p++) {
      var val = trace.yVals[p];
      if (!isNaN(val) && isFinite(val)) {
        hasPoints = true;
        if (val < dataMin) dataMin = val;
        if (val > dataMax) dataMax = val;
      }
    }
  }

  if (!hasPoints) {
    this.yMin = -10;
    this.yMax = 10;
    return false;
  }

  var span = dataMax - dataMin;
  var pad = span > 0 ? span * 0.1 : Math.max(1, Math.abs(dataMax) * 0.15);

  var targetMin = dataMin - pad;
  var targetMax = dataMax + pad;

  if (targetMin > 0 && targetMin < span * 0.25) targetMin = 0;
  if (targetMax < 0 && Math.abs(targetMax) < span * 0.25) targetMax = 0;

  if (dataMin < this.yMin || dataMax > this.yMax) {
    this.yMin = Math.min(this.yMin, targetMin);
    this.yMax = Math.max(this.yMax, targetMax);
    return true;
  }

  return false;
};

Plot.prototype.drawPlot = function (traceList) {
  if (traceList) {
    this.activeTraceIndices = traceList;
  }
  if (this.yBounds === "auto") {
    this.yMin = Infinity;
    this.yMax = -Infinity;
    this.computeAutoBounds();
  }
  this.checkSize();
  this.drawGrid();
  this.rebuildPolylines();
  this.updateAccessibleSummary();
};

Plot.prototype.drawGrid = function () {
  this.gridGroup.innerHTML = "";

  this.gridGroup.appendChild(this._createEl("rect", {
    x: this.l,
    y: this.t,
    width: this.w,
    height: this.h,
    fill: this.plotColor,
    stroke: this.lineColor,
    "stroke-width": 1
  }));

  var yTicks = this.generateYTicks();
  for (var j = 0; j < yTicks.length; j++) {
    var val = yTicks[j];
    var yPos = Math.round(this.t + this.h - ((val - this.yMin) / (this.yMax - this.yMin)) * this.h) + 0.5;

    var label = this._createEl("text", {
      x: this.l - 5,
      y: yPos,
      fill: this.lineColor,
      "font-size": "11px",
      "font-weight": "500",
      "text-anchor": "end",
      "dominant-baseline": "middle"
    });
    label.textContent = Math.abs(val) < 1 && val !== 0 ? val.toFixed(1) : val.toFixed(0);
    this.gridGroup.appendChild(label);

    if (val !== this.yMin && val !== this.yMax) {
      this.gridGroup.appendChild(this._createEl("line", {
        x1: this.l,
        y1: yPos,
        x2: this.l + this.w,
        y2: yPos,
        stroke: val === 0 ? this.lineColor : this.gridColor,
        "stroke-width": 1,
        "stroke-dasharray": val === 0 ? "none" : "2,4"
      }));
    }
  }

  for (var k = 0; k < this.nXGrid; k++) {
    var pct = k / (this.nXGrid - 1);
    var xPos = Math.round(this.lerp(this.l, this.l + this.w, pct)) + 0.5;

    if (this.showXAxis) {
      var xVal = this.lerp(this.xMin, this.xMax, pct);
      var xLabel = this._createEl("text", {
        x: xPos,
        y: this.t + this.h + 13,
        fill: this.lineColor,
        "font-size": "11px",
        "font-weight": "500",
        "text-anchor": "middle"
      });
      xLabel.textContent = xVal.toFixed(0);
      this.gridGroup.appendChild(xLabel);
    }

    if (k > 0 && k < this.nXGrid - 1) {
      this.gridGroup.appendChild(this._createEl("line", {
        x1: xPos,
        y1: this.t,
        x2: xPos,
        y2: this.t + this.h,
        stroke: this.gridColor,
        "stroke-width": 1,
        "stroke-dasharray": "2,4"
      }));
    }
  }

  this.yZero = this.t + this.scaleToPlot("y", this.yMax);
  this.xZero = this.l + this.w - this.scaleToPlot("x", this.xMax);

  this.cursorLine.setAttribute("y1", this.t);
  this.cursorLine.setAttribute("y2", this.t + this.h);
};

Plot.prototype.rebuildPolylines = function () {
  this.traceGroup.innerHTML = "";
  this.polylines = [];

  for (var i = 0; i < this.activeTraceIndices.length; i++) {
    var traceIdx = this.activeTraceIndices[i];
    var trace = this.traces[traceIdx];
    if (!trace) continue;

    var polyAttrs = {
      fill: "none",
      stroke: trace.traceColor,
      "stroke-width": trace.traceWidth,
      "stroke-linejoin": "round",
      "stroke-linecap": "round"
    };
    if (trace.traceName === "y") {
      polyAttrs["stroke-dasharray"] = "6,3";
    }
    var poly = this._createEl("polyline", polyAttrs);

    var pts = [];
    for (var p = 1; p < trace.xVals.length; p++) {
      var xVal = trace.xVals[p];
      var yVal = trace.yVals[p];
      if (!isFinite(xVal) || !isFinite(yVal)) continue;

      var px = this.xZero + this.scaleToPlot("x", xVal);
      var py = this.yZero - this.scaleToPlot("y", yVal);
      if (isFinite(px) && isFinite(py)) {
        pts.push(px.toFixed(1) + "," + py.toFixed(1));
      }
    }
    poly.setAttribute("points", pts.join(" "));

    this.traceGroup.appendChild(poly);
    this.polylines.push({ traceIdx: traceIdx, el: poly });
  }
};
// Positions the red vertical cursor at a specific trace sample index
Plot.prototype.setCursorIndex = function (index) {
  var firstTraceIdx = this.activeTraceIndices[0];
  var trace = this.traces[firstTraceIdx];
  if (!trace || trace.xVals.length <= 1) return;

  var safeIdx = Math.max(1, Math.min(index, trace.xVals.length - 1));
  this.currentCursorIndex = safeIdx;

  var px = this.xZero + this.scaleToPlot("x", trace.xVals[safeIdx]);
  this.cursorLine.setAttribute("x1", px.toFixed(1));
  this.cursorLine.setAttribute("x2", px.toFixed(1));
  this.cursorLine.setAttribute("visibility", "visible");
};

Plot.prototype.drawTraces = function (traceList, index, isCycleComplete) {
  if (traceList) {
    this.activeTraceIndices = traceList;
  }

  if (!isCycleComplete) {
    var xVal = trace.xVals[index];
    var yVal = trace.yVals[index];
    if (isFinite(xVal) && isFinite(yVal)) {
      var px = this.xZero + this.scaleToPlot("x", xVal);
      var py = this.yZero - this.scaleToPlot("y", yVal);
      if (isFinite(px) && isFinite(py)) {
        var currentPts = item.el.getAttribute("points");
        var nextPt = px.toFixed(1) + "," + py.toFixed(1);
        item.el.setAttribute("points", currentPts ? currentPts + " " + nextPt : nextPt);
      }
    }
  }

  for (var i = 0; i < this.polylines.length; i++) {
    var item = this.polylines[i];
    var trace = this.traces[item.traceIdx];
    if (!trace || index >= trace.xVals.length) continue;

    if (!isCycleComplete) {
      var px = this.xZero + this.scaleToPlot("x", trace.xVals[index]);
      var py = this.yZero - this.scaleToPlot("y", trace.yVals[index]);
      var currentPts = item.el.getAttribute("points");
      var nextPt = px.toFixed(1) + "," + py.toFixed(1);
      item.el.setAttribute("points", currentPts ? currentPts + " " + nextPt : nextPt);
    }
  }

  this.setCursorIndex(index);
};

Plot.prototype.resetTraces = function () {
  if (this.isPrecomputed) {
    this.setCursorIndex(1);
    return;
  }

  this.stopIndex = 0;
  for (var i = 0; i < this.traces.length; i++) {
    this.traces[i].xVals = [0];
    this.traces[i].yVals = [0];
  }
  if (this.yBounds === "auto") {
    this.yMin = -10;
    this.yMax = 10;
  }
  this.cursorLine.setAttribute("visibility", "hidden");
  this.drawPlot(this.activeTraceIndices);
};

Plot.prototype.lerp = function (min, max, percent) {
  return (1 - percent) * min + percent * max;
};

Plot.prototype.scaleToPlot = function (axis, val) {
  if (axis.toLowerCase() === "x") {
    return (val * this.w) / (this.xMax - this.xMin);
  }
  if (axis.toLowerCase() === "y") {
    return (val * this.h) / (this.yMax - this.yMin);
  }
  return 0;
};

Plot.prototype.getNiceStepSize = function (yMin, yMax, targetTicks) {
  var range = yMax - yMin;
  if (range <= 0 || !isFinite(range)) return 5;
  var rawStep = range / (targetTicks || 5);
  var exponent = Math.floor(Math.log10(rawStep));
  var fraction = rawStep / Math.pow(10, exponent);

  var niceFraction;
  if (fraction < 1.5) niceFraction = 1;
  else if (fraction < 3) niceFraction = 2;
  else if (fraction < 7) niceFraction = 5;
  else niceFraction = 10;

  return niceFraction * Math.pow(10, exponent);
};

Plot.prototype.generateYTicks = function () {
  if (!isFinite(this.yMin) || !isFinite(this.yMax) || this.yMin >= this.yMax) {
    this.yMin = -10;
    this.yMax = 10;
  }

  var targetTicks = this.nYGrid || 5;
  var step = this.getNiceStepSize(this.yMin, this.yMax, targetTicks);

  if (this.yMin < 0) {
    this.yMin = Math.floor(this.yMin / step) * step;
  } else if (this.yMin > 0) {
    this.yMin = Math.max(0, Math.floor(this.yMin / step) * step);
  }

  if (this.yMax > 0) {
    this.yMax = Math.ceil(this.yMax / step) * step;
  } else if (this.yMax < 0) {
    this.yMax = Math.min(0, Math.ceil(this.yMax / step) * step);
  }

  var ticks = [];
  var current = this.yMin;
  while (current <= this.yMax + step / 2) {
    ticks.push(Math.round(current * 1000) / 1000);
    current += step;
  }
  return ticks;
};

Plot.prototype.updateAccessibleSummary = function () {
  if (!this.svgTitle || !this.svgDesc) return;
  this.svgTitle.textContent = this.title + " (" + this.yLabel + " vs. " + this.xLabel + ")";

  var parts = [];
  for (var i = 0; i < this.activeTraceIndices.length; i++) {
    var trace = this.traces[this.activeTraceIndices[i]];
    if (!trace || trace.yVals.length <= 1) continue;

    var min = Infinity, max = -Infinity, minDeg = 0, maxDeg = 0;
    for (var p = 1; p < trace.yVals.length; p++) {
      var v = trace.yVals[p];
      if (v < min) { min = v; minDeg = trace.xVals[p]; }
      if (v > max) { max = v; maxDeg = trace.xVals[p]; }
    }
    if (isFinite(min) && isFinite(max)) {
      parts.push(
        trace.traceName.toUpperCase() + " component ranges from " +
        min.toFixed(1) + " at " + Math.round(minDeg) + " degrees to " +
        max.toFixed(1) + " at " + Math.round(maxDeg) + " degrees."
      );
    }
  }
  this.svgDesc.textContent = parts.join(" ");
};