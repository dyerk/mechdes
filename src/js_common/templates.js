// js_common/templates.js
// Generates HTML templates for mechanism animations and unified small-multiple plots

function renderPlotRow(config) {
  var type = config.type;
  var label = config.label;
  var height = config.height || 100;

  return `
    <div class="plot-row mb-1" data-plot-container="${type}">
      <div class="d-flex align-items-stretch">
        <!-- Sideways Vertical Y-Axis Label -->
        <div class="y-axis-vertical text-muted fw-semibold d-flex align-items-center justify-content-center pe-1">
          <span>${label}</span>
        </div>

        <!-- Full-Width Responsive SVG Host + Top-Right Chevron Overlay -->
        <div class="flex-grow-1 position-relative">
          <div class="plot-svg-host plot-short" data-plot-host="${type}" style="height: ${height}px;"></div>
          <button type="button"
                  class="btn btn-sm plot-expand-btn position-absolute"
                  data-plot-resize="${type}"
                  aria-label="Expand ${label} plot"
                  title="Expand/Collapse height">
            <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
          </button>
        </div>
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
      <div class="plotControl card shadow-sm border rounded bg-white text-dark">
        <!-- Unified Card Header: Point Selector & Shared Legend -->
        <div class="card-header bg-light py-2 px-3">
          <div class="d-flex align-items-center justify-content-between gap-2">
            <div class="d-flex align-items-center gap-2">
              <label for="sel-${id}" class="small fw-semibold text-uppercase text-secondary mb-0">Point:</label>
              <select id="sel-${id}" name="pointList" class="form-select form-select-sm w-auto" data-role="sel-pin">
                ${pinOptions}
              </select>
            </div>

            <div class="d-flex align-items-center gap-3 small fw-semibold text-secondary">
              <span class="d-flex align-items-center gap-1">
                <span class="legend-indicator legend-trace-x"></span> X
              </span>
              <span class="d-flex align-items-center gap-1">
                <span class="legend-indicator legend-trace-y"></span> Y
              </span>
            </div>
          </div>
        </div>

        <!-- Unified Card Body: Stacked Small Multiples -->
        <div class="card-body p-2">
          ${renderPlotRow({ type: 'dis', label: 'Disp [mm]', height: 100 })}
          ${renderPlotRow({ type: 'vel', label: 'Vel [mm/s]', height: 100 })}
          ${renderPlotRow({ type: 'acc', label: 'Accel [mm/s²]', height: 116 })}

          <!-- Shared Bottom X-Axis Title -->
          <div class="text-center text-muted fw-semibold mt-1" style="font-size: 0.75rem;">
            Crank Angle [deg]
          </div>
        </div>
      </div>
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

        <!-- Right Column: Unified Plot Card -->
        ${plotColumn}
      </div>
    </section>
  `;
}