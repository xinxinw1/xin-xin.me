function $(a){
  return document.getElementById(a);
}

function openNav(){
  $("overlay").style.display = "block";
  $("nav").style.display = "block";
  $("overlay").onclick = closeNav;
}

function closeNav(){
  $("overlay").onclick = function (){};
  $("nav").style.display = "none";
  $("overlay").style.display = "none";
};

window.onload = function (){
  $("menu-link").onclick = function (){
    openNav();
    return false;
  };
  $("nav").onclick = closeNav;
};
