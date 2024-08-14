package fi.oamk.muuvi.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @JsonProperty("id")
    private Long userId;
    private String userName;
    private String passwordHash;

    // Missing getter and setter
    @OneToMany(mappedBy = "user")
    Set<UsersToGroups> groupRegistrations;

    @JsonManagedReference
    @OneToMany(mappedBy = "owner")
    private List<Favourite> favourites;

    @OneToMany(mappedBy = "owner")
    private List<Review> reviews;

    public Long userId() {
        return userId;
    }

    public void userId(Long userId) {
        this.userId = userId;
    }

    @JsonProperty("username")
    public String userName() {
        return userName;
    }

    public void userName(String userName) {
        this.userName = userName;
    }

    public String passwordHash() {
        return passwordHash;
    }

    public void passwordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }


}
