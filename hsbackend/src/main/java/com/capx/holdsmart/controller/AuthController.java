package com.capx.holdsmart.controller;

import com.capx.holdsmart.util.JwtUtil;
import com.capx.holdsmart.model.User;
import com.capx.holdsmart.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder PasswordEncoder;

    @Autowired
    private UserRepo UserRepo;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> userData) {
        String email = userData.get("email");
        String password = userData.get("password");

        try {
            Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );
            System.out.println("Authentication successful");
            
            String token = jwtUtil.generateToken(authenticate.getName());
            return ResponseEntity.ok(token);
    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Map<String, String> userData) {
        String email = userData.get("email");
        String password = userData.get("password");
        String confirmPassword = userData.get("confirmPassword");
    
        try {
            if (UserRepo.findByEmail(email) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already registered");
            }
            if (!password.equals(confirmPassword)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match");
            }
            String hashedPassword = PasswordEncoder.encode(password);
            
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPassword(hashedPassword);
            UserRepo.save(newUser);
    
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during registration");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logged out successfully.");
    }

}