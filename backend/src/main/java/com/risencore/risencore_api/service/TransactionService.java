package com.risencore.risencore_api.service;

import com.risencore.risencore_api.dto.CategoryExpenseDTO;
import com.risencore.risencore_api.dto.CreateTransactionDTO;
import com.risencore.risencore_api.dto.TransactionDTO;
import java.util.List;

public interface TransactionService {
    List<TransactionDTO> getTransactionsForCurrentUser();

    TransactionDTO createTransactionForCurrentUser(CreateTransactionDTO createDto);

    List<CategoryExpenseDTO> getExpenseSummaryByCategoryForCurrentUser();

    void deleteTransaction(Long transactionId);
}
