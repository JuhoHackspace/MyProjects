package fi.oamk.muuvi.backend.Shemas;

import java.util.List;

import org.springframework.data.util.Pair;

import com.fasterxml.jackson.databind.JsonNode;

import fi.oamk.muuvi.backend.models.Favourite;

public class PaginatedFavourites {
    private int numPages;
    private int currentPage;
    private int pageSize;
    List<Pair<Favourite,JsonNode>> favourites;

    public int getNumPages() {
        return numPages;
    }

    public void setNumPages(int numPages) {
        this.numPages = numPages;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public List<Pair<Favourite,JsonNode>> getFavourites() {
        return favourites;
    }

    public void setFavourites(List<Pair<Favourite,JsonNode>> favourites) {
        this.favourites = favourites;
    }
}
