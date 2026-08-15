package com.risencore.risencore_api.repository;

import com.risencore.risencore_api.domain.HealthMetric;
import com.risencore.risencore_api.domain.HealthMetricType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {
    List<HealthMetric> findByUserId(Long userId);

    List<HealthMetric> findByUserIdAndType(Long userId, HealthMetricType type);
}
