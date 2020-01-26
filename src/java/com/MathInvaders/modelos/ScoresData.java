/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.MathInvaders.modelos;

/**
 *
 * @author Gamaliel
 */
public class ScoresData {
    private String LevelName;
    private int UserScore;

    public ScoresData(String LevelName, int UserScore) {
        this.LevelName = LevelName;
        this.UserScore = UserScore;
    }

    
    
    public String getLevelName() {
        return LevelName;
    }

    public void setLevelName(String LevelName) {
        this.LevelName = LevelName;
    }

    public int getUserScore() {
        return UserScore;
    }

    public void setUserScore(int UserScore) {
        this.UserScore = UserScore;
    }
    
}
