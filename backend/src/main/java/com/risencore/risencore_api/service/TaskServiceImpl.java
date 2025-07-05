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
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    @Override
    public TaskResponseDTO createTask(CreateTaskRequestDTO taskRequestDTO) {
        User currentUser = getCurrentUser();

        Task task = taskMapper.createTaskRequestDTOToTask(taskRequestDTO);
        task.setUser(currentUser);

        Task savedTask = taskRepository.save(task);
        return taskMapper.taskToTaskResponseDTO(savedTask);
    }

    @Override
    public List<TaskResponseDTO> getAllTasks() {
        User currentUser = getCurrentUser();

        List<Task> tasks = taskRepository.findByUserId(currentUser.getId());
        return tasks.stream()
                .map(taskMapper::taskToTaskResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponseDTO getTaskById(Long id) {
        User currentUser = getCurrentUser();
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Task", "id", id);
        }

        return taskMapper.taskToTaskResponseDTO(task);
    }

    @Override
    public TaskResponseDTO updateTask(Long id, UpdateTaskRequestDTO taskRequestDTO) {
        User currentUser = getCurrentUser();
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (!existingTask.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Task", "id", id);
        }

        taskMapper.updateTaskFromUpdateTaskRequestDTO(taskRequestDTO, existingTask);
        Task updatedTask = taskRepository.save(existingTask);
        return taskMapper.taskToTaskResponseDTO(updatedTask);
    }

    @Override
    public void deleteTask(Long id) {
        User currentUser = getCurrentUser();
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Task", "id", id);
        }

        taskRepository.deleteById(id);
    }
}