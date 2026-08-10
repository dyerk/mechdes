// **********************************************************************************
// classify the linkage based upon Grashof type and mobility classification
// **********************************************************************************

SliderCrank.prototype.classify = function (a,b,c) {
  
  // check the binding condition
  if (a+Math.abs(c) <= b) { // non-binding
		this.cap.innerHTML = "This slider-crank is non-binding.";
		this.isGrashof = true;
	} else { //binding
		this.crankMin = Math.asin((c-b)/a);
		this.crankMax = Math.PI-this.crankMin;
		this.cap.innerHTML = "The slider-crank moves between " +
			(this.crankMin*180/Math.PI).toFixed(1)+String.fromCharCode(176)+
			" and "+(this.crankMax*180/Math.PI).toFixed(1)+String.fromCharCode(176);
		this.isGrashof = false;
	}
};