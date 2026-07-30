package com.university.lostfound.repository;

import com.university.lostfound.entity.ClaimStatusMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClaimStatusMasterRepository extends JpaRepository<ClaimStatusMaster, Long> {
    Optional<ClaimStatusMaster> findByStatusName(String statusName);
}
