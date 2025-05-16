/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.app.utils;

import org.hibernate.SessionFactory;

/**
 *
 * @author User
 */
public class test {
     public static void main(String[] args) {
        try {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            System.out.println("SessionFactory creada: " + sf);
            sf.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
