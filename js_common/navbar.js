/* ************************************************************************* */
/* This Javascript file creates the side bar for the textbook website.	     */
/* Do NOT leave ANY line blank! and end each html line with "\"              */
/* ************************************************************************* */
document.write('\
	<a href="../ch00/introduction.html" id="HOME"><br>Home</a>\
	<div class="dropdown">\
		<button class="dropbtn" id="LINK"><br>Linkages\
			<i class="fa fa-caret-down"></i>\
		</button>\
		<div class="dropdown-content">\
			<a href="../ch01/primaryLinkages.html">Primary Linkages</a>\
			<a href="../ch04/alternateConfig.html">Alternate Configurations</a>\
			<a href="../ch01/sixbarLinkages.html">Sixbar Linkages</a>\
			<a href="../ch01/interestingLinkages.html">Other Interesting Linkages</a>\
			<a href="../ch05/instantCenters.html">Instant Centers</a>\
			<a href="../interactive/interactiveLinkages.html">Interactive Linkages</a>\
		</div>\
	</div>\
	<div class="dropdown">\
		<button class="dropbtn" id="GRAS">Grashof<br>Condition\
			<i class="fa fa-caret-down"></i>\
		</button>\
		<div class="dropdown-content">\
			<a href="../ch01/grashof.html">Grashof Linkages</a>\
			<a href="../ch01/nonGrashof.html">Non-Grashof Linkages</a>\
			<a href="../ch01/specialGrashof.html">Special Case Grashof Linkages</a>\
			<a href="../ch01/extremeGrashof.html">Extreme Case Grashof Linkages</a>\
			<a href="../ch01/openVsCrossed.html">Open vs Crossed Configurations</a>\
			<a href="../ch01/driverDyad.html">The Driver Dyad</a>\
		</div>\
	</div> \
	<div class="dropdown">\
		<button class="dropbtn" id="PLAN">Planetary<br>Gearsets\
			<i class="fa fa-caret-down"></i>\
		</button>\
		<div class="dropdown-content">\
			<a href="../ch09/sunRingPlanet.html">Sun, Ring, & Planet</a>\
			<a href="../ch09/sunPlanet.html">Sun & Planet</a>\
			<a href="../ch09/ringPlanet.html">Ring & Planet</a>\
			<a href="../ch09/balancingGears.html">Balancing Gears</a>\
			<a href="../ch09/largeReduction.html">Large Reductions</a>\
			<a href="../ch09/blockPlanetary.html">Building Block Planetary</a>\
		</div>\
	</div> \
	<a href="../ch10/cams.html" id="CAMF">Cam &<br>Followers</a>\
	<a href="javascript:void(0);" id="hamburger" class="hamburger">&#9776;</a>\
');