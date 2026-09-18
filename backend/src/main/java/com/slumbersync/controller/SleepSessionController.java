package com.slumbersync.controller;

import com.slumbersync.model.SleepSession;
import com.slumbersync.repository.SleepSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sleep-sessions")
@RequiredArgsConstructor
public class SleepSessionController {

    private final SleepSessionRepository sleepSessionRepository;

    @GetMapping
    public ResponseEntity<List<SleepSession>> getAllSessions() {
        return ResponseEntity.ok(sleepSessionRepository.findAllByOrderByStartTimeDesc());
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SleepSession> getSessionById(@PathVariable UUID sessionId) {
        return sleepSessionRepository.findBySessionId(sessionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SleepSession> createSession(@RequestBody SleepSession session) {
        SleepSession saved = sleepSessionRepository.save(session);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
