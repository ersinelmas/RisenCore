package com.risencore.risencore_api.exception;

// Thrown when the external AI provider (Gemini) call fails, so it maps to a distinct
// client-facing error instead of a generic internal server error.
public class AIServiceException extends RuntimeException {

    public AIServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
