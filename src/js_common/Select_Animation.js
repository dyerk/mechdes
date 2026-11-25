// js_common/Select_Animation.js
// Handles accessible tab switching & URL deep-linking for stacked mechanism sections

function Select_Animation(linkages) {
  var pills = Array.prototype.slice.call(document.querySelectorAll(".itemLinks"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".animationContainer"));

  if (!pills.length || !sections.length) return;

  function resolveInitialIndex() {
    var params = new URLSearchParams(window.location.search);
    
    // Check ?id=<mechanismId> (e.g., ?id=03)
    if (params.has("id")) {
      var targetId = params.get("id").replace(/^item/i, "");
      var byId = sections.findIndex(function (sec) {
        return sec.getAttribute("data-mechanism-id") === targetId || sec.id === "item" + targetId;
      });
      if (byId >= 0) return byId;
    }

    // Fallback to whichever pill has .active in HTML
    var initialActive = pills.findIndex(function (p) {
      return p.classList.contains("active");
    });
    return initialActive >= 0 ? initialActive : 0;
  }

  function updateUrl(index) {
    if (!window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    var mechId = sections[index] && sections[index].getAttribute("data-mechanism-id");

    // Keep the URL clean using ?id=03 (or ?anim=2 if no data-mechanism-id)
    if (mechId) {
      url.searchParams.set("id", mechId);
      url.searchParams.delete("anim");
    } else {
      url.searchParams.set("anim", index);
    }

    window.history.replaceState(null, "", url.toString());
  }

  function activateTab(index, moveFocus, syncUrl) {
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

    if (syncUrl) {
      updateUrl(index);
    }

    if (moveFocus) {
      pills[index].focus();
    }
  }

  pills.forEach(function (pill, idx) {
    pill.addEventListener("click", function () {
      var pos = parseInt(pill.getAttribute("data-pos"), 10);
      activateTab(isNaN(pos) ? idx : pos, false, true);
    });

    pill.addEventListener("keydown", function (e) {
      var currentPos = parseInt(pill.getAttribute("data-pos"), 10);
      if (isNaN(currentPos)) currentPos = idx;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        activateTab(currentPos + 1, true, true);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        activateTab(currentPos - 1, true, true);
      } else if (e.key === "Home") {
        e.preventDefault();
        activateTab(0, true, true);
      } else if (e.key === "End") {
        e.preventDefault();
        activateTab(pills.length - 1, true, true);
      }
    });
  });

  // Activate the tab requested in the URL (without rewriting the URL on initial load)
  activateTab(resolveInitialIndex(), false, false);
}