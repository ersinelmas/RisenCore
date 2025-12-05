package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.HealthMetric;
import com.risencore.risencore_api.domain.HealthMetricType;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.HealthMetricDTO;
import com.risencore.risencore_api.repository.HealthMetricRepository;
import com.risencore.risencore_api.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HealthServiceImpl implements HealthService {

    private final HealthMetricRepository healthMetricRepository;
    private final UserRepository userRepository;

    @Override
    public HealthMetricDTO createMetric(HealthMetricDTO metricDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));

        HealthMetric metric = new HealthMetric();
        metric.setType(metricDTO.getType());
        metric.setValue(metricDTO.getValue());
        metric.setUnit(metricDTO.getUnit());
        metric.setDate(metricDTO.getDate());
        metric.setNotes(metricDTO.getNotes());
        metric.setUser(user);

        HealthMetric savedMetric = healthMetricRepository.save(metric);
        return mapToDTO(savedMetric);
    }

    @Override
    public List<HealthMetricDTO> getAllMetrics() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));

        return healthMetricRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<HealthMetricDTO> getMetricsByType(HealthMetricType type) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));

        return healthMetricRepository.findByUserIdAndType(user.getId(), type).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteMetric(Long id) {
        // In a real app, check ownership before deleting
        healthMetricRepository.deleteById(id);
    }

    private HealthMetricDTO mapToDTO(HealthMetric metric) {
        return new HealthMetricDTO(
                metric.getId(),
                metric.getType(),
                metric.getValue(),
                metric.getUnit(),
                metric.getDate(),
                metric.getNotes());
    }
}
