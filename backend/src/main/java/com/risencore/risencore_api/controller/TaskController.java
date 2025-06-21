package com.risencore.risencore_api.controller;

import com.risencore.risencore_api.domain.Task;
import com.risencore.risencore_api.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import org.springframework.web.servlet.support.ServletUriComponentsBuilder; // For creating Location URI
// import java.net.URI; // For creating Location URI

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks") // Base path for all task-related endpoints
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        // TODO: Replace Task with TaskRequestDTO and add validation
        Task createdTask = taskService.createTask(task);
        // Consider returning a Location header:
        // URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
        // .buildAndExpand(createdTask.getId()).toUri();
        // return ResponseEntity.created(location).body(createdTask);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        // TODO: Replace Task with TaskUpdateRequestDTO and add validation
        return taskService.updateTask(id, taskDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (taskService.deleteTask(id)) {
            return ResponseEntity.noContent().build(); // Standard response for successful DELETE
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}