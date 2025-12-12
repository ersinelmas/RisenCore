package com.risencore.risencore_api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.risencore.risencore_api.domain.Role;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.dto.ChangePasswordRequestDTO;
import com.risencore.risencore_api.dto.UserDTO;
import com.risencore.risencore_api.exception.ResourceNotFoundException;
import com.risencore.risencore_api.mapper.UserMapper;
import com.risencore.risencore_api.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock private UserRepository userRepository;

    @Mock private UserMapper userMapper;

    @Mock private PasswordEncoder passwordEncoder;

    @Mock private SecurityContext securityContext;

    @Mock private Authentication authentication;

    @InjectMocks private UserServiceImpl userService;

    private User currentUser;

    @BeforeEach
    void setUp() {
        currentUser = new User();
        currentUser.setId(1L);
        currentUser.setUsername("jane");
        currentUser.setPassword("encoded");
        currentUser.setRoles(List.of(Role.USER));

        when(authentication.getName()).thenReturn(currentUser.getUsername());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.findByUsername(currentUser.getUsername()))
                .thenReturn(Optional.of(currentUser));
    }

    @Test
    @DisplayName("getAllUsers should map entities to DTOs")
    void getAllUsers_mapsDtos() {
        UserDTO dto = new UserDTO();
        dto.setUsername("jane");

        when(userRepository.findAll()).thenReturn(List.of(currentUser));
        when(userMapper.usersToUserDTOs(List.of(currentUser))).thenReturn(List.of(dto));

        List<UserDTO> results = userService.getAllUsers();

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getUsername()).isEqualTo("jane");
    }

    @Test
    @DisplayName("changePassword should validate current password and confirmation")
    void changePassword_validatesInput() {
        ChangePasswordRequestDTO request = new ChangePasswordRequestDTO();
        request.setCurrentPassword("old");
        request.setNewPassword("newPass");
        request.setConfirmationPassword("newPass");

        when(passwordEncoder.matches("old", currentUser.getPassword())).thenReturn(true);
        when(passwordEncoder.encode("newPass")).thenReturn("encodedNew");

        userService.changePassword(request);

        verify(userRepository).save(currentUser);
        assertThat(currentUser.getPassword()).isEqualTo("encodedNew");
    }

    @Test
    @DisplayName("changePassword should throw when current password mismatch")
    void changePassword_wrongCurrentPassword() {
        ChangePasswordRequestDTO request = new ChangePasswordRequestDTO();
        request.setCurrentPassword("wrong");
        request.setNewPassword("newPass");
        request.setConfirmationPassword("newPass");

        when(passwordEncoder.matches("wrong", currentUser.getPassword())).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> userService.changePassword(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("changePassword should throw when confirmation does not match")
    void changePassword_confirmationMismatch() {
        ChangePasswordRequestDTO request = new ChangePasswordRequestDTO();
        request.setCurrentPassword("old");
        request.setNewPassword("newPass");
        request.setConfirmationPassword("different");

        when(passwordEncoder.matches("old", currentUser.getPassword())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> userService.changePassword(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("promoteUserToAdmin should add ADMIN role")
    void promoteUserToAdmin_addsRole() {
        User target = new User();
        target.setUsername("target");
        target.setRoles(List.of(Role.USER));

        when(userRepository.findByUsername("target")).thenReturn(Optional.of(target));

        userService.promoteUserToAdmin("target");

        assertThat(target.getRoles()).contains(Role.ADMIN);
        verify(userRepository).save(target);
    }

    @Test
    @DisplayName("deleteUser should prevent deleting self and require existence")
    void deleteUser_selfDeleteAndMissingUser() {
        assertThrows(IllegalArgumentException.class, () -> userService.deleteUser(currentUser.getId()));

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.deleteUser(99L));
    }
}
