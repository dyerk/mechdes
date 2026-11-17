"use strict";
window.onload = init;

// ********************************************************************************
// function init() - initializes javascript on html page
// ********************************************************************************
function init() {
  // 1. Render standalone canvas grids for each section
  document.getElementById("carrier-fixed-mount").innerHTML = renderCanvasGrid([
    {
      id: "01",
      title: "Carrier Fixed - Sun Input",
      ariaDiagram: "Animation of carrier-fixed planetary gearset driven by the sun gear"
    },
    {
      id: "02",
      title: "Carrier Fixed - Ring Input",
      ariaDiagram: "Animation of carrier-fixed planetary gearset driven by the ring gear"
    }
  ]);

  document.getElementById("sun-fixed-mount").innerHTML = renderCanvasGrid([
    {
      id: "03",
      title: "Sun Fixed - Carrier Input",
      ariaDiagram: "Animation of sun-fixed planetary gearset driven by the carrier"
    },
    {
      id: "04",
      title: "Sun Fixed - Ring Input",
      ariaDiagram: "Animation of sun-fixed planetary gearset driven by the ring gear"
    }
  ]);

  document.getElementById("ring-fixed-mount").innerHTML = renderCanvasGrid([
    {
      id: "05",
      title: "Ring Fixed - Sun Input",
      ariaDiagram: "Animation of ring-fixed planetary gearset driven by the sun gear"
    },
    {
      id: "06",
      title: "Ring Fixed - Carrier Input",
      ariaDiagram: "Animation of ring-fixed planetary gearset driven by the carrier"
    }
  ]);

  var interactiveFieldset = `
    <fieldset class="w-100 border rounded p-3 bg-white mt-3" aria-label="Interactive Planetary Gearset Controls">
      <legend class="h6 fw-bold mb-3">Planetary Gear Inputs and Speeds</legend>

      <datalist id="speedTicks">
        <option value="-20" label="-20"></option>
        <option value="-10" label="-10"></option>
        <option value="0" label="0"></option>
        <option value="10" label="10"></option>
        <option value="20" label="20"></option>
      </datalist>

      <!-- Sun Control Group -->
      <div class="d-flex align-items-center gap-2 mb-3 w-100">
        <label for="07sliderSun" class="form-label mb-0 fw-semibold text-nowrap" style="min-width: 90px;">
          Sun Speed:
        </label>
        <input type="range" class="form-range flex-grow-1" id="07sliderSun" min="-20" max="20" value="5" step="1" list="speedTicks" />
        <output id="07valSun" for="07sliderSun" class="fw-bold text-end" style="min-width: 2.5rem;" aria-live="polite">5</output>
        <div class="form-check mb-0 ms-2 text-nowrap">
          <input type="radio" class="form-check-input" id="07btnSelectSun" name="gearOutput07" value="sun" />
          <label for="07btnSelectSun" class="form-check-label small">Output</label>
        </div>
      </div>

      <!-- Ring Control Group -->
      <div class="d-flex align-items-center gap-2 mb-3 w-100">
        <label for="07sliderRing" class="form-label mb-0 fw-semibold text-nowrap" style="min-width: 90px;">
          Ring Speed:
        </label>
        <input type="range" class="form-range flex-grow-1" id="07sliderRing" min="-20" max="20" value="5" step="1" list="speedTicks" />
        <output id="07valRing" for="07sliderRing" class="fw-bold text-end" style="min-width: 2.5rem;" aria-live="polite">5</output>
        <div class="form-check mb-0 ms-2 text-nowrap">
          <input type="radio" class="form-check-input" id="07btnSelectRing" name="gearOutput07" value="ring" />
          <label for="07btnSelectRing" class="form-check-label small">Output</label>
        </div>
      </div>

      <!-- Carrier Control Group -->
      <div class="d-flex align-items-center gap-2 w-100">
        <label for="07sliderCarrier" class="form-label mb-0 fw-semibold text-nowrap" style="min-width: 90px;">
          Carrier Speed:
        </label>
        <input type="range" class="form-range flex-grow-1" id="07sliderCarrier" min="-20" max="20" value="0" step="1" list="speedTicks" disabled />
        <output id="07valCarrier" for="07sliderCarrier" class="fw-bold text-end" style="min-width: 2.5rem;" aria-live="polite">0</output>
        <div class="form-check mb-0 ms-2 text-nowrap">
          <input type="radio" class="form-check-input" id="07btnSelectCarrier" name="gearOutput07" value="carrier" checked />
          <label for="07btnSelectCarrier" class="form-check-label small">Output</label>
        </div>
      </div>
    </fieldset>
  `;

  document.getElementById("interactive-mount").innerHTML = renderCanvasGrid([
    {
      id: "07",
      colClass: "col-12 col-md-8 col-lg-6",
      title: "Interactive Planetary",
      description: "Adjust sliders to vary component speeds and buttons to select an output component.",
      ariaDiagram: "Interactive planetary powertrain simulation with adjustable sun, ring, and carrier speeds",
      extraControlsHtml: interactiveFieldset
    }
  ], "row justify-content-center g-4");

  // 2. Initialize the animations
  var Ns = 32; // number of teeth on sun
  var Np = 16; // number of teeth on planet

  var fixedConfigs = [
    { id: "01", input: "sun",  fixed: "arm"  },
    { id: "02", input: "ring", fixed: "arm"  },
    { id: "03", input: "arm",  fixed: "sun"  },
    { id: "04", input: "ring", fixed: "sun"  },
    { id: "05", input: "sun",  fixed: "ring" },
    { id: "06", input: "arm",  fixed: "ring" }
  ];

  fixedConfigs.forEach(function (cfg) {
    var gearset = new PlanSRP_select(Ns, Np, false, cfg.input, cfg.fixed);
    gearset.showPlots = false;
    gearset.buttonCanvas(cfg.id, 250, 200);
    gearset.drawGround();
    gearset.draw(0);
  });

  // 3. Instantiate and initialize the interactive planetary gearset
  var planInteractive = new PlanInteractive(60, 30);
  planInteractive.showPlots = false;
  planInteractive.buttonCanvas("07", 250, 200);
  planInteractive.drawGround();
  planInteractive.draw(0);
}