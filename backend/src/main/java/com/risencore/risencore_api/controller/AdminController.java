package com.risencore.risencore_api.controller;

import com.risencore.risencore_api.dto.UserDTO;
import com.risencore.risencore_api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Management", description = "Endpoints for administrative tasks, accessible only to users with ADMIN role")
public class AdminController {

    private final UserService userService;

    @Operation(
            summary = "Get All Users",
            description = "Retrieves a list of all registered users. This endpoint is accessible only to users with ADMIN role.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "List of users retrieved successfully"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - Access denied")
            }
    )
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Promote a user to ADMIN role")
    @PatchMapping("/users/{username}/promote")
    public ResponseEntity<String> promoteUser(@PathVariable String username) {
        userService.promoteUserToAdmin(username);
        return ResponseEntity.ok("User '" + username + "' has been promoted to ADMIN.");
    }

    @Operation(summary = "Demote a user from ADMIN role")
    @PatchMapping("/users/{username}/demote")
    public ResponseEntity<String> demoteUser(@PathVariable String username) {
        userService.demoteUserFromAdmin(username);
        return ResponseEntity.ok("User '" + username + "' has been demoted from ADMIN.");
    }

    @Operation(summary = "Delete a user by ID")
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}