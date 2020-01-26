$(document).on("ready", function() {
  //   var stDisplaybtn = $(".btn-display").text();
  var stDisplaybtn = true;
  $(".btn-display").on("click", function() {
    if (stDisplaybtn) {
      $(".flechas-container").css({ display: "block" });
      $(".disparo-container").css({ display: "block" });
      $(".btn-display").text("Ocultar botones");
      stDisplaybtn = false;
    } else {
      $(".disparo-container").css({ display: "none" });
      $(".flechas-container").css({ display: "none" });
      $(".btn-display").text("Mostar botones");
      stDisplaybtn = true;
    }
  });
});

$(".levelinfo-planeta").html("Planeta: Saturno");
$(".levelinfo-number").html("6");
$(".mision-info").html("Sobrevive a las naves por dos minutos, no dejes que choquen contigo");
$(".municion-container").css({"display":"none"});
// ------- JUEGO -------
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var nave = {
  x: canvas.width / 2,
  y: canvas.height /2,
  width: 37.5,
  height: 37.5,
  contador: 0,
  
}; //50
var textoRespuesta = { contador: -1, titulo: "", subtitulo: "" };
var teclado = {};
var juego = { estado: "esperando" };
var disparos = [];
var disparosEnemigos = [];
var enemigos = [];
var aliados = [];

//Modificable
var enemigosTotales = 10;
var disparostotal = 30;
var disparosdisponibles=disparostotal;
var aliadosTotales=5;
var fondo;

var puntuaje = 0;
var restart = "deshabilitado";
var misionstatus = "escondido";


var time;
function supervivencia(){
  time=setTimeout(function(){
    if(nave.estado=="vivo"){
      juego.estado="victoria";
      Ganado();
      espera();
    }
    clearTimeout(time);
  },120000);
}

var waitR;
function espera(){
  waitR=setTimeout(function(){
    
    restart="habilitado";
    clearTimeout(waitR);
  },3000);
}

var timer = setTimeout(function() {
  juego.estado = "iniciando";

  supervivencia();
  clearTimeout(timer);
}, 13000);


function loadMedia() {
  fondo = new Image();
  fondo.src =
    "https://supercurioso.com/wp-content/uploads/2017/09/restos-mortales-tapa.jpg";
  fondo.onload = function() {
    var intervalo = window.setInterval(frameLoop, 1000 / 55);
  };
}

function dibujarEnemigos() {
  for (var i in enemigos) {
    var enemigo = enemigos[i];
    ctx.save();
    if (enemigo.estado == "vivo") ctx.fillStyle = "green";
    if (enemigo.estado == "muerto") ctx.fillStyle = "black";
    ctx.fillRect(enemigo.x, enemigo.y, enemigo.width, enemigo.height);
  }
}

function dibujarAliados() {
  for (var i in aliados) {
    var aliado = aliados[i];
    ctx.save();
    if (aliado.estado == "vivo") ctx.fillStyle = "blue";
    if (aliado.estado == "muerto") ctx.fillStyle = "black";
    ctx.fillRect(aliado.x, aliado.y, aliado.width, aliado.height);
  }
}

function dibujarFondo() {
  ctx.drawImage(fondo, 0, 0);
}

function dibujarNave() {
  ctx.save();
  ctx.fillStyle = "red";
  ctx.fillRect(nave.x, nave.y, nave.width, nave.height);
  ctx.restore();
}

function agregarEventosTeclado() {
  agregarEvento(document, "keydown", function(e) {
    teclado[e.keyCode] = true;
  });
  agregarEvento(document, "keyup", function(e) {
    teclado[e.keyCode] = false;
  });

  function agregarEvento(elemento, nombreEvento, funcion) {
    if (elemento.addEventListener) {
      elemento.addEventListener(nombreEvento, funcion, false);
    } else if (elemento.attachEvent) {
      elemento.attachEvent(nombreEvento, funcion);
    }
  }
}

function moverNave() {
  if (teclado[37] && misionstatus == "escondido") {
    nave.x -= 5;
    if (nave.x < 0) {
      nave.x = 0;
    }
  } else if (teclado[39] && misionstatus == "escondido") {
    var limite = canvas.width - nave.width;
    nave.x += 5;
    if (nave.x > limite) {
      nave.x = limite;
    }
  } else if(teclado[38] && misionstatus=="escondido"){
    nave.y-=5;
    if(nave.y<0){nave.y=0;}
  } else if(teclado[40] && misionstatus=="escondido"){
    var limite=canvas.height -nave.height;
    nave.y+=5;
    if(nave.y>limite){
      nave.y=limite;
    }
  }
  // else teclado.fire =false;
  if (nave.estado == "hit") {
    nave.contador++;
    if (nave.contador >= 5) {
      nave.contador = 0;
      nave.estado = "muerto";
      juego.estado = "perdido";
      textoRespuesta.contador = 0;
    }
  }
}




