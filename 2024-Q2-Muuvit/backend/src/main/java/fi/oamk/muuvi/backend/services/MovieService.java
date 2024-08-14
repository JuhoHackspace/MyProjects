package fi.oamk.muuvi.backend.services;

import java.util.*;

import fi.oamk.muuvi.backend.misc.Type;
import fi.oamk.muuvi.backend.models.Group;
import fi.oamk.muuvi.backend.models.Movie;
import fi.oamk.muuvi.backend.models.UsersToGroups;
import fi.oamk.muuvi.backend.repositories.GroupRepository;
import fi.oamk.muuvi.backend.repositories.MovieRepository;
import fi.oamk.muuvi.backend.repositories.UsersToGroupsRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.oamk.muuvi.backend.Shemas.MovieResult;
import fi.oamk.muuvi.backend.Shemas.PaginatedSeriesOrMovies;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Service
public class MovieService {
    @Value("${tmdb.api_key}")
    private String api_key;
    private Map<String, Integer> genres;
    private OkHttpClient client = new OkHttpClient();

    GroupRepository groupRepo;
    UsersToGroupsRepository utog;
    MovieRepository movieRepo;

    public MovieService(GroupRepository gr, UsersToGroupsRepository utog, MovieRepository mr) {
        groupRepo = gr;
        this.utog = utog;
        movieRepo = mr;

        // Initialize the genre map
        genres = new HashMap<>();
        genres.put("action", 28);
        genres.put("adventure", 12);
        genres.put("animation", 16);
        genres.put("comedy", 35);
        genres.put("crime", 80);
        genres.put("documentary", 99);
        genres.put("drama", 18);
        genres.put("family", 10751);
        genres.put("fantasy", 14);
        genres.put("history", 36);
        genres.put("horror", 27);
        genres.put("music", 10402);
        genres.put("mystery", 9648);
        genres.put("romance", 10749);
        genres.put("science fiction", 878);
        genres.put("tv movie", 10770);
        genres.put("thriller", 53);
        genres.put("war", 10752);
        genres.put("western", 37);

        client = new OkHttpClient();
    }

    public JsonNode getByPerson(String name) {
        List<Map<String, String>> movies = new ArrayList<>();

        // Construct the URL based on the query parameters.
        String URL = String.format("https://api.themoviedb.org/3/search/person?api_key=%s&query=%s", this.getApiKey(), name);

        // Execute the request and return the response.
        return executeAndDeserialise(URL);
    }

    public Map<String, Integer> getGenres() {
        return genres;
    }

    public String getApiKey() {
        return api_key;
    }

    public Integer getGenreId(String genre) {
        return genres.get(genre);
    }

