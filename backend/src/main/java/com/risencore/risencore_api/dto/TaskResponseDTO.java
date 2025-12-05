package com.risencore.risencore_api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Data // Lombok: @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor
public class TaskResponseDTO {
    private Long id;
    private String description;
    private boolean completed;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
