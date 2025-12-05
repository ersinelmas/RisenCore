package com.risencore.risencore_api.service;

import com.risencore.risencore_api.dto.JwtAuthenticationResponseDTO;
import com.risencore.risencore_api.dto.LoginRequestDTO;
import com.risencore.risencore_api.dto.SignUpRequestDTO;

public interface AuthService {
    void registerUser(SignUpRequestDTO signUpRequest);

    JwtAuthenticationResponseDTO loginUser(LoginRequestDTO loginRequest);
}
