// js_common/Select_Animation.js
// Handles accessible tab switching for stacked mechanism animation sections

function Select_Animation(linkages) {
  var pills = Array.prototype.slice.call(document.querySelectorAll(".itemLinks"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".animationContainer"));

  if (!pills.length || !sections.length) return;

  function activateTab(index, moveFocus) {
    if (index < 0) index = pills.length - 1;
    if (index >= pills.length) index = 0;

    pills.forEach(function (pill, i) {
      var isSelected = i === index;
      pill.classList.toggle("active", isSelected);
      pill.setAttribute("aria-selected", isSelected ? "true" : "false");
      pill.setAttribute("tabindex", isSelected ? "0" : "-1");
    });

    sections.forEach(function (sec, i) {
      var isSelected = i === index;
      sec.classList.toggle("d-none", !isSelected);

      // Pause hidden animations to save CPU
      if (!isSelected && Array.isArray(linkages) && linkages[i] && linkages[i].isPlaying) {
        linkages[i].eventPlay();
      }
    });

    if (moveFocus) {
      pills[index].focus();
    }
  }

  pills.forEach(function (pill, idx) {
    pill.addEventListener("click", function () {
      var pos = parseInt(pill.getAttribute("data-pos"), 10);
      activateTab(isNaN(pos) ? idx : pos, false);
    });

    pill.addEventListener("keydown", function (e) {
      var currentPos = parseInt(pill.getAttribute("data-pos"), 10);
      if (isNaN(currentPos)) currentPos = idx;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        activateTab(currentPos + 1, true);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        activateTab(currentPos - 1, true);
      } else if (e.key === "Home") {
        e.preventDefault();
        activateTab(0, true);
      } else if (e.key === "End") {
        e.preventDefault();
        activateTab(pills.length - 1, true);
      }
    });
  });

  // Initialize state on load
  var initialActive = pills.findIndex(function (p) {
    return p.classList.contains("active");
  });
  activateTab(initialActive >= 0 ? initialActive : 0, false);
}