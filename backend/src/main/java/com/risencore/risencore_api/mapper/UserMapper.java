package com.risencore.risencore_api.mapper;

import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.UserDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO userToUserDTO(User user);

    List<UserDTO> usersToUserDTOs(List<User> users);
}