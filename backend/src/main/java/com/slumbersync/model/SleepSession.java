package com.slumbersync.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sleep_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SleepSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    @Builder.Default
    private UUID sessionId = UUID.randomUUID();

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Double avgDecibels;

    private Double maxDecibelSpike;

    @Builder.Default
    private Integer disturbancesShieldedCount = 0;

    @Column(length = 64)
    @Builder.Default
    private String hardwareModeUsed = "TIER_B_SOFTWARE_SHIELD"; // TIER_A_ANC, TIER_B_SOFTWARE_SHIELD, HYBRID

    @Builder.Default
    private Integer sleepQualityScore = 88;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.sessionId == null) {
            this.sessionId = UUID.randomUUID();
        }
        if (this.startTime == null) {
            this.startTime = LocalDateTime.now();
        }
    }

    // Aliases for compatibility
    public Double getAverageDecibelLevel() {
        return avgDecibels != null ? avgDecibels : 35.0;
    }

    public Double getPeakDecibelLevel() {
        return maxDecibelSpike != null ? maxDecibelSpike : 55.0;
    }
}
