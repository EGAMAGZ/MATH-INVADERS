<%-- 
    Document   : level
    Created on : 19/11/2018, 08:17:20 AM
    Author     : Gamaliel
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page session="true"%>
<!DOCTYPE html>
<html>

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
        <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0"> -->
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta charset="UTF-8">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Math Invaders</title>
        <link href="css/level.css" rel="stylesheet" type="text/css">
        <script src="http://code.jquery.com/jquery-latest.js"></script>
    </head>

    <body>
        <%
            HttpSession MISess = request.getSession();
            if(!MISess.isNew()){
            
        
        %>
        <div class="juego-container">
            <canvas id="game" width="800" height="400"></canvas>
        </div>
        <div class="gameover-container">
            <div class="gameover">
                <h1>Game Over</h1>
                <form action="juego.jsp" method="POST">
                    <div>
                        <p>Puntuaje:</p><input type="text" name="score" id="scorefail" readonly>
                    </div>
                    <div><button type="submit" name="chgScore">Guardar</button></div>
                </form>
                <p class="repeat">Preiona R para reiniciar</p>
            </div>
        </div>
        <div class="win-container">
            <div class="win">
                <h1>Ganaste</h1>
                <form action="juego.jsp" method="POST">
                    <div>
                        <p>Puntuaje:</p><input type="text" name="score" id="scorewin" readonly>
                    </div>
                    <div><button type="submit" name="chgScore">Guardar</button></div>
                </form>
                <p class="repeat">Presiona R para reiniciar</p>
            </div>
        </div>
        <div class="levelinfo1">
            <p class="levelinfo-planeta"></p>
            <p class="levelinfo-level">Nivel:</p>
            <p class="levelinfo-number"></p>
        </div>
        <div class="levelinfo2"></div>
        <div class="mision-info-container">
            <div class="mision-info">
            </div>
        </div>
        <div class="municion-container">
            <p>Municion: &nbsp;</p><p class="municion" id="municion" ></p>
        </div>
        <div class="pregunta-container">
            <div class="preguntas-square">
                <h1>Resolver operacion para municion:</h1>
                <p class="problema" id="problema"></p>
                <div>
                    <p>Respuesta:</p><input type="text" id="respuesta">
                </div>
            </div>
        </div>

        <%
            String nivel=request.getParameter("lvl-name");
            out.println("<script>alert('"+nivel+"');</script>");
            if(nivel.toLowerCase().equals("jupiter")){
                out.println("<script src='niveles/nivel1/jupiter.js'></script>");
            }else
            if(nivel.toLowerCase().equals("tierra")){
                out.println("<script src='niveles/nivel2/tierra.js'></script>");
            }else
            if(nivel.toLowerCase().equals("mercurio")){
                out.println("<script src='niveles/nivel3/mercurio.js'></script>");
            }else
            if(nivel.toLowerCase().equals("marte")){
                out.println("<script src='niveles/nivel4/marte.js'></script>");
            }else
            if(nivel.toLowerCase().equals("pluton")){
                out.println("<script src='niveles/nivel5/pluton.js'></script>");
            }else
            if(nivel.toLowerCase().equals("saturno")){
                out.println("<script src='niveles/nivel6/saturno.js'></script>");
            }else
            if(nivel.toLowerCase()=="venus"){
            }else
            if(nivel.toLowerCase()=="sol"){
            }
            if(request.getParameter("chgScore")!=null){
                int score=Integer.parseInt(request.getParameter("score"));
                
            }
        }
        %>
    </body>

</html>