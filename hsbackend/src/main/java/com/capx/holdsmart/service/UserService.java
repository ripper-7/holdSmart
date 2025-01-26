package com.capx.holdsmart.service;

import com.capx.holdsmart.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
public interface UserService {
    public ResponseEntity<User> saveUser(User user);
    public ResponseEntity<User> getUser(Long id);
    public ResponseEntity<List<User>> getAllUsers();
    public ResponseEntity<String> deleteUser(Long id);
    public ResponseEntity<User> updateUser(Long id, User user);
    public UserDetails loadUserByUsername(String email);
}
