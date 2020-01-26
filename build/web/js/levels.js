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
var disparostotal=10;

var fondo;

var puntuaje = 0;
var restart = "deshabilitado";
var misionstatus = "escondido";

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
  } else if (teclado[32]) {
    if (!teclado.disparar) {
      if (juego.estado == "jugando") {
        if (misionstatus == "escondido" && disparos.length<disparostotal) {
          disparar();
        }
      }
      teclado.fire = true;
    } else if (!teclado[32]) {
      teclado.fire = false;
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
    if (misionstatus == "escondido") {
      disparo.y += 3;
    }
    if (misionstatus == "desplegado") {
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
        contador: 0
      });
    }
    juego.estado = "jugando";
  }
  for (var i in enemigos) {
    var enemigo = enemigos[i];
    if (!enemigo) continue;
    if (enemigo && enemigo.estado == "vivo") {
      if (misionstatus == "escondido") {
        enemigo.contador++;
        enemigo.x += Math.sin((enemigo.contador * Math.PI) / 90) * 5;

        if (aleatorio(0, enemigos.length * 10) == 4) {
          disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
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
    if (misionstatus == "escondido") {
      disparo.y -= 5;
    }
    if (misionstatus == "desplegado") {
      disparo.y = disparo.y;
    }
  }
  disparos = disparos.filter(function(disparo) {
    return disparo.y > 0;
  });
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
  if (teclado[77] && juego.estado == "jugando") {
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
    nave.x = canvas.width / 2;
    restart = "deshabilitado";
    juego.estado = "iniciando";
    nave.estado = "vivo";
    textoRespuesta.contador = -1;
    $(".gameover-container").css({ display: "none" });
    $(".win-container").css({ display: "none" });
    puntuaje = 0;
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
    for (i in enemigos) {
      var enemigo = enemigos[i];
      if (hit(disparo, enemigo)) {
        enemigo.estado = "hit";
        enemigo.contador = 0;
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
  }else if(juego.estado=="victoria"){
    puntuaje=100*(enemigosTotales);
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

function actualizacionMunicion(){
  var municionActual=disparostotal-disparos.length;
  $('#municion').val(municionActual);
}

function frameLoop() {
  comprobacionNaves();
  actualizaEnemigos();
  actualizarEstadoJuego();
  moverNave();
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
  actualizacionMunicion();
}

loadMedia();
agregarEventosTeclado();
