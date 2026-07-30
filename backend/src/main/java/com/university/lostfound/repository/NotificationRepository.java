package com.university.lostfound.repository;

import com.university.lostfound.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiverUserIdOrderByCreatedAtDesc(Long receiverUserId);
    long countByReceiverUserIdAndIsReadFalse(Long receiverUserId);
}
