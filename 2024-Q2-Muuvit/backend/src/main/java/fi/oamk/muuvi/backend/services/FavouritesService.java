package fi.oamk.muuvi.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

import fi.oamk.muuvi.backend.Shemas.PaginatedFavourites;
import fi.oamk.muuvi.backend.Shemas.SpecificMovieInformation;
import fi.oamk.muuvi.backend.misc.Type;
import fi.oamk.muuvi.backend.models.Favourite;
import fi.oamk.muuvi.backend.models.User;
import fi.oamk.muuvi.backend.repositories.FavouriteRepository;
import fi.oamk.muuvi.backend.repositories.UserRepository;
import java.util.ArrayList;

@Service
public class FavouritesService {
    private FavouriteRepository favouriteRepo;
    private UserRepository userRepo;
    private MovieService movieService;
    public FavouritesService(FavouriteRepository favouriteRepo, UserRepository userRepo, MovieService movieService) {
        this.favouriteRepo = favouriteRepo;
        this.userRepo = userRepo;
        this.movieService = movieService;
    }

    public String addFavourite(Long userId, Long movieId, Type type) {
        if(favouriteRepo.findByUserIdAndMovieId(userId, movieId) != null) {
            return "Favourite already exists";
        }
        Favourite favourite = new Favourite();
        favourite.setMovieId(movieId);
        Optional<User> user = userRepo.findById(userId);
        if(!user.isPresent()) {
            return "User not found";
        }
        favourite.setOwner(user.get());
        String slur = GenerateShareSlur.generateShareSlur(userId.toString());
        System.out.println("Share slur: " + slur);
        favourite.setShareSlur(slur);
        favourite.setType(type); 
        try {
            favouriteRepo.save(favourite);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error saving favourite";
        }
        return "Favourite added";
    }

    public void removeFavourite(Long userId, Long movieId) {
        Favourite favourite = favouriteRepo.findByUserIdAndMovieId(userId, movieId);
        if(favourite != null) {
            favouriteRepo.delete(favourite);
        }
    }

    public PaginatedFavourites getFavouritesList(Long userId, Integer page) {      

        PaginatedFavourites paginatedFavourites = new PaginatedFavourites();
        List<Favourite> favourites = favouriteRepo.findPageByUserId(userId,page);
        List<Pair<Favourite,JsonNode>> favouriteList = new ArrayList<>();

        for(Favourite favourite : favourites) {
            if(favourite.getType() == Type.movie) {
                JsonNode movie = movieService.fetchDetails(favourite.getMovieId()).getBody();
                if(movie != null) {
                    favouriteList.add(Pair.of(favourite, movie));
                } else {
                    favouriteRepo.delete(favourite);
                    System.out.println("Movie not found");
                }
            } else if(favourite.getType() == Type.tv) {
                JsonNode series = movieService.fetchSerieDetails(favourite.getMovieId()).getBody();
                if(series != null) {
                    favouriteList.add(Pair.of(favourite, series));
                } else {
                    favouriteRepo.delete(favourite);
                    System.out.println("Series not found");
                }
            }
        }
        paginatedFavourites.setFavourites(favouriteList);
        paginatedFavourites.setCurrentPage(page);
        Integer numFavourites = favouriteRepo.countAllFavourites(userId);
        paginatedFavourites.setNumPages(numFavourites % 5 > 0 ? numFavourites / 5 + 1 : numFavourites / 5);
        paginatedFavourites.setPageSize(5);

        return paginatedFavourites;
    }

    public ResponseEntity<?> getFavouritesByShareSlur(String shareSlur, Integer page) {
        PaginatedFavourites paginatedFavourites = new PaginatedFavourites();
        List<Favourite> favourites = favouriteRepo.findPageByShareSlur(shareSlur, page);
        if(favourites.isEmpty()) {
            return ResponseEntity.badRequest().body("No favourites found, check the share slur");
        }
        List<Pair<Favourite,JsonNode>> favouriteList = new ArrayList<>();

        for(Favourite favourite : favourites) {
            if(favourite.getType() == Type.movie) {
                JsonNode movie = movieService.fetchDetails(favourite.getMovieId()).getBody();
                if(movie != null) {
                    favouriteList.add(Pair.of(favourite, movie));
                } else {
                    favouriteRepo.delete(favourite);
                    System.out.println("Movie not found");
                }
            } else if(favourite.getType() == Type.tv) {
                JsonNode series = movieService.fetchSerieDetails(favourite.getMovieId()).getBody();
                if(series != null) {
                    favouriteList.add(Pair.of(favourite, series));
                } else {
                    favouriteRepo.delete(favourite);
                    System.out.println("Series not found");
                }
            }
        }
        paginatedFavourites.setFavourites(favouriteList);
        paginatedFavourites.setCurrentPage(page);
        Integer count = favouriteRepo.countFavouritesByShareSlur(shareSlur);
        paginatedFavourites.setNumPages((int) Math.ceil(count / 10.0));
        paginatedFavourites.setPageSize(10);

        return ResponseEntity.ok(paginatedFavourites);
    }
}
