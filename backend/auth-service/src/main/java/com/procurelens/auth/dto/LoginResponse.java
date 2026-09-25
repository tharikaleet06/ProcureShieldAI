package com.procurelens.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private boolean success;
    private String token;
    private String message;
    private UserDto user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private String id;
        private String name;
        private String email;
        private String role;
        private String roleTitle;
        private String department;
        private String avatarInitials;
        private List<String> permissions;
    }
}
