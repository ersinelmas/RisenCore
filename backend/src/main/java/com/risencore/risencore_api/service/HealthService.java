package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.HealthMetricType;
import com.risencore.risencore_api.dto.HealthMetricDTO;
import java.util.List;

public interface HealthService {
    HealthMetricDTO createMetric(HealthMetricDTO metricDTO);

    List<HealthMetricDTO> getAllMetrics();

    List<HealthMetricDTO> getMetricsByType(HealthMetricType type);

    void deleteMetric(Long id);
}
