package com.risencore.risencore_api.service;

import com.risencore.risencore_api.dto.CreateTaskRequestDTO;
import com.risencore.risencore_api.dto.TaskResponseDTO;
import com.risencore.risencore_api.dto.UpdateTaskRequestDTO;

import java.util.List;

public interface TaskService {
    List<TaskResponseDTO> getAllTasks();
    TaskResponseDTO getTaskById(Long id);
    TaskResponseDTO createTask(CreateTaskRequestDTO taskRequestDTO);
    TaskResponseDTO updateTask(Long id, UpdateTaskRequestDTO taskRequestDTO);
    void deleteTask(Long id);
}