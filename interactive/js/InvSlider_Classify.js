// **********************************************************************************
// classify the linkage based upon Grashof type and mobility classification
// **********************************************************************************

InvSlide.prototype.classify = function (a,c,d,gamma) {
  
  // check the binding condition
  if (a+d < c*Math.sin(gamma)) { // cannot be constructed
		this.cap.innerHTML = "This configuration of the inverted slider-crank cannot be constructed.";
		this.isPlaying = false;
	} else { //can be constructed
			
		if (Math.abs(a-d) >= c*Math.sin(gamma)){ // grashof
				this.cap.innerHTML = "This configuration of the inverted slider-crank is grashof."
				this.isGrashof = true;
		} else {
			this.crankMin = Math.acos((a*a+d*d-c*c*Math.sin(gamma)*Math.sin(gamma))/(2*a*d));
			this.crankMax = 2*Math.PI-this.crankMin;
			this.cap.innerHTML = "The slider-crank moves between " +
				(this.crankMin*180/Math.PI).toFixed(1)+String.fromCharCode(176)+
				" and "+(this.crankMax*180/Math.PI).toFixed(1)+String.fromCharCode(176);
			this.isGrashof = false;
		}
	}
};