package fi.oamk.muuvi.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import fi.oamk.muuvi.backend.services.SeriesService;
import io.swagger.v3.core.util.Json;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.SortedMap;

@RestController
@RequestMapping("/tv")
public class SeriesController {

    private SeriesService seriesService;

    public SeriesController(SeriesService seriesService) {
        this.seriesService = seriesService;
    }

    @GetMapping("/genres")
    public ResponseEntity<SortedMap<String, Integer>> getCategories() {
        try {
            return ResponseEntity.ok(this.seriesService.getGenres());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<JsonNode> searchMovies(@RequestParam(required = false) String query,
                                                    @RequestParam(required = false) String genre,
                                                    @RequestParam(required = false) Integer page,
                                                    @RequestParam(required = false) Integer year,
                                                    @RequestParam(required = false) String language) throws IOException {
        try {
            return ResponseEntity.ok(seriesService.search(query, genre, page, year, language));
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }


}
