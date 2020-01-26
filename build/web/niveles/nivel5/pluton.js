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
$("canvas").css({"transform":"rotate(180deg)"});
$(".levelinfo-planeta").html("Planeta: Pluton");
$(".levelinfo-number").html("5");
$(".mision-info").html("Elimina a las naves enemigas");
// ------- JUEGO -------
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var nave = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 37.5,
  height: 37.5,
  contador: 0
}; //50
var textoRespuesta = { contador: -1, titulo: "", subtitulo: "" };
var teclado = {};
var juego = { estado: "esperando" };
var disparos = [];
var disparosEnemigos = [];
var enemigos = [];

//Modificable
var enemigosTotales = 10;
var disparostotal = 50;
var disparosdisponibles=disparostotal;
var fondo;

var puntuaje = 0;
var restart = "deshabilitado";
var misionstatus = "escondido";
var operacionstatus="escondido";
var listaproblemas;
var pregunta;
var respuesta;

var operaciones={
  "suma":function(a,b){
    pregunta= a +" + "+b;
    respuesta=a+b;
  },
  "resta":function(a,b){
    pregunta= a +" - "+b;
    respuesta=a-b;
  },
  "multiplicacion":function(a,b){
    pregunta=a +" X "+b;
    respuesta=a*b;
  }
}

