package com.risencore.risencore_api.controller;

import com.risencore.risencore_api.dto.CreateTaskRequestDTO;
import com.risencore.risencore_api.dto.TaskResponseDTO;
import com.risencore.risencore_api.dto.UpdateTaskRequestDTO;
import com.risencore.risencore_api.service.TaskService;
import jakarta.validation.Valid; // Import @Valid
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@Valid @RequestBody CreateTaskRequestDTO taskRequestDTO) {
        // If taskRequestDTO fails validation, Spring automatically throws a MethodArgumentNotValidException,
        // resulting in an HTTP 400 Bad Request response by default.
        TaskResponseDTO createdTask = taskService.createTask(taskRequestDTO);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks() {
        List<TaskResponseDTO> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(@PathVariable Long id, @Valid @RequestBody UpdateTaskRequestDTO taskRequestDTO) {
        return taskService.updateTask(id, taskRequestDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (taskService.deleteTask(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}