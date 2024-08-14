package fi.oamk.muuvi.backend.services;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class GenerateShareSlur {
    public static String generateShareSlur(String user_id) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
        
            byte[] hashBytes = digest.digest(user_id.getBytes());
            
            StringBuilder hexString = new StringBuilder();
            for (byte hashByte : hashBytes) {
                String hex = Integer.toHexString(0xff & hashByte);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            
            String shareSlur = hexString.substring(0, 8);
            
            return shareSlur;
            
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            System.err.println("Error: SHA-256 algorithm not found");
            return null;
        }
    }
}
