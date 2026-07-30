package com.university.lostfound.dto;

public class ItemStatusDTO {
    private Long statusId;
    private String statusName;
    private String description;
    private Integer displayOrder;

    public ItemStatusDTO() {}

    public ItemStatusDTO(Long statusId, String statusName, String description, Integer displayOrder) {
        this.statusId = statusId;
        this.statusName = statusName;
        this.description = description;
        this.displayOrder = displayOrder;
    }

    public Long getStatusId() { return statusId; }
    public void setStatusId(Long statusId) { this.statusId = statusId; }

    public String getStatusName() { return statusName; }
    public void setStatusName(String statusName) { this.statusName = statusName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
