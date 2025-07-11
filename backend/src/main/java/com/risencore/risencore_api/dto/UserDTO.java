package com.risencore.risencore_api.dto;

import com.risencore.risencore_api.domain.Role;
import lombok.Data;
import java.util.Set;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Set<Role> roles;
}