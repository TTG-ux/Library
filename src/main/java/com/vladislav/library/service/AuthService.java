package com.vladislav.library.service;

import com.vladislav.library.dto.AuthResponseDTO;
import com.vladislav.library.enums.Role;
import com.vladislav.library.models.Reader;
import com.vladislav.library.models.User;
import com.vladislav.library.repository.ReaderRepository;
import com.vladislav.library.repository.UserRepository;
import com.vladislav.library.security.CustomUserDetails;
import com.vladislav.library.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final ReaderRepository readerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public User register(String username, String password, Role role) {
        log.info("Регистрация пользователя: {}", username);

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Пользователь с таким логином уже существует");
        }

        User user = User.builder()
                .username(username.trim())
                .password(passwordEncoder.encode(password))
                .role(role)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        if (role == Role.READER) {
            Reader reader = Reader.builder()
                    .user(user)
                    .firstName("Не указано")
                    .lastName("Не указано")
                    .email(username.trim() + "@library.com")
                    .phone("0000000000")
                    .registrationDate(LocalDate.now())
                    .build();
            readerRepository.save(reader);
        }

        log.info("Пользователь зарегистрирован: {}", username);
        return user;
    }

    public AuthResponseDTO login(String username, String password) {
        log.info("Попытка входа пользователя: {}", username);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username.trim(), password)
        );

        String token = tokenProvider.generateToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // Обновляем время последнего входа
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        log.info("Пользователь вошёл: {}", username);

        return AuthResponseDTO.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(userDetails.getId())
                .username(userDetails.getUsername())
                .role(userDetails.getRole())
                .readerId(userDetails.getReaderId())
                .build();
    }
}
