package com.university.lostfound.dto;

public class ItemTypeDTO {
    private Long typeId;
    private String typeName;
    private String description;

    public ItemTypeDTO() {}

    public ItemTypeDTO(Long typeId, String typeName, String description) {
        this.typeId = typeId;
        this.typeName = typeName;
        this.description = description;
    }

    public Long getTypeId() { return typeId; }
    public void setTypeId(Long typeId) { this.typeId = typeId; }

    public String getTypeName() { return typeName; }
    public void setTypeName(String typeName) { this.typeName = typeName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
