package com.slumbersync.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audio_presets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudioPreset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    @Builder.Default
    private Double thresholdDb = 48.0;

    @Column(nullable = false, length = 64)
    @Builder.Default
    private String maskingFrequencyBand = "SPEECH_BANDPASS_250_1800HZ";

    @Column(nullable = false)
    @Builder.Default
    private Boolean subAudibleHumEnabled = false;

    @Builder.Default
    private Boolean isDefault = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
