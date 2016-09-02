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

window.onload = function (){
  $("nav-link").onclick = function (){
    openNav();
    return false;
  };
  $("nav-drop").onclick = closeNav;
};
