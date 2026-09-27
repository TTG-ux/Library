package com.vladislav.library.dto;

import com.vladislav.library.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String tokenType;
    private Long userId;
    private String username;
    private Role role;
    private Long readerId;

    @Builder.Default
    private String tokenTypeDefault = "Bearer";
}
