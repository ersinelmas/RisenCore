package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.Task;
import com.risencore.risencore_api.dto.CreateTaskRequestDTO;
import com.risencore.risencore_api.dto.TaskResponseDTO;
import com.risencore.risencore_api.exception.ResourceNotFoundException;
import com.risencore.risencore_api.mapper.TaskMapper;
import com.risencore.risencore_api.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Enables Mockito annotations for JUnit 5
class TaskServiceImplTest {

    @Mock // Creates a mock implementation for the TaskRepository
    private TaskRepository taskRepository;

    @Mock // Creates a mock implementation for the TaskMapper
    private TaskMapper taskMapper;

    @InjectMocks // Creates an instance of TaskServiceImpl and injects the mocks into it
    private TaskServiceImpl taskService;

    private Task task;
    private TaskResponseDTO taskResponseDTO;
    private CreateTaskRequestDTO createTaskRequestDTO;

    @BeforeEach
    void setUp() {
        // This method runs before each test, setting up common test data.
        task = new Task();
        task.setId(1L);
        task.setDescription("Test Task");
        task.setCompleted(false);
        task.setDueDate(LocalDate.now().plusDays(5));
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        taskResponseDTO = new TaskResponseDTO();
        taskResponseDTO.setId(1L);
        taskResponseDTO.setDescription("Test Task");
        taskResponseDTO.setCompleted(false);

        createTaskRequestDTO = new CreateTaskRequestDTO();
        createTaskRequestDTO.setDescription("New Task");
    }

    @Test
    @DisplayName("getTaskById should return TaskResponseDTO when Task exists")
    void getTaskById_whenTaskExists_shouldReturnTaskResponseDTO() {
        // Given: Define the behavior of the mocks
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskMapper.taskToTaskResponseDTO(task)).thenReturn(taskResponseDTO);

        // When: Call the actual method to be tested
        TaskResponseDTO foundTask = taskService.getTaskById(1L);

        // Then: Assert the results
        assertThat(foundTask).isNotNull();
        assertThat(foundTask.getId()).isEqualTo(1L);
        assertThat(foundTask.getDescription()).isEqualTo("Test Task");

        // Verify that the repository's findById method was called exactly once
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("getTaskById should throw ResourceNotFoundException when Task does not exist")
    void getTaskById_whenTaskDoesNotExist_shouldThrowResourceNotFoundException() {
        // Given: Define the behavior of the mock for a non-existent ID
        long nonExistentId = 99L;
        when(taskRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // When & Then: Assert that the expected exception is thrown
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            taskService.getTaskById(nonExistentId);
        });

        assertThat(exception.getMessage()).isEqualTo("Task not found with id : '99'");

        // Verify that the mapper was never called, as the method should fail before mapping
        verify(taskMapper, never()).taskToTaskResponseDTO(any(Task.class));
    }

    @Test
    @DisplayName("createTask should save and return a new task")
    void createTask_shouldSaveAndReturnNewTask() {
        // Given
        Task taskToSave = new Task(); // The entity created from the DTO
        taskToSave.setDescription(createTaskRequestDTO.getDescription());

        when(taskMapper.createTaskRequestDTOToTask(createTaskRequestDTO)).thenReturn(taskToSave);
        when(taskRepository.save(any(Task.class))).thenReturn(task); // Assume save returns our pre-configured task
        when(taskMapper.taskToTaskResponseDTO(task)).thenReturn(taskResponseDTO);

        // When
        TaskResponseDTO createdTask = taskService.createTask(createTaskRequestDTO);

        // Then
        assertThat(createdTask).isNotNull();
        assertThat(createdTask.getId()).isEqualTo(1L);

        // Verify that repository.save was called on an object matching our DTO's data
        verify(taskRepository).save(argThat(savedTask ->
                savedTask.getDescription().equals("New Task") && !savedTask.isCompleted()
        ));
    }
}