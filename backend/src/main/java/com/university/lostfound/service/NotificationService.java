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
import java.util.Collection;
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
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.findByReceiverUserIdOrderByCreatedAtDesc(user.getUserId()).stream()
                .map(dtoMapper::toNotificationDTO)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.countByReceiverUserIdAndIsReadFalse(user.getUserId());
    }

    /**
     * A notification may only be changed by its receiver. Returning 404 for
     * someone else's notification avoids disclosing whether that ID exists.
     */
    @Transactional
    public void markAsRead(Long notificationId, String userEmail) {
        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (notification.getReceiver() == null
                || notification.getReceiver().getUserId() == null
                || !notification.getReceiver().getUserId().equals(requester.getUserId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        if (!Boolean.TRUE.equals(notification.getIsRead())) {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void markAllAsRead(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Notification> unread = notificationRepository.findByReceiverUserIdOrderByCreatedAtDesc(user.getUserId());
        for (Notification notification : unread) {
            if (!Boolean.TRUE.equals(notification.getIsRead())) {
                notification.setIsRead(true);
                notification.setReadAt(LocalDateTime.now());
            }
        }
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void sendNotification(User sender, User receiver, Long itemId, Long claimId,
                                 String title, String message, String typeName) {
        if (receiver == null) {
            return;
        }

        String resolvedTypeName = typeName != null && !typeName.trim().isEmpty()
                ? typeName.trim() : "GENERAL";

        NotificationType type = notificationTypeRepository.findByNotificationName(resolvedTypeName)
                .orElseGet(() -> notificationTypeRepository.findAll().stream().findFirst().orElseGet(() -> {
                    NotificationType created = new NotificationType();
                    created.setNotificationName(resolvedTypeName);
                    created.setDescription("Auto-created system notification type");
                    created.setIsActive(true);
                    return notificationTypeRepository.save(created);
                }));

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

    @Transactional
    public void sendNotificationToRoles(User sender, Collection<String> roleNames, Long itemId,
                                        String title, String message, String typeName) {
        roleNames.stream()
                .flatMap(roleName -> userRepository.findByRoleRoleNameAndIsActiveTrue(roleName).stream())
                .distinct()
                .forEach(receiver -> sendNotification(sender, receiver, itemId, null, title, message, typeName));
    }
}
