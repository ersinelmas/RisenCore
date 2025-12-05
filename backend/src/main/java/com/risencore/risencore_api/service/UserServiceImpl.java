package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.Role;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.ChangePasswordRequestDTO;
import com.risencore.risencore_api.dto.UserDTO;
import com.risencore.risencore_api.exception.ResourceNotFoundException;
import com.risencore.risencore_api.mapper.UserMapper;
import com.risencore.risencore_api.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userMapper.usersToUserDTOs(userRepository.findAll());
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequestDTO request) {
        // 1. Get the username of the currently authenticated user in a safe way.
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser =
                userRepository
                        .findByUsername(currentUsername)
                        .orElseThrow(
                                () ->
                                        new IllegalStateException(
                                                "Authenticated user not found in database"));

        // 2. Check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new IllegalArgumentException("Wrong current password");
        }

        // 3. Check if the new passwords match
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalArgumentException(
                    "New password and confirmation password do not match");
        }

        // 4. Set the new password (encoded) and save the user
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }

    @Override
    @Transactional
    public void promoteUserToAdmin(String username) {
        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "User not found with username: " + username));

        user.getRoles().add(Role.ADMIN);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void demoteUserFromAdmin(String username) {
        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "User not found with username: " + username));

        if (!user.getRoles().contains(Role.ADMIN)) {
            throw new IllegalArgumentException("User is not an admin");
        }

        user.getRoles().remove(Role.ADMIN);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser =
                userRepository
                        .findByUsername(currentUsername)
                        .orElseThrow(
                                () ->
                                        new IllegalStateException(
                                                "Current admin user not found in database"));

        if (currentUser.getId().equals(userId)) {
            throw new IllegalArgumentException("Admin cannot delete their own account.");
        }

        // Use findById to ensure the user exists before attempting to delete
        User userToDelete =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        userRepository.delete(userToDelete);
    }

    @Override
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository
                .findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Current user not found in database"));
    }
}
