package com.university.lostfound.dto;

import jakarta.validation.constraints.NotBlank;

public class ReviewClaimRequest {

    @NotBlank(message = "Claim status is required (APPROVED or REJECTED)")
    private String claimStatus;

    private String reviewerRemarks;

    public ReviewClaimRequest() {}

    public String getClaimStatus() { return claimStatus; }
    public void setClaimStatus(String claimStatus) { this.claimStatus = claimStatus; }

    public String getReviewerRemarks() { return reviewerRemarks; }
    public void setReviewerRemarks(String reviewerRemarks) { this.reviewerRemarks = reviewerRemarks; }
}
