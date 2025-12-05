package com.risencore.risencore_api.service;

import com.risencore.risencore_api.dto.CreateHabitDTO;
import com.risencore.risencore_api.dto.HabitResponseDTO;
import java.time.LocalDate;
import java.util.List;

public interface HabitService {
    List<HabitResponseDTO> getHabitsForCurrentUser();

    HabitResponseDTO createHabitForCurrentUser(CreateHabitDTO createDto);

    void toggleHabitCompletion(Long habitId, LocalDate date);

    void deleteHabit(Long habitId);
}
