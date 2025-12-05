package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.Task;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.CreateTaskRequestDTO;
import com.risencore.risencore_api.dto.TaskResponseDTO;
import com.risencore.risencore_api.dto.UpdateTaskRequestDTO;
import com.risencore.risencore_api.exception.ResourceNotFoundException;
import com.risencore.risencore_api.mapper.TaskMapper;
import com.risencore.risencore_api.repository.TaskRepository;
import com.risencore.risencore_api.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TaskResponseDTO createTask(CreateTaskRequestDTO taskRequestDTO) {
        User currentUser = getCurrentUser();
        Task task = taskMapper.createTaskRequestDTOToTask(taskRequestDTO);
        task.setUser(currentUser);
        Task savedTask = taskRepository.save(task);
        return taskMapper.taskToTaskResponseDTO(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponseDTO> getAllTasks() {
        User currentUser = getCurrentUser();
        List<Task> tasks = taskRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        return tasks.stream().map(taskMapper::taskToTaskResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponseDTO getTaskById(Long id) {
        User currentUser = getCurrentUser();
        Task task =
                taskRepository
                        .findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Task", "id", id);
        }
        return taskMapper.taskToTaskResponseDTO(task);
    }

    @Override
    @Transactional
    public TaskResponseDTO updateTask(Long id, UpdateTaskRequestDTO taskRequestDTO) {
        User currentUser = getCurrentUser();
        Task existingTask =
                taskRepository
                        .findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (!existingTask.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Task", "id", id);
        }

        taskMapper.updateTaskFromUpdateTaskRequestDTO(taskRequestDTO, existingTask);
        Task updatedTask = taskRepository.save(existingTask);
        return taskMapper.taskToTaskResponseDTO(updatedTask);
    }

    @Override
    @Transactional
    public void deleteTask(Long id) {
        User currentUser = getCurrentUser();
        Task task =
                taskRepository
                        .findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Task", "id", id);
        }
        taskRepository.deleteById(id);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new IllegalStateException("User is not authenticated");
        }
        String username = authentication.getName();
        return userRepository
                .findByUsername(username)
                .orElseThrow(
                        () ->
                                new IllegalStateException(
                                        "Authenticated user not found in database"));
    }
}
