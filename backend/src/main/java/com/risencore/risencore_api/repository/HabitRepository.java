package com.risencore.risencore_api.repository;

import com.risencore.risencore_api.domain.Habit;
import com.risencore.risencore_api.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {

    @EntityGraph(attributePaths = "completions")
    List<Habit> findByUser(User user);
}
