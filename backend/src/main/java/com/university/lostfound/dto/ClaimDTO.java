package com.university.lostfound.dto;

import java.time.LocalDateTime;

public class ClaimDTO {
    private Long claimId;
    private ItemDTO item;
    private UserDTO claimant;
    private UserDTO reviewedBy;
    private String proofDescription;
    private String proofDocumentUrl;
    private String claimStatus;
    private String reviewerRemarks;
    private LocalDateTime claimedAt;
    private LocalDateTime reviewedAt;

    public ClaimDTO() {}

    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public ItemDTO getItem() { return item; }
    public void setItem(ItemDTO item) { this.item = item; }

    public UserDTO getClaimant() { return claimant; }
    public void setClaimant(UserDTO claimant) { this.claimant = claimant; }

    public UserDTO getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(UserDTO reviewedBy) { this.reviewedBy = reviewedBy; }

    public String getProofDescription() { return proofDescription; }
    public void setProofDescription(String proofDescription) { this.proofDescription = proofDescription; }

    public String getProofDocumentUrl() { return proofDocumentUrl; }
    public void setProofDocumentUrl(String proofDocumentUrl) { this.proofDocumentUrl = proofDocumentUrl; }

    public String getClaimStatus() { return claimStatus; }
    public void setClaimStatus(String claimStatus) { this.claimStatus = claimStatus; }

    public String getReviewerRemarks() { return reviewerRemarks; }
    public void setReviewerRemarks(String reviewerRemarks) { this.reviewerRemarks = reviewerRemarks; }

    public LocalDateTime getClaimedAt() { return claimedAt; }
    public void setClaimedAt(LocalDateTime claimedAt) { this.claimedAt = claimedAt; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}
