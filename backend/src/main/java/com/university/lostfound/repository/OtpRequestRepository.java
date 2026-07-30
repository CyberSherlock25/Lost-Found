package com.university.lostfound.repository;

import com.university.lostfound.entity.OtpRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRequestRepository extends JpaRepository<OtpRequest, Long> {
    Optional<OtpRequest> findTopByEmailAndOtpTypeAndIsVerifiedFalseOrderByCreatedAtDesc(String email, String otpType);
}
