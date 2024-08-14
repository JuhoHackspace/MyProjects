package fi.oamk.muuvi.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fi.oamk.muuvi.backend.Shemas.NewFavourite;
import fi.oamk.muuvi.backend.Shemas.PaginatedFavourites;
import fi.oamk.muuvi.backend.Shemas.SpecificMovieInformation;
import fi.oamk.muuvi.backend.models.Favourite;
import fi.oamk.muuvi.backend.services.FavouritesService;

import java.util.List;

import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/favourites")
public class FavouritesController {
    private FavouritesService favouritesService;

    public FavouritesController(FavouritesService favouritesService) {
        this.favouritesService = favouritesService;
    }

    @PostMapping("/private/add")
    public ResponseEntity<String> addFavourite(@RequestBody NewFavourite favourite, @RequestAttribute(name="jwtSub") Long userId) {
        System.out.println("Received user id: " + userId + "and movie id: " + favourite.getMovieId() + " and type: " + favourite.getType());
        String response = favouritesService.addFavourite(userId, favourite.getMovieId(), favourite.getType());
        if(response.equals("Favourite added")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/private/getfavourites/{page}")
    public ResponseEntity<PaginatedFavourites> getFavourites(@PathVariable Integer page, @RequestAttribute(name="jwtSub") Long userId) {
       try {
            return ResponseEntity.ok(favouritesService.getFavouritesList(userId, page));
       } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
         }
    }
    
    @DeleteMapping("/private/deletefavourite/{id}")
    public ResponseEntity<String> deleteFavourite(@PathVariable Long id, @RequestAttribute(name="jwtSub") Long userId) {
        try {
            favouritesService.removeFavourite(userId, id);
            return ResponseEntity.ok("Favourite removed");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getFavouritesByShareSlur/{share_slur}/{page}")
    public ResponseEntity<?> getFavouritesByShareSlur(@PathVariable String share_slur, @PathVariable Integer page) {
        return favouritesService.getFavouritesByShareSlur(share_slur, page);
    }
}
