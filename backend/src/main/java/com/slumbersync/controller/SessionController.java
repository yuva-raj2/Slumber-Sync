package com.slumbersync.controller;

import com.slumbersync.model.SleepSession;
import com.slumbersync.repository.SleepSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SleepSessionRepository sleepSessionRepository;

    @PostMapping
    public ResponseEntity<SleepSession> createSession(@RequestBody SleepSession session) {
        SleepSession saved = sleepSessionRepository.save(session);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/history")
    public ResponseEntity<List<SleepSession>> getSessionHistory() {
        List<SleepSession> history = sleepSessionRepository.findAllByOrderByStartTimeDesc();
        return ResponseEntity.ok(history);
    }
}
