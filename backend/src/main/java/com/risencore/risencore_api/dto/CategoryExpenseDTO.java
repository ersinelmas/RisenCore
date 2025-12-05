package com.risencore.risencore_api.dto;

import com.risencore.risencore_api.domain.Category;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryExpenseDTO {
    private Category category;
    private BigDecimal totalAmount;
}
