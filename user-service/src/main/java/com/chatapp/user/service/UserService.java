package com.chatapp.user.service;

import com.chatapp.user.model.UserProfile;
import com.chatapp.user.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    public UserProfile createUserProfile(String username, String email) {
        UserProfile profile = new UserProfile(username, email);
        return userProfileRepository.save(profile);
    }

    public Optional<UserProfile> getUserProfile(Long id) {
        return userProfileRepository.findById(id);
    }

    public Optional<UserProfile> getUserProfileByUsername(String username) {
        return userProfileRepository.findByUsername(username);
    }

    public UserProfile updateUserProfile(UserProfile profile) {
        return userProfileRepository.save(profile);
    }

    public List<UserProfile> getOnlineUsers() {
        return userProfileRepository.findByIsOnlineTrue();
    }

    public List<UserProfile> searchUsers(String username) {
        return userProfileRepository.findByUsernameContainingIgnoreCase(username);
    }

    public void setUserOnline(Long userId) {
        Optional<UserProfile> profile = userProfileRepository.findById(userId);
        if (profile.isPresent()) {
            UserProfile userProfile = profile.get();
            userProfile.setOnline(true);
            userProfile.setLastSeen(LocalDateTime.now());
            userProfileRepository.save(userProfile);
        }
    }

    public void setUserOffline(Long userId) {
        Optional<UserProfile> profile = userProfileRepository.findById(userId);
        if (profile.isPresent()) {
            UserProfile userProfile = profile.get();
            userProfile.setOnline(false);
            userProfile.setLastSeen(LocalDateTime.now());
            userProfileRepository.save(userProfile);
        }
    }
}
