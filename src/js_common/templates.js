// js_common/templates.js
// Generates HTML templates for mechanism animations and responsive SVG plots

function renderPlotCard(config) {
  var type = config.type;
  var title = config.title;
  var unit = config.unit;
  var isVisible = config.isVisible || false;

  return `
    <div class="plotCanvas ${isVisible ? '' : 'd-none'} mb-3 border rounded p-3 bg-white text-dark shadow-sm" data-plot-container="${type}">
      <!-- Plot Header: Title & Legend -->
      <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
        <h3 class="h6 mb-0 fw-semibold text-uppercase text-secondary">${title}</h3>
        
        <div class="d-flex align-items-center gap-3 small">
          <span class="d-flex align-items-center gap-1">
            <span class="legend-indicator legend-trace-x"></span> X
          </span>
          <span class="d-flex align-items-center gap-1">
            <span class="legend-indicator legend-trace-y"></span> Y
          </span>
          <button type="button" class="btn btn-sm btn-outline-secondary border-0 ms-2" data-plot-resize="${type}" aria-label="Resize ${title}">
            <i class="fa-solid fa-expand plotSizer" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <!-- Plot Workspace -->
      <div class="d-flex align-items-center">
        <div class="y-axis-label text-muted small fw-semibold text-nowrap me-1">
          ${unit}
        </div>
        <div class="flex-grow-1 position-relative plot-svg-host plot-short" data-plot-host="${type}" style="height: 125px;"></div>
      </div>

      <!-- X-Axis Label -->
      <div class="text-center text-muted small fw-semibold mt-1">
        Crank Angle [deg]
      </div>
    </div>
  `;
}

function renderMechanismSection(config) {
  var id = config.id;
  var title = config.title;
  var description = config.description;
  var showPlots = config.showPlots !== false;
  var pins = config.pins || ['B', 'P'];
  var isActive = config.isActive || false;

  var colClass = showPlots ? 'col-12 col-lg-6' : 'col-12';

  var pinOptions = pins.map(function (p) {
    return `<option value="${p}">Point ${p}</option>`;
  }).join('');

  var plotColumn = showPlots ? `
    <div class="col-12 col-lg-6">
      <div class="plotControl bg-light p-3 rounded-bottom border mb-3">
        <h3 class="h6 text-uppercase fw-bold text-secondary tracking-wide mb-2 pb-1 border-bottom">
          Plotting Controls
        </h3>

        <div class="row g-2 align-items-center">
          <div class="col-12 col-sm-4">
            <select name="pointList" class="form-select" data-role="sel-pin" aria-label="Select Point">
              ${pinOptions}
            </select>
          </div>
          <div class="col-12 col-sm-8 d-flex gap-1 justify-content-sm-end">
            <button type="button" aria-pressed="true" class="btn btn-sm btn-secondary active plotButton" data-plot-toggle="dis">
              Displacement <i class="fa-solid fa-chart-line" aria-hidden="true"></i>
            </button>
            <button type="button" aria-pressed="false" class="btn btn-sm btn-outline-secondary plotButton" data-plot-toggle="vel">
              Velocity <i class="fa-solid fa-chart-line" aria-hidden="true"></i>
            </button>
            <button type="button" aria-pressed="false" class="btn btn-sm btn-outline-secondary plotButton" data-plot-toggle="acc">
              Acceleration <i class="fa-solid fa-chart-line" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      ${renderPlotCard({ type: 'dis', title: 'Displacement Plot', unit: 'Disp [mm]', isVisible: true })}
      ${renderPlotCard({ type: 'vel', title: 'Velocity Plot', unit: 'Velocity [mm/s]', isVisible: false })}
      ${renderPlotCard({ type: 'acc', title: 'Acceleration Plot', unit: 'Accel [mm/s²]', isVisible: false })}
    </div>
  ` : '';

  return `
    <section id="item${id}" data-mechanism-id="${id}" class="animationContainer mb-4 ${isActive ? '' : 'd-none'}">
      <div class="row g-4 align-items-start">
        <!-- Left Column: Canvas Animation & Controls -->
        <div class="${colClass}">
          <figure class="figure w-100 m-0">
            <div class="animationCanvas border rounded-bottom p-2 bg-light">
              <div class="canvas-wrapper">
                <canvas class="canTrace" data-layer="0" width="500" height="400"></canvas>
                <canvas class="canDraw z_2" data-layer="1" width="500" height="400"></canvas>
                <canvas class="canDraw z_3" data-layer="2" width="500" height="400"></canvas>
                <canvas class="canDraw z_4" data-layer="3" width="500" height="400"></canvas>
                <canvas class="canDraw z_5" data-layer="4" width="500" height="400"></canvas>
              </div>

              <!-- Animation Controls -->
              <div class="d-flex justify-content-center gap-3 mt-2">
                <button type="button" class="btn btn-outline-primary" data-role="btn-play" aria-label="Play animation">
                  <i class="fa-solid fa-circle-play fa-2xl" data-role="icon-play" aria-hidden="true"></i>
                </button>
                <button type="button" class="btn btn-outline-secondary" data-role="btn-reset" aria-label="Reset animation" disabled>
                  <i class="fa-solid fa-rotate-right fa-2xl button-disabled" data-role="icon-reset" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <figcaption class="figure-caption text-center mt-2">
              <h3 class="h6 mb-0 fw-semibold" data-role="caption"><b>${title}:</b> ${description}</h3>
            </figcaption>
          </figure>
        </div>

        <!-- Right Column: Plot Controls & Display Graphs -->
        ${plotColumn}
      </div>
    </section>
  `;
}