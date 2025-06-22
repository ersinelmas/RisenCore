package com.risencore.risencore_api.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateTaskRequestDTO {
    private String description;
    private Boolean completed;
    private LocalDate dueDate;
}
