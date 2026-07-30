package com.university.lostfound.service;

import com.university.lostfound.dto.NotificationDTO;
import com.university.lostfound.entity.Notification;
import com.university.lostfound.entity.NotificationType;
import com.university.lostfound.entity.User;
import com.university.lostfound.exception.ResourceNotFoundException;
import com.university.lostfound.mapper.DTOMapper;
import com.university.lostfound.repository.NotificationRepository;
import com.university.lostfound.repository.NotificationTypeRepository;
import com.university.lostfound.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationTypeRepository notificationTypeRepository;
    private final UserRepository userRepository;
    private final DTOMapper dtoMapper;

    public NotificationService(NotificationRepository notificationRepository,
                               NotificationTypeRepository notificationTypeRepository,
                               UserRepository userRepository,
                               DTOMapper dtoMapper) {
        this.notificationRepository = notificationRepository;
        this.notificationTypeRepository = notificationTypeRepository;
        this.userRepository = userRepository;
        this.dtoMapper = dtoMapper;
    }

    public List<NotificationDTO> getUserNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        return notificationRepository.findByReceiverUserIdOrderByCreatedAtDesc(user.getUserId()).stream()
                .map(dtoMapper::toNotificationDTO)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        return notificationRepository.countByReceiverUserIdAndIsReadFalse(user.getUserId());
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        List<Notification> unread = notificationRepository.findByReceiverUserIdOrderByCreatedAtDesc(user.getUserId());
        for (Notification n : unread) {
            if (!Boolean.TRUE.equals(n.getIsRead())) {
                n.setIsRead(true);
                n.setReadAt(LocalDateTime.now());
            }
        }
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void sendNotification(User sender, User receiver, Long itemId, Long claimId, String title, String message, String typeName) {
        NotificationType type = notificationTypeRepository.findByNotificationName(typeName)
                .orElseGet(() -> notificationTypeRepository.findAll().isEmpty() ? null : notificationTypeRepository.findAll().get(0));

        Notification notification = new Notification();
        notification.setNotificationType(type);
        notification.setSender(sender);
        notification.setReceiver(receiver);
        notification.setItemId(itemId);
        notification.setClaimId(claimId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setIsRead(false);

        notificationRepository.save(notification);
    }
}
