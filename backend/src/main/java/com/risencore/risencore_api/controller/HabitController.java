package com.risencore.risencore_api.controller;

import com.risencore.risencore_api.dto.CreateHabitDTO;
import com.risencore.risencore_api.dto.HabitResponseDTO;
import com.risencore.risencore_api.service.HabitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/habits")
@RequiredArgsConstructor
@Tag(name = "Habit Tracking", description = "Endpoints for managing user habits")
@SecurityRequirement(
        name = "bearerAuth") // Applies JWT security to all endpoints in this controller
public class HabitController {

    private final HabitService habitService;

    @Operation(summary = "Get all habits for the current user")
    @GetMapping
    public ResponseEntity<List<HabitResponseDTO>> getHabits() {
        return ResponseEntity.ok(habitService.getHabitsForCurrentUser());
    }

    @Operation(summary = "Create a new habit for the current user")
    @PostMapping
    public ResponseEntity<HabitResponseDTO> createHabit(
            @Valid @RequestBody CreateHabitDTO createDto) {
        HabitResponseDTO newHabit = habitService.createHabitForCurrentUser(createDto);
        return new ResponseEntity<>(newHabit, HttpStatus.CREATED);
    }

    @Operation(summary = "Toggle a habit's completion status for a specific date")
    @PostMapping("/{habitId}/completions")
    public ResponseEntity<Void> toggleCompletion(
            @PathVariable Long habitId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        habitService.toggleHabitCompletion(habitId, date);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Delete a habit")
    @DeleteMapping("/{habitId}")
    public ResponseEntity<Void> deleteHabit(@PathVariable Long habitId) {
        habitService.deleteHabit(habitId);
        return ResponseEntity.noContent().build();
    }
}
