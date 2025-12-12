package com.risencore.risencore_api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.risencore.risencore_api.domain.HealthMetric;
import com.risencore.risencore_api.domain.HealthMetricType;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.HealthMetricDTO;
import com.risencore.risencore_api.repository.HealthMetricRepository;
import com.risencore.risencore_api.repository.UserRepository;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class HealthServiceImplTest {

    @Mock private HealthMetricRepository healthMetricRepository;

    @Mock private UserRepository userRepository;

    @Mock private SecurityContext securityContext;

    @Mock private Authentication authentication;

    @InjectMocks private HealthServiceImpl healthService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("healthUser");

        when(authentication.getName()).thenReturn(user.getUsername());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
    }

    @Test
    @DisplayName("createMetric should map DTO to entity, set user and return DTO")
    void createMetric_savesWithCurrentUser() {
        HealthMetricDTO request =
                new HealthMetricDTO(
                        null,
                        HealthMetricType.WEIGHT,
                        70.0,
                        "kg",
                        LocalDate.now(),
                        "Post-workout");

        HealthMetric saved = new HealthMetric();
        saved.setId(10L);
        saved.setType(HealthMetricType.WEIGHT);
        saved.setValue(70.0);
        saved.setUnit("kg");
        saved.setDate(request.getDate());
        saved.setNotes(request.getNotes());
        saved.setUser(user);

        when(healthMetricRepository.save(any(HealthMetric.class))).thenReturn(saved);

        HealthMetricDTO result = healthService.createMetric(request);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getUnit()).isEqualTo("kg");
        verify(healthMetricRepository).save(any(HealthMetric.class));
    }

    @Test
    @DisplayName("getMetricsByType should map entities to DTOs for the current user")
    void getMetricsByType_returnsMappedDtos() {
        HealthMetric metric = new HealthMetric();
        metric.setId(5L);
        metric.setType(HealthMetricType.BLOOD_PRESSURE);
        metric.setValue(120.0);
        metric.setUnit("mmHg");
        metric.setDate(LocalDate.now());
        metric.setUser(user);

        when(healthMetricRepository.findByUserIdAndType(user.getId(), HealthMetricType.BLOOD_PRESSURE))
                .thenReturn(Collections.singletonList(metric));

        var results = healthService.getMetricsByType(HealthMetricType.BLOOD_PRESSURE);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getType()).isEqualTo(HealthMetricType.BLOOD_PRESSURE);
    }

    @Test
    @DisplayName("createMetric should throw when current user cannot be resolved")
    void createMetric_userNotFound() {
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.empty());

        HealthMetricDTO request =
                new HealthMetricDTO(
                        null, HealthMetricType.WEIGHT, 70.0, "kg", LocalDate.now(), "notes");

        assertThrows(RuntimeException.class, () -> healthService.createMetric(request));
    }
}
