package com.risencore.risencore_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTaskRequestDTO {

    @NotBlank(message = "Task description cannot be blank.")
    @Size(min = 3, max = 200, message = "Task description must be between 3 and 200 characters.")
    private String description;

    // dueDate is optional, so no @NotNull or @NotBlank.
    // Specific date validations (e.g., @Future) could be added if needed.
    private LocalDate dueDate;
}