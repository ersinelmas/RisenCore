package com.risencore.risencore_api.mapper;

import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.UserDTO;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO userToUserDTO(User user);

    List<UserDTO> usersToUserDTOs(List<User> users);
}
