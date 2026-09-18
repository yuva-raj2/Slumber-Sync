package com.slumbersync.repository;

import com.slumbersync.model.SleepSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SleepSessionRepository extends JpaRepository<SleepSession, Long> {
    Optional<SleepSession> findBySessionId(UUID sessionId);
    List<SleepSession> findAllByOrderByStartTimeDesc();
}
