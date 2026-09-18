package com.slumbersync.bootstrap;

import com.slumbersync.model.AudioPreset;
import com.slumbersync.model.SleepSession;
import com.slumbersync.repository.AudioPresetRepository;
import com.slumbersync.repository.SleepSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AudioPresetRepository audioPresetRepository;
    private final SleepSessionRepository sleepSessionRepository;

    @Override
    public void run(String... args) {
        if (audioPresetRepository.count() == 0) {
            log.info("Seeding dual-tier audio presets...");

            List<AudioPreset> defaultPresets = List.of(
                    AudioPreset.builder()
                            .name("Roommate Speech Bandpass Shield")
                            .thresholdDb(48.0)
                            .maskingFrequencyBand("SPEECH_BANDPASS_250_1800HZ")
                            .subAudibleHumEnabled(false)
                            .isDefault(true)
                            .build(),
                    AudioPreset.builder()
                            .name("Deep Sub-Bass & Footstep Barrier")
                            .thresholdDb(45.0)
                            .maskingFrequencyBand("SUB_BASS_75HZ")
                            .subAudibleHumEnabled(true)
                            .isDefault(false)
                            .build(),
                    AudioPreset.builder()
                            .name("Urban High-Traffic Broadband")
                            .thresholdDb(52.0)
                            .maskingFrequencyBand("BROADBAND")
                            .subAudibleHumEnabled(false)
                            .isDefault(false)
                            .build()
            );

            audioPresetRepository.saveAll(defaultPresets);
            log.info("Seeded {} dual-tier audio presets.", defaultPresets.size());
        }

        if (sleepSessionRepository.count() == 0) {
            log.info("Seeding initial dual-tier sleep session telemetry...");

            List<SleepSession> initialSessions = List.of(
                    SleepSession.builder()
                            .startTime(LocalDateTime.now().minusDays(1).withHour(23).withMinute(0))
                            .endTime(LocalDateTime.now().minusDays(1).withHour(7).withMinute(15))
                            .avgDecibels(34.8)
                            .maxDecibelSpike(68.4)
                            .disturbancesShieldedCount(8)
                            .hardwareModeUsed("TIER_A_ANC")
                            .build(),
                    SleepSession.builder()
                            .startTime(LocalDateTime.now().minusDays(2).withHour(22).withMinute(45))
                            .endTime(LocalDateTime.now().minusDays(2).withHour(6).withMinute(50))
                            .avgDecibels(37.2)
                            .maxDecibelSpike(74.1)
                            .disturbancesShieldedCount(14)
                            .hardwareModeUsed("TIER_B_SOFTWARE_SHIELD")
                            .build(),
                    SleepSession.builder()
                            .startTime(LocalDateTime.now().minusDays(3).withHour(23).withMinute(15))
                            .endTime(LocalDateTime.now().minusDays(3).withHour(7).withMinute(0))
                            .avgDecibels(32.5)
                            .maxDecibelSpike(49.2)
                            .disturbancesShieldedCount(2)
                            .hardwareModeUsed("HYBRID")
                            .build()
            );

            sleepSessionRepository.saveAll(initialSessions);
            log.info("Seeded {} sleep sessions.", initialSessions.size());
        }
    }
}
