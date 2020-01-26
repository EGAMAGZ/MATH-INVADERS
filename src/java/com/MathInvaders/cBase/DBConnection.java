/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.MathInvaders.cBase;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 *
 * @author Gamaliel
 */
public class DBConnection {
    private String user;
    private String pass;
    private String url;
    private String driver;
    private Connection cnx;
    public DBConnection(){
        user="root";
        pass="root";
        url="jdbc:mysql://localhost/MIDB";
        driver="com.mysql.jdbc.Driver";
    }
    public Connection connect(){
        try{
            Class.forName(driver).newInstance();
            cnx=DriverManager.getConnection(url,user,pass);
        }
        catch(Exception e){
            System.out.println("Error: "+e.toString());
        }
        return cnx;
    }
    public void disconnect() throws SQLException{
        cnx.close();
    }
}
