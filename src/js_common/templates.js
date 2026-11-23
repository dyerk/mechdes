function renderPlotRow(config) {
  var type = config.type;
  var label = config.label;
  var height = config.height || 100;
  var hostId = `plot-host-${config.id}-${type}`;

  return `
    <div class="plot-row mb-1" data-plot-container="${type}">
      <div class="d-flex align-items-stretch">
        <div class="y-axis-vertical text-muted fw-semibold d-flex align-items-center justify-content-center text-center pe-1" aria-hidden="true">
          <span>${label}</span>
        </div>

        <div class="flex-grow-1 position-relative">
          <div id="${hostId}" class="plot-svg-host plot-short" data-plot-host="${type}" style="height: ${height}px;"></div>
          <button type="button"
                  class="btn btn-sm plot-expand-btn position-absolute"
                  data-plot-resize="${type}"
                  aria-expanded="false"
                  aria-controls="${hostId}"
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
  var ariaDiagram = config.ariaDiagram || (title ? "Animation of " + title : "Mechanism animation");

  var colClass = showPlots ? 'col-12 col-lg-6' : 'col-12';

  var defaultPinDescriptions = {
    B: "B - Crank Pin",
    P: "P - Coupler Point",
    C: "C - Rocker Pin"
  };
  var pinLabels = config.pinLabels || {};

  var pinOptions = pins.map(function (p) {
    var label = pinLabels[p] || defaultPinDescriptions[p] || ("Point " + p);
    return `<option value="${p}">${label}</option>`;
  }).join('');

  var plotColumn = showPlots ? `
    <div class="col-12 col-lg-6">
      <div class="plotControl card shadow-sm border rounded bg-white text-dark">
        <div class="card-header bg-light py-2 px-3">
          <div class="d-flex align-items-center justify-content-between gap-2">
            <div class="d-flex align-items-center gap-2">
              <label for="sel-${id}" class="small fw-semibold text-uppercase text-secondary mb-0">Point:</label>
              <select id="sel-${id}" name="pointList" class="form-select form-select-sm w-auto" data-role="sel-pin">
                ${pinOptions}
              </select>
            </div>

            <!-- Added distinct line styles (solid vs dashed) alongside color -->
            <div class="d-flex align-items-center gap-3 small fw-semibold text-secondary" aria-label="Plot trace legend">
              <span class="d-flex align-items-center gap-1">
                <span class="legend-indicator legend-trace-x" aria-hidden="true"></span> X 
              </span>
              <span class="d-flex align-items-center gap-1">
                <span class="legend-indicator legend-trace-y" aria-hidden="true"></span> Y 
              </span>
            </div>
          </div>
        </div>

        <div class="card-body p-2">
          ${renderPlotRow({ id: id, type: 'dis', label: 'Displacement<br>[mm]', height: 100 })}
          ${renderPlotRow({ id: id, type: 'vel', label: 'Velocity<br>[mm/s]', height: 100 })}
          ${renderPlotRow({ id: id, type: 'acc', label: 'Acceleration<br>[mm/s²]', height: 116 })}

          <div class="text-center text-muted fw-semibold mt-1" style="font-size: 0.75rem;" aria-hidden="true">
            Crank Angle [deg]
          </div>
        </div>
      </div>
    </div>
  ` : '';

  return `
    <section id="item${id}"
             role="tabpanel"
             aria-labelledby="pill-${id}-tab"
             data-mechanism-id="${id}"
             class="animationContainer mb-4 ${isActive ? '' : 'd-none'}">
      <div class="row g-4 align-items-start">
        <div class="${colClass}">
          <figure class="figure w-100 m-0">
            <div class="animationCanvas border rounded-bottom p-2 bg-light">
              <!-- Single accessible image wrapper for the 5 stacked canvases -->
              <div class="canvas-wrapper" role="img" aria-label="${ariaDiagram}">
                <canvas class="canTrace" data-layer="0" width="500" height="400" aria-hidden="true"></canvas>
                <canvas class="canDraw z_2" data-layer="1" width="500" height="400" aria-hidden="true"></canvas>
                <canvas class="canDraw z_3" data-layer="2" width="500" height="400" aria-hidden="true"></canvas>
                <canvas class="canDraw z_4" data-layer="3" width="500" height="400" aria-hidden="true"></canvas>
                <canvas class="canDraw z_5" data-layer="4" width="500" height="400" aria-hidden="true"></canvas>
              </div>

              <!-- Polite live region for screen reader state announcements -->
              <div class="visually-hidden" aria-live="polite" data-role="sr-status"></div>

              <div class="d-flex justify-content-center gap-3 mt-2">
                <button type="button" class="btn btn-outline-primary" data-role="btn-play" aria-label="Play ${title} animation" aria-pressed="false">
                  <i class="fa-solid fa-circle-play fa-2xl" data-role="icon-play" aria-hidden="true"></i>
                </button>
                <button type="button" class="btn btn-outline-secondary" data-role="btn-reset" aria-label="Reset ${title} animation" disabled>
                  <i class="fa-solid fa-rotate-right fa-2xl button-disabled" data-role="icon-reset" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <figcaption class="figure-caption text-center mt-2">
              <h3 class="h6 mb-0 fw-semibold" data-role="caption"><b>${title}:</b> ${description}</h3>
            </figcaption>
          </figure>
        </div>

        ${plotColumn}
      </div>
    </section>
  `;
}

function renderMechanismTabs(configs, label) {
  var ariaLabel = label || "Animation Selection";
  var tabsHtml = configs.map(function (cfg, index) {
    var id = cfg.id;
    var tabTitle = cfg.tabTitle || cfg.title;
    var isActive = index === 0; // Select_Animation will sync URL ?sel= param on init

    return `
      <li class="nav-item" role="presentation">
        <button class="nav-link itemLinks ${isActive ? 'active' : ''}"
                data-pos="${index}"
                id="pill-${id}-tab"
                type="button"
                role="tab"
                aria-selected="${isActive ? 'true' : 'false'}"
                aria-controls="item${id}"
                tabindex="${isActive ? '0' : '-1'}">${tabTitle}</button>
      </li>
    `;
  }).join('');

  return `
    <div class="mt-3 border-bottom border-3">
      <ul id="sliderLinks"
          class="nav nav-pills justify-content-center bg-light p-2 rounded-top border"
          role="tablist"
          aria-label="${ariaLabel}">
        ${tabsHtml}
      </ul>
    </div>
  `;
}

function renderMechanismSet(configs, options) {
  options = options || {};
  var showTabs = options.showTabs !== undefined ? options.showTabs : configs.length > 1;
  var navHtml = showTabs ? renderMechanismTabs(configs, options.tabLabel) : '';
  var panelsHtml = configs.map(renderMechanismSection).join('');

  return navHtml + panelsHtml;
}

function renderCanvasPlayer(config) {
  var title = config.title || "";
  var ariaDiagram = config.ariaDiagram || (title ? "Animation of " + title : "Mechanism animation");
  var roundedClass = config.roundedClass || "rounded";
  var extraControlsHtml = config.extraControlsHtml || "";

  return `
    <div class="animationCanvas border ${roundedClass} p-2 bg-light">
      <!-- Single accessible image wrapper for the 5 stacked canvases -->
      <div class="canvas-wrapper" role="img" aria-label="${ariaDiagram}">
        <canvas class="canTrace" data-layer="0" width="500" height="400" aria-hidden="true"></canvas>
        <canvas class="canDraw z_2" data-layer="1" width="500" height="400" aria-hidden="true"></canvas>
        <canvas class="canDraw z_3" data-layer="2" width="500" height="400" aria-hidden="true"></canvas>
        <canvas class="canDraw z_4" data-layer="3" width="500" height="400" aria-hidden="true"></canvas>
        <canvas class="canDraw z_5" data-layer="4" width="500" height="400" aria-hidden="true"></canvas>
      </div>

      <!-- Polite live region for screen reader state announcements -->
      <div class="visually-hidden" aria-live="polite" data-role="sr-status"></div>

      <div class="d-flex justify-content-center gap-3 mt-2">
        <button type="button" class="btn btn-outline-primary" data-role="btn-play" aria-label="Play ${title} animation" aria-pressed="false">
          <i class="fa-solid fa-circle-play fa-2xl" data-role="icon-play" aria-hidden="true"></i>
        </button>
        <button type="button" class="btn btn-outline-secondary" data-role="btn-reset" aria-label="Reset ${title} animation" disabled>
          <i class="fa-solid fa-rotate-right fa-2xl button-disabled" data-role="icon-reset" aria-hidden="true"></i>
        </button>
      </div>

      ${extraControlsHtml}
    </div>
  `;
}

// Renders a single standalone canvas animation card with title & description at the bottom
function renderCanvasCard(config) {
  var colClass = config.colClass || "col-12 col-md-6";
  var title = config.title || "";
  var captionText = config.description ? `<b>${title}:</b> ${config.description}` : `<b>${title}</b>`;

  var imageHtml = "";
  if (config.image) {
    var imgAlt = config.image.alt || title;
    var imgCaption = config.image.caption || title;
    var imgHeight = config.image.height || 220;

    imageHtml = `
      <figure class="figure border p-3 rounded bg-light shadow-sm text-center w-100 mb-3 d-flex flex-column align-items-center justify-content-between">
        <div class="w-100" style="height: ${imgHeight}px;">
          <img src="${config.image.src}" class="w-100 h-100 bg-white rounded border shadow-sm object-fit-contain" alt="${imgAlt}">
        </div>
        <figcaption class="figure-caption text-center fw-semibold mt-2">
          ${imgCaption}
        </figcaption>
      </figure>
    `;
  }

  return `
    <div class="${colClass}">
      ${imageHtml}
      <figure class="figure w-100 m-0" data-mechanism-id="${config.id}">
        ${renderCanvasPlayer({
          title: title,
          ariaDiagram: config.ariaDiagram,
          roundedClass: "rounded",
          extraControlsHtml: config.extraControlsHtml
        })}
        <figcaption class="figure-caption text-center mt-2">
          <h4 class="h6 mb-0 fw-semibold" data-role="caption">${captionText}</h4>
        </figcaption>
      </figure>
    </div>
  `;
}

// Renders a grid row of standalone canvas cards
function renderCanvasGrid(configs, rowClass) {
  var cls = rowClass || "row g-4 align-items-start";
  return `<div class="${cls}">${configs.map(renderCanvasCard).join("")}</div>`;
}