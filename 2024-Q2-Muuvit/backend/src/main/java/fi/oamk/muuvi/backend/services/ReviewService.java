package fi.oamk.muuvi.backend.services;



import fi.oamk.muuvi.backend.Shemas.PaginatedReviews;
import fi.oamk.muuvi.backend.models.User;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Service;

import fi.oamk.muuvi.backend.misc.Type;
import fi.oamk.muuvi.backend.models.Review;
import fi.oamk.muuvi.backend.repositories.ReviewRepository;
import fi.oamk.muuvi.backend.repositories.UserRepository;
import fi.oamk.muuvi.backend.repositories.UsersToGroupsRepository;

import javax.swing.*;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class ReviewService {
    ReviewRepository repo;
    UserRepository userRepo;
    UsersToGroupsRepository utogRepo;
    ReviewService(ReviewRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo=userRepo;
    }

    public ResponseEntity<String> newReview(Integer movieId, Type type, Integer stars, String description, Long userId) {
        Review newreview = new Review();
        Optional<User> owner = userRepo.findById(userId);
        try {
            newreview.setMovieId(movieId);
            newreview.setStars(stars);
            newreview.setType(type);
            newreview.setDescription(description);
            newreview.setOwner(owner.get());
            this.repo.save(newreview);
            return ResponseEntity.ok().body("Review created");
        } catch (HttpMessageNotReadableException e) {
            System.out.println(e.getStackTrace());
            return ResponseEntity.badRequest().body("bad request");
        } catch (Exception e) {
            System.out.println(e.getStackTrace());
            return ResponseEntity.status(418).body("I'm a teapot");
        }
    }

    public ResponseEntity<PaginatedReviews> getReviews(Integer page) {
        ArrayList<Review> reviews = repo.getPage(page);
        PaginatedReviews paginatedReviews = new PaginatedReviews();
        paginatedReviews.setReviews(reviews);
        paginatedReviews.setCurrentPage(page);
        Integer numReviews = repo.countAllReviews();
        paginatedReviews.setNumPages(numReviews % 5 > 0 ? numReviews / 5 + 1 : numReviews / 5);
        paginatedReviews.setPageSize(5);
        return ResponseEntity.ok().body(paginatedReviews);
    }
}
