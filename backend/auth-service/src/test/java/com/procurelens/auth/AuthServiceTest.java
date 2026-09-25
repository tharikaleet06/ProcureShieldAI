package com.procurelens.auth;

import com.procurelens.auth.dto.LoginRequest;
import com.procurelens.auth.dto.LoginResponse;
import com.procurelens.auth.model.UserAccount;
import com.procurelens.auth.repository.UserAccountRepository;
import com.procurelens.auth.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class AuthServiceTest {

    private UserAccountRepository userAccountRepository;
    private AuthService authService;

    @BeforeEach
    public void setUp() {
        userAccountRepository = Mockito.mock(UserAccountRepository.class);
        authService = new AuthService(userAccountRepository);
    }

    @Test
    public void testAuthenticateAdminRole() {
        LoginRequest request = LoginRequest.builder()
            .email("admin@company.com")
            .password("admin123")
            .build();

        LoginResponse response = authService.authenticate(request);

        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertNotNull(response.getToken());
        assertEquals("ROLE_ADMIN", response.getUser().getRole());
        assertTrue(response.getUser().getPermissions().contains("PERM_DASHBOARD_FULL"));
        assertTrue(response.getUser().getPermissions().contains("PERM_MANAGE_USERS"));
    }

    @Test
    public void testAuthenticateAuditorRole() {
        LoginRequest request = LoginRequest.builder()
            .email("auditor@company.com")
            .password("audit123")
            .build();

        LoginResponse response = authService.authenticate(request);

        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("ROLE_AUDITOR", response.getUser().getRole());
        assertTrue(response.getUser().getPermissions().contains("PERM_INVESTIGATION_FULL"));
        assertTrue(response.getUser().getPermissions().contains("PERM_DECISION_RESOLVE"));
    }

    @Test
    public void testAuthenticateProcurementManagerRole() {
        LoginRequest request = LoginRequest.builder()
            .email("rahul@company.com")
            .password("procure123")
            .build();

        LoginResponse response = authService.authenticate(request);

        assertNotNull(response);
        assertEquals("ROLE_PROCUREMENT_MANAGER", response.getUser().getRole());
        assertTrue(response.getUser().getPermissions().contains("PERM_PO_MANAGE"));
        assertTrue(response.getUser().getPermissions().contains("PERM_INVOICE_SUBMIT"));
    }

    @Test
    public void testAuthenticateWithDatabaseUser() {
        UserAccount dbAccount = new UserAccount(
            "USR-DB-101",
            "Custom Auditor",
            "custom@company.com",
            "hash123",
            "ROLE_AUDITOR",
            "Lead Auditor",
            "Vigilance Cell",
            true,
            null
        );

        when(userAccountRepository.findByEmail("custom@company.com"))
            .thenReturn(Optional.of(dbAccount));

        LoginRequest request = LoginRequest.builder()
            .email("custom@company.com")
            .password("secret")
            .build();

        LoginResponse response = authService.authenticate(request);

        assertNotNull(response);
        assertEquals("Custom Auditor", response.getUser().getName());
        assertEquals("ROLE_AUDITOR", response.getUser().getRole());
    }
}
