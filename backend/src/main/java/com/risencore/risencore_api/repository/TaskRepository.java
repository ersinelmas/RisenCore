package com.risencore.risencore_api.repository;

import com.risencore.risencore_api.domain.Task;
import com.risencore.risencore_api.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId);
    List<Task> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Task> findByUserAndCreatedAtAfter(User user, LocalDateTime date);
}