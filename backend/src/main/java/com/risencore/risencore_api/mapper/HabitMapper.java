package com.risencore.risencore_api.mapper;

import com.risencore.risencore_api.domain.Habit;
import com.risencore.risencore_api.domain.HabitCompletion;
import com.risencore.risencore_api.dto.CreateHabitDTO;
import com.risencore.risencore_api.dto.HabitDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface HabitMapper {

    @Mapping(target = "completionDates", source = "completions", qualifiedByName = "completionsToDates")
    HabitDTO toDto(Habit habit);

    List<HabitDTO> toDtoList(List<Habit> habits);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "completions", ignore = true)
    Habit toEntity(CreateHabitDTO createHabitDTO);

    @Named("completionsToDates")
    default Set<LocalDate> completionsToDates(List<HabitCompletion> completions) {
        if (completions == null) {
            return Set.of();
        }
        return completions.stream()
                .map(HabitCompletion::getCompletionDate)
                .collect(Collectors.toSet());
    }
}