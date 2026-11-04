// **********************************************************************************
// classify the linkage based upon Grashof type and mobility classification
// **********************************************************************************

Fourbar.prototype.classify = function (a,b,c,d) {
  this.cap.innerHTML = "This fourbar is ";
  
	links = [d,a,b,c];  // length of links in order for classificaiton
	
  // check the Grashof condition
  var S = 100000;     // find the shortest and longest links
  var L = 0;          // in the linkage
  var iS = undefined; // index of shortest link
  var iL = undefined; // index of longest link
  for (var i = 0; i < 4; i++) {
    if (links[i] < S) {
      S = links[i];
      iS = i;
    }
    if (links[i] > L) {
      L = links[i];
      iL = i;
    }
  }

  var PQ = a + b + c + d - S - L;  // PQ is left over after subtracting S + L

// **********************************************************************************
// Grashof linkages
// **********************************************************************************
  if ((S+L) < PQ) {  // Grashof linkages
    this.isGrashof = true;
    this.cap.innerHTML = this.cap.innerHTML+"Grashof - ";
    this.crankMin = 0;
    switch(iS) {
      case 0:   // shortest link is ground
        this.cap.innerHTML = this.cap.innerHTML+"Class 1";
        this.iClass = 1;
        break;
      case 1:   // shortest link is crank
        this.cap.innerHTML = this.cap.innerHTML+"Class 2";
        this.iClass = 2;
        break;
      case 2:   // shortest link is coupler
        this.cap.innerHTML = this.cap.innerHTML+"Class 3";
        this.iClass = 3;
        break;
      case 3:   // shortest link is output
        this.cap.innerHTML = this.cap.innerHTML+"Class 4";
        this.iClass = 4;
        break;
    }
  } 
  
// **********************************************************************************
// non-Grashof linkages
// **********************************************************************************  
  if ((S+L) > PQ) {
    this.isGrashof = false;
    this.cap.innerHTML = this.cap.innerHTML+"Not Grashof - ";
    switch(iL) {
      case 0: // longest link is ground - can only make open triangles
        if (a < c) { // crank is shorter than rocker
          this.cap.innerHTML = this.cap.innerHTML+"Class 5";
          this.iClass = 5;
          this.crankMin = -Math.acos((a*a + d*d - (b+c)*(b+c))/(2*a*d));
          this.crankMax = -this.crankMin;
        } else {  // rocker is shorter than crank
          this.cap.innerHTML = this.cap.innerHTML+"Class 6";
          this.iClass = 6;
          this.crankMin = Math.acos((d*d + c*c - (a+b)*(a+b))/(2*c*d)) - Math.PI;
          this.crankMax = -2*Math.PI - this.crankMin;
        }
        break;
      case 1: // longest link is crank
        this.cap.innerHTML = this.cap.innerHTML+"Class 7";
        this.iClass = 7;
        this.crankMin = Math.acos((d*d + c*c - (a-b)*(a-b))/(2*c*d)) - Math.PI;
        this.crankMax = -this.crankMin;
        break;
      case 2: // longest link is coupler
        if (a < c) {  // crank is shorter than rocker
          this.cap.innerHTML = this.cap.innerHTML+"Class 8";
          this.iClass = 8;
          this.crankMin = -Math.acos((a*a + d*d - (b-c)*(b-c))/(2*a*d));
          this.crankMax = -2*Math.PI - this.crankMin;
        } else {  // rocker is shorter than crank
          this.cap.innerHTML = this.cap.innerHTML+"Class 9";
          this.iClass = 9;
          this.crankMin = Math.acos((d*d + c*c - (b-a)*(b-a))/(2*c*d)) - Math.PI;
          this.crankMax = -this.crankMin;
        }
        break;
      case 3: // longest link is rocker
        this.cap.innerHTML = this.cap.innerHTML+"Class 10";
        this.iClass = 10;
        this.crankMin = -Math.acos((a*a + d*d - (c-b)*(c-b))/(2*a*d));
        this.crankMax = -2*Math.PI - this.crankMin;
        break;       
    }
  }
  
// **********************************************************************************
// special case linkages
// **********************************************************************************
  if ((S + L) === (PQ)) {
    this.iGrashof = true;
    this.crankMin = 0;
    this.cap.innerHTML = this.cap.innerHTML+"Special Case - ";

// determine if any of the links are identical
    var nS = [];  // stores link numbers that have the same length as S
    var nL = [];  // stores link numbers that have the same length as L
    for (i = 0; i < 4; i++) {
      if (links[i] === S) nS.push(i);
    }
    for (i = 0; i < 4; i++) {
      if (links[i] === L) nL.push(i);
    }

// two pairs of identical links
    if ((nS.length === 2) && (nL.length === 2)) {
      if ((nS[0] === 0) && (nS[1] === 1)) {  // ground and crank are short links
        this.iClass = 15;
        this.cap.innerHTML = this.cap.innerHTML+"Class 15";    
      }
      if ((nS[0] === 1) && (nS[1] === 2)) {  // crank and coupler are short links
        this.iClass = 16;     
        this.cap.innerHTML = this.cap.innerHTML+"Class 16";    
      }
      if ((nS[0] === 2) && (nS[1] === 3)) {  // coupler and rocker are short links
        this.iClass = 17;
        this.cap.innerHTML = this.cap.innerHTML+"Class 17";    
      }
      if ((nS[0] === 0) && (nS[1] === 3)) {  // rocker and ground are short links
        this.iClass = 18;
        this.cap.innerHTML = this.cap.innerHTML+"Class 18";    
      }
      if ((nS[0] === 0) && (nS[1] === 2)) {  // ground and coupler are short links (parallelogram)
        this.iClass = 19;
        this.cap.innerHTML = this.cap.innerHTML+"Class 19";
      }      
      if ((nS[0] === 1) && (nS[1] === 3)) {  // crank and rocker are short links (parallelogram)
        this.iClass = 19;
        this.cap.innerHTML = this.cap.innerHTML+"Class 19";    
      }

// all four links are equal (parallelogram)
    } else if ((nS.length === 4) || (nL.length === 4)) {
      this.iClass = 19;
      this.cap.innerHTML = this.cap.innerHTML+"Class 19";
      
// other special case linkages without identical pairs
    } else {
      switch(iS) {
        case 0:   // shortest link is ground
          this.cap.innerHTML = this.cap.innerHTML+"Class 11";
          this.iClass = 11;
          break;
        case 1:   // shortest link is crank
          this.cap.innerHTML = this.cap.innerHTML+"Class 12";
          this.iClass = 12;
          break;
        case 2:   // shortest link is coupler
          this.cap.innerHTML = this.cap.innerHTML+"Class 13";
          this.iClass = 13;
          break;
        case 3:   // shortest link is output
          this.cap.innerHTML = this.cap.innerHTML+"Class 14";
          this.iClass = 14;
          break;
      }
    }
  }
};