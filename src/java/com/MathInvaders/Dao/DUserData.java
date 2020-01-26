/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.MathInvaders.Dao;

import com.MathInvaders.modelos.UserData;
import java.util.ArrayList;

/**
 *
 * @author Gamaliel
 */
public interface DUserData {
     boolean Create (UserData UD,String user);
    UserData Read(int id);
    void Update(UserData UD);
    boolean ChangeMail(String mail,String user);
    UserData LogIn(String user);
    ArrayList<UserData> PlayerList();   
}
