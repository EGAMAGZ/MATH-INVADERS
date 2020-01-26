$(document).on("ready", function() {
  $('.nav-menu-container').hover(function(){});  
});

$('#Perfil').on("click",function(){
  $('.circ-menu').css({"transform":"rotate(180deg)"});
  $('.btnCirc').css({"transform":"rotate(180deg)"});
  $('.profile-container').css({"display":"block"});


  $('.puntuaje-container').css({"display":"none"});
  $('.puntuaje-container').css({"display":"none"});
  $('.LevelSelection-container').css({"display":"none"});
  $('.controles-container').css({"display":"none"});
});
$('#Sesion').on("click",function(){
  $('.circ-menu').css({"transform":"rotate(40deg)"});
  $('.btnCirc').css({"transform":"rotate(-40deg)"});

  $('.puntuaje-container').css({"display":"none"});
    $('.LevelSelection-container').css({"display":"none"});
  $('.profile-container').css({"display":"none"});
  $('.controles-container').css({"display":"none"});
});

$('#Nave').on("click",function(){
  $('.circ-menu').css({"transform":"rotate(160deg)"});
  $('.btnCirc').css({"transform":"rotate(-160deg)"});
  $('.controles-container').css({"display":"flex"});

  $('.puntuaje-container').css({"display":"none"});
  $('.LevelSelection-container').css({"display":"none"});
  $('.profile-container').css({"display":"none"});
});

$('#Nivel').on("click",function(){
  $('.circ-menu').css({"transform":"rotate(120deg)"});
  $('.btnCirc').css({"transform":"rotate(-120deg)"});
  $('.LevelSelection-container').css({"display":"block"});

  $('.puntuaje-container').css({"display":"none"});
  $('.profile-container').css({"display":"none"});
  $('.controles-container').css({"display":"none"});
});

$('#Puntuaje').on("click",function(){
  $('.circ-menu').css({"transform":"rotate(70deg)"});
  $('.btnCirc').css({"transform":"rotate(-70deg)"});
  $('.puntuaje-container').css({"display":"block"});

  $('.LevelSelection-container').css({"display":"none"});
  $('.profile-container').css({"display":"none"});
  $('.controles-container').css({"display":"none"});
});

var menu=true;
$('#menu').on("click",function(){
  if(menu){
    $('.nav-menu-container').css({"left":"0"});
    $('#menu').text("Esconder Menu");
    menu=false;
  }
  else{
    $('.nav-menu-container').css({"left":"-35em"});
    $('#menu').text("Desplegar Menu");
    menu=true;
  }
});

$('#cancelar').on("click",function(){$('.logout-container').css({"display":"none"});});
$('#Sesion').on("click",function(){$('.logout-container').css({"display":"flex"});});



