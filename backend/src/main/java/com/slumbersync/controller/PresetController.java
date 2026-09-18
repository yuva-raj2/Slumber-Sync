package com.slumbersync.controller;

import com.slumbersync.model.AudioPreset;
import com.slumbersync.repository.AudioPresetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/presets")
@RequiredArgsConstructor
public class PresetController {

    private final AudioPresetRepository audioPresetRepository;

    @GetMapping
    public ResponseEntity<List<AudioPreset>> getAllPresets() {
        return ResponseEntity.ok(audioPresetRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<AudioPreset> createPreset(@RequestBody AudioPreset preset) {
        AudioPreset saved = audioPresetRepository.save(preset);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
