package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.Task;
import com.risencore.risencore_api.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service // Marks this class as a Spring service component
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    // Constructor-based dependency injection
    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    @Transactional(readOnly = true) // Indicates that this method is a read-only transaction
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    @Transactional // Default transaction (read-write)
    public Task createTask(Task task) {
        // In a real app, you might add validation or other business logic here
        // For now, task comes pre-populated with createdAt/updatedAt by @PrePersist
        return taskRepository.save(task);
    }

    @Override
    @Transactional
    public Optional<Task> updateTask(Long id, Task taskDetails) {
        return taskRepository.findById(id).map(existingTask -> {
            existingTask.setDescription(taskDetails.getDescription());
            existingTask.setCompleted(taskDetails.isCompleted());
            if (taskDetails.getDueDate() != null) {
                existingTask.setDueDate(taskDetails.getDueDate());
            }
            // 'updatedAt' will be handled by @PreUpdate in Task entity
            return taskRepository.save(existingTask);
        });
    }

    @Override
    @Transactional
    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false; // Task not found
    }
}