    public ResponseEntity<MovieResult> search(String queryString, String genre, Integer page, Integer year, String language) {
        // Construct the URL based on the query parameters  
        String nameSearchString = queryString != null ? String.format("&query=%s", queryString) : "";
        String genreSearch = genre != null ? String.format("&with_genres=%s", getGenreId(genre)) : "";
        String pageSearch = page != null ? String.format("&page=%s", page) : "";
        String yearSearch = year != null ? String.format("&primary_release_year=%s", year) : "";
        String languageSearch = language != null ? String.format("&language=%s", language) : "";

        String URL;

        // If the query string is null, we are using a different endpoint
        if (queryString == null) {
            URL = String.format("https://api.themoviedb.org/3/discover/movie?api_key=%s%s%s%s%s", this.getApiKey(), genreSearch, pageSearch, yearSearch, languageSearch);
        } else {
            URL = String.format("https://api.themoviedb.org/3/search/movie?api_key=%s%s%s%s%s%s", this.getApiKey(), nameSearchString, genreSearch, pageSearch, yearSearch, languageSearch);
        }

        // Execute the request and get the response body
        JsonNode result = executeAndDeserialise(URL);

        // Deserialise the JsonNode body into a MovieResult object
        try {
            ObjectMapper mapper = new ObjectMapper();
            return ResponseEntity.ok(mapper.treeToValue(result, MovieResult.class));
        } catch (JsonProcessingException e) {
            // Handle deserialization error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    public ResponseEntity<JsonNode> fetchDetails(Long id) {

        // For each movie ID, fetch the details
        String URL = String.format("https://api.themoviedb.org/3/movie/%d?api_key=%s", id, this.getApiKey());

        // Execute the request and get the response body
        JsonNode response = executeAndDeserialise(URL);
        //SpecificMovieInformation movie = null;
        // Deserialise the JsonNode body into a SpecificMovieInformation object
        /*try {
            ObjectMapper mapper = new ObjectMapper();
            movie = mapper.treeToValue(response, SpecificMovieInformation.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }*/

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<JsonNode> fetchSerieDetails(Long id) {

        // For each movie ID, fetch the details
        String URL = String.format("https://api.themoviedb.org/3/tv/%d?api_key=%s", id, this.getApiKey());

        // Execute the request and get the response body
        JsonNode response = executeAndDeserialise(URL);
        // Deserialise the JsonNode body into a SpecificMovieInformation object
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode serie = mapper.treeToValue(response, JsonNode.class);
            return ResponseEntity.ok(serie);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

    public JsonNode executeAndDeserialise(String URL) {
        // Construct the request
        Request request = new Request.Builder()
                .url(URL)
                .get()
                .addHeader("accept", "application/json")
                .build();

        // Execute the request
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                return null;
            }

            String responseBody = response.body().string();

            ObjectMapper mapper = new ObjectMapper();

            // Deserialise the response body into a JsonNode
            JsonNode movieResult = mapper.readValue(responseBody, JsonNode.class);

            return movieResult;
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseEntity<String> addMovieToGroup(Long movieId, Long groupId, Long userId, Type type) {
        Optional<UsersToGroups> lala = utog.findByGroupAndUser(groupId, userId);
        if (lala.isEmpty()) {
            return ResponseEntity.badRequest().body("Käyttäjä ei ole ryhmässä.");
        }
        Group group = groupRepo.findById(groupId).get();  // lala was not empty, so this is neither.
        Movie movie = new Movie();
        movie.setMovieIdOnTmdb(movieId);
        movie.setType(type);
        movie.setGroup(group);
        try {
            movieRepo.save(movie);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Leffa tai sarja on jo ryhmässä");
        }
        return ResponseEntity.ok("Leffa tai sarja lisätty ryhmään");
    }

    public PaginatedSeriesOrMovies getGroupSeries(Type type, Long groupId, Long userId, Integer page) {
        List<Movie> movies = new ArrayList<>();
        if(type == Type.movie) {
            movies = movieRepo.findMoviesByGroupId(groupId,page);
        }else if(type == Type.tv) {
            movies = movieRepo.findSeriesByGroupId(groupId,page);
        }
        PaginatedSeriesOrMovies paginatedContent = new PaginatedSeriesOrMovies();
        Integer count = 0;
        if(type == Type.movie) {
            count = movieRepo.countMoviesByGroupId(groupId);
        } else if(type == Type.tv) {
            count = movieRepo.countSeriesByGroupId(groupId);
            System.out.println("Series count: " + count);
        }
        paginatedContent.setNumPages((int) Math.ceil(count / 5.0));
        paginatedContent.setPageSize(5);
        paginatedContent.setCurrentPage(page);
        List<JsonNode> tvOrMovieContent = new ArrayList<>();

        for(Movie movie : movies) {
            if(movie.getType() == type && type == Type.movie) {
                // Fetch the movie details (if it exists)
                JsonNode content = fetchDetails(movie.getMovieIdOnTmdb()).getBody();
                if(content != null) {
                    tvOrMovieContent.add(content);
                } else {
                    movieRepo.delete(movie);
                    System.out.println("Movie not found");
                }
            } else if(movie.getType() == type && type == Type.tv) {
                // Fetch the series details (if it exists)
                JsonNode content = fetchSerieDetails(movie.getMovieIdOnTmdb()).getBody();
                if(content != null) {
                    tvOrMovieContent.add(content);
                } else {
                    movieRepo.delete(movie);
                    System.out.println("Series not found");
                }
            }
        }
        paginatedContent.setContent(tvOrMovieContent);
        paginatedContent.setContentLength(tvOrMovieContent.size());

        return paginatedContent;
    }

    public JsonNode getMoviesForCarouselle() {

        int page = (int)(Math.random() * 5.0 + 1);
        // Construct the URL based on the query parameters
        String URL = String.format(
                "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=fi-FI&with_original_language=en&page=%d&sort_by=popularity.desc&api_key=%s",page, this.getApiKey());

        // Execute the request and get the response body
        return executeAndDeserialise(URL);
    }
}
