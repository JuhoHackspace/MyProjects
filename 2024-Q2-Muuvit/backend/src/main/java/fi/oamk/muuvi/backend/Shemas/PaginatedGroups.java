package fi.oamk.muuvi.backend.Shemas;

import fi.oamk.muuvi.backend.models.Group;
import fi.oamk.muuvi.backend.models.Review;

import java.util.ArrayList;

public class PaginatedGroups {
    private int numPages;
    private int currentPage;
    private int pageSize;
    ArrayList<Group> groups;

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

    public ArrayList<Group> getGroups() {
        return groups;
    }

    public void setGroups(ArrayList<Group> groups) {
        this.groups = groups;
    }
}
