package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.Task;

import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<Task> getAllTasks();
    Optional<Task> getTaskById(Long id);
    Task createTask(Task task);
    Optional<Task> updateTask(Long id, Task taskDetails);
    boolean deleteTask(Long id);
}