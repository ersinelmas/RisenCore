package com.risencore.risencore_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequestDTO {

    @NotBlank(message = "Current password cannot be blank")
    private String currentPassword;

    @NotBlank(message = "New password cannot be blank")
    @Size(min = 6, max = 40, message = "New password must be between 6 and 40 characters")
    private String newPassword;

    @NotBlank(message = "Confirmation password cannot be blank")
    private String confirmationPassword;
}
