package fi.oamk.muuvi.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "events_")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    
    private Group group;

    private Long eventIdOnFinnkino;
    private Long showIdOnFinnkino;
    private Long areaIdOnFinnkino;

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Long getEventIdOnFinnkino() {
        return eventIdOnFinnkino;
    }

    public void setEventIdOnFinnkino(Long eventIdOnFinnkino) {
        this.eventIdOnFinnkino = eventIdOnFinnkino;
    }

    public Long getShowIdOnFinnkino() {
        return showIdOnFinnkino;
    }

    public void setShowIdOnFinnkino(Long showIdOnFinnkino) {
        this.showIdOnFinnkino = showIdOnFinnkino;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public Long getAreaIdOnFinnkino() {
        return areaIdOnFinnkino;
    }

    public void setAreaIdOnFinnkino(Long areaIdOnFinnkino) {
        this.areaIdOnFinnkino = areaIdOnFinnkino;
    }
}
