package com.risencore.risencore_api.dto;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Data;

@Data
public class UpdateTaskRequestDTO {

    // For updates, fields are typically optional.
    // Validation applies if the field is provided.
    @Size(
            min = 3,
            max = 200,
            message = "Task description, if provided, must be between 3 and 200 characters.")
    private String description;

    private Boolean completed;

    private LocalDate dueDate;
}
