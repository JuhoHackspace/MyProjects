package fi.oamk.muuvi.backend.services;

import com.fasterxml.jackson.databind.JsonNode;

import fi.oamk.muuvi.backend.Shemas.PaginatedEvents;
import fi.oamk.muuvi.backend.models.Event;
import fi.oamk.muuvi.backend.models.Group;
import fi.oamk.muuvi.backend.repositories.EventRepository;
import fi.oamk.muuvi.backend.repositories.GroupRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;


@Service
public class EventService {
    private EventRepository eventRepository;
    private GroupRepository groupRepository;
    public EventService(EventRepository eventRepository, GroupRepository groupRepository) {
        this.eventRepository = eventRepository;
        this.groupRepository = groupRepository;
    }

    public String postEvent(Long group_id, Long event_id, Long show_id, Long area_id) {
        Optional<Group> group = groupRepository.findById(group_id);
        if(!group.isPresent()) {
            return "Group not found";
        }
        Event event = eventRepository.findEvent(group_id, event_id, show_id);
        if(event != null) {
            return "Event already exists";
        }
        event = new Event();
        event.setGroup(group.get());
        event.setEventIdOnFinnkino(event_id);
        event.setShowIdOnFinnkino(show_id);
        event.setAreaIdOnFinnkino(area_id);
        try {
            eventRepository.save(event);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error saving event";
        }
        return "Event added";
    }

    public PaginatedEvents getGroupEvents(Long group_id, Integer page) {
        PaginatedEvents events = new PaginatedEvents();
        events.setEvents(eventRepository.findByGroupId(group_id, page));
        Integer count = eventRepository.countByGroupId(group_id);
        events.setNumPages((int) Math.ceil(count / 5.0));
        events.setCurrentPage(page);
        events.setPageSize(5);
        return events;
    }

    public String deleteEvent(Long group_id, Long event_id, Long show_id) {
        Event event = eventRepository.findEvent(group_id, event_id, show_id);
        if(event == null) {
            return "Event not found";
        }
        try {
            eventRepository.delete(event);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error deleting event";
        }
        return "Event deleted";
    }
}

