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
public class UserData {

    private int playerId;

    private String playerName;
    private String playerPassword;
    private String playerEmail;

    public UserData(int playerId, String playerName, String playerPassword, String playerEmail) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.playerPassword = playerPassword;
        this.playerEmail = playerEmail;
    }

    public int getPlayerId() {
        return playerId;
    }

    public void setPlayerId(int playerId) {
        this.playerId = playerId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getPlayerPassword() {
        return playerPassword;
    }

    public void setPlayerPassword(String playerPassword) {
        this.playerPassword = playerPassword;
    }

    public String getPlayerEmail() {
        return playerEmail;
    }

    public void setPlayerEmail(String playerEmail) {
        this.playerEmail = playerEmail;
    }
/*
    @Override
    public String toString() {
        return "UserData{" + "playerId=" + playerId + ", playerName=" + playerName + ", playerPassword=" + playerPassword + ", playerEmail=" + playerEmail + '}';
    }
    */

}