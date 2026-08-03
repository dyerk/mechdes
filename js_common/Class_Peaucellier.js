Peaucellier.prototype = new Linkage();

// *********************************************************************************************************************
// Function Peaucellier creates a Peaucellier straight line linkage
// *********************************************************************************************************************
function Peaucellier(a,b,c) {
  this.bar = [new Bar(b, this.geom, this.color[3], this.color[6]),  // medium link
              new Bar(c, this.geom, this.color[3], this.color[5]),  // long link
              new Bar(c, this.geom, this.color[3], this.color[5]),  // long link
              new Bar(a, this.geom, this.color[3], this.color[10]),  // short link
              new Bar(a, this.geom, this.color[3], this.color[10]),  // short link
              new Bar(a, this.geom, this.color[3], this.color[10]),  // short link
              new Bar(a, this.geom, this.color[3], this.color[10])]; // short link

  this.bar[0].x = b;  // right medium link is fixed to right pivot
  this.bar[0].y = 0;
  this.bar[1].x = 0;  // long bars are pinned to left pivot
  this.bar[1].y = 0;
  this.bar[2].x = 0;
  this.bar[2].y = 0;

  this.pivot = [new Pivot(0, 0, this.geom),
                new Pivot(b, 0, this.geom)];

  this.crankMin = Math.acos((b*b + b*b - (c-a)*(c-a))/(2*b*b)) - Math.PI;
  this.crankMax = -this.crankMin;
	
	this.tracePoint = new Array();		// initialize array for trace points
	for (var i = 0; i < 1; i++){
		this.tracePoint[i] = {x:0,y:0};
	}
}

// *********************************************************************************************************************
// Peaucellier.draw - calculates the linkage angles and draws the bars
// *********************************************************************************************************************
Peaucellier.prototype.draw = function(angle) {
  var a = this.bar[3].L;  // short link
  var b = this.bar[0].L;  // medium link
  var c = this.bar[1].L;  // long link

  var theta = this.solve(c, a, b*Math.cos(angle) + b, b*Math.sin(angle),false);
  this.bar[0].theta = angle;    // rocker angle
  this.bar[2].theta = theta[0]; // crank angle
  this.bar[4].theta = theta[1]; // coupler angle

  var theta = this.solve(c, a, b*Math.cos(angle) + b, b*Math.sin(angle),true);
  this.bar[1].theta = theta[0]; // crank angle
  this.bar[5].theta = theta[1]; // coupler angle

  this.bar[3].theta = this.bar[5].theta - Math.PI;  // rest of linkage is parallelogram
  this.bar[6].theta = this.bar[4].theta - Math.PI;

// update link positions
  this.bar[3].x =  c*Math.cos(this.bar[2].theta);
  this.bar[3].y = -c*Math.sin(this.bar[2].theta);
  this.bar[5].x =  c*Math.cos(this.bar[1].theta);
  this.bar[5].y = -c*Math.sin(this.bar[1].theta);
  this.bar[4].x =  this.bar[3].x;
  this.bar[4].y =  this.bar[3].y;
  this.bar[6].x =  this.bar[5].x;
  this.bar[6].y =  this.bar[5].y;

// calculate coordinates of tracing point
  this.tracePoint[0].x = this.bar[6].x + a*Math.cos(this.bar[6].theta);
  this.tracePoint[0].y = this.bar[6].y - a*Math.sin(this.bar[6].theta);

// draw the bars
  this.ctx[1].clearRect(0,0,this.can[1].width,this.can[1].height);
  this.ctx[1].save();
  this.ctx[1].translate(this.x0,this.y0);
  this.bar[1].draw(this.ctx[1]);
  this.bar[4].draw(this.ctx[1]);
  this.bar[2].draw(this.ctx[1]);
  this.ctx[1].restore();

  this.ctx[3].clearRect(0,0,this.can[3].width,this.can[3].height);
  this.ctx[3].save();
  this.ctx[3].translate(this.x0,this.y0);
  this.bar[0].draw(this.ctx[3]);
  this.bar[5].draw(this.ctx[3]);
  this.bar[3].draw(this.ctx[3]);
  this.bar[6].draw(this.ctx[3]);
  this.ctx[3].restore();
}

/**********************************************************************************************************************/
/* Peaucellier.solve - solves for the two unknown angles of the fourbar linkage given the crank angle
/**********************************************************************************************************************/
Peaucellier.prototype.solve = function(p,q,r,s,open) {

  var theta = [];
  var D = (r*r+s*s-p*p-q*q)/(2*p*q);
  if (open) {
    var delta = Math.acos(D);
  } else {
    var delta = -Math.acos(D);
  }
  var A = p+q*D;
  var B = q*Math.sin(delta);
  theta[0] = Math.atan2(A*s-B*r, A*r+B*s);
  theta[1] = theta[0] + delta;
  return theta;
}

/**********************************************************************************************************************/
/* Peaucellier.drawGround - draw the two pivots
/**********************************************************************************************************************/
Peaucellier.prototype.drawGround = function() {
  this.ctx[2].save();
  this.ctx[2].translate(this.x0,this.y0);
  this.pivot[0].draw(this.ctx[2]);
  this.pivot[1].draw(this.ctx[2]);
  this.ctx[2].restore();
}

