package com.vladislav.library.controller;

import com.vladislav.library.dto.AuthResponseDTO;
import com.vladislav.library.dto.LoginRequestDTO;
import com.vladislav.library.dto.RegisterRequestDTO;
import com.vladislav.library.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;



@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request) {
        try {
            authService.register(
                    request.getUsername(),
                    request.getPassword(),
                    request.getRole()
            );
            return ResponseEntity.ok(Map.of(
                    "message", "Регистрация успешна",
                    "success", true
            ));
        } catch (RuntimeException e) {
            log.error("Ошибка регистрации: {}", e.getMessage());
            return ResponseEntity.status(409).body(Map.of(
                    "error", "Пользователь уже существует",
                    "message", e.getMessage(),
                    "success", false
            ));
        } catch (Exception e) {
            log.error("Непредвиденная ошибка: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Ошибка валидации",
                    "message", e.getMessage(),
                    "success", false
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {
        try {
            AuthResponseDTO response = authService.login(
                    request.getUsername(),
                    request.getPassword()
            );
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            log.warn("Неверные учётные данные для: {}", request.getUsername());
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Неверный логин или пароль",
                    "message", "Проверьте правильность введённых данных",
                    "success", false
            ));
        } catch (Exception e) {
            log.error("Ошибка входа: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Ошибка аутентификации",
                    "message", e.getMessage(),
                    "success", false
            ));
        }
    }
}
