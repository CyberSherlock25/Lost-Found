package com.university.lostfound.service;

import com.university.lostfound.dto.*;
import com.university.lostfound.entity.*;
import com.university.lostfound.exception.BadRequestException;
import com.university.lostfound.exception.ResourceNotFoundException;
import com.university.lostfound.exception.UnauthorizedException;
import com.university.lostfound.mapper.DTOMapper;
import com.university.lostfound.repository.*;
import com.university.lostfound.security.CustomUserDetails;
import com.university.lostfound.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OtpRequestRepository otpRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final DTOMapper dtoMapper;

    private final long refreshTokenExpirationMs;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            RoleRepository roleRepository,
            DepartmentRepository departmentRepository,
            RefreshTokenRepository refreshTokenRepository,
            OtpRequestRepository otpRequestRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            DTOMapper dtoMapper,
            @Value("${app.jwt.refresh-expiration-ms:604800000}") long refreshTokenExpirationMs) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.otpRequestRepository = otpRequestRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.dtoMapper = dtoMapper;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();
        User user = userPrincipal.getUser();

        String accessToken = tokenProvider.generateAccessToken(authentication);
        RefreshToken refreshToken = createRefreshToken(user);

        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "STUDENT";
        String deptName = user.getDepartment() != null ? user.getDepartment().getDepartmentName() : null;

        return new AuthResponse(
                accessToken,
                refreshToken.getToken(),
                user.getUserId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                roleName,
                deptName,
                user.getProfileImage()
        );
    }

    @Transactional
    public UserDTO register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email address is already in use!");
        }

        if (userRepository.existsByUniversityId(registerRequest.getUniversityId())) {
            throw new BadRequestException("University ID is already registered!");
        }

        Role role = roleRepository.findById(registerRequest.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + registerRequest.getRoleId()));

        Department department = null;
        if (registerRequest.getDepartmentId() != null) {
            department = departmentRepository.findById(registerRequest.getDepartmentId())
                    .orElse(null);
        }

        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhone(registerRequest.getPhone());
        user.setUniversityId(registerRequest.getUniversityId());
        user.setRole(role);
        user.setDepartment(department);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);
        return dtoMapper.toUserDTO(savedUser);
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Refresh Token not found"));

        if (refreshToken.getIsRevoked() || refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException("Refresh Token was expired or revoked. Please login again.");
        }

        User user = refreshToken.getUser();
        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "STUDENT";
        String newAccessToken = tokenProvider.generateAccessTokenForUser(user.getEmail(), user.getUserId(), roleName);

        String deptName = user.getDepartment() != null ? user.getDepartment().getDepartmentName() : null;

        return new AuthResponse(
                newAccessToken,
                refreshToken.getToken(),
                user.getUserId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                roleName,
                deptName,
                user.getProfileImage()
        );
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No user found with email: " + request.getEmail()));

        String otpCode = String.format("%06d", new Random().nextInt(900000) + 100000);

        OtpRequest otp = new OtpRequest();
        otp.setUser(user);
        otp.setEmail(user.getEmail());
        otp.setOtpCode(otpCode);
        otp.setOtpType("PASSWORD_RESET");
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        otp.setIsVerified(false);

        otpRequestRepository.save(otp);
        return "OTP sent successfully to " + request.getEmail() + ". Code for demo/dev: " + otpCode;
    }

    public boolean verifyOtp(VerifyOtpRequest request) {
        OtpRequest otp = otpRequestRepository.findTopByEmailAndOtpTypeAndIsVerifiedFalseOrderByCreatedAtDesc(
                request.getEmail(), request.getOtpType())
                .orElseThrow(() -> new BadRequestException("Invalid or expired OTP"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            otp.setIsExpired(true);
            otpRequestRepository.save(otp);
            throw new BadRequestException("OTP has expired");
        }

        if (!otp.getOtpCode().equals(request.getOtpCode())) {
            otp.setAttemptCount(otp.getAttemptCount() + 1);
            otpRequestRepository.save(otp);
            throw new BadRequestException("Incorrect OTP code");
        }

        otp.setIsVerified(true);
        otp.setVerifiedAt(LocalDateTime.now());
        otpRequestRepository.save(otp);

        return true;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        OtpRequest otp = otpRequestRepository.findTopByEmailAndOtpTypeAndIsVerifiedFalseOrderByCreatedAtDesc(
                request.getEmail(), "PASSWORD_RESET")
                .orElseThrow(() -> new BadRequestException("No valid OTP session found"));

        if (!otp.getOtpCode().equals(request.getOtpCode())) {
            throw new BadRequestException("Invalid OTP code");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otp.setIsVerified(true);
        otp.setVerifiedAt(LocalDateTime.now());
        otpRequestRepository.save(otp);
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenExpirationMs));
        refreshToken.setIsRevoked(false);

        return refreshTokenRepository.save(refreshToken);
    }
}
