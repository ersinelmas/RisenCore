package com.risencore.risencore_api.mapper;

import com.risencore.risencore_api.domain.Task;
import com.risencore.risencore_api.dto.CreateTaskRequestDTO;
import com.risencore.risencore_api.dto.TaskResponseDTO;
import com.risencore.risencore_api.dto.UpdateTaskRequestDTO;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TaskMapper {

    TaskMapper INSTANCE = Mappers.getMapper(TaskMapper.class);

    TaskResponseDTO taskToTaskResponseDTO(Task task);

    Task createTaskRequestDTOToTask(CreateTaskRequestDTO createTaskRequestDTO);

    void updateTaskFromUpdateTaskRequestDTO(
            UpdateTaskRequestDTO updateTaskRequestDTO, @MappingTarget Task task);
}
