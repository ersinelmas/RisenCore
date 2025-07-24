package com.risencore.risencore_api.repository;

import com.risencore.risencore_api.domain.Habit;
import com.risencore.risencore_api.domain.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {

    @EntityGraph(attributePaths = "completions")
    List<Habit> findByUser(User user);
}