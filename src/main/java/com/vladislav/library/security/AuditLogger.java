package com.vladislav.library.security;


import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AuditLogger {

    public void logAction(String action, String details) {
        String username = getCurrentUsername();
        log.info("AUDIT | Пользователь: {} | Действие: {} | Детали: {}",
                username, action, details);
    }

    public void logCriticalAction(String action, String details) {
        String username = getCurrentUsername();
        log.warn("AUDIT_CRITICAL | Пользователь: {} | Действие: {} | Детали: {}",
                username, action, details);
    }

    private String getCurrentUsername() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null ? authentication.getName() : "anonymous";
    }
}
