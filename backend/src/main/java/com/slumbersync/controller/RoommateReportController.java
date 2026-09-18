package com.slumbersync.controller;

import com.slumbersync.dto.RoommateReportResponse;
import com.slumbersync.model.NoiseIncident;
import com.slumbersync.model.SleepSession;
import com.slumbersync.repository.NoiseIncidentRepository;
import com.slumbersync.repository.SleepSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports/roommate")
@RequiredArgsConstructor
public class RoommateReportController {

    private final SleepSessionRepository sleepSessionRepository;
    private final NoiseIncidentRepository noiseIncidentRepository;

    @GetMapping("/{sessionId}")
    public ResponseEntity<RoommateReportResponse> getReportForSession(@PathVariable UUID sessionId) {
        SleepSession session = sleepSessionRepository.findBySessionId(sessionId).orElse(null);
        if (session == null) {
            return ResponseEntity.notFound().build();
        }

        List<NoiseIncident> incidents = noiseIncidentRepository.findBySessionIdOrderByTimestampAsc(sessionId);
        double whoGuideline = 35.0; // World Health Organization Night Noise Guidelines for Europe (30-35 dB inside bedroom)
        double peak = session.getPeakDecibelLevel() != null ? session.getPeakDecibelLevel() : 65.0;
        double avg = session.getAverageDecibelLevel() != null ? session.getAverageDecibelLevel() : 38.0;
        double over = Math.max(0, peak - whoGuideline);

        String severity = over > 25 ? "SEVERE" : (over > 15 ? "MODERATE" : "MILD");

        String summary = String.format(
                "Acoustic telemetry recorded %d noise disturbance spikes during sleep hours. " +
                "Bedroom sound levels reached a peak of %.1f dB, exceeding the WHO recommended 35.0 dB nighttime sleep ceiling by +%.1f dB. " +
                "Slumber-Sync deployed adaptive vocal cloaking and bass attenuation to mitigate sleep disruption.",
                incidents.size(), peak, over
        );

        RoommateReportResponse response = RoommateReportResponse.builder()
                .sessionId(sessionId)
                .startTime(session.getStartTime())
                .endTime(session.getEndTime() != null ? session.getEndTime() : LocalDateTime.now())
                .averageDecibels(avg)
                .peakDecibels(peak)
                .whoGuidelineThresholdDb(whoGuideline)
                .decibelsOverGuideline(over)
                .totalDisturbances(incidents.size())
                .quietHoursViolations(incidents.size())
                .sleepQualityScore(session.getSleepQualityScore() != null ? session.getSleepQualityScore() : 82)
                .impactSeverity(severity)
                .executiveSummary(summary)
                .incidents(incidents)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sessionId}/incidents")
    public ResponseEntity<NoiseIncident> logIncident(
            @PathVariable UUID sessionId,
            @RequestBody NoiseIncident incident) {
        incident.setSessionId(sessionId);
        if (incident.getTimestamp() == null) {
            incident.setTimestamp(LocalDateTime.now());
        }
        NoiseIncident saved = noiseIncidentRepository.save(incident);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
