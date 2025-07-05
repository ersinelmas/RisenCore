package com.risencore.risencore_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.risencore.risencore_api.domain.Task;
import com.risencore.risencore_api.dto.CreateTaskRequestDTO;
import com.risencore.risencore_api.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
class TaskControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ObjectMapper objectMapper; // For converting objects to JSON strings

    @BeforeEach
    void setUp() {
        // Clean up the database before each test to ensure isolation
        taskRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /api/v1/tasks - Should create a new task")
    void givenCreateTaskRequest_whenCreateTask_thenReturns201AndTaskResponse() throws Exception {
        // Given
        CreateTaskRequestDTO createTaskRequest = new CreateTaskRequestDTO();
        createTaskRequest.setDescription("Read a book");

        // When
        ResultActions response = mockMvc.perform(post("/api/v1/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createTaskRequest)));

        // Then
        response.andDo(print()) // Optional: Prints the request and response, useful for debugging
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.description", is("Read a book")))
                .andExpect(jsonPath("$.completed", is(false)));
    }

    @Test
    @DisplayName("GET /api/v1/tasks/{id} - Should return Task when ID exists")
    void givenTaskId_whenGetTaskById_thenReturns200AndTaskResponse() throws Exception {
        // Given: Create a task directly in the database to test retrieval
        Task savedTask = new Task();
        savedTask.setDescription("Test Task 1");
        savedTask = taskRepository.save(savedTask);

        // When
        ResultActions response = mockMvc.perform(get("/api/v1/tasks/{id}", savedTask.getId()));

        // Then
        response.andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("$.id", is(savedTask.getId().intValue())))
                .andExpect(jsonPath("$.description", is(savedTask.getDescription())));
    }

    @Test
    @DisplayName("GET /api/v1/tasks/{id} - Should return 404 when ID does not exist")
    void givenNonExistentTaskId_whenGetTaskById_thenReturns404NotFound() throws Exception {
        // Given
        long nonExistentId = 999L;

        // When
        ResultActions response = mockMvc.perform(get("/api/v1/tasks/{id}", nonExistentId));

        // Then
        response.andExpect(status().isNotFound())
                .andDo(print())
                .andExpect(jsonPath("$.message", is("Task not found with id : '999'")));
    }
}