package fi.oamk.muuvi.backend.Shemas;

import fi.oamk.muuvi.backend.misc.Type;

public class ReviewSchema {
    private Integer movieId;
    private Integer stars;
    private String description;
    private Type type;

    public Type getType() {
        return this.type;
    }

    public void setType(Type type) {
        this.type = type;
    }
    //Tähän tarvitaan type
    

    public Integer getMovieId() {
        return this.movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public Integer getStars() {
        return this.stars;
    }

    public void setStars(Integer stars) {
        this.stars = stars;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}