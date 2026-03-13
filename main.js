window.addEventListener("DOMContentLoaded", () => {

Editor.canvas = document.getElementById("canvas");
Editor.ctx = Editor.canvas.getContext("2d");

Editor.canvas.width = Editor.width;
Editor.canvas.height = Editor.height;

startRenderLoop();

});
