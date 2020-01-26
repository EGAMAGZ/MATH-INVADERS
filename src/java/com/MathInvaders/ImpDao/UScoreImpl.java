package com.MathInvaders.ImpDao;

import com.MathInvaders.Dao.UserScore;
import com.MathInvaders.cBase.DBConnection;
import com.MathInvaders.modelos.ScoresData;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

public class UScoreImpl implements UserScore {

    private Connection conn = null;
    private DBConnection cnx = new DBConnection();
    private ArrayList<ScoresData> AS = null;
    private PreparedStatement dbps = null;
    private ResultSet dbrs = null;
    private ScoresData SD = null;
    private String UserName;
    private int UserId;

    private String ShowAllScores = "call procShowAllScores(?)";
    private String Score = "call procScore(?,?,?);";
    private String ID = "call procID(?)";

    public UScoreImpl(String UserName) {
        this.UserName = UserName;
        try {
            conn = cnx.connect();
        } catch (Exception e) {
            System.out.println(e.toString());
        }
    }

    public int USERID(String UserName) {
        ResultSet rs=null;
        try {
            Connection conx = cnx.connect();
            PreparedStatement ps = conx.prepareStatement(ID);
            ps.setString(1, UserName);
            rs=ps.executeQuery();
            if(rs.next()){
                UserId=rs.getInt("UserId");
            }
        } catch (Exception e) {
            System.out.println(e.toString());
        }

        return UserId;
    }

    @Override
    public void ChangeScore(int LevelId, int UserScore,String UserName) {
        try {
            dbps=conn.prepareStatement(Score);
            dbps.setInt(1,LevelId);
            dbps.setInt(2,USERID(UserName));
            dbps.setInt(3,UserScore);
            dbps.executeUpdate();
        } catch (Exception e) {
        }

    }

    @Override
    public ArrayList<ScoresData> AllScores() {
        AS = new ArrayList();
        UserId = USERID(UserName);
        try {
            dbps = conn.prepareStatement(ShowAllScores);
            dbps.setInt(1, UserId);
            dbrs = dbps.executeQuery();
            while (dbrs.next()) {
                SD = new ScoresData(dbrs.getString("LevelName"), dbrs.getInt("UserScore"));
                AS.add(SD);
            }
        } catch (Exception e) {
        }

        return AS;
    }

}
