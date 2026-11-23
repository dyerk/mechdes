# Mechanism Animation & Kinematic Plot Architecture

This project implements a zero-dependency, responsive, and WCAG 2.1 AA compliant template system for interactive mechanical linkage animations and kinematic plots (displacement, velocity, and acceleration). It is built with Vanilla JavaScript, HTML5 Canvas, inline SVG, and Bootstrap 5, it is designed to run directly on static hosts (GitHub Pages, Cloudflare Pages) with no build tools required. CSS files are compiled using Sass to overlay custom color profiles that match textbook themes and to extend responsive behavior to some Bootstrap elements. 

Pages are contstructed by JS and HTML templates so a local server is required for local development. Local development recommendation is to use python as a lightweight server; change path to /src start the server. 
Example: 
```
..\mechdes\src> python -m http.server 8000
```

## 1. File Architecture Overview
```
scss                                    # Sass file used to generate CSS
src
├── css/
│   └── main.css                        # Layout styles, vertical Y-axis labels, overlay buttons, WCAG focus states
├── images/                             # Images used througought site matching pages/category organization
├── js_common/
│   ├── templates.js                    # Dynamic HTML generator for mechanism sections and unified plot cards
│   ├── Linkage.js                      # Base class for animations, canvas layers, zoom, and plot orchestration
│   ├── Plot.js                         # Responsive inline SVG line-plot renderer with auto-scaling Y-axes
│   ├── Select_Animation.js             # Tab/pill navigation controller between mechanism sections
│   ├── Common_Shapes.js                # Shared 2D canvas drawing primitives (links, pins, pivots, grounds)
│   └── Class_*.js                      # Mechanism subclasses (Fourbar, SliderCrank, InvSlide, Fivebar, Cam)
├── pages
│   ├── [category]                      # Folders organize content based on book sections - linkages, gears, cams
│       ├── [page].html & js/[page].js  # Lightweight page shell and mechanism configuration scripts
└── index.html
```     

## 2. Template Structure & Calls (`templates.js`)
Instead of duplicating hundreds of lines of boilerplate HTML per mechanism, pages provide a mount point to render animations in one of three ways:
| Style | HTML Mount | JS Function |
| :--- | :--- | :--- |
| Set of tabs | `<div id="mechanisms-mount"></div>` | `renderMechanismSection(config)`|
| Standalone | `<div id="[name-mount]" class="mb-3"></div>` | `document.getElementById("name-mount").innerHTML = renderCanvasGrid([parameters])` |


### HTML Page Shell Requirements
Every HTML page must include:
1. `templates.js`, `Linkage.js`, `Plot.js`, `Select_Animation.js`, and the page's mechanism class scripts in `<head>`.
2. Navigation pills (`<button class="nav-link itemLinks" data-pos="0" id="pill-...">`) corresponding to each mechanism index.
3. A mount container `<div id="mechanisms-mount"></div>` inside `<main>`.

### `renderMechanismSection(config)`
Generates a complete `<section>` containing the 5-layer canvas stack, playback controls, figure caption, and (optionally) the unified 3-row kinematic plot card.

#### Configuration Object Schema
| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | **Yes** | Two-digit unique identifier (`"01"`, `"02"`, etc.) matching `buttonCanvas(id, ...)`. |
| `title` | `string` | **Yes** | Display title shown in the figure caption and ARIA labels. |
| `description` | `string` | **Yes** | Explanatory text rendered in `<figcaption>`. |
| `showPlots` | `boolean` | No | Defaults to `true`. Set to `false` for full-width animations without kinematic plots (e.g., Geared Fivebar). |
| `pins` | `string[]` | No | Array of selectable pin letters for the point dropdown (e.g., `["B", "C"]` or `["B", "P"]`). |
| `isActive` | `boolean` | No | Set to `true` on the default visible tab (`"01"`); all other tabs start with `d-none`. |
| `tabId` | `string` | No | ID of the controlling nav pill button (`"pill-..."`) for `aria-labelledby` tabpanel association. |

#### Example Template Render Call
```javascript
function renderPageTemplates() {
  var mount = document.getElementById("mechanisms-mount");
  if (!mount || mount.dataset.rendered === "true") return;

  var sectionConfigs = [
    {
      id: "01",
      title: "Slider Crank (Aligned)",
      description: "Most slider-cranks have the cylinder horizontally aligned with the ground pin.",
      showPlots: true,
      pins: ["B", "C"],
      isActive: true,
      tabId: "pill-slider-aligned-tab"
    },
    {
      id: "02",
      title: "Geared Fivebar",
      description: "This linkage consists of two gears, two couplers and ground.",
      showPlots: false,
      tabId: "pill-fivebar-tab"
    }
  ];

  mount.innerHTML = sectionConfigs.map(renderMechanismSection).join("");
  mount.dataset.rendered = "true";
}
```

### Generated DOM & `data-*` Hooks
`Linkage.js` uses scoped DOM queries inside `[data-mechanism-id="{id}"]` rather than global IDs:
* **Canvas Layers (`data-layer="0"` through `"4"`):** Five stacked `500x400` canvases (`0`: trace path, `1–3`: moving links, `4`: ground/ICs).
* **Playback Controls:** `data-role="btn-play"`, `data-role="btn-reset"`, `data-role="icon-play"`, `data-role="icon-reset"`.
* **Unified Plot Card (`.plotControl`):**
  * Pin Selector: `data-role="sel-pin"`
  * SVG Plot Hosts: `data-plot-host="dis"`, `data-plot-host="vel"`, `data-plot-host="acc"`
  * Height Expand/Collapse Chevrons: `data-plot-resize="dis|vel|acc"` (top-right overlay buttons toggling between `100px` short and `200px` tall views).


