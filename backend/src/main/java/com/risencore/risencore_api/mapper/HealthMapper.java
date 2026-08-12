package com.risencore.risencore_api.mapper;

import com.risencore.risencore_api.domain.HealthMetric;
import com.risencore.risencore_api.dto.HealthMetricDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface HealthMapper {

    HealthMapper INSTANCE = Mappers.getMapper(HealthMapper.class);

    HealthMetricDTO healthMetricToHealthMetricDTO(HealthMetric metric);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    HealthMetric healthMetricDTOToHealthMetric(HealthMetricDTO dto);
}
