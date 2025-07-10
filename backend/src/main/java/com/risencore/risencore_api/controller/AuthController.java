package com.risencore.risencore_api.controller;

import com.risencore.risencore_api.dto.JwtAuthenticationResponseDTO;
import com.risencore.risencore_api.dto.LoginRequestDTO;
import com.risencore.risencore_api.dto.SignUpRequestDTO;
import com.risencore.risencore_api.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user authentication and registration")
public class AuthController {

    private final AuthService authService;

    @Operation (
            summary = "User Registration",
            description = "Registers a new user with the provided details. The user will be created with the default role of USER.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "User registered successfully"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Bad Request - Invalid input data")
            }
    )
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody SignUpRequestDTO signUpRequest) {
        authService.registerUser(signUpRequest);
        return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
    }

    @Operation (
            summary = "User Login",
            description = "Authenticates a user and returns a JWT token for further requests.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User logged in successfully"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - Invalid credentials")
            }
    )
    @PostMapping("/login")
    public ResponseEntity<JwtAuthenticationResponseDTO> loginUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        return ResponseEntity.ok(authService.loginUser(loginRequest));
    }
}