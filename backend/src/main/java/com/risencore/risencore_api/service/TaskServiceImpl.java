package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.Task;
import com.risencore.risencore_api.dto.CreateTaskRequestDTO;
import com.risencore.risencore_api.dto.TaskResponseDTO;
import com.risencore.risencore_api.dto.UpdateTaskRequestDTO;
import com.risencore.risencore_api.mapper.TaskMapper;
import com.risencore.risencore_api.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper; // TaskMapper'ı inject et

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponseDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(taskMapper::taskToTaskResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TaskResponseDTO> getTaskById(Long id) {
        return taskRepository.findById(id)
                .map(taskMapper::taskToTaskResponseDTO);
    }

    @Override
    @Transactional
    public TaskResponseDTO createTask(CreateTaskRequestDTO taskRequestDTO) {
        Task task = taskMapper.createTaskRequestDTOToTask(taskRequestDTO);
        Task savedTask = taskRepository.save(task);
        return taskMapper.taskToTaskResponseDTO(savedTask);
    }

    @Override
    @Transactional
    public Optional<TaskResponseDTO> updateTask(Long id, UpdateTaskRequestDTO taskRequestDTO) {
        return taskRepository.findById(id).map(existingTask -> {
            taskMapper.updateTaskFromUpdateTaskRequestDTO(taskRequestDTO, existingTask);
            Task updatedTask = taskRepository.save(existingTask);
            return taskMapper.taskToTaskResponseDTO(updatedTask);
        });
    }

    @Override
    @Transactional
    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }
}