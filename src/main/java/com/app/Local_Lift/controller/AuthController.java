package com.app.Local_Lift.controller;

import com.app.Local_Lift.dto.LoginRequest;
import com.app.Local_Lift.dto.SignupRequest;
import com.app.Local_Lift.model.User;
import com.app.Local_Lift.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public User signup(
            @RequestBody SignupRequest request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public User login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}