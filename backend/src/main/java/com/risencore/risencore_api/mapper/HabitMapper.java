package com.risencore.risencore_api.mapper;

import com.risencore.risencore_api.domain.Habit;
import com.risencore.risencore_api.domain.HabitCompletion;
import com.risencore.risencore_api.dto.CreateHabitDTO;
import com.risencore.risencore_api.dto.HabitResponseDTO;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface HabitMapper {

    @Mapping(target = "completionDates", ignore = true)
    @Mapping(target = "completedToday", ignore = true)
    HabitResponseDTO toDto(Habit habit);

    List<HabitResponseDTO> toDtoList(List<Habit> habits);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "completions", ignore = true)
    Habit toEntity(CreateHabitDTO createHabitDTO);

    @AfterMapping
    default void processCompletions(Habit habit, @MappingTarget HabitResponseDTO dto) {
        if (habit.getCompletions() == null || habit.getCompletions().isEmpty()) {
            dto.setCompletionDates(Collections.emptySet());
            dto.setCompletedToday(false);
            return;
        }

        Set<LocalDate> completionDates = habit.getCompletions().stream()
                .map(HabitCompletion::getCompletionDate)
                .collect(Collectors.toSet());

        dto.setCompletionDates(completionDates);

        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        boolean isCompletedToday = completionDates.contains(today);

        dto.setCompletedToday(isCompletedToday);
    }
}