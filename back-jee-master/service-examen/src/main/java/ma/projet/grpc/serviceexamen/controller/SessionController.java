package ma.projet.grpc.serviceexamen.controller;

import ma.projet.grpc.serviceexamen.entity.Session;
import ma.projet.grpc.serviceexamen.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sessions")
public class SessionController {
    @Autowired
    private SessionService sessionService;
    @GetMapping
    public List<Session> getAllSessions() {
        return sessionService.getAllSessions();
    }

    @GetMapping("/{id}")
    public Session getSessionById(@PathVariable Long id) {
        return sessionService.getSessionById(id);
    }
    @PostMapping
    public ResponseEntity<Session> createSession(@RequestBody Session session) {
        Session savedSession = sessionService.saveSession(session);
        System.out.println(savedSession);
        return ResponseEntity.ok(savedSession);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        if (sessionService.getSessionById(id)==null) {
            return ResponseEntity.notFound().build();
        }
        sessionService.deleteSessionById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Session> updateSession(@PathVariable Long id, @RequestBody Session session) {
        // Check if the session exists
        Session existingSession = sessionService.getSessionById(id);
        if (existingSession == null) {
            return ResponseEntity.notFound().build();
        }

        // Update the fields with the new data
        existingSession.setTypeSession(session.getTypeSession());
        existingSession.setDateDebut(session.getDateDebut());
        existingSession.setDateFin(session.getDateFin());
        existingSession.setStart1(session.getStart1());
        existingSession.setEnd1(session.getEnd1());
        existingSession.setStart2(session.getStart2());
        existingSession.setEnd2(session.getEnd2());
        existingSession.setStart3(session.getStart3());
        existingSession.setEnd3(session.getEnd3());
        existingSession.setStart4(session.getStart4());
        existingSession.setEnd4(session.getEnd4());

        // Save the updated session
        Session updatedSession = sessionService.saveSession(existingSession);

        return ResponseEntity.ok(updatedSession);
    }



}
