package fi.oamk.muuvi.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
@Table(name = "groups_")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long groupId;

    private String groupName;
    private String groupDescription;

//    @JsonProperty("members")
    public Set<UsersToGroups> getParticipantRegistrations() {
        return participantRegistrations;
    }

    public void setParticipantRegistrations(Set<UsersToGroups> participantRegistrations) {
        this.participantRegistrations = participantRegistrations;
    }

    public Set<Movie> getMovies() {
        return movies;
    }

    public void setMovies(Set<Movie> movies) {
        this.movies = movies;
    }

    public Set<Event> getEvents() {
        return events;
    }

    public void setEvents(Set<Event> events) {
        this.events = events;
    }

    // No setter or getter yet
    @JsonManagedReference
    @OneToMany(mappedBy = "group")
    private Set<UsersToGroups> participantRegistrations;

    @JsonManagedReference
    @OneToMany(mappedBy = "group")
    private Set<Movie> movies;
    
    @JsonManagedReference
    @OneToMany(mappedBy = "group")
    private Set<Event> events;


    public Long getGroupId() {
        return this.groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return this.groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupDescription() {
        return this.groupDescription;
    }

    public void setGroupDescription(String groupDescription) {
        this.groupDescription = groupDescription;
    }

}
