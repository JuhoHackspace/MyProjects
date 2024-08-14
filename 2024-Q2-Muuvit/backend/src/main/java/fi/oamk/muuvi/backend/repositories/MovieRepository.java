package fi.oamk.muuvi.backend.repositories;

import fi.oamk.muuvi.backend.misc.Type;
import fi.oamk.muuvi.backend.models.Movie;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface MovieRepository extends CrudRepository<Movie, Long>{
    @Query(value="SELECT * FROM movies mov WHERE mov.group_id = ?1 AND mov.type = 'movie' ORDER BY mov.movie_id DESC LIMIT 5 OFFSET ((?2-1)*5)" , nativeQuery = true)
    List<Movie> findMoviesByGroupId(Long groupId, Integer page);

    @Query(value="SELECT * FROM movies mov WHERE mov.group_id = ?1 AND mov.type = 'tv' ORDER BY mov.movie_id DESC LIMIT 5 OFFSET ((?2-1)*5)" , nativeQuery = true)
    List<Movie> findSeriesByGroupId(Long groupId, Integer page);

    @Query(value="SELECT COUNT(*) FROM movies mov WHERE mov.group_id = ?1 AND mov.type = 'movie' ", nativeQuery = true)
    Integer countMoviesByGroupId(Long groupId);

    @Query(value="SELECT COUNT(*) FROM movies mov WHERE mov.group_id = ?1 AND mov.type = 'tv' ", nativeQuery = true)
    Integer countSeriesByGroupId(Long groupId);
}
