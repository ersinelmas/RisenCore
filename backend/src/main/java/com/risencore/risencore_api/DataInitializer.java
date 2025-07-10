package com.risencore.risencore_api;

import com.risencore.risencore_api.domain.Role;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createAdminUser();
        createTestUser();
    }

    private void createAdminUser() {
        // Create an ADMIN user if one doesn't exist
        if (userRepository.findByUsername("adminuser").isEmpty()) {
            User admin = new User();
            admin.setUsername("adminuser");
            admin.setEmail("admin@risencore.com");
            admin.setPassword(passwordEncoder.encode("adminpass"));
            admin.setRoles(Set.of(Role.ADMIN, Role.USER));
            userRepository.save(admin);
            System.out.println(">>> Created ADMIN user");
        }
    }

    private void createTestUser() {
        // Create a regular USER if one doesn't exist
        if (userRepository.findByUsername("testuser").isEmpty()) {
            User user = new User();
            user.setUsername("testuser");
            user.setEmail("user@risencore.com");
            user.setPassword(passwordEncoder.encode("userpass"));
            user.setRoles(Set.of(Role.USER));
            userRepository.save(user);
            System.out.println(">>> Created TEST user");
        }
    }
}