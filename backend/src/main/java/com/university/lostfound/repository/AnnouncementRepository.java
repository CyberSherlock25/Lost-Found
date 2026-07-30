package com.university.lostfound.repository;

import com.university.lostfound.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByIsActiveTrueOrderByIsPinnedDescCreatedAtDesc();
    List<Announcement> findAllByOrderByCreatedAtDesc();
}
