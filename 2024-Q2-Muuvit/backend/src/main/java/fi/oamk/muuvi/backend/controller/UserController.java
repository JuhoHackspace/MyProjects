package fi.oamk.muuvi.backend.controller;


import fi.oamk.muuvi.backend.Shemas.MovieResult;
import fi.oamk.muuvi.backend.Shemas.UserInformation;
import fi.oamk.muuvi.backend.repositories.UserRepository;
import fi.oamk.muuvi.backend.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    private UserService userservice;
    private UserRepository userrepository;
    public UserController(UserService userservice, UserRepository userrepository){
        this.userservice=userservice;
        this.userrepository=userrepository;
    }

    @PostMapping("/createAccount")
    public ResponseEntity<String> createAccount(@RequestBody UserInformation credentials) {
        if(credentials.getUserName() == null || credentials.getPassword() == null || credentials.getUserName().isEmpty() || credentials.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Username or password missing");
        }
        if(credentials.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Password too short");
        }
        return userservice.CreateAccount(credentials.getUserName(), credentials.getPassword());
    }

    @DeleteMapping("/private/deleteAccount")
    public ResponseEntity<String> deleteAccount (@RequestAttribute(name = "jwtSub") Long userId) {
        return userservice.deleteAccountByUserId(userId);
    }
    
}
