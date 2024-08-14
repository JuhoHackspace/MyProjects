package fi.oamk.muuvi.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.core.util.Json;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import fi.oamk.muuvi.backend.Shemas.NewEvent;
import fi.oamk.muuvi.backend.Shemas.PaginatedEvents;
import fi.oamk.muuvi.backend.models.Event;
import fi.oamk.muuvi.backend.services.EventService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/event")
public class EventController {
    private EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }
    
    @PostMapping("private/addToGroup")
    public ResponseEntity<String> postEventToGroup(@RequestBody NewEvent event, @RequestAttribute("jwtSub") Long userId) {
        String result = eventService.postEvent(event.getGroup_id(), event.getEvent_id(), event.getShow_id(), event.getArea_id());
        if(result.equals("Event added")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @GetMapping("/private/getGroupEvents/{group_id}/{page}")
    public ResponseEntity<PaginatedEvents> getGroupEvents(@RequestAttribute("jwtSub") Long userId, @PathVariable Long group_id, @PathVariable Integer page) {
        try {
            return ResponseEntity.ok(eventService.getGroupEvents(group_id, page));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/private/deleteEvent/{group_id}/{event_id}/{show_id}")
    public ResponseEntity<String> deleteEvent(@RequestAttribute("jwtSub") Long userId, @PathVariable Long group_id, @PathVariable Long event_id, @PathVariable Long show_id) {
        try {
            return ResponseEntity.ok(eventService.deleteEvent(group_id, event_id, show_id));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
}
