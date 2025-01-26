package com.capx.holdsmart.service;

import com.capx.holdsmart.model.User;
import com.capx.holdsmart.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.Collections;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo UserRepo;

    public UserServiceImpl(UserRepo UserRepo) {
        this.UserRepo = UserRepo;
    }

    @Override
    public ResponseEntity<User> saveUser(User user) {
        try{
            return ResponseEntity.created(URI.create("/users/" + user.getId())).body(UserRepo.save(user));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @Override
    public ResponseEntity<User> getUser(Long id) {
        try {
            return ResponseEntity.ok(UserRepo.findById(id).get());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<List<User>> getAllUsers() {
        try{
            return ResponseEntity.ok(UserRepo.findAll());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @Override
    public ResponseEntity<String> deleteUser(Long id) {
        try{
            UserRepo.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    @Override
    public ResponseEntity<User> updateUser(Long id, User user) {
        try{
            return ResponseEntity.ok(UserRepo.save(user));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = UserRepo.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        System.out.println("User found: " + user.getEmail());
        
        return new org.springframework.security.core.userdetails.User(
            user.getEmail(), 
            user.getPassword(), 
            Collections.emptyList()
        );
    }
}
