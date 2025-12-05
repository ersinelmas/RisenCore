package com.risencore.risencore_api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.risencore.risencore_api.domain.Task;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.CreateTaskRequestDTO;
import com.risencore.risencore_api.dto.TaskResponseDTO;
import com.risencore.risencore_api.exception.ResourceNotFoundException;
import com.risencore.risencore_api.mapper.TaskMapper;
import com.risencore.risencore_api.repository.TaskRepository;
import com.risencore.risencore_api.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock private TaskRepository taskRepository;

    @Mock private TaskMapper taskMapper;

    @Mock private UserRepository userRepository;

    @Mock private SecurityContext securityContext;

    @Mock private Authentication authentication;

    @InjectMocks private TaskServiceImpl taskService;

    private User testUser;
    private Task task;
    private TaskResponseDTO taskResponseDTO;
    private CreateTaskRequestDTO createTaskRequestDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        // Mock the security context to simulate an authenticated user
        when(authentication.getName()).thenReturn(testUser.getUsername());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true); // Crucial for the new check
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.findByUsername(testUser.getUsername()))
                .thenReturn(Optional.of(testUser));

        task = new Task();
        task.setId(1L);
        task.setUser(testUser);
        task.setDescription("Test Task");

        taskResponseDTO = new TaskResponseDTO();
        taskResponseDTO.setId(1L);

        createTaskRequestDTO = new CreateTaskRequestDTO();
        createTaskRequestDTO.setDescription("New Task");
    }

    @Test
    @DisplayName("getTaskById should return TaskResponseDTO when Task exists and belongs to user")
    void getTaskById_whenTaskExists_shouldReturnTaskResponseDTO() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskMapper.taskToTaskResponseDTO(task)).thenReturn(taskResponseDTO);

        // When
        TaskResponseDTO foundTask = taskService.getTaskById(1L);

        // Then
        assertThat(foundTask).isNotNull();
        assertThat(foundTask.getId()).isEqualTo(1L);
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("getTaskById should throw ResourceNotFoundException when Task does not exist")
    void getTaskById_whenTaskDoesNotExist_shouldThrowResourceNotFoundException() {
        // Given
        long nonExistentId = 99L;
        when(taskRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(
                ResourceNotFoundException.class,
                () -> {
                    taskService.getTaskById(nonExistentId);
                });

        verify(taskMapper, never()).taskToTaskResponseDTO(any(Task.class));
    }

    @Test
    @DisplayName("createTask should save and return a new task")
    void createTask_shouldSaveAndReturnNewTask() {
        // Given
        Task newTask = new Task();
        newTask.setDescription(createTaskRequestDTO.getDescription());

        when(taskMapper.createTaskRequestDTOToTask(createTaskRequestDTO)).thenReturn(newTask);
        when(taskRepository.save(any(Task.class))).thenReturn(newTask);
        when(taskMapper.taskToTaskResponseDTO(newTask)).thenReturn(taskResponseDTO);

        // When
        TaskResponseDTO createdTask = taskService.createTask(createTaskRequestDTO);

        // Then
        assertThat(createdTask).isNotNull();
        verify(taskRepository).save(newTask);
        assertThat(newTask.getUser()).isEqualTo(testUser);
    }
}
