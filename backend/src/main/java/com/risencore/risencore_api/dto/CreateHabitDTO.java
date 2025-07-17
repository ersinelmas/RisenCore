package com.risencore.risencore_api.dto;

import com.risencore.risencore_api.domain.Frequency;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateHabitDTO {
    @NotBlank
    private String name;
    private String description;
    @NotNull
    private Frequency frequency;
    @Min(1)
    private int targetCount;
}