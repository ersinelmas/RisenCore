package com.risencore.risencore_api.dto;

import com.risencore.risencore_api.domain.Frequency;
import java.time.LocalDate;
import java.util.Set;
import lombok.Data;

@Data
public class HabitResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Frequency frequency;
    private int targetCount;
    private Set<LocalDate> completionDates;
    private boolean completedToday;
}
