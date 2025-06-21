package com.risencore.risencore_api.repository;

import com.risencore.risencore_api.domain.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Marks this interface as a Spring Data repository and a Spring managed bean
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Spring Data JPA will automatically implement basic CRUD operations:
    // - save(Task entity)
    // - findById(Long id)
    // - findAll()
    // - deleteById(Long id)
    // - and more...

    // You can also define custom query methods here following Spring Data's naming conventions.
    // For example, to find all tasks that are not completed:
    // List<Task> findByCompletedFalse();

    // Or to find tasks by description containing a certain string:
    // List<Task> findByDescriptionContainingIgnoreCase(String keyword);
}