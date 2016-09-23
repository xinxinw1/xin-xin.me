function $(a){
  return document.getElementById(a);
}

function openNav(){
  $("overlay").style.display = "block";
  $("nav-drop").style.display = "block";
  $("overlay").onclick = closeNav;
}

function closeNav(){
  $("overlay").onclick = function (){};
  $("nav-drop").style.display = "none";
  $("overlay").style.display = "none";
};

function replaceYoutubeVideo(elem, id) {
  var yt = document.createElement("iframe");
  yt.setAttribute("src", "https://www.youtube.com/embed/" + id + "?autoplay=1");
  yt.setAttribute("frameborder", "0");
  yt.setAttribute("allowfullscreen", "allowfullscreen");
  elem.parentNode.replaceChild(yt, elem);
}