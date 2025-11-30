package com.risencore.risencore_api.repository;

import com.risencore.risencore_api.domain.HealthMetric;
import com.risencore.risencore_api.domain.HealthMetricType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {
    List<HealthMetric> findByUserId(Long userId);

    List<HealthMetric> findByUserIdAndType(Long userId, HealthMetricType type);

    List<HealthMetric> findByUserIdAndDate(Long userId, LocalDate date);
}
