package com.risencore.risencore_api.dto;

import com.risencore.risencore_api.domain.Frequency;
import lombok.Data;
import java.util.Set;
import java.time.LocalDate;

@Data
public class HabitDTO {
    private Long id;
    private String name;
    private String description;
    private Frequency frequency;
    private int targetCount;
    private Set<LocalDate> completionDates;
}