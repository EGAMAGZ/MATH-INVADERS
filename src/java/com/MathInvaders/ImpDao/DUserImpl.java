package com.MathInvaders.ImpDao;

import com.MathInvaders.Dao.DUserData;
import com.MathInvaders.Seguridad.Validacion;
import com.MathInvaders.cBase.DBConnection;
import com.MathInvaders.modelos.UserData;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Gamaliel
 */
public class DUserImpl implements DUserData {
    
    private DBConnection cnx = null;
    private Connection conn = null;
    private PreparedStatement dbps=null;
    private UserData UD=null;
    private ResultSet dbrs=null;
    private Validacion val=new Validacion();

    
    private final String DBAltaUser = "call procAltaUser(?,?,?,?);";
    private final String DBLogUser="call procLogUser(?);";
    private final String DBChgMail="call procChgMail(?,?)";
    private String ID = "call procID(?)";
    
    private final int id = 0;
    private int UserId;
    
    public DUserImpl() {
        try {
            cnx=new DBConnection();
            conn = cnx.connect();
        } catch (Exception e) {
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
    
    public void Scores(String user){

        String listNewScore = "insert into levelsScore values(?,?,?)";
        try {
            for(int i=1;i<=8;++i){
                PreparedStatement p=conn.prepareStatement(listNewScore);
                p.setInt(1,i);
                p.setInt(2,USERID(user));
                p.setInt(3,0);
                p.executeUpdate();
            }

        } catch (SQLException ex) {
            Logger.getLogger(DUserImpl.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    @Override
    public boolean Create(UserData UD, String user) {
        boolean creacion = false;
        
        try {
            if (val.CompUser(user)) {
                creacion = false;
            } else {
                dbps = conn.prepareStatement(DBAltaUser);
                dbps.setInt(0, id);
                dbps.setString(1, UD.getPlayerName());
                dbps.setString(2, UD.getPlayerPassword());
                dbps.setString(3, UD.getPlayerEmail());
                dbps.executeUpdate();
                Scores(user);
                creacion = true;
            }

        } catch (Exception e) {
        }

        return creacion;
    }

    @Override
    public UserData Read(int id) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void Update(UserData UD) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public boolean ChangeMail(String mail,String user) {
        boolean change;
        if(val.CompUser(user)){
            try {
                dbps=conn.prepareStatement(DBChgMail);
                dbps.setString(1, user);
                dbps.setString(2,mail);
                dbps.executeUpdate();
                change=true;
            } catch (Exception ex) {
                Logger.getLogger(DUserImpl.class.getName()).log(Level.SEVERE, null, ex);
                change=false;
            }
        }
        else{
            change=false;
        }
        return change;
    }

    @Override
    public UserData LogIn(String user) {
        try {
            dbps=conn.prepareStatement(DBLogUser);
            dbps.setString(1,user);
            dbrs=dbps.executeQuery();
            if(dbrs.next()){
                UD=new UserData(id,user,dbrs.getString("UserPass"),dbrs.getString("UserMail"));
            }else{
                UD=new UserData(id,null,null,null);
            }
        } catch (Exception e) {
        }
        return UD;
    }

    @Override
    public ArrayList<UserData> PlayerList() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

}
