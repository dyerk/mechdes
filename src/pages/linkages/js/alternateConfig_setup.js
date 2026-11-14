document.addEventListener("DOMContentLoaded", () => {
    const linkageAnimations = [
        {
            prefix: "01",
            captionHtml: "<b>Threebar:</b> This linkage consists of a crank, coupler and ground.",
            scriptPath: "../../js_common/Class_Threebar.js",
            hasPlot: true,
            points: ["B", "P"]
        },
        {
            prefix: "02",
            captionHtml: "<b>Fourbar Linkage:</b> This very common linkage consists of a crank, coupler, rocker and ground.",
            scriptPath: "../../js_common/Class_Fourbar.js",
            hasPlot: true,
            points: ["B", "P", "C"]
        },
        {
            prefix: "03",
            captionHtml: "<b>Slider-Crank:</b> This linkage consists of a crank, connecting rod, slider and ground.",
            scriptPath: "../../js_common/Class_Slider_Crank.js",
            hasPlot: true,
            points: ["B", "C"]
        },
        {
            prefix: "04",
            captionHtml: "<b>Inverted Slider-Crank:</b> This linkage consists of a crank, slider, rocker and ground.",
            scriptPath: "../../js_common/Class_Inv_Slider_Crank.js",
            hasPlot: true,
            points: ["B", "C"]
        },
        {
            prefix: "05",
            captionHtml: "<b>Geared Fivebar:</b> This linkage consists of two gears, two couplers and ground.",
            scriptPath: "../../js_common/Class_Fivebar.js",
            hasPlot: false
        },
        {
            prefix: "06",
            captionHtml: "<b>Cam-Follower:</b> The cam-follower changes rotary motion of the cam to translational motion of a cam. The cam-follower pictured is known a rocker configuration.",
            scriptPath: [
                "../../js_common/Common_Shapes_Cam.js",
                "../../js_common/Class_Cam_Rock.js",
            ],
            hasPlot: false
        }
    ];

    renderAnimations("animation-sections-container", "../../includes/animation-section.html", linkageAnimations);
});