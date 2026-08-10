// **********************************************************************************
// function LU_Decomp - performs LU decomposition on a matrix (as per Numerical Recipes)
// **********************************************************************************
function LU_Decomp(A,n) {
  var aMax = 0, dum = 0, sum = 0, iMax = 0;
  var d = 1;
  var indx = new Array();
  var vv = new Array();
  
  for (var i = 0; i < n; i++) {
    aMax = 0;
    for (var j = 0; j < n; j++) {
      if (Math.abs(A[i][j]) > aMax) {
        aMax = Math.abs(A[i][j]);
      }
    }
    if (aMax == 0) {
      alert("singular matrix!");
    }
    vv[i] = 1.0/aMax;
  }
  for (j = 0; j < n; j++) {
// calculate beta terms  
    for (var i = 0; i < j; i++) {
      sum = A[i][j];
      for (var k = 0; k < i; k++) {
        sum -= A[i][k] * A[k][j];
      }
      A[i][j]=sum;
    }
// calculate alpha terms
    aMax = 0;
    for (var i = j; i < n; i++) {
      sum = A[i][j];
      for (var k = 0; k < j; k++) {
        sum -= A[i][k]*A[k][j];
      }
      A[i][j]=sum;
      dum=vv[i]*Math.abs(sum);
      if (dum >= aMax) {
        iMax = i;
        aMax = dum;
      }
    }
    if (j != iMax) {
      for (var k = 0; k < n; k++) {
        dum = A[iMax][k];
        A[iMax][k] = A[j][k];
        A[j][k] = dum;
      }
      d = -d;
      vv[iMax] = vv[j];      
    }
    indx[j] = iMax;
    if (j != n-1) {
      dum = 1.0/A[j][j];
      for (var i = j + 1; i < n; i++) {
        A[i][j] = A[i][j] * dum;
      }; 
    }  
  }

  return {
    A: A,
    indx: indx
  }
}
/**********************************************************************************************************************/
/* function LU_Backsub - performs back substitution on LU decomposed system (as per Numerical Recipes)
/**********************************************************************************************************************/
function LU_Backsub(A,n,indx,b) {
  var sum = 0.0, ii = 0, ll = 0;

  for (var i = 0; i < n; i++) {
    ll = indx[i];
    sum = b[ll];
    b[ll]=b[i];
    for (j = 0; j < i; j++) {
      sum -= A[i][j] * b[j];
    }
    b[i] = sum;
  }
  for (var i = n-1; i >= 0; i--) {
    sum = b[i];
    for (j = i+1; j < n; j++) {
      sum -=A[i][j]*b[j]
    }
    b[i] = sum/A[i][i];
  }
  return b
}
