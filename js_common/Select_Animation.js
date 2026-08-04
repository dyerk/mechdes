// *****************************************************************************************
// function Select_Animation - toggles between multiple animations on same page
// *****************************************************************************************

function Select_Animation() {
  const links = document.querySelectorAll(".itemLinks");         // selector tabs
  const animations = document.querySelectorAll(".animationContainer"); // animation containers
  const numCanvas = links.length;

  // Add click event listeners to tabs
  for (let i = 0; i < numCanvas; i++) {
    links[i].addEventListener('click', setClickedItem, false);
  }

  // Determine active tab from URL query params or default to index 0
  const urlParams = new URLSearchParams(window.location.search);
  let activeIndex = parseInt(urlParams.get("sel"), 10);
  if (isNaN(activeIndex) || activeIndex < 0 || activeIndex >= numCanvas) {
    activeIndex = 0;
  }

  // Set initial Bootstrap & ARIA state
  setActiveTab(activeIndex);

  function setActiveTab(index) {
    for (let i = 0; i < numCanvas; i++) {
      links[i].classList.remove("active");
      links[i].setAttribute("aria-selected", "false");
      animations[i].classList.add("d-none");
    }
    links[index].classList.add("active");
    links[index].setAttribute("aria-selected", "true");
    animations[index].classList.remove("d-none");
  }

  function setClickedItem(e) {
    const clickedLink = e.currentTarget;
    const canvasPos = parseInt(clickedLink.getAttribute("data-pos"), 10);
    setActiveTab(canvasPos);
  }
}

