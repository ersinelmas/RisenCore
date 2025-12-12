package com.risencore.risencore_api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.risencore.risencore_api.domain.Frequency;
import com.risencore.risencore_api.domain.Habit;
import com.risencore.risencore_api.domain.HabitCompletion;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.CreateHabitDTO;
import com.risencore.risencore_api.dto.HabitResponseDTO;
import com.risencore.risencore_api.exception.ResourceNotFoundException;
import com.risencore.risencore_api.mapper.HabitMapper;
import com.risencore.risencore_api.repository.HabitCompletionRepository;
import com.risencore.risencore_api.repository.HabitRepository;
import com.risencore.risencore_api.repository.UserRepository;
import java.time.LocalDate;
import java.util.Collections;
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
class HabitServiceImplTest {

    @Mock private HabitRepository habitRepository;

    @Mock private HabitCompletionRepository habitCompletionRepository;

    @Mock private UserRepository userRepository;

    @Mock private HabitMapper habitMapper;

    @Mock private SecurityContext securityContext;

    @Mock private Authentication authentication;

    @InjectMocks private HabitServiceImpl habitService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("habitUser");

        when(authentication.getName()).thenReturn(user.getUsername());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
    }

    @Test
    @DisplayName("createHabitForCurrentUser should map DTO, set user and return DTO")
    void createHabit_setsUserAndReturnsDto() {
        CreateHabitDTO request = new CreateHabitDTO();
        request.setName("Water");
        request.setFrequency(Frequency.DAILY);
        request.setTargetCount(3);

        Habit habit = new Habit();
        habit.setUser(user);

        HabitResponseDTO responseDTO = new HabitResponseDTO();
        responseDTO.setName("Water");

        when(habitMapper.toEntity(request)).thenReturn(habit);
        when(habitRepository.save(habit)).thenReturn(habit);
        when(habitMapper.toDto(habit)).thenReturn(responseDTO);

        HabitResponseDTO result = habitService.createHabitForCurrentUser(request);

        assertThat(result.getName()).isEqualTo("Water");
        assertThat(habit.getUser()).isEqualTo(user);
        verify(habitRepository).save(habit);
    }

    @Test
    @DisplayName("toggleHabitCompletion should add completion when not present and remove when present")
    void toggleHabitCompletion_togglesState() {
        Habit habit = new Habit();
        habit.setId(5L);
        habit.setUser(user);

        when(habitRepository.findById(5L)).thenReturn(Optional.of(habit));
        when(habitCompletionRepository.findByHabitIdAndCompletionDate(habit.getId(), LocalDate.MIN))
                .thenReturn(Optional.empty());

        habitService.toggleHabitCompletion(habit.getId(), LocalDate.MIN);

        verify(habitCompletionRepository).save(any(HabitCompletion.class));

        HabitCompletion completion = new HabitCompletion();
        completion.setHabit(habit);
        completion.setCompletionDate(LocalDate.MIN);
        when(habitCompletionRepository.findByHabitIdAndCompletionDate(habit.getId(), LocalDate.MIN))
                .thenReturn(Optional.of(completion));

        habitService.toggleHabitCompletion(habit.getId(), LocalDate.MIN);

        verify(habitCompletionRepository).delete(completion);
    }

    @Test
    @DisplayName("Non-owner access should raise ResourceNotFoundException")
    void toggleHabitCompletion_wrongOwnerThrows() {
        Habit habit = new Habit();
        habit.setId(7L);
        User other = new User();
        other.setId(9L);
        habit.setUser(other);

        when(habitRepository.findById(7L)).thenReturn(Optional.of(habit));

        assertThrows(
                ResourceNotFoundException.class,
                () -> habitService.toggleHabitCompletion(7L, LocalDate.now()));

        verify(habitCompletionRepository, never())
                .findByHabitIdAndCompletionDate(any(Long.class), any(LocalDate.class));
    }

    @Test
    @DisplayName("getHabitsForCurrentUser should map entities to DTOs")
    void getHabitsForCurrentUser_returnsDtos() {
        Habit habit = new Habit();
        habit.setUser(user);

        HabitResponseDTO dto = new HabitResponseDTO();
        dto.setName("Stretch");

        when(habitRepository.findByUser(user)).thenReturn(Collections.singletonList(habit));
        when(habitMapper.toDtoList(Collections.singletonList(habit)))
                .thenReturn(Collections.singletonList(dto));

        var results = habitService.getHabitsForCurrentUser();

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getName()).isEqualTo("Stretch");
    }
}
