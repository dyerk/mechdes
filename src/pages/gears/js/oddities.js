"use strict"
window.onload = init;

//********************************************************************************
// function init() - initializes javascript on html page
// *******************************************************************************
function init() {
  // 1. Render stacked image + animation grids per section
  document.getElementById("sr2p-mount").innerHTML = renderCanvasGrid([
    {
      id: "01",
      title: "Sun, Ring and Two Planets — Type 1",
      image: { src: "../../images/gears/C8_IN_bSR2P.jpg", alt: "Sun, ring and two planets - 1" }
    },
    {
      id: "02",
      title: "Sun, Ring and Two Planets — Type 2",
      image: { src: "../../images/gears/C8_IN_iSR2P.jpg", alt: "Sun, ring and two planets - 2" }
    }
  ]);

  document.getElementById("sr3p-mount").innerHTML = renderCanvasGrid([
    {
      id: "03",
      title: "Sun, Ring and Three Planets — Type 1",
      image: { src: "../../images/gears/C8_IN_kSR3P.jpg", alt: "Sun, ring and three planets - 1" }
    },
    {
      id: "04",
      title: "Sun, Ring and Three Planets — Type 2",
      image: { src: "../../images/gears/C8_IN_lSR3P.jpg", alt: "Sun, ring and three planets - 2" }
    }
  ]);

  document.getElementById("sr4p-mount").innerHTML = renderCanvasGrid([
    {
      id: "05",
      colClass: "col-12 col-md-8 col-lg-6",
      title: "Sun, Ring and Four Planets",
      image: { src: "../../images/gears/C8_IN_jSR4P.jpg", alt: "Sun, ring and four planets - 1" }
    }
  ], "row g-4 justify-content-center");

  document.getElementById("2r-mount").innerHTML = renderCanvasGrid([
    {
      id: "06",
      title: "Two Rings, Two Planets",
      image: { src: "../../images/gears/C8_IN_h2R2P.jpg", alt: "Two rings, two planets" }
    },
    {
      id: "07",
      title: "Two Rings, Three Planets",
      image: { src: "../../images/gears/C8_IN_e2R3P.jpg", alt: "Two rings, three planets" }
    }
  ]);

  document.getElementById("2r4p-mount").innerHTML = renderCanvasGrid([
    {
      id: "08",
      colClass: "col-12 col-md-8 col-lg-6",
      title: "Two Rings, Four Planets",
      image: { src: "../../images/gears/C8_IN_d2R4P.jpg", alt: "Two rings, four planets" }
    }
  ], "row g-4 justify-content-center");

  document.getElementById("2s-mount").innerHTML = renderCanvasGrid([
    {
      id: "09",
      title: "Two Suns, Three Planets",
      image: { src: "../../images/gears/C8_IN_f2S3P.jpg", alt: "Two suns, three planets" }
    },
    {
      id: "10",
      title: "Two Suns, Four Planets",
      image: { src: "../../images/gears/C8_IN_c2S4P.jpg", alt: "Two suns, four planets" }
    }
  ]);

  // 2. Initiate animaitons
	// ***** numbers of teeth on gears *****
  var Ns = 32;    // number of teeth on sun
  var Nr = 72;   // number of teeth on ring
  var Np1 = 16;   // number of teeth on planet1
  var Np2 = 24;   // number of teeth on planet2

  var planSRP2_1 = new PlanSRP2_1(Ns, Nr, Np1, Np2);
  planSRP2_1.showPlots = false;
	planSRP2_1.buttonCanvas("01", 250, 200);
  planSRP2_1.drawGround();
  planSRP2_1.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns = 16;    // number of teeth on sun
  var Nr = 112;   // number of teeth on ring
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 24;   // number of teeth on planet2

  var planSRP2_2 = new PlanSRP2_2(Ns, Nr, Np1, Np2);
  planSRP2_2.showPlots = false;
	planSRP2_2.buttonCanvas("02", 250, 200);
  planSRP2_2.drawGround();
  planSRP2_2.draw(0);
	
	// ***** numbers of teeth on gears *****
  var Ns = 24;    // number of teeth on sun
  var Nr = 112;   // number of teeth on ring
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2
  var Np3 = 24;   // number of teeth on planet3

  var planSRP3_1 = new PlanSRP3_1(Ns, Nr, Np1, Np2, Np3);
  planSRP3_1.showPlots = false;
	planSRP3_1.buttonCanvas("03", 250, 200);
  planSRP3_1.drawGround();
  planSRP3_1.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns = 24;    // number of teeth on sun
  var Nr = 112;   // number of teeth on ring
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2
  var Np3 = 24;   // number of teeth on planet3

  var planSRP3_2 = new PlanSRP3_2(Ns, Nr, Np1, Np2, Np3);
  planSRP3_2.showPlots = false;
	planSRP3_2.buttonCanvas("04", 250, 200);
  planSRP3_2.drawGround();
  planSRP3_2.draw(0);

	// ***** numbers of teeth on gears *****
  var Ns = 32;    // number of teeth on sun
  var Nr = 112;   // number of teeth on ring
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2
  var Np3 = 16;   // number of teeth on planet3
  var Np4 = 24;   // number of teeth on planet4

  var planSRP4 = new PlanSRP4(Ns, Nr, Np1, Np2, Np3, Np4);
  planSRP4.showPlots = false;
	planSRP4.buttonCanvas("05", 250, 200);
  planSRP4.drawGround();
  planSRP4.draw(0);

  // ***** numbers of teeth on gears *****
  var Nr1 = 72;   // number of teeth on sun1
  var Nr2 = 112;  // number of teeth on sun2
  var Np1 = 16;   // number of teeth on planet1
  var Np2 = 56;   // number of teeth on planet2

  var planR2P2 = new PlanR2P2(Nr1, Nr2, Np1, Np2);
  planR2P2.showPlots = false;
	planR2P2.buttonCanvas("06", 250, 200);
  planR2P2.drawGround();
  planR2P2.draw(0);

  // ***** numbers of teeth on gears *****
  var Nr1 = 72;   // number of teeth on sun1
  var Nr2 = 112;  // number of teeth on sun2
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2
  var Np3 = 24;   // number of teeth on planet3

  var planR2P3 = new PlanR2P3(Nr1, Nr2, Np1, Np2, Np3);
  planR2P3.showPlots = false;
	planR2P3.buttonCanvas("07", 250, 200);
  planR2P3.drawGround();
  planR2P3.draw(0);

  // ***** numbers of teeth on gears *****
  var Nr1 = 48;   // number of teeth on sun1
  var Nr2 = 112;  // number of teeth on sun2
  var Np1 = 16;   // number of teeth on planet1
  var Np2 = 24;   // number of teeth on planet2
  var Np3 = 24;   // number of teeth on planet3
  var Np4 = 32;   // number of teeth on planet4

  var planR2P4 = new PlanR2P4(Nr1, Nr2, Np1, Np2, Np3, Np4);
  planR2P4.showPlots = false;
	planR2P4.buttonCanvas("08", 250, 200);
  planR2P4.drawGround();
  planR2P4.draw(0);

  // ***** numbers of teeth on gears *****
  var Ns1 = 16;   // number of teeth on sun1
  var Ns2 = 48;   // number of teeth on sun2
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2
  var Np3 = 32;   // number of teeth on planet3

  var planS2P3 = new PlanS2P3(Ns1, Ns2, Np1, Np2, Np3);  // create Grashof type 1 linkage
  planS2P3.showPlots = false;
  planS2P3.calcLengths = false;
	planS2P3.buttonCanvas("09", 250, 200);
  planS2P3.drawGround();
  planS2P3.draw(0);

  // ***** numbers of teeth on gears *****
  var Ns1 = 16;   // number of teeth on sun1
  var Ns2 = 48;   // number of teeth on sun2
  var Np1 = 24;   // number of teeth on planet1
  var Np2 = 16;   // number of teeth on planet2
  var Np3 = 16;   // number of teeth on planet3
  var Np4 = 24;   // number of teeth on planet4

  var planS2P4 = new PlanS2P4(Ns1, Ns2, Np1, Np2, Np3, Np4);  // create Grashof type 1 linkage
  planS2P4.showPlots = false;
  planS2P4.calcLengths = false;
	planS2P4.buttonCanvas("10", 250, 200);
  planS2P4.drawGround();
  planS2P4.draw(0);
}






