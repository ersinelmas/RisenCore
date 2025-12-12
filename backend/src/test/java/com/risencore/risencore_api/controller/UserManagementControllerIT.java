package com.risencore.risencore_api.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.risencore.risencore_api.BaseIntegrationTest;
import com.risencore.risencore_api.domain.Role;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.ChangePasswordRequestDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

class UserManagementControllerIT extends BaseIntegrationTest {

    private User admin;
    private User standardUser;
    private String adminToken;
    private String userToken;

    @BeforeEach
    void init() throws Exception {
        admin = createTestUser("admin_user", "password", Role.USER, Role.ADMIN);
        standardUser = createTestUser("standard_user", "password", Role.USER);
        adminToken = getJwtToken(admin.getUsername(), "password");
        userToken = getJwtToken(standardUser.getUsername(), "password");
    }

    @Test
    @DisplayName("Admin endpoints should enforce RBAC and require authentication")
    void adminEndpoints_enforceRbac() throws Exception {
        mockMvc.perform(get("/api/v1/admin/users")).andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/admin/users").header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/v1/admin/users").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", greaterThanOrEqualTo(2)));
    }

    @Test
    @DisplayName("PATCH /api/v1/users/change-password should change password for authenticated user")
    void changePassword_success() throws Exception {
        ChangePasswordRequestDTO request = new ChangePasswordRequestDTO();
        request.setCurrentPassword("password");
        request.setNewPassword("newPass123");
        request.setConfirmationPassword("newPass123");

        mockMvc.perform(
                        patch("/api/v1/users/change-password")
                                .header("Authorization", "Bearer " + userToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is("Password changed successfully")));

        // Verify login now works with the new password
        getJwtToken(standardUser.getUsername(), "newPass123");
    }

    @Test
    @DisplayName("change-password should reject wrong current password and missing auth")
    void changePassword_failures() throws Exception {
        ChangePasswordRequestDTO wrongCurrent = new ChangePasswordRequestDTO();
        wrongCurrent.setCurrentPassword("wrong");
        wrongCurrent.setNewPassword("newPass123");
        wrongCurrent.setConfirmationPassword("newPass123");

        mockMvc.perform(
                        patch("/api/v1/users/change-password")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(wrongCurrent)))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(
                        patch("/api/v1/users/change-password")
                                .header("Authorization", "Bearer " + userToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(wrongCurrent)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Wrong current password")));
    }
}
