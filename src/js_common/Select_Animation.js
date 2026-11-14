// js_common/Select_Animation.js
function Select_Animation(mechanisms) {
  var links = document.querySelectorAll(".itemLinks");
  var animations = document.querySelectorAll(".animationContainer");
  var numCanvas = links.length;

  for (var i = 0; i < numCanvas; i++) {
    links[i].addEventListener("click", setClickedItem, false);
  }

  var urlParams = new URLSearchParams(window.location.search);
  var activeIndex = parseInt(urlParams.get("sel"), 10);
  if (isNaN(activeIndex) || activeIndex < 0 || activeIndex >= numCanvas) {
    activeIndex = 0;
  }

  setActiveTab(activeIndex);

  function setActiveTab(index) {
    for (var i = 0; i < numCanvas; i++) {
      links[i].classList.remove("active");
      links[i].setAttribute("aria-selected", "false");
      animations[i].classList.add("d-none");
    }
    links[index].classList.add("active");
    links[index].setAttribute("aria-selected", "true");
    animations[index].classList.remove("d-none");

    // Refresh plots when tab becomes visible so SVG viewBox matches live width
    if (mechanisms && mechanisms[index] && typeof mechanisms[index].initPlots === "function") {
      mechanisms[index].initPlots();
    }
  }

  function setClickedItem(e) {
    var canvasPos = parseInt(e.currentTarget.getAttribute("data-pos"), 10);
    setActiveTab(canvasPos);
  }
}