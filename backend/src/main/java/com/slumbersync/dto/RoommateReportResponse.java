package com.slumbersync.dto;

import com.slumbersync.model.NoiseIncident;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoommateReportResponse {
    private UUID sessionId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double averageDecibels;
    private Double peakDecibels;
    private Double whoGuidelineThresholdDb; // 35.0 dB
    private Double decibelsOverGuideline;
    private Integer totalDisturbances;
    private Integer quietHoursViolations; // 11 PM to 7 AM
    private Integer sleepQualityScore;
    private String impactSeverity; // MILD, MODERATE, SEVERE
    private String executiveSummary;
    private List<NoiseIncident> incidents;
}
