package fi.oamk.muuvi.backend.Shemas;

import com.fasterxml.jackson.annotation.JsonProperty;

import fi.oamk.muuvi.backend.misc.Type;

public class NewFavourite {
    @JsonProperty("movieId")
    private Long movieId;

    @JsonProperty("type")
    private Type type;

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

}
