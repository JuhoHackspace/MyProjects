package fi.oamk.muuvi.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import fi.oamk.muuvi.backend.models.User;
import fi.oamk.muuvi.backend.repositories.UserRepository;
import io.micrometer.core.ipc.http.HttpSender.Response;
import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    UserRepository repo;

    UserService(UserRepository repo) {
        this.repo = repo;
    }

    User getUserById(Long id) {
        if (id == null) return null;
        try {
            return this.repo.getReferenceById(id);
        } catch (EntityNotFoundException e) {
            return null;
        }
    }

    public ResponseEntity<String> CreateAccount(String username, String password) {
        User user = new User();
        user.userName(username);
        user.passwordHash(passwordEncoder.encode(password));
        this.repo.save(user);
        return ResponseEntity.ok().body("Account created");
        
    }

}
