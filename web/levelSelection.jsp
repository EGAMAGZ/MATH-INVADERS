<%@page import="com.MathInvaders.modelos.ScoresData"%>
<%@page import="java.util.ArrayList"%>
<%@page import="com.MathInvaders.ImpDao.UScoreImpl"%>
<%@page import="com.MathInvaders.Seguridad.Validacion"%>
<%@page import="com.MathInvaders.modelos.UserData"%>
<%@page import="com.MathInvaders.ImpDao.DUserImpl"%>
<%@page import="com.MathInvaders.Dao.DUserData"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page session="true"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Math Invaders</title>    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link href="css/levelSelection.css" rel="stylesheet" type="text/css" />
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    </head>
    <body>
        <%
            boolean display = false;
            String user = null;
            String password = null;
            DUserImpl DUDI = null;
            UserData UD = null;
            String mail = null;
            Validacion val = new Validacion();
            String passwordcomp = null;
            String usercomp = null;
            UScoreImpl USI = null;
            ArrayList<ScoresData> ALSD = null;

            HttpSession MISess = request.getSession();
            if (MISess.isNew()) {
                if (request.getParameter("btnLogIn") != null) {
                    user = request.getParameter("usr");
                    password = request.getParameter("mail");
                    DUDI = new DUserImpl();
                    UD = DUDI.LogIn(user);
                    usercomp = UD.getPlayerName();
                    passwordcomp = UD.getPlayerPassword();
                    if (val.LogInVal(user, password)) {
                        if (usercomp != null && passwordcomp != null) {
                            if ((user.equals(usercomp)) && (password.equals(passwordcomp))) {
                                out.println("<script>alert('Logueado');</script>");
                                MISess.setAttribute("MIName", user);
                                display = true;
                            } else {
                                out.println("<script>alert('Valores invalidos')</script>");
                                response.sendRedirect("index.html");
                                display = false;
                            }
                        } else {
                            out.println("<script>alert('Cuenta inexistente');</script>");
                            response.sendRedirect("index.html");
                            display = false;
                        }
                    } else {
                        out.println("<script>alert('Valores incorrectos');</script>");
                        response.sendRedirect("index.html");
                        display = false;
                    }
                } else if (request.getParameter("btnRegister") != null) {
                    user = request.getParameter("usr");
                    mail = request.getParameter("mail");
                    password = request.getParameter("pass1");
                    passwordcomp = request.getParameter("pass2");
                    if (val.RegisterVal(user, password, mail)) {
                        if (password.equals(passwordcomp)) {
                            UD = new UserData(0, user, password, mail);
                            DUDI = new DUserImpl();
                            if (DUDI.Create(UD, user)) {
                                out.println("<script>alert('Registrado Correctamente');</script>");
                                MISess.setAttribute("MIName", user);
                                display = true;
                            } else {
                                out.println("<script>alert('Usuario ya Existente');</script>");
                                response.sendRedirect("index.html");
                                display = false;
                            }
                        } else {
                            out.println("<script>alert('Contraseñas no coninciden')</script>");
                            response.sendRedirect("index.html");
                            display = false;
                        }
                    } else {
                        out.println("<script>alert('Valores incorrectos');</script>");
                        response.sendRedirect("index.html");
                        display = false;
                    }
                } else if (request.getParameter("btnClose") != null) {
                    MISess.invalidate();
                    response.sendRedirect("index.html");
                }
                USI = new UScoreImpl(user);
            } else {
                user = MISess.getAttribute("MIName").toString();
                USI = new UScoreImpl(user);
                DUDI = new DUserImpl();
                
                if(user!=null){
                    if (request.getParameter("chgEmail") != null) {
                    mail = request.getParameter("mail");
                    user = MISess.getAttribute("MIName").toString();
                    if (DUDI.ChangeMail(mail, user)) {
                        out.println("<script>alert('Correo cambiado exitosamente');</script>");
                    } else {
                        out.println("<script>alert('No se pudo cambiar el correo');</script>");
                    }
                    display = true;
                    }
                }
                
                 
            }
            out.println("<script>alert('"+user+"')</script>");
            if (display) {
                %>
    <div class="nav-menu-container">
      <h2>Menu</h2>
      <div class="anillo3">
        <div class="anillo2">
          <div class="anillo1">
            <ul class="circ-menu">
              <li><button id="Perfil" class="btnCirc">Perfil</button></li>
              <li><button id="Nave" class="btnCirc">Controles</button></li>
              <li>
                <button id="Nivel" class="btnCirc">Seleccion de Nivel</button>
              </li>
              <li><button id="Puntuaje" class="btnCirc">Puntajes</button></li>
              <li>
                <button id="Sesion" class="btnCirc">Cerrar Sesion</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="logout-container">
      <div class="logout">
        <h2>Cerrar Sesion</h2>
        <p>¿Estas seguro que quieres cerrar sesion?</p>
        <div>
          <button id="cancelar">Cancelar</button>
          <form method="POST" action="levelSelection.jsp">
            <button id="aceptar">Aceptar</button>
          </form>
        </div>
      </div>
    </div>
    <div class="profile-container">
      <div class="prof1">
        <div>
          <h2>MI</h2>
          <p>Math Invaders</p>
        </div>
      </div>
      <div class="prof2">
        <div class="title-profile"><p>Informacion de Perfil</p></div>
        <div class="info-profile-container">
          <div class="info1-container">
            <div class="info1">
              <form action="levelSelection.jsp" method="POST">
                <h2>Correo Electronico:</h2>
                <input type="text" name="mail" placeholder="Correo" />
                <input type="submit" name="chgEmail" value="Cambiar" />
              </form>
            </div>
            <div class="info2">
              <h2>Estado de Sesion:</h2>
              <p>Iniciado</p>
            </div>
          </div>
          <div class="info2-container"></div>
        </div>
      </div>
    </div>
    <div class="LevelSelection-container">
      <div class="level-title"><p>Selector de Niveles</p></div>
      <div class="levels-container">
        <div class="level-card">
            <form action="level.jsp" method="POST">
            <p class="lvl-title">Nivel 1</p>
            <img src="" />
            <input type="text" class="lvl-name" value="Jupiter" name="lvl-name"readonly />
            <button type="submit">Jugar</button>
          </form>
        </div>
        <div class="level-card">
          <form action="level.jsp" method="POST">
            <p class="lvl-title">Nivel 2</p>
            <img src="" />
            <input type="text" class="lvl-name" value="Tierra" name="lvl-name" readonly />
            <button type="submit">Jugar</button>
          </form>
        </div>
        <div class="level-card">
          <form action="level.jsp" method="POST">
            <p class="lvl-title">Nivel 3</p>
            <img src="" />
            <input type="text" class="lvl-name" value="Mercurio" name="lvl-name" readonly />
            <button type="submit">Jugar</button>
          </form>
        </div>
        <div class="level-card">
          <form action="level.jsp" method="POST">
            <p class="lvl-title">Nivel 4</p>
            <img src="" />
            <input type="text" class="lvl-name" value="Marte" name="lvl-name" readonly />
            <button type="submit">Jugar</button>
          </form>
        </div>
        <div class="level-card">
          <form action="level.jsp" method="POST">
            <p class="lvl-title">Nivel 5</p>
            <img src="" />
            <input type="text" class="lvl-name" value="Pluton" name="lvl-name" readonly />
            <button type="submit">Jugar</button>
          </form>
        </div>
        <div class="level-card">
          <form action="level.jsp" method="POST">
            <p class="lvl-title">Nivel 6</p>
            <img src="" />
            <input type="text" class="lvl-name" value="Saturno" name="lvl-name" readonly />
            <button type="submit">Jugar</button>
          </form>
        </div>
        <div class="level-card">
          <form action="level.jsp" method="POST">
            <p class="lvl-title">Nivel 7</p>
            <img src="" />
            <input type="text" class="lvl-name" value="Venus" name="lvl-name" readonly />
            <button type="submit">Jugar</button>
          </form>
        </div>
        <div class="level-card">
          <form action="level.jsp" method="POST">
            <p class="lvl-title">Nivel 8[JEFE]</p>
            <img src="" />
            <input type="text" class="lvl-name" value="Sol" name="lvl-name" readonly />
            <button type="submit">Jugar</button>
          </form>
        </div>
      </div>
    </div>

    <div class="body"></div>

    <div class="puntuaje-container">
      <div class="puntuaje-div1">
        <div class="user-score-container">
          <div class="user-score-title"><p>Tu puntuacion</p></div>
        </div>
      </div>
      <div class="puntuaje-div2"></div>
    </div>

    <div class="controles-container">
      <div class="info-control-container">
        <div class="info-control-title"><p>Moverse</p></div>
        <div class="info-control-text">
          Para moverse, se hace uso de las flechas del teclado &nbsp;
          <button>Izquierda</button> <button>Derecha</button>
          <button>Arriba</button> <button>Abajo</button>&nbsp;. En algunos
          niveles te permitira moverte libremente en la pantalla, mientras que
          otros de un lado a otro
        </div>
      </div>
      <div class="info-control-container">
        <div class="info-control-title"><p>Disparar</p></div>
        <div class="info-control-text">
          En la gran mayoria de niveles tu mision es eliminar a las naves
          enemigas, para realizar estó se usa la tecla &nbsp;<button>Espacio</button>&nbsp;.
          Cada nivel tiene un limite de carga de municion, el cual se gasta a medida que uno dispara.
        </div>
      </div>
      <div class="info-control-container">
        <div class="info-control-title"><p>Recargar</p></div>
        <div class="info-control-text">
          Obviamente sera necesario recargar a medida que la municion es gastada, para volver a llenarla es necesario resolver un problema aritmetico. Debido a esto hay dos metodos de recargalo:<br>
          1)Dejar que se gasta.<br>
          2)Presionar la tecla&nbsp; <button>SHIFT</button> &nbsp;para recargar [Es necesario haberse gastado un poco de la municion previa a recargar]<br>
          <b>IMPORTANTE:</b>Cuando se resuelve correctamente la operacion, se la recarga sera completa pero si es erronea te dara o quitara hasta que tengas un numero total de 10 en la municion<br>
          Al aparecer la pregunta, es autoseleccionado el cuadro texto para mayor comodidad<br>
          Una vez escrita la respuesta presionar&nbsp; <button>ENTER</button>&nbsp; para automaticamente evaluar la respuesta<br>
        </div>
      </div>
      <div class="info-control-container">
        <div class="info-control-title"><p>Pausa/Ver Misión</p></div>
        <div class="info-control-text">
          En todos los niveles a excepcion de los de contramiento, te da la posibilidad de poder poner pausa o ver tu mision actual.<br>
          Esto se habilita y deshabilita presionando la tecla <button>M</button>
        </div>
      </div>
      <div class="info-control-container">
        <div class="info-control-title"><p>Guardar Puntuaje/Reintentar</p></div>
        <div class="info-control-text">
          Una vez ganada o perdida la partida, la pantalla respectiva te mostrara tu puntuaje actual,junto
          con dos opciones: <b>GUARDAR</b> dandole click al texto, o <b>REINTENTAR</b> presionando la tecla &nbsp; <button>R</button>
        </div>
      </div>
    </div>

    <button id="menu">Desplegar Menu</button>

    <script src="js/levelSelection.js"></script>

        <%
            }
        %>

    </body>
</html>