package com.university.lostfound.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AnnouncementDTO {
    private Long announcementId;
    private String title;
    private String message;
    private UserDTO postedBy;
    private String targetRoleName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isPinned;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public AnnouncementDTO() {}

    public Long getAnnouncementId() { return announcementId; }
    public void setAnnouncementId(Long announcementId) { this.announcementId = announcementId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UserDTO getPostedBy() { return postedBy; }
    public void setPostedBy(UserDTO postedBy) { this.postedBy = postedBy; }

    public String getTargetRoleName() { return targetRoleName; }
    public void setTargetRoleName(String targetRoleName) { this.targetRoleName = targetRoleName; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Boolean getIsPinned() { return isPinned; }
    public void setIsPinned(Boolean pinned) { isPinned = pinned; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
