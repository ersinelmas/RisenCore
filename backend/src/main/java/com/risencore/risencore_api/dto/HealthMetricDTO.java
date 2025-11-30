package com.risencore.risencore_api.dto;

import com.risencore.risencore_api.domain.HealthMetricType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetricDTO {
    private Long id;
    private HealthMetricType type;
    private Double value;
    private String unit;
    private LocalDate date;
    private String notes;
}
