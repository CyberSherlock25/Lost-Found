package com.university.lostfound.repository;

import com.university.lostfound.entity.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemStatusRepository extends JpaRepository<ItemStatus, Long> {
    Optional<ItemStatus> findByStatusName(String statusName);
}
