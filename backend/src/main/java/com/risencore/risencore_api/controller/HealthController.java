package com.risencore.risencore_api.controller;

import com.risencore.risencore_api.domain.HealthMetricType;
import com.risencore.risencore_api.dto.HealthMetricDTO;
import com.risencore.risencore_api.service.HealthService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
public class HealthController {

    private final HealthService healthService;

    @PostMapping
    public ResponseEntity<HealthMetricDTO> createMetric(@RequestBody HealthMetricDTO metricDTO) {
        return ResponseEntity.ok(healthService.createMetric(metricDTO));
    }

    @GetMapping
    public ResponseEntity<List<HealthMetricDTO>> getAllMetrics() {
        return ResponseEntity.ok(healthService.getAllMetrics());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<HealthMetricDTO>> getMetricsByType(
            @PathVariable HealthMetricType type) {
        return ResponseEntity.ok(healthService.getMetricsByType(type));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMetric(@PathVariable Long id) {
        healthService.deleteMetric(id);
        return ResponseEntity.noContent().build();
    }
}
