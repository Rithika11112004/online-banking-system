package com.banking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    // Note: In real applications, avoid returning passwords in DTOs. 
    // This is included here simply to receive it during registration.
    private String password;
}