## 3. Animation Structure & Calls (`Linkage.js`)
All mechanism classes (`Fourbar`, `SliderCrank`, `InvSlide`, `Fivebar`, `Cam`) inherit from `Linkage.prototype`.

### Initialization Sequence
For each mechanism on a page, follow this three-step setup pattern inside `init()`:

#### Step 1: Instantiate the Mechanism
Pass physical link dimensions (in millimeters) and configuration flags to the subclass constructor:
```javascript
var fourbar = new Fourbar(a, b, c, d, p, beta, grashofType, isOpen);
```

#### Step 2: Bind Canvas, Origin, and Zoom (`buttonCanvas`)
```javascript
linkage.buttonCanvas(pageID, x0, y0, zoom);
```
* `pageID` (`string`): Must match the `id` passed to `renderMechanismSection` (e.g., `"01"`).
* `x0`, `y0` (`number`): Pixel coordinates of the mechanism's primary ground pivot inside the `500x400` canvas.
* `zoom` (`number`, optional): Scale factor centered on `(x0, y0)` (defaults to `1.0`). Enlarges the mechanism visually on the canvas without altering kinematic calculations or plot units.

#### Step 3: Pre-Compute Plots or Draw Initial Frame
* **For mechanisms with plots (`showPlots: true`):** Call `precomputePlots()`. This runs a silent $0^\circ \rightarrow 360^\circ$ kinematic pass, populates all trace arrays (`B`, `P`, `C`), automatically calculates rounded Y-axis limits (`Plot.js`), renders the full curves immediately, and resets the mechanism canvas back to $\theta = 0^\circ$.
  ```javascript
  fourbar.buttonCanvas("01", 150, 200, 1.25);
  fourbar.precomputePlots();
  ```
* **For mechanisms without plots (`showPlots: false`):** Draw the static ground and initial pose directly:
  ```javascript
  fivebar.buttonCanvas("07", 200, 230, 1.1);
  fivebar.drawGround();
  fivebar.draw(0);
  ```

### Safe Page Startup Pattern
Because external navigation/footer includes may load asynchronously, guard initialization so `init()` executes once after both the DOM and component loader are ready:
```javascript
var pageInitialized = false;
function safeInit() {
  if (pageInitialized) return;
  if (!document.getElementById("mechanisms-mount")) return;
  pageInitialized = true;
  renderPageTemplates();
  init();
}

document.addEventListener("DOMContentLoaded", safeInit);
document.addEventListener("animationsRendered", safeInit);
if (document.readyState !== "loading") {
  safeInit();
}
```


## 4. Kinematic Plotting & Zoom Internals
### Pre-Computed Full-Cycle Plots (`Plot.js` & `Linkage.js`)
* **Shared X-Axis:** Displacement (`dis`) and Velocity (`vel`) render with `showXAxis: false` to maximize vertical density. Acceleration (`acc`) sits at the bottom with `showXAxis: true`, owning the `0` to `360` degree tick labels for the entire stack.
* **Automatic Y-Axis Scaling:** `Plot.prototype.computeAutoBounds()` inspects the active pin's X and Y traces, adds 10% vertical padding, snaps to human-readable intervals (`getNiceStepSize()`), and redraws automatically whenever the user switches pins in the `Point` dropdown.
* **Playback Cursor:** During animation (`eventPlay()`), `updatePlot()` advances a vertical dashed red cursor line (`setCursorIndex()`) across the pre-rendered curves at 60 fps. Clicking **Reset** (`eventReset()`) clears canvas trace dots and returns the cursor to $0^\circ$ without erasing the precomputed curves.

### Transform-Safe Canvas Zoom
`Linkage.prototype._applyCanvasZoom(ctx)` scales all 5 canvas contexts around `(x0, y0)`:
```javascript
ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.translate(this.x0, this.y0);
ctx.scale(this.zoom, this.zoom);
ctx.translate(-this.x0, -this.y0);
```
Whenever canvases are cleared (`eventReset()` or `precomputePlots()`), `clearAllCanvases()` temporarily resets the identity matrix inside `ctx.save()` / `ctx.restore()` so the entire `500x400` viewport clears cleanly while preserving the active zoom matrix.

---

## 5. Accessibility (WCAG 2.1 AA)
* **Non-Text Content (`1.1.1`):** Stacked `<canvas>` layers and internal `<svg>` elements are marked `aria-hidden="true"`, while their parent containers carry `role="img"` and descriptive `aria-labelledby` text.
* **Tabpanel Semantics (`1.3.1`, `4.1.2`):** Each mechanism `<section>` uses `role="tabpanel"` linked to its navigation pill via `aria-labelledby`.
* **Interactive Control States (`4.1.2`):** Play/Pause buttons toggle `aria-pressed` and update `aria-label`; plot expand/collapse chevrons toggle `aria-expanded` between `"false"` and `"true"`.
* **Color Independence & Contrast (`1.4.1`, `1.4.3`, `1.4.11`):** Trace legends pair color swatches with screen-reader component labels (`visually-hidden`), text uses contrast-safe `text-body-secondary`, and overlay chevron buttons maintain $\ge 3:1$ border contrast with visible `:focus-visible` outlines.