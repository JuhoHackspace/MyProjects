package fi.oamk.muuvi.backend.services;



import org.springframework.beans.factory.annotation.Autowired;
import fi.oamk.muuvi.backend.models.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



import fi.oamk.muuvi.backend.models.Review;
import fi.oamk.muuvi.backend.repositories.ReviewRepository;
import fi.oamk.muuvi.backend.repositories.UserRepository;
import io.micrometer.core.ipc.http.HttpSender.Response;
import jakarta.persistence.EntityNotFoundException;

import java.util.Optional;

@Service
public class ReviewService {
    ReviewRepository repo;
    UserRepository userRepo;
    ReviewService(ReviewRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo=userRepo;
    }

    public ResponseEntity<String> newReview(Integer movieId, Integer stars, String description, Long userId) {
        Review newreview = new Review();
        Optional<User> owner = userRepo.findById(userId);
        try {
            newreview.setMovieId(movieId);
            newreview.setStars(stars);
            newreview.setDescription(description);
            newreview.setOwner(owner.get());
            this.repo.save(newreview);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body("Invalid review");
        }
        return ResponseEntity.ok().body("Review created");
        
    }

}