var timer = setTimeout(function() {
  juego.estado = "iniciando";
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
  if (teclado[39] && (misionstatus == "escondido" &&  operacionstatus=="escondido")) {
    nave.x -= 5;
    if (nave.x < 0) {
      nave.x = 0;
    }
  } else if (teclado[37] && (misionstatus == "escondido" &&  operacionstatus=="escondido")) {
    var limite = canvas.width - nave.width;
    nave.x += 5;
    if (nave.x > limite) {
      nave.x = limite;
    }
  } else if (teclado[32]) {
    if (!teclado.disparar) {
      if (juego.estado == "jugando") {
        if ((misionstatus == "escondido" &&  operacionstatus=="escondido") && disparosdisponibles>0) {
          actualizacionMunicion();
        }
      }
      teclado.fire = true;
    } else if (!teclado[32]) {
      teclado.fire = false;
    }
  }else if(teclado[13] && operacionstatus=="desplegado"){
    var contenido=$('#respuesta').val();
    comprobacionRespuesta(contenido);
  }else if(teclado[38] && misionstatus=="escondido"){
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

function dibujarDisparosEnemigos() {
  for (var i in disparosEnemigos) {
    var disparo = disparosEnemigos[i];
    ctx.save();
    ctx.fillStyle = "yellow";
    ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height);
    ctx.restore();
  }
}

function moverDisparosEnemigos() {
  for (var i in disparosEnemigos) {
    var disparo = disparosEnemigos[i];
    if (misionstatus == "escondido" &&  operacionstatus=="escondido") {
      disparo.y += 10;
    }
    if (misionstatus == "desplegado" || operacionstatus=="desplegado") {
      disparo.y = disparo.y;
    }
  }
  disparosEnemigos = disparosEnemigos.filter(function(disparo) {
    return disparo.y < canvas.height;
  });
}

function actualizaEnemigos() {
  function agregarDisparosEnemigos(enemigo) {
    return {
      x: enemigo.x,
      y: enemigo.y,
      width: 10,
      height: 25,
      contador: 0
    };
  }
  if (juego.estado == "iniciando") {
    for (var i = 0; i < 10; i++) {
      enemigos.push({
        x: 10 + i * 50,
        y: 10,
        width: 40,
        height: 40,
        estado: "vivo",
        contador: 0,
        mov: "desplazamiento"
      });
    }
    juego.estado = "jugando";
  }
  for (var i in enemigos) {
    var enemigo = enemigos[i];
    if (!enemigo) continue;
    if (enemigo && enemigo.estado == "vivo") {
      if (misionstatus == "escondido" &&  operacionstatus=="escondido") {
        if (enemigo.mov == "desplazamiento" ) {
          enemigo.contador++;
          enemigo.x += Math.sin((enemigo.contador * Math.PI) / 90) * 5;
        }

        if (aleatorio(0, enemigos.length * 10) == 4) {
          disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
        } else {
          if (
            aleatorio(0, enemigos.length * 10) == 8 &&
            enemigo.mov == "desplazamiento"
          ) {
            enemigo.mov = "caida";
          }
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

function moverDisparos() {
  for (var i in disparos) {
    var disparo = disparos[i];
    if (misionstatus == "escondido" &&  operacionstatus=="escondido") {
      disparo.y -= 10;
    }
    if (misionstatus == "desplegado" ||  operacionstatus=="desplegado") {
      disparo.y = disparo.y;
    }
  }
  disparos = disparos.filter(function(disparo) {
    return disparo.y > 0;
  });
}

function moverCaida() {
  for (var i in enemigos) {
    var enemigo = enemigos[i];
    if (enemigo.mov == "caida") {
      if (enemigo.y < canvas.height) {
        if (misionstatus == "escondido" &&  operacionstatus=="escondido") {
          enemigo.y += 10;
        }
        if (misionstatus == "desplegado" ||  operacionstatus=="desplegado") {
          enemigo.y = enemigo.y;
        }
      } else if (enemigo.y == canvas.height) {
        enemigo.mov = "subida";
      }
    } else if (enemigo.mov == "subida") {
      if (enemigo.y > 10) {
        if (misionstatus == "escondido" &&  operacionstatus=="escondido") {
          enemigo.y -= 10;
        }
        if (misionstatus == "desplegado" ||  operacionstatus=="desplegado") {
          enemigo.y = enemigo.y;
        }
      } else if (enemigo.y == 10) {
        enemigo.mov = "desplazamiento";
      }
    }
  }
}

function disparar() {
  disparos.push({
    x: nave.x + 10,
    y: nave.y - 5,
    width: 10,
    height: 20
  });
}

function dibujarDisparos() {
  ctx.save();
  ctx.fillStyle = "white";
  for (var i in disparos) {
    var disparo = disparos[i];
    ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height);
  }
  ctx.restore();
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
    $(".gameover-container").css({ display: "flex" });
    $("#scorefail").val(puntuaje);
    
    $('.pregunta-container').css({"display":"none"});
    for (var i in disparosEnemigos) {
      delete disparosEnemigos[i];
    }
    for (var i in disparos) {
      delete disparos[i];
    }
    for (var i in enemigos) {
      delete enemigos[i];
    }
    var waitR = setTimeout(function() {
      restart = "habilitado";
      clearTimeout(waitR);
    }, 3000);
  }
  if (juego.estado == "victoria") {
    $(".win-container").css({ display: "flex" });
    $("#scorewin").val(puntuaje);
    $('.pregunta-container').css({"display":"none"});
    for (var i in disparosEnemigos) {
      delete disparosEnemigos[i];
    }
    for (var i in disparos) {
      delete disparos[i];
    }

    var waitR = setTimeout(function() {
      restart = "habilitado";
      clearTimeout(waitR);
    }, 3000);
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
  if (teclado[77] && juego.estado == "jugando" &&  operacionstatus=="escondido") {
    var mision = $(".mision-info-container").css("top");
    if (mision == "-96px") {
      $(".mision-info-container").css({ top: "0em" });
      misionstatus = "desplegado";
    }
    if (mision == "0px") {
      $(".mision-info-container").css({ top: "-6em" });
      misionstatus = "escondido";
    }
  }
  if (
    (juego.estado == "perdido" || juego.estado == "victoria") &&
    teclado[82] &&
    restart == "habilitado"
  ) {
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
  for (var i in disparos) {
    var disparo = disparos[i];
    for (k in enemigos) {
      var enemigo = enemigos[k];
      if (hit(disparo, enemigo)) {
        enemigo.estado = "hit";
        enemigo.contador = 0;
        delete disparos[i];
      }
    }
  }
  if (nave.estado == "hit" || nave.estado == "muerto") return;
  for (var i in disparosEnemigos) {
    var disparo = disparosEnemigos[i];
    if (hit(disparo, nave)) {
      nave.estado = "hit";
    }
  }
  for (var i in enemigos) {
    var enemigo = enemigos[i];
    if (hit(enemigo, nave)) {
      nave.estado = "hit";
    }
  }
}

function aleatorio(inferior, superior) {
  var posibilidades = superior - inferior;
  var a = Math.random() * posibilidades;
  a = Math.floor(a);
  return parseInt(inferior) + a;
}

function puntuacion() {
  if (nave.estado == "hit" || nave.estado == "vivo") {
    puntuaje = 100 * (enemigosTotales - enemigos.length);
  } else if (nave.estado == "muerto") {
    puntuaje = puntuaje;
  } else if (juego.estado == "victoria") {
    puntuaje = 100 * enemigosTotales;
  }
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
}

function actualizacionMunicion() {
  if(disparosdisponibles>0){
    disparar();
    disparosdisponibles-=1;
  }
}

function actualizacionMunicionRest() {
  $("#municion").html(disparosdisponibles);
}

function desplegarPregunta(){
  
  if(disparosdisponibles<=0 && juego.estado=="jugando" && operacionstatus=="escondido"){
    $('.pregunta-container').css({"display":"flex"});
    operacionstatus="desplegado";
    randomProblema();
    enfocar();
  }
  else if((disparosdisponibles<disparostotal) && juego.estado=="jugando" && operacionstatus=="escondido" && teclado[16]){
    $('.pregunta-container').css({"display":"flex"});
    operacionstatus="desplegado";
    randomProblema();
    enfocar();
  }

}
function enfocar() {
  var input = document.getElementById("respuesta");
  input.focus();
  input.select();
}
function comprobacionRespuesta(contenido){
  if(contenido==respuesta){
    $('.pregunta-container').css({"display":"none"});
    operacionstatus="escondido";    
    disparosdisponibles+=disparostotal-disparosdisponibles;
    $('#respuesta').val("");
  }else{
    $('.pregunta-container').css({"display":"none"});
    operacionstatus="escondido";
    disparosdisponibles=10;
    $('#respuesta').val("");
  }
}

function randomProblema(){
  var list=["suma","resta","multiplicacion"];
  function limiteNumeros(){
    var a=Math.floor((Math.random() * 10) + 1);
    return a;
  }
  var r=aleatorio(0,list.length);
  operaciones[list[r]](limiteNumeros(),limiteNumeros());
  $("#problema").html(pregunta);
}

function frameLoop() {
  comprobacionNaves();
  actualizaEnemigos();
  actualizarEstadoJuego();
  moverNave();
  moverCaida();
  moverDisparosEnemigos();
  moverDisparos();
  dibujarFondo();
  verificarContacto();
  dibujarEnemigos();
  dibujarDisparosEnemigos();
  dibujarDisparos();
  dibujaTexto();
  dibujarNave();
  puntuacion();
  //CAMBIE
  actualizacionMunicionRest();
  desplegarPregunta();
}

loadMedia();
agregarEventosTeclado();


function reinicio() {

  disparosdisponibles = disparostotal; //CAMBIE
  nave.x = canvas.width / 2;
  nave.y=canvas.height - 50;
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
  if (xinit >= (canvas.width / 2)) {
      accion = "disparo";
  } else if (xinit <= (canvas.width / 2)) {
      accion = "movimiento"
  }
}, false);
document.addEventListener("touchmove", function (e) {
  xend = e.touches[0].clientX;
  yend = e.touches[0].clientY;
  if (accion == "movimiento" && misionstatus == "escondido" && operacionstatus == "escondido") {
      var restanteX = xend - xinit;
      var restanteY = yend - yinit;
      var absX = Math.abs(xend - xinit);
      var absY = Math.abs(yend - yinit);
      if (absX > absY) {
          if (xend > xinit) {
              //DERECHA
              var limite = canvas.width - nave.width;
              nave.x -= 5;
              if (nave.x > limite) {
                  nave.x = limite;
              }
          }
          if (xend < xinit) {
              //IZQUIERDA
              nave.x += 5;
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

$(".municion-container").on("click",function(){
  if(juego.estado=="jugando" && operacionstatus=="escondido"&& misionstatus=="escondido"){
      
          $(".pregunta-container").css({display: "flex"});
      operacionstatus = "desplegado";
      randomProblema();
      enfocar();
  }
});
$(".preguntas-square").on("click",function(){
  if(misionstatus=="escondido" && disparosdisponibles<disparostotal){
      var contenido = $("#respuesta").val();
      comprobacionRespuesta(contenido);
  }
});
document.addEventListener("touchend", function (e) {
  if (juego.estado == "jugando" && misionstatus == "escondido" && operacionstatus == "escondido") {
      if (accion == "disparo") {
          actualizacionMunicion();
      }
  }
}, false);