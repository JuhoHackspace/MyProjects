package fi.oamk.muuvi.backend.controller;
import fi.oamk.muuvi.backend.Shemas.CreateGroupReply;
import fi.oamk.muuvi.backend.Shemas.NewGroup;
import fi.oamk.muuvi.backend.Shemas.PaginatedGroups;
import fi.oamk.muuvi.backend.models.Group;
import fi.oamk.muuvi.backend.repositories.GroupRepository;
import fi.oamk.muuvi.backend.services.GroupService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;


@RestController
@RequestMapping("/group")
public class GroupController {

    private GroupService groupService;
    private GroupRepository groupRepository;


    public GroupController(GroupService groupService, GroupRepository groupRepository) {
        this.groupService = groupService;
        this.groupRepository = groupRepository;
    }

    @PostMapping("/private/create")
    public ResponseEntity<CreateGroupReply> createGroup(@RequestBody NewGroup group, @RequestAttribute(name="jwtSub") Long userId) {
        if(group.getGroupName().isEmpty() || group.getDescription().isEmpty()) {
            CreateGroupReply reply = new CreateGroupReply();
            reply.setGroupId(null);
            reply.setMsg("Ryhmän nimi tai kuvaus puuttuu");
            return ResponseEntity.badRequest().body(reply); 
        }
        return groupService.createGroup(group, userId);
    }

    @GetMapping("/groupslist/{page}")
    public ResponseEntity<PaginatedGroups> groupsAsList(@PathVariable(name = "page") Integer page) {
        try {
            return ResponseEntity.ok(groupService.getAllGroupsAndPaginate(page));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/private/mygroups/{page}")
    public ResponseEntity<PaginatedGroups> myOwnGroups(@PathVariable(name = "page") Integer page, @RequestAttribute(name = "jwtSub") Long userId) {
        try {
            return ResponseEntity.ok(groupService.getMyGroups(page, userId));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/private/allmygroups")
    public ResponseEntity<ArrayList<Group>> allMyOwnGroups(@RequestAttribute(name = "jwtSub") Long userId) {
        try {
            return ResponseEntity.ok(groupService.getAllMyGroups(userId));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/private/joingroup/{groupId}")
    public ResponseEntity<String> joinGroup(@PathVariable(name = "groupId") Long groupId, @RequestAttribute(name = "jwtSub") Long userId) {
        return groupService.joinGroupRequest(groupId, userId);
    }

    @GetMapping("/private/queryMyGroupMembership/{groupId}")
    public ResponseEntity<Boolean> queryMyGroupMembership(@PathVariable(name = "groupId") Long groupId, @RequestAttribute(name = "jwtSub") Long userId) {
        return groupService.queryGroupMembership(groupId, userId);
    }

    @GetMapping("/private/groupData/{groupId}")
    public ResponseEntity<Group> getGroupData(@PathVariable(name = "groupId") Long groupId) {
        return groupService.getGroupData(groupId);
    }

    /**
     * Delete group member or reject join request
     * @param groupId
     * @param userId comes with JWT
     * @param ownerId
     * @return
     */
    
    @DeleteMapping("/private/deleteGroupMember/{groupId}/{userId}")
    public ResponseEntity<String> deleteGroupMember(@PathVariable(name = "groupId") Long groupId, @PathVariable(name = "userId") Long userId, @RequestAttribute(name = "jwtSub") Long ownerId) {
        return groupService.deleteGroupMember(ownerId, userId, groupId);
    }

    @DeleteMapping("/private/deleteGroup/{groupId}")
    public ResponseEntity<String> deleteGroup(@PathVariable(name = "groupId") Long groupId, @RequestAttribute(name = "jwtSub") Long userId) {
        System.out.println("Request to delete group: groupId: " + groupId + " userId: " + userId);
        return groupService.deleteGroupById(groupId, userId);
    }

    @GetMapping("/private/resolveRequest/{groupId}/{subjectName}/{status}")
    public ResponseEntity<String> resolveRequest(@RequestAttribute(name="jwtSub") Long userId, @PathVariable(name = "groupId") Long groupId, @PathVariable(name = "subjectName") String subjectName, @PathVariable(name = "status") String status) {
        System.out.println("Request to resolve information: groupId: " + groupId + " userId: " + userId + " subjectName: " + subjectName + " status: " + status);
        String response = groupService.resolveRequest(groupId, userId, subjectName, status);
        if(response.equals("Virheellinen pyyntö.")) {
            return ResponseEntity.badRequest().body(response);
        } else {
            return ResponseEntity.ok(response);
        }
    }
    
}
