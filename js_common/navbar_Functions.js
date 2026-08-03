function navbar(){
	
	// Add event listeners to navbar hamburger menu
	var hamburger = document.getElementById("hamburger");
	hamburger.addEventListener("click",toggleResponsive,false);
	window.addEventListener("resize",widthReset,false);
	
	//if touch occurs add canTouch class to html root then remove listener for future touches
	document.addEventListener('touchstart',function addTouchClass() {
		document.documentElement.classList.add('canTouch');
		document.removeEventListener('touchstart',addTouchClass,false);
	},false);
	
	function toggleResponsive() {
		var x = document.getElementById("topNav")
		if ((x.className === "") || (x.className === "navbar")) {
			x.className = "responsive";
			document.getElementById("HOME").innerHTML = "Home";
			document.getElementById("LINK").innerHTML = "Linkages <i class='fa fa-caret-down'></i>";
			document.getElementById("GRAS").innerHTML = "Grashof Condition <i class='fa fa-caret-down'></i>"
			document.getElementById("PLAN").innerHTML = "Planetary Gearsets <i class='fa fa-caret-down'></i>"
			document.getElementById("CAMF").innerHTML = "Cam & Followers";
		} else {
			x.className = "navbar";
			document.getElementById("HOME").innerHTML = "<br>Home";
			document.getElementById("LINK").innerHTML = "<br>Linkages <i class='fa fa-caret-down'></i>";
			document.getElementById("GRAS").innerHTML = "Grashof<br>Condition <i class='fa fa-caret-down'></i>"
			document.getElementById("PLAN").innerHTML = "Planetary<br>Gearsets <i class='fa fa-caret-down'></i>"
			document.getElementById("CAMF").innerHTML = "Cam &<br>Followers";
		}
	}
	
	function widthReset() {
		if (window.innerWidth > 575) {
			var x = document.getElementById("topNav")
			x.className = "navbar";
			document.getElementById("HOME").innerHTML = "<br>Home";
			document.getElementById("LINK").innerHTML = "<br>Linkages <i class='fa fa-caret-down'></i>";
			document.getElementById("GRAS").innerHTML = "Grashof<br>Condition <i class='fa fa-caret-down'></i>"
			document.getElementById("PLAN").innerHTML = "Planetary<br>Gearsets <i class='fa fa-caret-down'></i>"
			document.getElementById("CAMF").innerHTML = "Cam &<br>Followers";
		}
	}
}