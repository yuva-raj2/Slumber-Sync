package com.slumbersync.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "noise_incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoiseIncident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UUID sessionId;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private Double decibelLevel;

    @Column(nullable = false)
    @Builder.Default
    private Integer durationSeconds = 5;

    @Column(nullable = false, length = 64)
    private String incidentType; // BASS_TRANSIENT, VOCAL_CHATTER, SHARP_IMPACT, SUSTAINED_PARTY

    @Column(nullable = false, length = 64)
    private String actionTaken; // ADAPTIVE_BOOST, CLOAKING_REINFORCED, ALARM_PASSTHROUGH

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
