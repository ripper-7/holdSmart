package com.capx.holdsmart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.capx.holdsmart.model.User;
import com.capx.holdsmart.repository.UserRepo;

@Service
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepo userRepo;

    // this method authenticates the user and returns a JWT token
    public String authenticate(String email, String rawPassword) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new BadCredentialsException("Email not registered");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, rawPassword)
        );
        return "JWT_TOKEN";
    }
}
