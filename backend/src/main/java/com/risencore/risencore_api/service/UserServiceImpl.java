package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.ChangePasswordRequestDTO;
import com.risencore.risencore_api.dto.UserDTO;
import com.risencore.risencore_api.mapper.UserMapper;
import com.risencore.risencore_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        // 1. Get the currently authenticated user
        var principal = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) principal.getPrincipal();

        // 2. Check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new IllegalStateException("Wrong current password");
        }

        // 3. Check if the new passwords match
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("New password and confirmation password do not match");
        }

        // 4. Set the new password (encoded) and save the user
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }
}