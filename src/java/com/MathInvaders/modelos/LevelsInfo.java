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
public class LevelsInfo {
    private int LevelId;
    private String LevelName;
    private String LevelConfig;

    public LevelsInfo(int LevelId, String LevelName, String LevelConfig) {
    }

    public int getLevelId() {
        return LevelId;
    }

    public void setLevelId(int LevelId) {
        this.LevelId = LevelId;
    }

    public String getLevelName() {
        return LevelName;
    }

    public void setLevelName(String LevelName) {
        this.LevelName = LevelName;
    }

    public String getLevelConfig() {
        return LevelConfig;
    }

    public void setLevelConfig(String LevelConfig) {
        this.LevelConfig = LevelConfig;
    }
    
}
