// ================================================================
// ImpactGrid Creator Studio — Main State
// ================================================================

// Global video reference
let vid = document.getElementById("masterVid");

// Canvas
let canvas = document.getElementById("cv");
let ctx = canvas.getContext("2d");

// Core state
let appState = {
    fileLoaded: false,
    duration: 0,
    currentTime: 0,

    captions: [],
    overlays: [],
    keywords: [],

    music: null,
    musicVolume: 0.4,

    exportFormat: "mp4",
    exportFPS: 30,

    crop: {
        scale: 1,
        offsetX: 0,
        offsetY: 0
    }
};

// Utility
function showToast(msg){
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"),2000);
}
