package com.risencore.risencore_api.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.risencore.risencore_api.BaseIntegrationTest;
import com.risencore.risencore_api.domain.Frequency;
import com.risencore.risencore_api.domain.Habit;
import com.risencore.risencore_api.domain.HabitCompletion;
import com.risencore.risencore_api.domain.Role;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.CreateHabitDTO;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

class HabitControllerIT extends BaseIntegrationTest {

    private String userToken;
    private String otherToken;
    private User owner;
    private User stranger;

    @BeforeEach
    void init() throws Exception {
        owner = createTestUser("habit_owner", "password", Role.USER);
        userToken = getJwtToken("habit_owner", "password");

        stranger = createTestUser("habit_stranger", "password", Role.USER);
        otherToken = getJwtToken("habit_stranger", "password");
    }

    @Test
    @DisplayName("POST /api/v1/habits should create a habit when payload is valid")
    void createHabit_returnsCreatedHabit() throws Exception {
        CreateHabitDTO createDto = new CreateHabitDTO();
        createDto.setName("Morning Walk");
        createDto.setDescription("30 minute walk");
        createDto.setFrequency(Frequency.DAILY);
        createDto.setTargetCount(1);

        mockMvc.perform(
                        post("/api/v1/habits")
                                .header("Authorization", "Bearer " + userToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Morning Walk")))
                .andExpect(jsonPath("$.completedToday", is(false)));
    }

    @Test
    @DisplayName("Habit creation should fail validation when required fields are missing")
    void createHabit_validationErrors() throws Exception {
        CreateHabitDTO createDto = new CreateHabitDTO();
        createDto.setName("");
        createDto.setFrequency(null);
        createDto.setTargetCount(0);

        mockMvc.perform(
                        post("/api/v1/habits")
                                .header("Authorization", "Bearer " + userToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name[0]", containsString("must not be blank")))
                .andExpect(jsonPath("$.errors.frequency[0]", containsString("must not be null")))
                .andExpect(jsonPath("$.errors.targetCount[0]", containsString("must be greater than or equal to 1")));
    }

    @Test
    @DisplayName("Habit owner can toggle completion; other users receive 404")
    void toggleCompletion_respectsOwnership() throws Exception {
        Habit habit = new Habit();
        habit.setName("Read");
        habit.setFrequency(Frequency.DAILY);
        habit.setTargetCount(1);
        habit.setUser(owner);
        Habit saved = habitRepository.save(habit);

        mockMvc.perform(
                        post("/api/v1/habits/{habitId}/completions", saved.getId())
                                .param("date", LocalDate.now().toString())
                                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk());

        mockMvc.perform(
                        post("/api/v1/habits/{habitId}/completions", saved.getId())
                                .param("date", LocalDate.now().toString())
                                .header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isNotFound());

        mockMvc.perform(
                        get("/api/v1/habits")
                                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].completionDates", hasSize(1)));
    }

    @Test
    @DisplayName("DELETE /api/v1/habits/{id} should prevent unauthorized deletion")
    void deleteHabit_unauthorizedUserGets404() throws Exception {
        Habit habit = new Habit();
        habit.setName("Journal");
        habit.setFrequency(Frequency.WEEKLY);
        habit.setTargetCount(1);
        habit.setUser(owner);
        Habit saved = habitRepository.save(habit);

        // Add a completion to ensure cascading cleanup works
        HabitCompletion completion = new HabitCompletion();
        completion.setHabit(saved);
        completion.setCompletionDate(LocalDate.now());
        habitCompletionRepository.save(completion);

        mockMvc.perform(
                        delete("/api/v1/habits/{id}", saved.getId())
                                .header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isNotFound());

        mockMvc.perform(
                        delete("/api/v1/habits/{id}", saved.getId())
                                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Requests without authentication should be rejected")
    void unauthenticatedRequests_return401() throws Exception {
        mockMvc.perform(get("/api/v1/habits")).andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/v1/habits").content("{}"))
                .andExpect(status().isUnauthorized());
    }
}
