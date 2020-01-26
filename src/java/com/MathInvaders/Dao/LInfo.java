/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.MathInvaders.Dao;

import com.MathInvaders.modelos.LevelsInfo;

/**
 *
 * @author Gamaliel
 */
public interface LInfo {
    boolean Subir(LevelsInfo LI);
    boolean Bajar(String LevelName);
}
