// js/primaryLinkages.js
"use strict";
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
  var mount = document.getElementById("mechanisms-mount");

  // 1. Define template metadata for all 6 mechanisms
  var sectionConfigs = [
    {
      id: "01",
      title: "Threebar",
      description: "This linkage consists of a crank, coupler and ground.",
      showPlots: true,
      pins: ["B", "P"],
      isActive: true
    },
    {
      id: "02",
      title: "Fourbar Linkage",
      description: "This very common linkage consists of a crank, coupler, rocker and ground.",
      showPlots: true,
      pins: ["B", "P", "C"]
    },
    {
      id: "03",
      title: "Slider-Crank",
      description: "This linkage consists of a crank, connecting rod, slider and ground.",
      showPlots: true,
      pins: ["B", "C"]
    },
    {
      id: "04",
      title: "Inverted Slider-Crank",
      description: "This linkage consists of a crank, slider, rocker and ground.",
      showPlots: true,
      pins: ["B", "P"]
    },
    {
      id: "05",
      title: "Geared Fivebar",
      description: "This linkage consists of two gears, two couplers and ground.",
      showPlots: false
    },
    {
      id: "06",
      title: "Cam-Follower",
      description: "The cam-follower changes rotary motion of the cam to translational motion of a follower. The cam-follower pictured is known as a rocker configuration.",
      showPlots: false
    }
  ];

  // 2. Render HTML templates into DOM
  mount.innerHTML = sectionConfigs.map(renderMechanismSection).join("");

  // 3. Instantiate and initialize each mechanism
  // 01: Threebar
  var threebar = new Threebar(60, 250, 160, 160);
  threebar.buttonCanvas("01", 120, 200);
  threebar.limits = {
    B: { dis: [-65, 65], vel: [-60, 60], acc: [-70, 70] },
    P: { dis: [-65, 315], vel: [-95, 65], acc: [-160, 160] }
  };
  threebar.initPlots();
  threebar.drawGround();
  threebar.draw(0);

  // 02: Fourbar
  var fourbar = new Fourbar(80, 170, 120, 160, 70, (40 * Math.PI) / 180, 2, true);
  fourbar.buttonCanvas("02", 120, 230);
  fourbar.limits = {
    B: { dis: [-65, 65], vel: [-85, 85], acc: [-80, 80] },
    P: { dis: [-65, 200], vel: [-95, 65], acc: [-160, 100] },
    C: { dis: [0, 250], vel: [-85, 165], acc: [-325, 185] }
  };
  fourbar.initPlots();
  fourbar.drawGround();
  fourbar.draw(0);

  // 03: Slider-Crank
  var sliderCrank = new SliderCrank(60, 130, 60);
  sliderCrank.buttonCanvas("03", 140, 210);
  sliderCrank.limits = {
    B: { dis: [-65, 65], vel: [-85, 85], acc: [-80, 80] },
    C: { dis: [0, 200], vel: [-85, 125], acc: [-200, 200] }
  };
  sliderCrank.initPlots();
  sliderCrank.drawGround();
  sliderCrank.draw(0);

  // 04: Inverted Slider-Crank
  var invSlide = new InvSlide(60, 220, 70, 160, (70 * Math.PI) / 180, true);
  invSlide.buttonCanvas("04", 120, 250);
  invSlide.limits = {
    B: { dis: [-65, 65], vel: [-85, 85], acc: [-80, 80] },
    P: { dis: [-65, 75], vel: [-100, 100], acc: [-200, 200] }
  };
  invSlide.initPlots();
  invSlide.drawGround();
  invSlide.draw(0);

  // 05: Geared Fivebar
  var fivebar = new Fivebar(
    90, 150, 150, 120, 90, 180, 180,
    (30 * Math.PI) / 180, (-30 * Math.PI) / 180,
    100, 140
  );
  fivebar.showPlots = false;
  fivebar.buttonCanvas("05", 190, 275);
  fivebar.drawGround();
  fivebar.draw(0);

  // 06: Cam-Follower
  var camrock = new CamRock(3, 50, [10, 20, 40], [100, 40, 30], [60, 50, 80], 20, 150, 200);
  camrock.showPlots = false;
  camrock.showTrace = false;
  camrock.buttonCanvas("06", 160, 200);
  camrock.drawGround();
  camrock.draw(0);

  // 4. Initialize tab switcher and pass mechanism instances for plot resizing
  Select_Animation([threebar, fourbar, sliderCrank, invSlide, fivebar, camrock]);
}