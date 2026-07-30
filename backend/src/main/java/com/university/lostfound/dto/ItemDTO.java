package com.university.lostfound.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ItemDTO {
    private Long itemId;
    private String title;
    private String description;
    private CategoryDTO category;
    private LocationDTO location;
    private ItemTypeDTO type;
    private ItemStatusDTO status;
    private UserDTO uploadedBy;
    private UserDTO claimedBy;
    private UserDTO verifiedBy;
    private String brand;
    private String color;
    private String serialNumber;
    private String itemCondition;
    private LocalDate dateLost;
    private LocalDate dateFound;
    private Boolean isVerified;
    private Boolean isClaimable;
    private Boolean isActive;
    private String remarks;
    private List<ItemImageDTO> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ItemDTO() {}

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public CategoryDTO getCategory() { return category; }
    public void setCategory(CategoryDTO category) { this.category = category; }

    public LocationDTO getLocation() { return location; }
    public void setLocation(LocationDTO location) { this.location = location; }

    public ItemTypeDTO getType() { return type; }
    public void setType(ItemTypeDTO type) { this.type = type; }

    public ItemStatusDTO getStatus() { return status; }
    public void setStatus(ItemStatusDTO status) { this.status = status; }

    public UserDTO getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(UserDTO uploadedBy) { this.uploadedBy = uploadedBy; }

    public UserDTO getClaimedBy() { return claimedBy; }
    public void setClaimedBy(UserDTO claimedBy) { this.claimedBy = claimedBy; }

    public UserDTO getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(UserDTO verifiedBy) { this.verifiedBy = verifiedBy; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getItemCondition() { return itemCondition; }
    public void setItemCondition(String itemCondition) { this.itemCondition = itemCondition; }

    public LocalDate getDateLost() { return dateLost; }
    public void setDateLost(LocalDate dateLost) { this.dateLost = dateLost; }

    public LocalDate getDateFound() { return dateFound; }
    public void setDateFound(LocalDate dateFound) { this.dateFound = dateFound; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean verified) { isVerified = verified; }

    public Boolean getIsClaimable() { return isClaimable; }
    public void setIsClaimable(Boolean claimable) { isClaimable = claimable; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public List<ItemImageDTO> getImages() { return images; }
    public void setImages(List<ItemImageDTO> images) { this.images = images; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
