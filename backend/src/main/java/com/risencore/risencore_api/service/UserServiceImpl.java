package com.risencore.risencore_api.service;

import com.risencore.risencore_api.dto.UserDTO;
import com.risencore.risencore_api.mapper.UserMapper;
import com.risencore.risencore_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userMapper.usersToUserDTOs(userRepository.findAll());
    }
}