package com.university.lostfound.repository;

import com.university.lostfound.entity.Claim;
import com.university.lostfound.entity.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    
    List<Claim> findByClaimantUserIdOrderByClaimedAtDesc(Long claimantUserId);

    List<Claim> findByItemItemIdOrderByClaimedAtDesc(Long itemId);

    List<Claim> findByClaimStatusOrderByClaimedAtDesc(ClaimStatus claimStatus);

    long countByClaimStatus(ClaimStatus claimStatus);

    long countByClaimantUserId(Long claimantUserId);

    Optional<Claim> findByItemItemIdAndClaimantUserId(Long itemId, Long claimantUserId);

    List<Claim> findAllByOrderByClaimedAtDesc();

    @Query("SELECT c.claimStatus, COUNT(c) FROM Claim c GROUP BY c.claimStatus")
    List<Object[]> countClaimsByStatus();
}
