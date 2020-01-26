/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.MathInvaders.ImpDao;

import com.MathInvaders.Dao.LInfo;
import com.MathInvaders.cBase.DBConnection;
import com.MathInvaders.modelos.LevelsInfo;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;

/**
 *
 * @author Gamaliel
 */
public class LInfoImpl implements LInfo {

    private String BajarNivel = "call procBajarNivel(?);";
    private boolean ejecucion;

    private Connection conn = null;
    private PreparedStatement dbps = null;

    private DBConnection conx = new DBConnection();

    public LInfoImpl() {
        try {
            conn = conx.connect();
        } catch (Exception e) {
        }
    }

    @Override
    public boolean Subir(LevelsInfo LI) {
        try {
            Statement code= conn.createStatement();
            code.executeUpdate("insert into levelsData(LevelId,LevelName,LevelConfig) values('"+LI.getLevelId()+"','"+LI.getLevelName()+"','"+LI.getLevelConfig()+"');");
            ejecucion = true;
        } catch (Exception e) {
            ejecucion = false;
        }
        return ejecucion;
    }

    @Override
    public boolean Bajar(String LevelName) {
        try {
            dbps = conn.prepareStatement(BajarNivel);
            dbps.setString(1, LevelName);
            dbps.executeUpdate();
            ejecucion = true;
        } catch (Exception e) {
            ejecucion = false;
        }

        return ejecucion;
    }

}
