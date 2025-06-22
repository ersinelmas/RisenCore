package com.risencore.risencore_api.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTaskRequestDTO {
    private String description;
    private LocalDate dueDate;
}