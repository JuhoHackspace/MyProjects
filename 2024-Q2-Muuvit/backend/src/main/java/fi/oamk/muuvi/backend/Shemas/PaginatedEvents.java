package fi.oamk.muuvi.backend.Shemas;

import java.util.List;

import fi.oamk.muuvi.backend.models.Event;

public class PaginatedEvents {
    private Integer numPages;
    private Integer currentPage;
    private Integer pageSize;
    private List<Event> events;

    public Integer getNumPages() {
        return numPages;
    }

    public void setNumPages(Integer numPages) {
        this.numPages = numPages;
    }

    public Integer getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }
}