function actualizaEnemigos() {

  if (juego.estado == "iniciando") {
    for (var i = 0; i < 10; i++) {
      enemigos.push({
        x: 10 + i * 50,
        y: canvas.height-60,
        width: 40,
        height: 40,
        estado: "vivo",
        contador: 0,
        mov:"desplazamiento"
      });
    }
    juego.estado = "jugando";
  }
  for (var i in enemigos) {
    var enemigo = enemigos[i];
    if (!enemigo) continue;
    if (enemigo && enemigo.estado == "vivo") {
      if (misionstatus == "escondido") {
        if(enemigo.mov=="desplazamiento"){
          enemigo.contador++;
          enemigo.x += Math.sin((enemigo.contador * Math.PI) / 90) * 5;
        }
        if(aleatorio(0,enemigos.length*10)==8 && enemigo.mov=="desplazamiento"){
          enemigo.mov="subida";
        }
      }
    } else if (enemigo && enemigo.estado == "hit") {
      enemigo.contador++;
      if (enemigo.contador >= 3) {
        enemigo.estado = "muerto";
        enemigo.contador = 0;
      }
    }
  }
  enemigos = enemigos.filter(function(enemigo) {
    if (enemigo && enemigo.estado != "muerto") {
      return true;
    }
    return false;
  });
}
function actualizarAliados() {
  if (juego.estado == "iniciando") {
    for (var i = 0; i < 10; i++) {

        aliados.push({
          x: 30 + i * 50,
          y: 30,
          width: 40,
          height: 40,
          estado: "vivo",
          contador: 0,
          mov:"desplazamiento"
        });
      
    }
  }
  for (var i in aliados) {
    var aliado = aliados[i];
    if (!aliado) continue;
    if (aliado && aliado.estado == "vivo") {
      if (misionstatus == "escondido") {
        if(aliado.mov=="desplazamiento"){
          aliado.contador++;
          aliado.x += Math.sin((aliado.contador * Math.PI) / 90) * 5;
        }
        if(aleatorio(0,aliados.length*10)==8 && aliado.mov=="desplazamiento"){
          aliado.mov="caida";
        }
      }
    } else if (aliado && aliado.estado == "hit") {
      aliado.contador++;
      if (aliado.contador >= 3) {
        aliado.estado = "muerto";
        aliado.contador = 0;
      }
    }
  }
  aliados = aliados.filter(function(aliado) {
    if (aliado && aliado.estado != "muerto") {
      return true;
    }
    return false;
  });
}

function moverCaida(){
  for(var i in aliados){
    var aliado=aliados[i];
    if(aliado.mov=="caida"){
      if(aliado.y < canvas.height){
        if(misionstatus == "escondido"){
          aliado.y+=5;
        }
        if(misionstatus == "desplegado"){
          aliado.y=aliado.y;
        }
      }
      else if(aliado.y== canvas.height){
        aliado.mov="subida";
      }
    } else if(aliado.mov=="subida"){
      if(aliado.y>40){
        if(misionstatus=="escondido"){
          aliado.y-=5;
        }
        if(misionstatus=="desplegado"){
          aliado.y=aliado.y;
        }
      }else if(aliado.y==40){
        aliado.mov="desplazamiento";
      }
    }
  }
}

function moverSubida(){
  for(var i in enemigos){
    var enemigo=enemigos[i];
    if(enemigo.mov=="subida"){
      if(enemigo.y>0){
        if(misionstatus=="escondido"){
          enemigo.y-=5;
        }
        else if(misionstatus =="desplegado"){
          enemigo.y=enemigo.y;
        }
      } else if(enemigo.y==0){
        enemigo.mov="caida";
      }
    } else if(enemigo.mov=="caida"){
      if(enemigo.y<(canvas.height -60)){
        if(misionstatus=="escondido"){
          enemigo.y+=5;
        }
        if(misionstatus=="desplegado"){
          enemigo.y=enemigo.y;
        }
      }else if(enemigo.y == (canvas.height-60)){
        enemigo.mov="desplazamiento";
      }
    }
  }
}


function dibujaTexto() {
  if (textoRespuesta.contador == -1) {
    return;
  }
  var alpha = textoRespuesta.contador / 50.0;
  if (alpha > 1) {
  }
  ctx.save();
  ctx.globalAlpha = alpha;
  if (juego.estado == "perdido") {
    clearTimeout(time);
    espera();
    disparosdisponibles=0;
    $(".gameover-container").css({ display: "flex" });
    $("#scorefail").val(puntuaje);
    $('.pregunta-container').css({"display":"none"});
    for (var i in enemigos) {
      delete enemigos[i];
    }
    for(var i in aliados){
      delete aliados[i];
    }

  }
}
function Ganado(){
  $(".win-container").css({ display: "flex" });
  $("#scorewin").val(puntuaje);
  $('.pregunta-container').css({"display":"none"});
  for (var i in enemigos) {
    delete enemigos[i];
  }
  for(var i in aliados){
      delete aliados[i];
  }
}
function actualizarEstadoJuego() {
  if (juego.estado == "jugando" && enemigos.length == 0) {
    juego.estado = "victoria";
    textoRespuesta.titulo = "Derrotaste a los enemigos";
    textoRespuesta.subtitulo = "Presiona la tecla R para reiniciar";
    textoRespuesta.contador = 0;
  }
  if (textoRespuesta.contador >= 0) {
    textoRespuesta.contador++;
  }

  if (
    (juego.estado == "perdido" || juego.estado == "victoria") &&
    teclado[82] &&
    restart == "habilitado"
  ) {
    supervivencia();
    reinicio();
  }
}

