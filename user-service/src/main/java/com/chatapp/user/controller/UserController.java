package com.chatapp.user.controller;

import com.chatapp.user.model.UserProfile;
import com.chatapp.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable Long id) {
        Optional<UserProfile> profile = userService.getUserProfile(id);
        return profile.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserProfile> getUserProfileByUsername(@PathVariable String username) {
        Optional<UserProfile> profile = userService.getUserProfileByUsername(username);
        return profile.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfile> updateUserProfile(@PathVariable Long id,
                                                        @RequestBody UserProfile profile) {
        profile.setId(id);
        UserProfile updatedProfile = userService.updateUserProfile(profile);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/online")
    public ResponseEntity<List<UserProfile>> getOnlineUsers() {
        List<UserProfile> onlineUsers = userService.getOnlineUsers();
        return ResponseEntity.ok(onlineUsers);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserProfile>> searchUsers(@RequestParam String username) {
        List<UserProfile> users = userService.searchUsers(username);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/{id}/online")
    public ResponseEntity<String> setUserOnline(@PathVariable Long id) {
        userService.setUserOnline(id);
        return ResponseEntity.ok("User set to online");
    }

    @PostMapping("/{id}/offline")
    public ResponseEntity<String> setUserOffline(@PathVariable Long id) {
        userService.setUserOffline(id);
        return ResponseEntity.ok("User set to offline");
    }
}
