package fi.oamk.muuvi.backend.services;

import fi.oamk.muuvi.backend.Shemas.CreateGroupReply;
import fi.oamk.muuvi.backend.Shemas.NewGroup;
//import fi.oamk.muuvi.backend.controller.Map;
import fi.oamk.muuvi.backend.Shemas.PaginatedGroups;
import fi.oamk.muuvi.backend.misc.Status;
import fi.oamk.muuvi.backend.models.Group;
import fi.oamk.muuvi.backend.models.User;
import fi.oamk.muuvi.backend.models.UsersToGroups;
import fi.oamk.muuvi.backend.repositories.GroupRepository;
import fi.oamk.muuvi.backend.repositories.UserRepository;
import fi.oamk.muuvi.backend.repositories.UsersToGroupsRepository;

//import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.UnexpectedRollbackException;
//import org.springframework.web.bind.annotation.RequestAttribute;


import java.util.ArrayList;
import java.util.Optional;
//import java.util.List;

@Service
public class GroupService {

    GroupRepository groupRepo;
    UserRepository userRepo;
    UsersToGroupsRepository utogRepo;

    public GroupService(GroupRepository grepo, UserRepository urepo, UsersToGroupsRepository utogRepo) {
        this.groupRepo = grepo;
        this.userRepo = urepo;
        this.utogRepo = utogRepo;
    }

    public ResponseEntity<CreateGroupReply> createGroup(NewGroup group, Long ownerId) {
            // Create new group
            Group newGroup = new Group();
            newGroup.setGroupName(group.getGroupName());
            System.out.println(group.getDescription());
            newGroup.setGroupDescription(group.getDescription());

            // Create new UsersToGroups
            UsersToGroups utog = new UsersToGroups();
            utog.setStatus(Status.owner);
            utog.setGroup(newGroup);


            // Get user by id from database
            Optional<User> owner = userRepo.findById(ownerId);
            utog.setUser(owner.get());  // Owner will definitely exist, since JWT says so.

        try {
            groupRepo.save(newGroup);
            utogRepo.save(utog);
            CreateGroupReply reply = new CreateGroupReply();
            reply.setGroupId(newGroup.getGroupId());
            reply.setMsg("Created");
            return ResponseEntity.ok(reply);
        } catch (DataIntegrityViolationException e) {
            CreateGroupReply reply = new CreateGroupReply();
            reply.setGroupId(null);
            reply.setMsg("Virhe luotaessa ryhmää. Ehkä se on jo olemassa?");
            return ResponseEntity.badRequest().body(reply);
        } catch (Exception e) {
            throw e;
        }
    }

    public Iterable<Group> getAllGroups() {
        return groupRepo.findAll();
    }

    public PaginatedGroups getAllGroupsAndPaginate(int page) {
        PaginatedGroups pg = new PaginatedGroups();
        pg.setPageSize(10);
        pg.setCurrentPage(page);
        Integer numGroups = groupRepo.countAllGroups();
        pg.setNumPages(numGroups % 10 > 0 ? numGroups/10 + 1 : numGroups/10);
        ArrayList<Group> groups = groupRepo.findGroupsPaginated(page);
        pg.setGroups(groups);
        return pg;

    }

    public PaginatedGroups getMyGroups(Integer page, Long userId) {
        ArrayList<Group> groups = groupRepo.findMyGroups(page, userId);
        PaginatedGroups pg = new PaginatedGroups();
        pg.setGroups(groups);
        pg.setCurrentPage(page);
        pg.setPageSize(10);
        Integer numGroups = groupRepo.countMyGroups(userId);
        System.out.println(userId);
        pg.setNumPages(numGroups % 10 > 0 ? numGroups/10 + 1 : numGroups/10);
        return pg;
    }

    public ResponseEntity<String> joinGroupRequest(Long groupId, Long userId) {
        UsersToGroups utog = new UsersToGroups();
        utog.setGroup(groupRepo.findById(groupId).get());
        utog.setUser(userRepo.findById(userId).get());
        utog.setStatus(Status.pending);
        try {
            utogRepo.save(utog);
            return ResponseEntity.ok(String.format("Kutsu ryhmään %s lähetetty.", utog.getGroup().getGroupName()));
        } catch (UnexpectedRollbackException e) {
            return ResponseEntity.badRequest().body("Olet jo tässä ryhmässä ryhmässä, tai pyyntö on jo lähetetty.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Virhe lisättäessä ryhmäkutsua.");
        }
    }

    public ArrayList<Group> getAllMyGroups(Long userId) {
        return groupRepo.findAllGroupsByUserId(userId);
    }

    public ResponseEntity<Boolean> queryGroupMembership(Long groupId, Long userId) {
        Optional<UsersToGroups> utog = utogRepo.findByGroupAndUser(groupId, userId);
        return ResponseEntity.ok(utog.isPresent());
    }

    public ResponseEntity<Group> getGroupData(Long groupId) {
        Optional<Group> group = groupRepo.findByGroupId(groupId);
        if (group.isPresent()) {
            return ResponseEntity.ok(group.get());
        } else {
            return null;
        }
    }

    public ResponseEntity<String> deleteGroupMember(Long ownerId, Long userId, Long groupId) {
        Optional<UsersToGroups> utog = utogRepo.findByGroupAndUser(groupId, ownerId);
        System.out.println("jep");
        if (utog.isPresent() && utog.get().getStatus() == Status.owner) {
            System.out.println(String.format("Deleting user %d from group %d", userId, groupId));
            utogRepo.deleteByGroupIdAndUserId(groupId, userId);
            System.out.println("User removed from group successfully");
            return ResponseEntity.ok("User removed from group successfully");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only the group owner can remove users");
        }
    }

    public ResponseEntity<String> deleteGroupById(Long groupId, Long userId) {
        Optional<UsersToGroups> utog = utogRepo.findByGroupAndUser(groupId, userId);
        System.out.println(String.format("utog is present %b", utog.isPresent()));
        if (utog.isPresent() && utog.get().getStatus() == Status.owner){
            groupRepo.deleteById(groupId) ;
            return ResponseEntity.ok("200 - poisto onnistui");
        } else {
            throw new UnsupportedOperationException("tanen virhe -Unimplemented method 'deleteGroupById'");
        }

        
    }

    public String resolveRequest(Long groupId, Long userId, String subjectName, String status) {
        Optional<UsersToGroups> utogOwner = utogRepo.findByGroupAndUser(groupId, userId);
        User subject = userRepo.findByUsername(subjectName);
        Optional<UsersToGroups> utogSubject = utogRepo.findByGroupAndUser(groupId, subject.userId());
        if (utogOwner.isPresent() && utogOwner.get().getStatus() == Status.owner) {
            if(status.equals("accepted")) {
                try {
                    utogRepo.updateStatus(status, groupId, subject.userId());
                } catch (Exception e) {
                    return "Virheellinen pyyntö. Ei voida päivittää taulua";
                }
            }else {
                utogRepo.delete(utogSubject.get());
            }
            String response = status.equals("accepted") ? "hyväksytty" : "hylätty";
            return String.format("Käyttäjän %s pyyntö ryhmään %s %s.", utogSubject.get().getUser().userName(), utogOwner.get().getGroup().getGroupName(), response);
        } else {
            return "Virheellinen pyyntö.";
        }
    }
}
