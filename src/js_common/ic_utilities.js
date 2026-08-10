	function lineParams(pt1,pt2) {
		var m = (pt2.y-pt1.y)/(pt2.x-pt1.x)				// slope
		var b = pt1.y - m*pt1.x;									// y-intercept of line
		return {m:m,b:b}
	}
	
	function linePerp(pt1,angle) {
		var m = -Math.sin(angle)/Math.cos(angle);	// slope of current angle
		var mPerp = -1/m;														// slope perpendicular to m
		var b = pt1.y - mPerp*pt1.x;								// y-intercept of perpendicular line
		return {m:mPerp,b:b}
	}
	
	Linkage.prototype.calcIC = function(pair1,pair2,type,text,fillColor){
		lineA = lineParams(pair1[0],pair1[1]);//calculate line of first point pair
		
		switch (type) {
			case "pa"://point, angle
				lineB = linePerp(pair2[0],pair2[1]); //calculate line perpendicular to point and angle
				break;
			case "pp": //point, point
				lineB = lineParams(pair2[0],pair2[1]);//calculate line of second point pair
				break;
		}
		
		xAB = (lineB.b-lineA.b)/(lineA.m-lineB.m); 						  	//find x intersection
		yAB = lineA.m * xAB + lineA.b							 						  	//find y intersection
		IC = new InstantCenter(xAB,yAB,fillColor,text,this.geom); // create new IC
		return IC;																
	}