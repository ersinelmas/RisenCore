package com.risencore.risencore_api.service;

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
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HabitServiceImpl implements HabitService {

    private final HabitRepository habitRepository;
    private final HabitCompletionRepository habitCompletionRepository;
    private final UserRepository userRepository;
    private final HabitMapper habitMapper;

    @Override
    @Transactional(readOnly = true)
    public List<HabitResponseDTO> getHabitsForCurrentUser() {
        User currentUser = getCurrentUser();
        List<Habit> habits = habitRepository.findByUser(currentUser);
        return habitMapper.toDtoList(habits);
    }

    @Override
    @Transactional
    public HabitResponseDTO createHabitForCurrentUser(CreateHabitDTO createDto) {
        User currentUser = getCurrentUser();
        Habit habit = habitMapper.toEntity(createDto);
        habit.setUser(currentUser);
        return habitMapper.toDto(habitRepository.save(habit));
    }

    @Override
    @Transactional
    public void toggleHabitCompletion(Long habitId, LocalDate date) {
        User currentUser = getCurrentUser();
        Habit habit = findHabitByIdAndEnsureOwnership(habitId, currentUser);

        Optional<HabitCompletion> existingCompletion = habitCompletionRepository.findByHabitIdAndCompletionDate(habitId, date);

        if (existingCompletion.isPresent()) {
            // If already completed, remove the completion (toggle off)
            habitCompletionRepository.delete(existingCompletion.get());
        } else {
            // If not completed, add a new completion (toggle on)
            HabitCompletion newCompletion = new HabitCompletion();
            newCompletion.setHabit(habit);
            newCompletion.setCompletionDate(date);
            habitCompletionRepository.save(newCompletion);
        }
    }

    @Override
    @Transactional
    public void deleteHabit(Long habitId) {
        User currentUser = getCurrentUser();
        Habit habit = findHabitByIdAndEnsureOwnership(habitId, currentUser);
        habitRepository.delete(habit);
    }

    private Habit findHabitByIdAndEnsureOwnership(Long habitId, User user) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new ResourceNotFoundException("Habit", "id", habitId));
        if (!habit.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Habit", "id", habitId);
        }
        return habit;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Current user not found in database"));
    }
}