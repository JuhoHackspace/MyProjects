package fi.oamk.muuvi.backend.repositories;

import fi.oamk.muuvi.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query(value="SELECT * FROM users u WHERE u.user_name = ?1", nativeQuery = true)
    User findByUsername(String username);
}
