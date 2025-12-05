package com.risencore.risencore_api.mapper;

import com.risencore.risencore_api.domain.Transaction;
import com.risencore.risencore_api.dto.CreateTransactionDTO;
import com.risencore.risencore_api.dto.TransactionDTO;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    TransactionDTO toDto(Transaction transaction);

    List<TransactionDTO> toDtoList(List<Transaction> transactions);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Transaction toEntity(CreateTransactionDTO createTransactionDTO);
}
