package com.risencore.risencore_api.repository;

import com.risencore.risencore_api.domain.HabitCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface HabitCompletionRepository extends JpaRepository<HabitCompletion, Long> {
    Optional<HabitCompletion> findByHabitIdAndCompletionDate(Long habitId, LocalDate completionDate);
}