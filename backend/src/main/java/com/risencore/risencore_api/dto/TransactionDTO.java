package com.risencore.risencore_api.dto;

import com.risencore.risencore_api.domain.Category;
import com.risencore.risencore_api.domain.TransactionType;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionDTO {
    private Long id;
    private String description;
    private BigDecimal amount;
    private TransactionType type;
    private Category category;
    private LocalDate transactionDate;
}