package com.university.lostfound.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "otp_requests")
public class OtpRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "otp_request_id")
    private Long otpRequestId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "email", length = 120)
    private String email;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "otp_code", nullable = false, length = 6)
    private String otpCode;

    @Column(name = "otp_type", nullable = false, length = 50)
    private String otpType;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "attempt_count")
    private Integer attemptCount = 0;

    @Column(name = "max_attempts")
    private Integer maxAttempts = 5;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "is_expired")
    private Boolean isExpired = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public OtpRequest() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.attemptCount == null) this.attemptCount = 0;
        if (this.maxAttempts == null) this.maxAttempts = 5;
        if (this.isVerified == null) this.isVerified = false;
        if (this.isExpired == null) this.isExpired = false;
    }

    public Long getOtpRequestId() { return otpRequestId; }
    public void setOtpRequestId(Long otpRequestId) { this.otpRequestId = otpRequestId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public String getOtpType() { return otpType; }
    public void setOtpType(String otpType) { this.otpType = otpType; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public Integer getAttemptCount() { return attemptCount; }
    public void setAttemptCount(Integer attemptCount) { this.attemptCount = attemptCount; }

    public Integer getMaxAttempts() { return maxAttempts; }
    public void setMaxAttempts(Integer maxAttempts) { this.maxAttempts = maxAttempts; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean verified) { isVerified = verified; }

    public Boolean getIsExpired() { return isExpired; }
    public void setIsExpired(Boolean expired) { isExpired = expired; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OtpRequest that = (OtpRequest) o;
        return Objects.equals(otpRequestId, that.otpRequestId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(otpRequestId);
    }

    @Override
    public String toString() {
        return "OtpRequest{" +
                "otpRequestId=" + otpRequestId +
                ", email='" + email + '\'' +
                ", otpType='" + otpType + '\'' +
                ", isVerified=" + isVerified +
                '}';
    }
}
