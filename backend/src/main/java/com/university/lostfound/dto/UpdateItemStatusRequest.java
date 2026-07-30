package com.university.lostfound.dto;

import jakarta.validation.constraints.NotNull;

public class UpdateItemStatusRequest {

    @NotNull(message = "Status ID is required")
    private Long statusId;

    private String remarks;

    public UpdateItemStatusRequest() {}

    public Long getStatusId() { return statusId; }
    public void setStatusId(Long statusId) { this.statusId = statusId; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
