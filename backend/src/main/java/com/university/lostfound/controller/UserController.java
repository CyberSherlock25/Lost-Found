package com.university.lostfound.controller;

import com.university.lostfound.dto.ApiResponse;
import com.university.lostfound.dto.UserDTO;
import com.university.lostfound.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PatchMapping("/{userId}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<UserDTO>> toggleUserStatus(@PathVariable Long userId) {
        UserDTO user = userService.toggleUserStatus(userId);
        return ResponseEntity.ok(ApiResponse.success("User status updated", user));
    }

    @PatchMapping("/{userId}/role")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<UserDTO>> updateUserRole(@PathVariable Long userId, @RequestParam Long roleId) {
        UserDTO user = userService.updateUserRole(userId, roleId);
        return ResponseEntity.ok(ApiResponse.success("User role updated", user));
    }
}