function hit(a, b) {
  var hit = false;
  if (b.x + b.width >= a.x && b.x < a.x + a.width) {
    if (b.y + b.height >= a.y && b.y < a.y + a.height) {
      hit = true;
    }
  } else if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
    if (b.y <= a.y && b.x + b.height >= a.y + a.height) {
      hit = true;
    }
  } else if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
    if (a.y <= b.y && a.x + a.height >= b.y + b.height) {
      hit = true;
    }
  }

  return hit;
}

function verificarContacto() {
  //Enemigos
  
  for (var i in enemigos) {
    var enemigo = enemigos[i];
    if (hit(nave, enemigo)) {
      enemigo.estado = "hit";
      enemigo.contador = 0;
      nave.estado = "hit";
      delete enemigos[i];
    }
  }
  //Aliados

    for (var i in aliados) {
      var aliado = aliados[i];
      if (hit(nave, aliado)) {
        aliado.estado = "hit";
        aliado.contador = 0;
        nave.estado = "hit";
        delete disparos[i];
      }
    }
  //Nave
  if (nave.estado == "hit" || nave.estado == "muerto") return;
}

function aleatorio(inferior, superior) {
  var posibilidades = superior - inferior;
  var a = Math.random() * posibilidades;
  a = Math.floor(a);
  return parseInt(inferior) + a;
}


function comprobacionNaves() {
  if (enemigos.length > 10) {
    for (var i in enemigos) {
      delete enemigos[i];
    }
    for (var i in disparosEnemigos) {
      delete disparosEnemigos[i];
    }
    dibujarEnemigos();
  }
  if(aliados.length>10){
    for(var i in aliados){
        delete aliados[i];
    }
    dibujarAliados();
  }
}



function frameLoop() {
  comprobacionNaves();
  actualizarAliados();
  actualizaEnemigos();
  actualizarEstadoJuego();
  moverNave();
  dibujarFondo();
  verificarContacto();
  dibujarAliados();
  dibujarEnemigos();
  dibujaTexto();
  dibujarNave();
  moverCaida();
  moverSubida();
}
loadMedia();
agregarEventosTeclado();

function reinicio() {

  disparosdisponibles = disparostotal; //CAMBIE
  nave.x = canvas.width / 2;
  nave.y=canvas.height/2;
  restart = "deshabilitado";
  juego.estado = "iniciando";
  nave.estado = "vivo";
  textoRespuesta.contador = -1;
  $(".gameover-container").css({display: "none"});
  $(".win-container").css({display: "none"});
  puntuaje = 0;
  nave.contador = 0;
}


//TOUCH EVENTS
var xinit = 0;
var yinit = 0;
var xend = 0;
var yend = 0;
var accion = "";
document.addEventListener("touchstart", function (e) {
  xinit = e.touches[0].clientX;
  yinit = e.touches[0].clientY;
  if (xinit <= canvas.width ) {
      accion = "movimiento"
  }
}, false);
document.addEventListener("touchmove", function (e) {
  xend = e.touches[0].clientX;
  yend = e.touches[0].clientY;
  if (accion == "movimiento" && misionstatus == "escondido" ) {
      var restanteX = xend - xinit;
      var restanteY = yend - yinit;
      var absX = Math.abs(xend - xinit);
      var absY = Math.abs(yend - yinit);
      if (absX > absY) {
          if (xend > xinit) {
              //DERECHA
              var limite = canvas.width - nave.width;
              nave.x += 5;
              if (nave.x > limite) {
                  nave.x = limite;
              }
          }
          if (xend < xinit) {
              //IZQUIERDA
              nave.x -= 5;
              if (nave.x < 0) {
                  nave.x = 0;
              }
          }
      }
      if (absX < absY) {
          if (yend > yinit) {
              //ABAJO
              var limite = canvas.height - nave.height;
              nave.y += 5;
              if (nave.y > limite) {
                  nave.y = limite;
              }
          }
          if (yend < yinit) {
              //ARRIBA
              nave.y -= 5;
              if (nave.y < 0) {
                  nave.y = 0;
              }
          }
      }
  }
}, false);
$(".repeat").on("click", function () {
  if (juego.estado == "victoria" || juego.estado == "perdido") {
      reinicio();
  }
});
$(".mision-info-container").on("click", function () {
  if (juego.estado == "jugando") {
      var mision = $(".mision-info-container").css("top");
      if (mision == "-96px") {
          $(".mision-info-container").css({top: "0em"});
          misionstatus = "desplegado";
      }
      if (mision == "0px") {
          $(".mision-info-container").css({top: "-6em"});
          misionstatus = "escondido";
      }

  }
});


document.addEventListener("touchend", function (e) {
}, false);