package com.chatapp.auth.controller;

import com.chatapp.auth.dto.JwtResponse;
import com.chatapp.auth.dto.LoginRequest;
import com.chatapp.auth.dto.SignupRequest;
import com.chatapp.auth.model.User;
import com.chatapp.auth.service.AuthService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        User user = authService.registerUser(signUpRequest);
        return ResponseEntity.ok("User registered successfully!");
    }
}
