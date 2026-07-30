package com.university.lostfound.controller;

import com.university.lostfound.dto.ApiResponse;
import com.university.lostfound.dto.ChangePasswordRequest;
import com.university.lostfound.dto.UpdateProfileRequest;
import com.university.lostfound.dto.UserDTO;
import com.university.lostfound.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<UserDTO>> getProfile(Authentication authentication) {
        UserDTO userDTO = userService.getUserProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(userDTO));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(Authentication authentication,
                                                              @Valid @RequestBody UpdateProfileRequest request) {
        UserDTO userDTO = userService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", userDTO));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(Authentication authentication,
                                                              @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @PostMapping("/avatar")
    public ResponseEntity<ApiResponse<UserDTO>> updateAvatar(Authentication authentication,
                                                             @RequestParam("file") MultipartFile file) {
        UserDTO userDTO = userService.updateAvatar(authentication.getName(), file);
        return ResponseEntity.ok(ApiResponse.success("Profile image updated successfully", userDTO));
    }
}
