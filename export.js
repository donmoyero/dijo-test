function exportFrame(){

const link = document.createElement("a");

link.download = "impactgrid-frame.png";

link.href = Editor.canvas.toDataURL();

link.click();

}
