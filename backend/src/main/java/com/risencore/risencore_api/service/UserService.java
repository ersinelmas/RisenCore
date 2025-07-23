package com.risencore.risencore_api.service;

import com.risencore.risencore_api.dto.ChangePasswordRequestDTO;
import com.risencore.risencore_api.dto.UserDTO;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    void changePassword(ChangePasswordRequestDTO request);
    void promoteUserToAdmin(String username);
    void demoteUserFromAdmin(String username);
    void deleteUser(Long userId);
}