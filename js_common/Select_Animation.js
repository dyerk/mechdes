// *****************************************************************************************
// function Select_Animation - toggles between multiple animations on same page
// *****************************************************************************************

function Select_Animation() {
  // Get variables from page html to determine number of animaiton containers
	var links = document.querySelectorAll(".itemLinks");  // "buttons" to select an animation
  var animations = document.querySelectorAll(".animationContainer"); // container holding animations
  var numCanvas = links.length;                         // number of canvases
  	
	// these are the possible names for the transform function
  var transforms = ["transform","msTransform","webkitTransform","mozTransform","oTransform"];
  var transformProperty = getSupportedPropertyName(transforms);

	// find out which transform function is compatible with current browser
  function getSupportedPropertyName(properties) {
    for (var i = 0; i < properties.length; i++) {
      if (typeof document.body.style[properties[i]] != "undefined") {
        return properties[i];
      }
    }
    return null;
  }

	// set up the event listeners for each animation selector "button"
  for (var i = 0; i < numCanvas; i++) {
    links[i].addEventListener('click', setClickedItem, false);
  }

	// determine if their is an animation specified in the url
	var activeLink = getUrlVars()["sel"];
	if (activeLink == null) {
		var activeLink = 0;              // points to currently selected item
	}
	
	// set button for selected animation as active (from url or default to 0)
  links[activeLink].classList.add("button-selected");
	animations[activeLink].classList.remove("div-hide");
	
	
	// ***** This function is called when a menu item is clicked ***** //
  function setClickedItem(e) {
    for (var i = 0; i < numCanvas; i++) {  // loop through all menu items and make sure none are set
      links[i].classList.remove("button-selected"); // to "active"
			animations[i].classList.add("div-hide");
    }
    var clickedLink = e.target;                           // which menu item was clicked?
    var canvas = clickedLink.getAttribute("data-pos");  // how many pixels do we need to move?

    //carousel.style["transform"] = "translateX(" + position*500 + ")";
		animations[canvas].classList.remove("div-hide");
		clickedLink.classList.add("button-selected");
  }

	// ****** This function peels of any parameters are end of url by name and value ******
	// use url?sel=val  -- val should range from 0 to the number of animations on page
	function getUrlVars() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			vars[key] = value;
		});
		return vars;
	}
}

