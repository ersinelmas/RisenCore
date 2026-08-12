package com.risencore.risencore_api.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "health_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HealthMetricType type;

    // Backtick-quoted: "value" is a reserved word in H2 (used in tests), though not in
    // PostgreSQL. Hibernate auto-translates backticks to the correct quoting per dialect.
    @Column(name = "`value`", nullable = false)
    private Double value;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false)
    private LocalDate date;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
