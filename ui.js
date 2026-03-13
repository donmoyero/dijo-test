function togglePlay(){

if(!Editor.video) return;

if(Editor.playing){

Editor.video.pause();
Editor.playing = false;

}else{

Editor.video.play();
Editor.playing = true;

}

}
