package com.slumbersync.repository;

import com.slumbersync.model.NoiseIncident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NoiseIncidentRepository extends JpaRepository<NoiseIncident, Long> {
    List<NoiseIncident> findBySessionIdOrderByTimestampAsc(UUID sessionId);
    Long countBySessionId(UUID sessionId);
}
