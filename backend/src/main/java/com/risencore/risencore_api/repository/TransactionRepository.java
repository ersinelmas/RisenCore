package com.risencore.risencore_api.repository;

import com.risencore.risencore_api.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Find all transactions for a specific user, ordered by date descending
    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);
}