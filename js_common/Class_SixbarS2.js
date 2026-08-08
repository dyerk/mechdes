SixbarS2.prototype = new Linkage();  // create Stephenson's type II linkage from basic linkage

// *********************************************************************************************************************
// Function SixbarS2 creates a Stephenson type S2 sixbar linkage
// *********************************************************************************************************************
function SixbarS2(a,b,c,d,p,q,u,v,gamma3,gamma4) {
  this.bar = [new Bar(a, this.geom, this.color[3], this.color[5]),
              new Coupler(b, p, gamma3, this.geom, this.color[3], this.color[15]),
              new Coupler(c, q, gamma4, this.geom, this.color[3], this.color[20]),
              new Bar(u, this.geom, this.color[3], this.color[5]),
              new Bar(v, this.geom, this.color[3], this.color[10])];

  this.bar[2].x = d;  // right coupler is pinned to ground
  this.bar[2].y = 0;  // at (d,0)

  this.bar[1].theta =  18*Math.PI/180;  // initial guess
  this.bar[2].theta =  62*Math.PI/180;
  this.bar[3].theta =  36*Math.PI/180;
  this.bar[4].theta =  -8*Math.PI/180;
  this.pivot = [new Pivot(0, 0, this.geom),
                new Pivot(d, 0, this.geom)];
								
	this.type = "sixbar";					  	// declare type of linkage
	this.IC = new Array();						// initialize array for instant centers
	this.tracePoint = new Array();		// initialize array for trace points
	for (var i = 0; i < 3; i++){
		this.tracePoint[i] = {x:0,y:0};
	}
}

// *********************************************************************************************************************
// Sixbar.draw - calculates the linkage angles and draws the bars
// *********************************************************************************************************************
SixbarS2.prototype.draw = function(angle) {
  var a = this.bar[0].L;   // crank length
  var b = this.bar[1].L;   // coupler length
  var c = this.bar[2].L;   // rocker length
  var d = this.bar[2].x; // ground length
  var p = this.bar[1].p;   // length from ground pivot to third pin on crank
  var q = this.bar[2].p;   // length from ground pivot to third pin on rocker
  var u = this.bar[3].L;   // length of left upper bar
  var v = this.bar[4].L;   // length of right upper bar
  var gamma3 = this.bar[1].beta;  // internal angle of left coupler
  var gamma4 = this.bar[2].beta;  // internal angle of right coupler
  var c2, c3, c4, c5, c6, c33, c44;
  var s2, s3, s4, s5, s6, s33, s44;
  this.bar[0].theta = angle;
  var dphi = [];
  var dq = new Array();
  
  for (var i = 0; i < 10; i++) {
    c2 = a*Math.cos(angle);              s2 = a*Math.sin(angle);
    c3 = b*Math.cos(this.bar[1].theta);  s3 = b*Math.sin(this.bar[1].theta);
    c4 = c*Math.cos(this.bar[2].theta);  s4 = c*Math.sin(this.bar[2].theta);
    c5 = u*Math.cos(this.bar[3].theta);  s5 = u*Math.sin(this.bar[3].theta);
    c6 = v*Math.cos(this.bar[4].theta);  s6 = v*Math.sin(this.bar[4].theta);
    c33 = p*Math.cos(this.bar[1].theta + gamma3);
    s33 = p*Math.sin(this.bar[1].theta + gamma3);
    c44 = q*Math.cos(this.bar[2].theta + gamma4);
    s44 = q*Math.sin(this.bar[2].theta + gamma4);
    dq[0] = c2 + c33 + c6 - c44 - d;
    dq[1] = s2 + s33 + s6 - s44;
    dq[2] = c2 + c3 + c5 - c4 -d;
    dq[3] = s2 + s3 + s5 - s4;

    if(dq[0]*dq[0] + dq[1]*dq[1] + dq[2]*dq[2] + dq[3]*dq[3] < 0.001) {
      break;
    } else {
      dphi[0] = [-s6,   0,  s44, -s33];
      dphi[1] = [ c6,   0, -c44,  c33];
      dphi[2] = [  0, -s5,   s4,  -s3];
      dphi[3] = [  0,  c5,  -c4,   c3];
    
      var LU = LU_Decomp(dphi,4);
      dq = LU_Backsub(LU.A,4,LU.indx,dq); 
      this.bar[1].theta = this.bar[1].theta - dq[3];
      this.bar[2].theta = this.bar[2].theta - dq[2];
      this.bar[3].theta = this.bar[3].theta - dq[1];
      this.bar[4].theta = this.bar[4].theta - dq[0];
    }
  }

// solve for pin positions
  var Bx = a*Math.cos(angle);                      // top crank pin
  var By = a*Math.sin(angle);
  var Cx = Bx + b*Math.cos(this.bar[1].theta);     // right coupler pin
  var Cy = By + b*Math.sin(this.bar[1].theta);
  var Ex = Bx + p*Math.cos(this.bar[1].theta + gamma3);             // third pin on left coupler
  var Ey = By + p*Math.sin(this.bar[1].theta + gamma3);
  var Fx = q*Math.cos(this.bar[2].theta + gamma4) + d;  // third pin on right coupler
  var Fy = q*Math.sin(this.bar[2].theta + gamma4);
  var Gx = c*Math.cos(this.bar[2].theta) + d;
  var Gy = c*Math.sin(this.bar[2].theta);

// update link positions
  this.bar[1].x =  Bx;  // right pin on crank
  this.bar[1].y = -By;
  this.bar[3].x =  Cx;
  this.bar[3].y = -Cy;
  this.bar[4].x =  Ex;
  this.bar[4].y = -Ey;

// calculate coordinates of trace points
  this.tracePoint[0].x =  Ex;
  this.tracePoint[0].y = -Ey;
  this.tracePoint[1].x =  Fx;
  this.tracePoint[1].y = -Fy;
  this.tracePoint[2].x =  Gx;
  this.tracePoint[2].y = -Gy;
  
// draw the bars
  this.ctx[1].clearRect(0,0,this.can[1].width,this.can[1].height);
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.bar[0].draw(this.ctx[1]);
  this.bar[2].draw(this.ctx[1]);
  this.ctx[1].restore();

  this.ctx[3].clearRect(0,0,this.can[3].width,this.can[3].height);
  this.ctx[3].save();
  this.ctx[3].translate(this.x0,this.y0);
  this.bar[1].draw(this.ctx[3]);
  this.bar[3].draw(this.ctx[3]);
  this.bar[4].draw(this.ctx[3]);
  this.ctx[3].restore();
}

/**********************************************************************************************************************/
/* SixbarS2.drawGround - draw the two pivots
/**********************************************************************************************************************/
SixbarS2.prototype.drawGround = function() {
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.pivot[0].draw(this.ctx[2]);
  this.pivot[1].draw(this.ctx[2]);
  this.ctx[2].restore();
}
