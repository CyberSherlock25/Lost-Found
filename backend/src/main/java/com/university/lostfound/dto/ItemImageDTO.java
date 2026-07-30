package com.university.lostfound.dto;

public class ItemImageDTO {
    private Long imageId;
    private String imageUrl;
    private String imageName;
    private Boolean isPrimary;

    public ItemImageDTO() {}

    public ItemImageDTO(Long imageId, String imageUrl, String imageName, Boolean isPrimary) {
        this.imageId = imageId;
        this.imageUrl = imageUrl;
        this.imageName = imageName;
        this.isPrimary = isPrimary;
    }

    public Long getImageId() { return imageId; }
    public void setImageId(Long imageId) { this.imageId = imageId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getImageName() { return imageName; }
    public void setImageName(String imageName) { this.imageName = imageName; }

    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean primary) { isPrimary = primary; }
}
