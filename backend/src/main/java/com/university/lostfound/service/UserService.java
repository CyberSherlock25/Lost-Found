package com.university.lostfound.service;

import com.university.lostfound.dto.*;
import com.university.lostfound.entity.Department;
import com.university.lostfound.entity.Role;
import com.university.lostfound.entity.User;
import com.university.lostfound.exception.BadRequestException;
import com.university.lostfound.exception.ResourceNotFoundException;
import com.university.lostfound.mapper.DTOMapper;
import com.university.lostfound.repository.DepartmentRepository;
import com.university.lostfound.repository.RoleRepository;
import com.university.lostfound.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;
    private final DTOMapper dtoMapper;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       DepartmentRepository departmentRepository,
                       PasswordEncoder passwordEncoder,
                       FileStorageService fileStorageService,
                       DTOMapper dtoMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
        this.dtoMapper = dtoMapper;
    }

    public UserDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return dtoMapper.toUserDTO(user);
    }

    @Transactional
    public UserDTO updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElse(null);
            user.setDepartment(department);
        }

        User updatedUser = userRepository.save(user);
        return dtoMapper.toUserDTO(updatedUser);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public UserDTO updateAvatar(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        String imageUrl = fileStorageService.storeFile(file);
        user.setProfileImage(imageUrl);

        User updatedUser = userRepository.save(user);
        return dtoMapper.toUserDTO(updatedUser);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(dtoMapper::toUserDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        return dtoMapper.toUserDTO(userRepository.save(user));
    }

    @Transactional
    public UserDTO updateUserRole(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + roleId));
        user.setRole(role);
        return dtoMapper.toUserDTO(userRepository.save(user));
    }
}
