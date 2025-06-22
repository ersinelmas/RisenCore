package com.risencore.risencore_api.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseDTO {
    private LocalDateTime timestamp;
    private int status;
    private String error; // Short error description e.g., "Bad Request", "Not Found"
    private String message; // More detailed human-readable message
    private String path; // The path where the error occurred

    // For validation errors, to hold field-specific messages
    private Map<String, List<String>> validationErrors;

    // Simpler constructor for general errors
    public ErrorResponseDTO(int status, String error, String message, String path) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    // Constructor for validation errors
    public ErrorResponseDTO(int status, String error, String message, String path, Map<String, List<String>> validationErrors) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.validationErrors = validationErrors;
    }
}