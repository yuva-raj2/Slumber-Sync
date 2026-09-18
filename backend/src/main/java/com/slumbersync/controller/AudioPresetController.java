package com.slumbersync.controller;

import com.slumbersync.model.AudioPreset;
import com.slumbersync.repository.AudioPresetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audio-presets")
@RequiredArgsConstructor
public class AudioPresetController {

    private final AudioPresetRepository audioPresetRepository;

    @GetMapping
    public ResponseEntity<List<AudioPreset>> getAllPresets() {
        return ResponseEntity.ok(audioPresetRepository.findAll());
    }

    @GetMapping("/defaults")
    public ResponseEntity<List<AudioPreset>> getDefaultPresets() {
        return ResponseEntity.ok(audioPresetRepository.findByIsDefaultTrue());
    }

    @PostMapping
    public ResponseEntity<AudioPreset> createPreset(@RequestBody AudioPreset preset) {
        AudioPreset saved = audioPresetRepository.save(preset);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
