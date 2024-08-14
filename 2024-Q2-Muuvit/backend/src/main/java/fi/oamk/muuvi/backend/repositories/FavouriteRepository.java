package fi.oamk.muuvi.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import fi.oamk.muuvi.backend.models.Favourite;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    @Query(value="SELECT * FROM favourites fav WHERE fav.user_id = ?1 AND fav.movie_id = ?2", nativeQuery = true)
    Favourite findByUserIdAndMovieId(Long user_id, Long movie_id);

    @Query(value="SELECT * FROM favourites fav WHERE fav.user_id = ?1 LIMIT 5 OFFSET ((?2-1)*5)", nativeQuery = true)
    List<Favourite> findPageByUserId(Long user_id, Integer page);

    @Query(value="SELECT COUNT(*) FROM favourites fav WHERE fav.user_id = ?1", nativeQuery = true)
    Integer countAllFavourites(Long user_id);

    @Query(value="SELECT * FROM favourites fav WHERE fav.share_slur = ?1 LIMIT 10 OFFSET ((?2-1)*10)", nativeQuery = true)
    List<Favourite> findPageByShareSlur(String share_slur, Integer page);

    @Query(value="SELECT COUNT(*) FROM favourites fav WHERE fav.share_slur = ?1", nativeQuery = true)
    Integer countFavouritesByShareSlur(String share_slur);
}
