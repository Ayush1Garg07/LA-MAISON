package com.lamaison.service;

import com.lamaison.dto.AuthDto;
import com.lamaison.entity.User;
import com.lamaison.repository.UserRepository;
import com.lamaison.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthDto.AuthResponse login(AuthDto.LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthDto.AuthResponse(token, toDto(user));
    }

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User.Role role;
        try {
            role = User.Role.valueOf(req.getRole());
        } catch (Exception e) {
            role = User.Role.customer;
        }

        User user = userRepo.save(User.builder()
            .name(req.getName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .role(role)
            .build());

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthDto.AuthResponse(token, toDto(user));
    }

    private AuthDto.UserDto toDto(User u) {
        return new AuthDto.UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole().name());
    }
}
