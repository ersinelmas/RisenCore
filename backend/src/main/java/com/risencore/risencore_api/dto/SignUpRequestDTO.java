package com.risencore.risencore_api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignUpRequestDTO {

    @NotBlank(message = "First name cannot be blank")
    @Size(max = 50)
    private String firstName;

    @NotBlank(message = "Last name cannot be blank")
    @Size(max = 50)
    private String lastName;

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Size(max = 50)
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, max = 40)
    private String password;
}