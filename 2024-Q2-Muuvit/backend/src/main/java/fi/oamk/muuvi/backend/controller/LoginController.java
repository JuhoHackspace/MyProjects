package fi.oamk.muuvi.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import fi.oamk.muuvi.backend.Shemas.UserInformation;
import fi.oamk.muuvi.backend.services.SecurityService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/auth")
public class LoginController {
    private SecurityService securityService;

    public LoginController(SecurityService securityService) {
        this.securityService = securityService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> Login(@RequestBody UserInformation credentials) {
        System.out.println("Login controller attempt with username: " + credentials.getUserName() + " and password: " + credentials.getPassword());
        String response = securityService.login(credentials.getUserName(), credentials.getPassword());
        if(credentials.getUserName() == null || credentials.getPassword() == null || credentials.getUserName().isEmpty() || credentials.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Username or password missing");
        }
        if(response.equals("User not found")) {
            return ResponseEntity.badRequest().body(response);
        }else if(response.equals("Invalid password")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        return ResponseEntity.ok().body(response);
    }
    
}
