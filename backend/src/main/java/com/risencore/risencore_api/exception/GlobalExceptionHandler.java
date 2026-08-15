package com.risencore.risencore_api.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice // Indicates that this class assists all @Controller classes.
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Handler for JSR-303 Bean Validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // Sets the HTTP status code for the response
    public ResponseEntity<ErrorResponseDTO> handleValidationExceptions(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        Map<String, List<String>> errors = new HashMap<>();
        ex.getBindingResult()
                .getAllErrors()
                .forEach(
                        (error) -> {
                            String fieldName = ((FieldError) error).getField();
                            String errorMessage = error.getDefaultMessage();
                            errors.computeIfAbsent(fieldName, k -> new ArrayList<>())
                                    .add(errorMessage);
                        });

        ErrorResponseDTO errorResponse =
                new ErrorResponseDTO(
                        HttpStatus.BAD_REQUEST.value(),
                        "Bad Request",
                        "Validation failed for one or more fields.",
                        request.getRequestURI(),
                        errors);
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Handler for ResourceNotFoundException
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorResponseDTO> handleResourceNotFoundException(
            ResourceNotFoundException ex, HttpServletRequest request) {

        ErrorResponseDTO errorResponse =
                new ErrorResponseDTO(
                        HttpStatus.NOT_FOUND.value(),
                        "Not Found",
                        ex.getMessage(), // Message from the exception itself
                        request.getRequestURI());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    // Handler for IllegalArgumentException
    // This is used for cases like "Username is already taken!" or similar validation errors.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDTO> handleIllegalArgumentException(
            IllegalArgumentException ex, HttpServletRequest request) {

        ErrorResponseDTO errorResponse =
                new ErrorResponseDTO(
                        HttpStatus.BAD_REQUEST.value(),
                        "Bad Request",
                        ex.getMessage(),
                        request.getRequestURI());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Handler for DB constraint violations (unique/FK/not-null) that slip past
    // application-level checks, e.g. a race between an existsBy... check and the save().
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ErrorResponseDTO> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex, HttpServletRequest request) {
        logger.warn("Data integrity violation on {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponseDTO errorResponse =
                new ErrorResponseDTO(
                        HttpStatus.CONFLICT.value(),
                        "Conflict",
                        "The request could not be completed because it conflicts with existing"
                                + " data.",
                        request.getRequestURI());
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    // Handler for Spring Security authorization failures (e.g. non-admin hitting an
    // admin-only endpoint), so the response body shape stays consistent with every other error.
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<ErrorResponseDTO> handleAccessDeniedException(
            AccessDeniedException ex, HttpServletRequest request) {

        ErrorResponseDTO errorResponse =
                new ErrorResponseDTO(
                        HttpStatus.FORBIDDEN.value(),
                        "Forbidden",
                        "You do not have permission to access this resource.",
                        request.getRequestURI());
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    // Handler for external AI provider (Gemini) failures, so the client sees a specific
    // "AI review failed" message instead of the generic 500 fallback.
    @ExceptionHandler(AIServiceException.class)
    @ResponseStatus(HttpStatus.BAD_GATEWAY)
    public ResponseEntity<ErrorResponseDTO> handleAIServiceException(
            AIServiceException ex, HttpServletRequest request) {
        logger.error("AI service call failed on {}", request.getRequestURI(), ex);

        ErrorResponseDTO errorResponse =
                new ErrorResponseDTO(
                        HttpStatus.BAD_GATEWAY.value(),
                        "Bad Gateway",
                        "The AI review service is currently unavailable. Please try again later.",
                        request.getRequestURI());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_GATEWAY);
    }

    // Generic handler for all other exceptions (fallback)
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ErrorResponseDTO> handleAllUncaughtException(
            Exception ex, HttpServletRequest request) {
        logger.error("Unhandled exception on {}", request.getRequestURI(), ex);

        ErrorResponseDTO errorResponse =
                new ErrorResponseDTO(
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        "Internal Server Error",
                        "An unexpected error occurred. Please try again later.", // Generic message
                        // for client
                        request.getRequestURI());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Handler for IllegalStateException. In this codebase it's thrown when a valid JWT
    // references a user that no longer exists in the DB — a data-integrity issue, not an auth
    // failure, so it's a 500 (previously mismapped to 401, which could send the frontend into a
    // spurious re-login loop instead of surfacing the real error).
    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ErrorResponseDTO> handleIllegalStateException(
            IllegalStateException ex, HttpServletRequest request) {
        logger.error("Illegal state on {}: {}", request.getRequestURI(), ex.getMessage());

        ErrorResponseDTO errorResponse =
                new ErrorResponseDTO(
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        "Internal Server Error",
                        "An unexpected error occurred. Please try again later.",
                        request.getRequestURI());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Handler for BadCredentialsException (invalid login attempts)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentialsException(
            BadCredentialsException ex, HttpServletRequest request) {

        ErrorResponseDTO errorResponse =
                new ErrorResponseDTO(
                        HttpStatus.UNAUTHORIZED.value(),
                        "Unauthorized",
                        "Invalid username or password.",
                        request.getRequestURI());
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
}
