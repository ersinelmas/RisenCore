package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.HealthMetric;
import com.risencore.risencore_api.domain.HealthMetricType;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.HealthMetricDTO;
import com.risencore.risencore_api.exception.ResourceNotFoundException;
import com.risencore.risencore_api.mapper.HealthMapper;
import com.risencore.risencore_api.repository.HealthMetricRepository;
import com.risencore.risencore_api.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HealthServiceImpl implements HealthService {

    private final HealthMetricRepository healthMetricRepository;
    private final UserRepository userRepository;
    private final HealthMapper healthMapper;

    @Override
    @Transactional
    public HealthMetricDTO createMetric(HealthMetricDTO metricDTO) {
        User user = getCurrentUser();

        HealthMetric metric = healthMapper.healthMetricDTOToHealthMetric(metricDTO);
        metric.setUser(user);

        HealthMetric savedMetric = healthMetricRepository.save(metric);
        return healthMapper.healthMetricToHealthMetricDTO(savedMetric);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthMetricDTO> getAllMetrics() {
        User user = getCurrentUser();
        return healthMetricRepository.findByUserId(user.getId()).stream()
                .map(healthMapper::healthMetricToHealthMetricDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthMetricDTO> getMetricsByType(HealthMetricType type) {
        User user = getCurrentUser();
        return healthMetricRepository.findByUserIdAndType(user.getId(), type).stream()
                .map(healthMapper::healthMetricToHealthMetricDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteMetric(Long id) {
        User user = getCurrentUser();
        HealthMetric metric =
                healthMetricRepository
                        .findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("HealthMetric", "id", id));

        if (!metric.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("HealthMetric", "id", id);
        }
        healthMetricRepository.deleteById(id);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new IllegalStateException("User is not authenticated");
        }
        String username = authentication.getName();
        return userRepository
                .findByUsername(username)
                .orElseThrow(
                        () ->
                                new IllegalStateException(
                                        "Authenticated user not found in database"));
    }
}
