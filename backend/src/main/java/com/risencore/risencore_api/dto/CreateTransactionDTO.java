package com.risencore.risencore_api.dto;

import com.risencore.risencore_api.domain.Category;
import com.risencore.risencore_api.domain.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

@Data
public class CreateTransactionDTO {
    @NotBlank private String description;

    @NotNull
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull private TransactionType type;

    @NotNull private Category category;

    @NotNull private LocalDate transactionDate;
}
