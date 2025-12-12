package com.risencore.risencore_api.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.risencore.risencore_api.BaseIntegrationTest;
import com.risencore.risencore_api.domain.HealthMetric;
import com.risencore.risencore_api.domain.HealthMetricType;
import com.risencore.risencore_api.domain.Role;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.HealthMetricDTO;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

class HealthControllerIT extends BaseIntegrationTest {

    private String userToken;
    private User owner;

    @BeforeEach
    void init() throws Exception {
        owner = createTestUser("health_user", "password", Role.USER);
        userToken = getJwtToken("health_user", "password");
    }

    @Test
    @DisplayName("POST /api/v1/health should create a metric for authenticated user")
    void createMetric_authenticated_returnsCreatedMetric() throws Exception {
        HealthMetricDTO metricDTO =
                new HealthMetricDTO(
                        null,
                        HealthMetricType.BLOOD_PRESSURE,
                        120.0,
                        "mmHg",
                        LocalDate.now(),
                        "Morning reading");

        mockMvc.perform(
                        post("/api/v1/health")
                                .header("Authorization", "Bearer " + userToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(metricDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type", is("BLOOD_PRESSURE")))
                .andExpect(jsonPath("$.unit", is("mmHg")));
    }

    @Test
    @DisplayName("GET /api/v1/health/type/{type} should return only metrics of that type for the user")
    void getMetricsByType_returnsFilteredMetrics() throws Exception {
        // Metric for current user
        HealthMetric metric = new HealthMetric();
        metric.setType(HealthMetricType.WEIGHT);
        metric.setValue(75.0);
        metric.setUnit("kg");
        metric.setDate(LocalDate.now());
        metric.setUser(owner);
        healthMetricRepository.save(metric);

        // Metric for another user (should not be returned)
        User other = createTestUser("health_other", "password", Role.USER);
        HealthMetric otherMetric = new HealthMetric();
        otherMetric.setType(HealthMetricType.WEIGHT);
        otherMetric.setValue(80.0);
        otherMetric.setUnit("kg");
        otherMetric.setDate(LocalDate.now());
        otherMetric.setUser(other);
        healthMetricRepository.save(otherMetric);

        mockMvc.perform(
                        get("/api/v1/health/type/{type}", HealthMetricType.WEIGHT)
                                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].value", is(75.0)));
    }

    @Test
    @DisplayName("Unauthenticated health metric requests should be rejected")
    void unauthorizedRequests_return401() throws Exception {
        mockMvc.perform(post("/api/v1/health").content("{}"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(delete("/api/v1/health/{id}", 1L))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/health/type/{type}", HealthMetricType.BLOOD_PRESSURE))
                .andExpect(status().isUnauthorized());
    }
}
