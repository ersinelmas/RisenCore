package com.risencore.risencore_api.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB auto-increment
    private Long id;

    @Column(nullable = false, length = 200)
    private String description;

    @Column(nullable = false)
    private boolean completed = false;

    private LocalDate dueDate; // Optional

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist // Runs before a new entity is persisted
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate // Runs before an existing entity is updated
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
