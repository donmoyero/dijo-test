function loadVideo(file){

const url = URL.createObjectURL(file);

const vid = document.createElement("video");

vid.src = url;
vid.crossOrigin = "anonymous";

vid.onloadedmetadata = () => {

Editor.video = vid;
Editor.duration = vid.duration;

};

}
