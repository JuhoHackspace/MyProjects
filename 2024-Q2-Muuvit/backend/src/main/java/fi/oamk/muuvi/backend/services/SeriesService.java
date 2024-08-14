package fi.oamk.muuvi.backend.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import okhttp3.Call;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class SeriesService {

    @Value("${tmdb.api_key}")
    private String api_key;
    private OkHttpClient client;

    public SeriesService() {
        client = new OkHttpClient();
    }


    /**
     * Get list of genres.
     * @return
     * @throws IOException
     */
    public SortedMap<String, Integer> getGenres() throws IOException {
        Request request = new Request.Builder()
                .url(String.format("https://api.themoviedb.org/3/genre/tv/list?api_key=%s&language=fi", api_key))
                .get()
                .build();

        try (Response resp = this.client.newCall(request).execute();)  {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode result = mapper.readValue(resp.body().string(), JsonNode.class);
            SortedMap<String, Integer> returnable = new TreeMap<>();
            for (JsonNode genre : result.get("genres")) {
                returnable.put(genre.get("name").asText(), genre.get("id").asInt());
            }
            return returnable;
        } catch (IOException e) {
            System.out.println(e.getMessage());
            throw e;
        }
    }

    public JsonNode search(String queryString, String genreList, Integer page, Integer year, String language) throws IOException {
        // Construct the URL based on the query parameters
        String nameSearchString = queryString != null ? String.format("&query=%s", queryString) : "";
        String genreSearch = genreList != null ? String.format("&with_genres=%s", genreList) : "";
        String pageSearch = page != null ? String.format("&page=%s", page) : "";
        String yearSearch = year != null ? String.format("&primary_release_year=%s", year) : "";
        String languageSearch = language != null ? String.format("&language=%s", language) : "";

        String URL;

        // If the query string is null, we are using a different endpoint
        if (queryString == null) {
            URL = String.format("https://api.themoviedb.org/3/discover/tv?api_key=%s%s%s%s%s", this.api_key, genreSearch, pageSearch, yearSearch, languageSearch);
        } else {
            URL = String.format("https://api.themoviedb.org/3/search/tv?api_key=%s%s%s%s%s%s", this.api_key, nameSearchString, genreSearch, pageSearch, yearSearch, languageSearch);
        }

        // Execute the request and get the response body
        Request req = new Request.Builder()
                .url(URL)
                .get()
                .addHeader("accept", "application/json")
                .build();
        try (Response response = client.newCall(req).execute()) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode result = mapper.readValue(response.body().string(), JsonNode.class);
            return result;
        } catch (IOException e) {
            throw e;
        }
    }

}
