/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.MathInvaders.Seguridad;

import com.MathInvaders.cBase.DBConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 *
 * @author Gamaliel
 */
public class Validacion {

    private final String invalidos = "!'#-:;/()[]{}*+<>,|&%$";
    private final String DBCompUser = "call procCompUser(?);";

    private final char[] valoresCorreo = {'.', '@'};

    private Connection conn = null;

    private DBConnection cnx = null;

    private void Validacion_connect() {
        try {
            cnx = new DBConnection();
            conn = cnx.connect();
        } catch (Exception e) {
        }
    }

    public boolean CompCorreo(String mail) {
        boolean compCorreo = true;
        for (int m = 0; m < valoresCorreo.length; m++) {
            if (mail.indexOf(valoresCorreo[m]) == -1) {
                compCorreo = false;
                break;
            }
        }
        return compCorreo;
    }

    public boolean RegisterVal(String user, String pass, String mail) {
        boolean result = true;
        String[] valor = new String[3];
        valor[0] = user;
        valor[1] = pass;
        valor[2] = mail;
        if (user.isEmpty() || pass.isEmpty() || mail.isEmpty()) {
            result = false;
        } else if (8> user.length() || user.length()>20  || (6>pass.length() && pass.length()>20 ) || !CompCorreo(mail) || 15>mail.length() || mail.length()>30 ) {
            result = false;
        } else {
            for (int i = 0; i < valor.length; i++) {
                for (int j = 0; j < invalidos.length(); ++j) {
                    if (valor[i].indexOf(invalidos.charAt(j)) == -1) {
                    }else{
                        result = false;
                        break;
                    }
                }
                if (!result) {
                    break;
                }
            }
        }
        return result;
    }

    public boolean LogInVal(String user, String pass) {
        boolean result = true;

        String[] valor = new String[2];
        valor[0] = user;
        valor[1] = pass;
        if (user.isEmpty() || pass.isEmpty()) {
            result = false;
        } else if (user.length() < 8 || user.length()>20 || pass.length() < 6 || pass.length()>20) {
            result = false;
        } else {
            for (int i = 0; i < valor.length; i++) {
                for (int j = 0; j < invalidos.length(); ++j) {
                    if (valor[i].indexOf(invalidos.charAt(j)) == -1) {
                    }else{
                        result = false;
                        break;
                    }
                }
                if (!result) {
                    break;
                }
            }
        }

        return result;
    }

    public boolean CompUser(String user) {
        boolean existencia = false;
        Validacion_connect();
        ResultSet rs = null;
        try {
            PreparedStatement ps = conn.prepareStatement(DBCompUser);
            ps.setString(1, user);
            rs = ps.executeQuery();
            if (rs.next()) {
                return existencia = true;
            } else {
                return existencia = false;
            }
        } catch (Exception e) {
        }

        return existencia;
    }
}
