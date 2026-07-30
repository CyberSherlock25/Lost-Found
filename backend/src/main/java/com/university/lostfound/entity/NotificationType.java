package com.university.lostfound.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "notification_types")
public class NotificationType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_type_id")
    private Long notificationTypeId;

    @Column(name = "notification_name", nullable = false, unique = true, length = 100)
    private String notificationName;

    @Column(name = "description")
    private String description;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public NotificationType() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isActive == null) this.isActive = true;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getNotificationTypeId() { return notificationTypeId; }
    public void setNotificationTypeId(Long notificationTypeId) { this.notificationTypeId = notificationTypeId; }

    public String getNotificationName() { return notificationName; }
    public void setNotificationName(String notificationName) { this.notificationName = notificationName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NotificationType that = (NotificationType) o;
        return Objects.equals(notificationTypeId, that.notificationTypeId) && Objects.equals(notificationName, that.notificationName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(notificationTypeId, notificationName);
    }

    @Override
    public String toString() {
        return "NotificationType{" +
                "notificationTypeId=" + notificationTypeId +
                ", notificationName='" + notificationName + '\'' +
                '}';
    }
}
