package com.university.lostfound.mapper;

import com.university.lostfound.dto.*;
import com.university.lostfound.entity.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class DTOMapper {

    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setUniversityId(user.getUniversityId());
        dto.setProfileImage(user.getProfileImage());
        dto.setIsActive(user.getIsActive());
        if (user.getRole() != null) {
            dto.setRoleId(user.getRole().getRoleId());
            dto.setRoleName(user.getRole().getRoleName());
        }
        if (user.getDepartment() != null) {
            dto.setDepartmentId(user.getDepartment().getDepartmentId());
            dto.setDepartmentName(user.getDepartment().getDepartmentName());
        }
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public CategoryDTO toCategoryDTO(Category category) {
        if (category == null) return null;
        return new CategoryDTO(
                category.getCategoryId(),
                category.getCategoryName(),
                category.getDescription(),
                category.getIsActive()
        );
    }

    public LocationDTO toLocationDTO(Location location) {
        if (location == null) return null;
        LocationDTO dto = new LocationDTO();
        dto.setLocationId(location.getLocationId());
        dto.setLocationName(location.getLocationName());
        dto.setDescription(location.getDescription());
        dto.setBuilding(location.getBuilding());
        dto.setFloorNo(location.getFloorNo());
        dto.setIsActive(location.getIsActive());
        return dto;
    }

    public ItemTypeDTO toItemTypeDTO(ItemType itemType) {
        if (itemType == null) return null;
        return new ItemTypeDTO(
                itemType.getTypeId(),
                itemType.getTypeName(),
                itemType.getDescription()
        );
    }

    public ItemStatusDTO toItemStatusDTO(ItemStatus itemStatus) {
        if (itemStatus == null) return null;
        return new ItemStatusDTO(
                itemStatus.getStatusId(),
                itemStatus.getStatusName(),
                itemStatus.getDescription(),
                itemStatus.getDisplayOrder()
        );
    }

    public ItemImageDTO toItemImageDTO(ItemImage image) {
        if (image == null) return null;
        return new ItemImageDTO(
                image.getImageId(),
                image.getImageUrl(),
                image.getImageName(),
                image.getIsPrimary()
        );
    }

    public ItemDTO toItemDTO(Item item) {
        if (item == null) return null;
        ItemDTO dto = new ItemDTO();
        dto.setItemId(item.getItemId());
        dto.setTitle(item.getTitle());
        dto.setDescription(item.getDescription());
        dto.setCategory(toCategoryDTO(item.getCategory()));
        dto.setLocation(toLocationDTO(item.getLocation()));
        dto.setType(toItemTypeDTO(item.getType()));
        dto.setStatus(toItemStatusDTO(item.getStatus()));
        dto.setUploadedBy(toUserDTO(item.getUploadedBy()));
        dto.setClaimedBy(toUserDTO(item.getClaimedBy()));
        dto.setVerifiedBy(toUserDTO(item.getVerifiedBy()));
        dto.setBrand(item.getBrand());
        dto.setColor(item.getColor());
        dto.setSerialNumber(item.getSerialNumber());
        dto.setItemCondition(item.getItemCondition());
        dto.setDateLost(item.getDateLost());
        dto.setDateFound(item.getDateFound());
        dto.setIsVerified(item.getIsVerified());
        dto.setIsClaimable(item.getIsClaimable());
        dto.setIsActive(item.getIsActive());
        dto.setRemarks(item.getRemarks());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());

        if (item.getImages() != null) {
            dto.setImages(item.getImages().stream().map(this::toItemImageDTO).collect(Collectors.toList()));
        } else {
            dto.setImages(Collections.emptyList());
        }
        return dto;
    }

    public ClaimDTO toClaimDTO(Claim claim) {
        if (claim == null) return null;
        ClaimDTO dto = new ClaimDTO();
        dto.setClaimId(claim.getClaimId());
        dto.setItem(toItemDTO(claim.getItem()));
        dto.setClaimant(toUserDTO(claim.getClaimant()));
        dto.setReviewedBy(toUserDTO(claim.getReviewedBy()));
        dto.setProofDescription(claim.getProofDescription());
        dto.setProofDocumentUrl(claim.getProofDocumentUrl());
        dto.setClaimStatus(claim.getClaimStatus() != null ? claim.getClaimStatus().name() : "PENDING");
        dto.setReviewerRemarks(claim.getReviewerRemarks());
        dto.setClaimedAt(claim.getClaimedAt());
        dto.setReviewedAt(claim.getReviewedAt());
        return dto;
    }

    public NotificationDTO toNotificationDTO(Notification notification) {
        if (notification == null) return null;
        NotificationDTO dto = new NotificationDTO();
        dto.setNotificationId(notification.getNotificationId());
        dto.setNotificationType(notification.getNotificationType() != null ? notification.getNotificationType().getNotificationName() : "GENERAL");
        if (notification.getSender() != null) {
            dto.setSenderName(notification.getSender().getFirstName() + " " + notification.getSender().getLastName());
        }
        if (notification.getReceiver() != null) {
            dto.setReceiverId(notification.getReceiver().getUserId());
        }
        dto.setItemId(notification.getItemId());
        dto.setClaimId(notification.getClaimId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setIsRead(notification.getIsRead());
        dto.setReadAt(notification.getReadAt());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }

    public AnnouncementDTO toAnnouncementDTO(Announcement announcement) {
        if (announcement == null) return null;
        AnnouncementDTO dto = new AnnouncementDTO();
        dto.setAnnouncementId(announcement.getAnnouncementId());
        dto.setTitle(announcement.getTitle());
        dto.setMessage(announcement.getMessage());
        dto.setPostedBy(toUserDTO(announcement.getPostedBy()));
        if (announcement.getTargetRole() != null) {
            dto.setTargetRoleName(announcement.getTargetRole().getRoleName());
        }
        dto.setStartDate(announcement.getStartDate());
        dto.setEndDate(announcement.getEndDate());
        dto.setIsPinned(announcement.getIsPinned());
        dto.setIsActive(announcement.getIsActive());
        dto.setCreatedAt(announcement.getCreatedAt());
        return dto;
    }

    public AuditLogDTO toAuditLogDTO(AuditLog auditLog) {
        if (auditLog == null) return null;
        AuditLogDTO dto = new AuditLogDTO();
        dto.setAuditLogId(auditLog.getAuditLogId());
        if (auditLog.getUser() != null) {
            dto.setUserName(auditLog.getUser().getFirstName() + " " + auditLog.getUser().getLastName());
            dto.setUserEmail(auditLog.getUser().getEmail());
        }
        dto.setAction(auditLog.getAction());
        dto.setEntityName(auditLog.getEntityName());
        dto.setEntityId(auditLog.getEntityId());
        dto.setDescription(auditLog.getDescription());
        dto.setRequestMethod(auditLog.getRequestMethod());
        dto.setRequestUrl(auditLog.getRequestUrl());
        dto.setIpAddress(auditLog.getIpAddress());
        dto.setActionStatus(auditLog.getActionStatus());
        dto.setFailureReason(auditLog.getFailureReason());
        dto.setCreatedAt(auditLog.getCreatedAt());
        return dto;
    }
}
