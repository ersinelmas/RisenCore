package com.risencore.risencore_api.service;

import com.risencore.risencore_api.dto.CreateTaskRequestDTO;
import com.risencore.risencore_api.dto.TaskResponseDTO;
import com.risencore.risencore_api.dto.UpdateTaskRequestDTO;

import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<TaskResponseDTO> getAllTasks();
    Optional<TaskResponseDTO> getTaskById(Long id);
    TaskResponseDTO createTask(CreateTaskRequestDTO taskRequestDTO);
    Optional<TaskResponseDTO> updateTask(Long id, UpdateTaskRequestDTO taskRequestDTO);
    boolean deleteTask(Long id);
}