package com.procurelens.auth.controller;

import com.procurelens.auth.dto.LoginRequest;
import com.procurelens.auth.dto.LoginResponse;
import com.procurelens.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Authentication & RBAC", description = "Enterprise identity, credential verification, and role-based access control (RBAC)")
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(
        summary = "Authenticate user & issue JWT token",
        description = "Authenticates user credentials against the MySQL relational user registry and returns a signed JWT token with assigned enterprise permissions."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Authentication successful", 
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponse.class))),
        @ApiResponse(responseCode = "401", description = "Invalid credentials or account inactive", content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(response);
    }
}
