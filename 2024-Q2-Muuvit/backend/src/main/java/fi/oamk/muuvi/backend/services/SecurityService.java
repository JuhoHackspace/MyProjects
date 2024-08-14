package fi.oamk.muuvi.backend.services;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import fi.oamk.muuvi.backend.models.User;
import fi.oamk.muuvi.backend.repositories.UserRepository;

@Service
public class SecurityService {
    @Value("${jwt.secret}")
    private String jwtKey;
    
    @Autowired
    PasswordEncoder passwordEncoder;
    
    UserRepository repo;

    public SecurityService(UserRepository repository){
        this.repo = repository;
    }

    public String login(String uname, String pw) {
        System.out.println("Login attempt with username: " + uname);
        User user = repo.findByUsername(uname);

        if(user == null) {
            return "User not found";
        }

        if(passwordEncoder.matches(pw,user.passwordHash())) {
            Algorithm alg = Algorithm.HMAC256(jwtKey);
            Instant now = Instant.now().plusSeconds(1800);
            return JWT.create().withSubject(user.userId().toString()).withExpiresAt(now).sign(alg);
        } else {
            return "Invalid password";
        }
        
    }

}