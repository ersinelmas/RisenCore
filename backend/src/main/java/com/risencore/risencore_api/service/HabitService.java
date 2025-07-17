package com.risencore.risencore_api.service;

import com.risencore.risencore_api.dto.CreateHabitDTO;
import com.risencore.risencore_api.dto.HabitDTO;

import java.time.LocalDate;
import java.util.List;

public interface HabitService {
    List<HabitDTO> getHabitsForCurrentUser();
    HabitDTO createHabitForCurrentUser(CreateHabitDTO createDto);
    void toggleHabitCompletion(Long habitId, LocalDate date);
    void deleteHabit(Long habitId);
}