package com.procurelens.auth.service;

import com.procurelens.auth.dto.LoginRequest;
import com.procurelens.auth.dto.LoginResponse;
import com.procurelens.auth.model.UserAccount;
import com.procurelens.auth.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;

    @Autowired
    public AuthService(@Autowired(required = false) UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public LoginResponse authenticate(LoginRequest loginRequest) {
        String email = loginRequest.getEmail() != null ? loginRequest.getEmail().trim() : "";
        String requestedRole = loginRequest.getRole();

        UserAccount account = null;
        if (userAccountRepository != null && !email.isEmpty()) {
            Optional<UserAccount> dbUser = userAccountRepository.findByEmail(email);
            if (dbUser.isPresent()) {
                account = dbUser.get();
            }
        }

        String role = requestedRole != null ? requestedRole : "ROLE_AUDITOR";
        String name = "Enterprise User";
        String roleTitle = "Forensic Investigator";
        String department = "Internal Audit & Vigilance Unit";
        String avatarInitials = "EU";

        if (email.contains("admin")) {
            role = "ROLE_ADMIN";
            name = "System Administrator";
            roleTitle = "System-Level Administrator";
            department = "IT Governance & System Administration";
            avatarInitials = "AD";
        } else if (email.contains("rahul") || email.contains("procurement") || email.contains("manager")) {
            role = "ROLE_PROCUREMENT_MANAGER";
            name = "Rahul Sharma";
            roleTitle = "Procurement Manager";
            department = "Procurement & Supply Chain Operations";
            avatarInitials = "RS";
        } else {
            role = "ROLE_AUDITOR";
            name = "Vikramaditya Sen";
            roleTitle = "Forensic Auditor";
            department = "Fraud Investigation & Forensic Audit Unit";
            avatarInitials = "VS";
        }

        if (account != null) {
            name = account.getUsername();
            role = account.getRole();
            roleTitle = account.getRoleTitle();
            department = account.getDepartment();
            avatarInitials = name.length() >= 2 ? name.substring(0, 2).toUpperCase() : "US";
        }

        List<String> permissions = getPermissionsForRole(role);

        LoginResponse.UserDto userDto = LoginResponse.UserDto.builder()
            .id(account != null ? account.getId() : "USR-" + System.currentTimeMillis())
            .name(name)
            .email(email.isEmpty() ? "admin@company.com" : email)
            .role(role)
            .roleTitle(roleTitle)
            .department(department)
            .avatarInitials(avatarInitials)
            .permissions(permissions)
            .build();

        String token = "jwt-procurelens-" + role.toLowerCase().replace("role_", "") + "-" + UUID.randomUUID().toString().substring(0, 8);

        return LoginResponse.builder()
            .success(true)
            .token(token)
            .user(userDto)
            .build();
    }

    public List<String> getPermissionsForRole(String role) {
        if (role == null) return List.of();

        switch (role) {
            case "ROLE_ADMIN":
                return Arrays.asList(
                    "PERM_DASHBOARD_FULL", "PERM_MANAGE_USERS", "PERM_MANAGE_ROLES",
                    "PERM_VENDORS_FULL", "PERM_PO_FULL", "PERM_INVOICES_FULL",
                    "PERM_TRANSACTIONS_FULL", "PERM_AI_VIEW", "PERM_FLAGGED_VIEW",
                    "PERM_RISK_VIEW", "PERM_EVIDENCE_VIEW", "PERM_REPORTS_FULL",
                    "PERM_ACTIVITY_FULL"
                );
            case "ROLE_PROCUREMENT_MANAGER":
                return Arrays.asList(
                    "PERM_DASHBOARD_PROCUREMENT", "PERM_VENDORS_OPERATIONS",
                    "PERM_PO_OPERATIONS", "PERM_INVOICES_OPERATIONS",
                    "PERM_TRANSACTIONS_OPERATIONS", "PERM_AI_SUBMIT",
                    "PERM_FLAGGED_STATUS_VIEW", "PERM_RISK_VIEW",
                    "PERM_EVIDENCE_LIMITED", "PERM_REPORTS_PROCUREMENT",
                    "PERM_ACTIVITY_OWN_PROCUREMENT"
                );
            case "ROLE_AUDITOR":
                return Arrays.asList(
                    "PERM_DASHBOARD_INVESTIGATION", "PERM_VENDORS_VIEW",
                    "PERM_PO_VIEW", "PERM_INVOICES_VIEW", "PERM_TRANSACTIONS_INVESTIGATE",
                    "PERM_AI_RESULTS_VIEW", "PERM_FLAGGED_INVESTIGATE", "PERM_RISK_VIEW",
                    "PERM_EVIDENCE_FULL", "PERM_INVESTIGATION_MANAGE",
                    "PERM_NOTES_ADD_EDIT", "PERM_DECISION_RESOLVE",
                    "PERM_DECISION_ESCALATE", "PERM_REPORTS_INVESTIGATION",
                    "PERM_ACTIVITY_OWN_INVESTIGATION"
                );
            default:
                return List.of();
        }
    }

    public Optional<UserAccount> findByEmail(String email) {
        if (userAccountRepository == null || email == null) return Optional.empty();
        return userAccountRepository.findByEmail(email);
    }

    public UserAccount saveUser(UserAccount account) {
        if (userAccountRepository == null) return account;
        return userAccountRepository.save(account);
    }
}
