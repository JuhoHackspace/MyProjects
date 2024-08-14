package fi.oamk.muuvi.backend.repositories;

import fi.oamk.muuvi.backend.models.Review;
import fi.oamk.muuvi.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query(value="SELECT * FROM reviews r WHERE r.user_name = ?1;", nativeQuery = true)
    User findByUsername(String username);

    @Query(value="SELECT r.*, u.user_name FROM reviews r JOIN users u ON r.user_id = u.user_id ORDER BY r.review_id DESC LIMIT 5 OFFSET ((?1-1)*5)", nativeQuery = true)
    ArrayList<Review> getPage(Integer page);

    @Query(value="SELECT COUNT(*) FROM reviews", nativeQuery = true)
    Integer countAllReviews();

}
