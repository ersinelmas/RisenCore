package com.risencore.risencore_api.repository;

import com.risencore.risencore_api.domain.Transaction;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.CategoryExpenseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);

    @Query("SELECT new com.risencore.risencore_api.dto.CategoryExpenseDTO(t.category, SUM(t.amount)) " +
            "FROM Transaction t " +
            "WHERE t.user.id = :userId AND t.type = 'EXPENSE' " +
            "GROUP BY t.category " +
            "ORDER BY SUM(t.amount) DESC")
    List<CategoryExpenseDTO> findExpenseSummaryByCategory(@Param("userId") Long userId);
    List<Transaction> findByUserAndTransactionDateAfter(User user, LocalDate date);
}