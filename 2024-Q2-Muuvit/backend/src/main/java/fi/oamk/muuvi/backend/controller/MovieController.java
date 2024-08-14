package fi.oamk.muuvi.backend.controller;
import com.fasterxml.jackson.databind.JsonNode;
import fi.oamk.muuvi.backend.misc.Type;
import io.swagger.v3.core.util.Json;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.*;

import fi.oamk.muuvi.backend.Shemas.MovieResult;
import fi.oamk.muuvi.backend.Shemas.PaginatedSeriesOrMovies;
import fi.oamk.muuvi.backend.Shemas.SpecificMovieInformation;
import fi.oamk.muuvi.backend.services.MovieService;
import okhttp3.Response;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/movie")
public class MovieController {
    private MovieService movieService;
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }
    
    @GetMapping("/search")
    public ResponseEntity<MovieResult> searchMovies(@RequestParam(required = false) String query,
                                                     @RequestParam(required = false) String genre,
                                                     @RequestParam(required = false) Integer page,
                                                     @RequestParam(required = false) Integer year,
                                                     @RequestParam(required = false) String language) {
        return movieService.search(query, genre, page, year, language);
    }

    @GetMapping("/genres")
    public Map<String, Integer> getGenres() {
        return movieService.getGenres();
    }

    @GetMapping("/fetchMovieDetails/{id}")
    public ResponseEntity<JsonNode> getMovieById(@PathVariable Long id) {
        return movieService.fetchDetails(id);
    }

    @GetMapping("/fetchSerieDetails/{id}")
    public ResponseEntity<JsonNode> getSerieById(@PathVariable Long id) {
        return movieService.fetchSerieDetails(id);
    }

    /// Type is either movie or tv
    @GetMapping("/private/group/addToGroup/{type}/{movieId}/{groupId}")
    public ResponseEntity<String> addMovieToGroup(@PathVariable Type type, @PathVariable Long movieId, @PathVariable Long groupId, @RequestAttribute(name = "jwtSub") Long userId ){
        return movieService.addMovieToGroup(movieId, groupId, userId, type);
    }

    @GetMapping("/private/group/getGroupContent/{type}/{groupId}/{page}")
    public ResponseEntity<PaginatedSeriesOrMovies> getGroupSeries(@PathVariable Type type, @PathVariable Long groupId, @PathVariable Integer page, @RequestAttribute(name = "jwtSub") Long userId) {
        try {
            return ResponseEntity.ok(movieService.getGroupSeries(type, groupId, userId, page));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/movieCarouselle/getMovies")
    public ResponseEntity<JsonNode> getMoviesForCarouselle() {
        JsonNode resp = movieService.getMoviesForCarouselle();
        return new ResponseEntity<JsonNode>(resp, HttpStatusCode.valueOf(200));
    }
}
