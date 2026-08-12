package com.risencore.risencore_api.dto;

import com.risencore.risencore_api.domain.HealthMetricType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetricDTO {
    private Long id;

    @NotNull(message = "Metric type is required")
    private HealthMetricType type;

    @NotNull(message = "Value is required")
    private Double value;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private String notes;
}
