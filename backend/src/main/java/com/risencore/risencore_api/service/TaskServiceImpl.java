package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.Task;
import com.risencore.risencore_api.dto.CreateTaskRequestDTO;
import com.risencore.risencore_api.dto.TaskResponseDTO;
import com.risencore.risencore_api.dto.UpdateTaskRequestDTO;
import com.risencore.risencore_api.exception.ResourceNotFoundException;
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
    public TaskResponseDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return taskMapper.taskToTaskResponseDTO(task);
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
    public TaskResponseDTO updateTask(Long id, UpdateTaskRequestDTO taskRequestDTO) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        taskMapper.updateTaskFromUpdateTaskRequestDTO(taskRequestDTO, existingTask);
        Task updatedTask = taskRepository.save(existingTask);
        return taskMapper.taskToTaskResponseDTO(updatedTask);
    }

    @Override
    @Transactional
    public void deleteTask(Long id) { // boolean yerine void
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task", "id", id);
        }
        taskRepository.deleteById(id);
    }
}