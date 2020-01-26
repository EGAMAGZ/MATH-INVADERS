/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.MathInvaders.Dao;

import com.MathInvaders.modelos.ScoresData;
import java.util.ArrayList;

/**
 *
 * @author Gamaliel
 */
public interface UserScore {

    ArrayList<ScoresData> AllScores();

    void ChangeScore(int LevelId, int UserScore,String UserName);
}
