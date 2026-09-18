package com.slumbersync.repository;

import com.slumbersync.model.AudioPreset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AudioPresetRepository extends JpaRepository<AudioPreset, Long> {
    List<AudioPreset> findByMaskingFrequencyBand(String maskingFrequencyBand);
    List<AudioPreset> findByIsDefaultTrue();
}
